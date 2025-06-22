import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  DataProvider,
  type TinderProfile,
  type HingeProfile,
  HingeInteractionType,
} from "@prisma/client";
import type { AnonymizedTinderDataJSON } from "@/lib/interfaces/TinderDataJSON";
import type { AnonymizedHingeDataJSON } from "@/lib/interfaces/HingeDataJSON";
import { createSubLogger } from "@/lib/tslog";

import {
  computeUsageInput,
  createSwipestatsTinderProfileInput,
  prismaCreateTinderProfileTxn,
} from "../services/profile.service";
import { createMessagesAndMatches } from "../services/profile.messages.service";
import { prismaCreateHingeProfileTxn } from "../services/hingeProfile.service";
import { analyticsTrackServer } from "@/lib/analytics/analyticsTrackServer";
import { expandAndAugmentProfileWithMissingDays } from "@/lib/profile.utils";
import { sendInternalSlackMessage } from "../services/internal-slack.service";
import { type FullTinderProfile } from "@/lib/interfaces/utilInterfaces";
import { getRandomTinderProfileIds } from "../services/researchPurchase.service";
import { env } from "@/env";

const log = createSubLogger("profile.router");

export const profileRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  get: publicProcedure
    .input(
      z.object({
        tinderId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const demoId =
        "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5";

      const tinderProfile = ctx.db.tinderProfile.findUnique({
        where: {
          tinderId: input.tinderId === "demo" ? demoId : input.tinderId,
        },
        include: {
          profileMeta: true,
          // usage: {
          //   orderBy: {
          //     dateStamp: "asc",
          //   },
          // },
          customData: true,
          user: true,
        },
      });

      return tinderProfile;
    }),

  getHinge: publicProcedure
    .input(
      z.object({
        hingeId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const hingeProfile = ctx.db.hingeProfile.findUnique({
        where: {
          hingeId: input.hingeId,
        },
        include: {
          prompts: true,
          customData: true,
          user: true,
          jobs: true,
          schools: true,
        },
      });

      return hingeProfile;
    }),

  compare: publicProcedure
    .input(
      z.object({
        tinderId: z.string(),
        comparisonIds: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      log.info("Starting profile comparison", {
        tinderId: input.tinderId,
        comparisonIds: input.comparisonIds,
      });

      const myProfile = await ctx.db.tinderProfile.findUniqueOrThrow({
        where: {
          tinderId: input.tinderId,
        },
      });

      log.info("Fetched my profile", {
        tinderId: input.tinderId,
        firstDayOnApp: myProfile.firstDayOnApp,
        lastDayOnApp: myProfile.lastDayOnApp,
      });

      const tinderProfiles = await ctx.db.tinderProfile.findMany({
        where: {
          tinderId: {
            in: [input.tinderId, ...input.comparisonIds],
          },
        },
        include: {
          profileMeta: true,
          usage: {
            orderBy: {
              dateStamp: "asc",
            },
            where: {
              dateStamp: {
                gte: myProfile.firstDayOnApp,
                lte: myProfile.lastDayOnApp,
              },
            },
          },
          customData: true,
        },
      });

      // Sort profiles to ensure input.tinderId is first
      const sortedProfiles = tinderProfiles.sort((a, b) => {
        if (a.tinderId === input.tinderId) return -1;
        if (b.tinderId === input.tinderId) return 1;
        return 0; // maintain stable order for other profiles
      });

      log.info("Fetched comparison profiles", {
        profileCount: sortedProfiles.length,
      });

      return sortedProfiles as FullTinderProfile[];
    }),

  compareRandom: publicProcedure
    .input(
      z.object({
        excludeIds: z.string().array(),
      }),
    )
    .mutation(async ({ input }) => {
      const randomTinderProfile = await getRandomTinderProfileIds(
        1,
        input.excludeIds,
      );

      return randomTinderProfile[0]!;
    }),

  create: publicProcedure
    .input(
      z.object({
        tinderId: z.string().min(1),
        anonymizedTinderJson: z.any(),
        timeZone: z.string().optional(),
        country: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<TinderProfile> => {
      const existingProfile = await ctx.db.tinderProfile.findUnique({
        where: {
          tinderId: input.tinderId,
        },
      });

      if (existingProfile) {
        throw new Error("Use the update function instead");
      }

      const user = ctx.session?.user;

      const tinderJson = input.anonymizedTinderJson as AnonymizedTinderDataJSON;

      const userId = user?.id ?? input.tinderId; // defaults to the tinderId as it is unique too

      log.info("Initiate prisma create", {
        tinderId: input.tinderId,
        userId: user?.id,
        timeZone: input.timeZone,
        country: input.country,
      });

      const swipestatsProfile = await prismaCreateTinderProfileTxn({
        user: { userId, timeZone: input.timeZone, country: input.country },
        tinderId: input.tinderId,
        tinderJson,
      });

      analyticsTrackServer(userId, "Profile Created", {
        tinderId: input.tinderId,
        gender: swipestatsProfile.gender,
        age: swipestatsProfile.ageAtUpload,
        city: swipestatsProfile.city,
        region: swipestatsProfile.region,
        timeZone: input.timeZone ?? null,
        country: input.country ?? null,
      });

      sendInternalSlackMessage(
        env.NEXT_PUBLIC_MANUAL_ENV === "production"
          ? "bot-messages"
          : "bot-developer",
        "Profile Created",
        {
          tinderId: input.tinderId,
          profileUrl: `https://swipestats.io/insights/${input.tinderId}`,
          gender: swipestatsProfile.gender,
          age: swipestatsProfile.ageAtUpload,
          city: swipestatsProfile.city,
          region: swipestatsProfile.region,
          bio: swipestatsProfile.bio,
          geoTimezone: input.timeZone,
          geoCountry: input.country,
        },
      );

      return swipestatsProfile;
    }),

  createHinge: publicProcedure
    .input(
      z.object({
        hingeId: z.string().min(1),
        anonymizedHingeJson: z.any(),
        timeZone: z.string().optional(),
        country: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<HingeProfile> => {
      const existingProfile = await ctx.db.hingeProfile.findUnique({
        where: {
          hingeId: input.hingeId,
        },
      });

      if (existingProfile) {
        throw new Error(
          "Hinge profile already exists. Use update function instead",
        );
      }

      const user = ctx.session?.user;
      const hingeJson = input.anonymizedHingeJson as AnonymizedHingeDataJSON;
      const userId = user?.id ?? input.hingeId; // defaults to the hingeId as it is unique too

      log.info("Initiate Hinge profile creation", {
        hingeId: input.hingeId,
        userId: user?.id,
        timeZone: input.timeZone,
        country: input.country,
      });

      const hingeProfile = await prismaCreateHingeProfileTxn({
        user: { userId, timeZone: input.timeZone, country: input.country },
        hingeId: input.hingeId,
        hingeJson,
      });

      analyticsTrackServer(userId, "Profile Created", {
        hingeId: input.hingeId,
        gender: hingeProfile.gender,
        age: hingeProfile.ageAtUpload,
        timeZone: input.timeZone ?? null,
        country: input.country ?? null,
        provider: "HINGE",
      });

      sendInternalSlackMessage(
        env.NEXT_PUBLIC_MANUAL_ENV === "production"
          ? "bot-messages"
          : "bot-developer",
        "Hinge Profile Created",
        {
          hingeId: input.hingeId,
          profileUrl: `https://swipestats.io/insights/hinge/${input.hingeId}`,
          gender: hingeProfile.gender,
          age: hingeProfile.ageAtUpload,
          geoTimezone: input.timeZone,
          geoCountry: input.country,
        },
      );

      return hingeProfile;
    }),

  update: publicProcedure
    .input(
      z.object({
        tinderId: z.string().min(1),
        anonymizedTinderJson: z.any(),
        timeZone: z.string().optional(),
        country: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<TinderProfile> => {
      // find existing profile
      //  wipe of the old data, and then re-upload.
      const sessionUser = ctx.session?.user;
      const existingProfile = await ctx.db.tinderProfile.findUnique({
        where: {
          tinderId: input.tinderId,
        },
        include: {
          user: {
            include: {
              originalAnonymizedFiles: {
                orderBy: {
                  createdAt: "desc",
                },
                where: {
                  dataProvider: "TINDER",
                },
              },
            },
          },
          customData: true,
          usage: true,
        },
      });

      if (!existingProfile) {
        throw new Error("Use the create function instead");
      }

      if (sessionUser && sessionUser.id !== existingProfile?.user.id) {
        throw new Error("You are not allowed to update this profile");
      }

      const userId = existingProfile.userId;
      // TODO: If existingProfile.userId !== user.id, then transfer profile first

      const tinderJson = input.anonymizedTinderJson as AnonymizedTinderDataJSON;

      const originalAnonymizedFile =
        existingProfile.user.originalAnonymizedFiles[0]!;

      try {
        await ctx.db.tinderProfile.delete({
          where: {
            tinderId: input.tinderId,
          },
        });

        await prismaCreateTinderProfileTxn({
          user: { userId, timeZone: input.timeZone, country: input.country },
          tinderId: input.tinderId,
          tinderJson,
        });

        const updatedTinderProfile = await ctx.db.customData
          .update({
            where: {
              tinderProfileId: input.tinderId,
            },
            data: {
              ...existingProfile.customData,
            },
          })
          .tinderProfile();

        return updatedTinderProfile!;
      } catch (error) {
        log.error("Error updating profile", error);

        await prismaCreateTinderProfileTxn({
          user: { userId, timeZone: input.timeZone, country: input.country },
          tinderId: input.tinderId,
          tinderJson:
            originalAnonymizedFile.file as unknown as AnonymizedTinderDataJSON,
        });

        return existingProfile;
      }

      // const updatedTinderProfile = await ctx.db.$transaction(
      //   async (txn) => {
      //     await txn.tinderProfile.delete({
      //       where: {
      //         tinderId: input.tinderId,
      //       },
      //     });

      //     const savePoint = "update_profile";
      //     try {
      //       await txn.$executeRaw`SAVEPOINT ${savePoint}`;

      //       await prismaCreateTinderProfileTxn({
      //         userId,
      //         tinderId: input.tinderId,
      //         tinderJson,
      //       });

      //       const updatedTinderProfile = await txn.customData
      //         .update({
      //           where: {
      //             tinderProfileId: input.tinderId,
      //           },
      //           data: {
      //             ...existingProfile.customData,
      //           },
      //         })
      //         .tinderProfile();
      //       await txn.$executeRaw`RELEASE SAVEPOINT ${savePoint}`;

      //       return updatedTinderProfile;
      //     } catch (error) {
      //       await txn.$executeRaw`ROLLBACK TO SAVEPOINT ${savePoint}`;
      //     }
      //   },
      // );

      // const updatedTinderProfile = await ctx.db.$transaction(
      //   async (txn) => {
      //     await txn.tinderProfile.delete({
      //       where: {
      //         tinderId: input.tinderId,
      //       },
      //     });

      //     const savePoint = "update_profile";
      //     try {
      //       await txn.$executeRaw`SAVEPOINT ${savePoint}`;

      //       await prismaCreateTinderProfileTxn({
      //         userId,
      //         tinderId: input.tinderId,
      //         tinderJson,
      //       });

      //       const updatedTinderProfile = await txn.customData
      //         .update({
      //           where: {
      //             tinderProfileId: input.tinderId,
      //           },
      //           data: {
      //             ...existingProfile.customData,
      //           },
      //         })
      //         .tinderProfile();
      //       await txn.$executeRaw`RELEASE SAVEPOINT ${savePoint}`;

      //       return updatedTinderProfile;
      //     } catch (error) {
      //       await txn.$executeRaw`ROLLBACK TO SAVEPOINT ${savePoint}`;
      //     }
      //   },
      // );

      //  ? if neccecary, come back and clean this up. Easier to just re-upload like above at this point.
      // const oldUsage = existingProfile.usage;
      // const newUsage = Object.entries(tinderJson.Usage.app_opens).map(
      //   ([date, appOpensCount]) => {
      //     return computeUsageInput(
      //       {
      //         appOpensCount,
      //         matchesCount: tinderJson.Usage.matches[date] ?? 0,
      //         swipeLikesCount: tinderJson.Usage.swipes_likes[date] ?? 0,
      //         swipeSuperLikesCount: tinderJson.Usage.superlikes[date] ?? 0,
      //         swipePassesCount: tinderJson.Usage.swipes_passes[date] ?? 0,
      //         messagesSentCount: tinderJson.Usage.messages_sent[date] ?? 0,
      //         messagesReceivedCount:
      //           tinderJson.Usage.messages_received[date] ?? 0,
      //       },
      //       date,
      //       input.tinderId,
      //     );
      //   },
      // );
      // const oldUsageDateSet = new Set(oldUsage.map((u) => u.dateStampRaw));
      // const newUsageDateSet = new Set(newUsage.map((u) => u.dateStampRaw));

      // const newDataSize = symmetricDifference(
      //   oldUsageDateSet,
      //   newUsageDateSet,
      // ).size;

      // const mergedUsageInput = [
      //   ...newUsage,
      //   ...oldUsage.filter(
      //     (oldUsageItem) => !newUsageDateSet.has(oldUsageItem.dateStampRaw),
      //   ),
      // ];
    }),
  claimTinderProfile: protectedProcedure
    .input(
      z.object({
        tinderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session?.user;

      const tinderProfile = await ctx.db.tinderProfile.findUnique({
        where: {
          tinderId: input.tinderId,
        },
        include: {
          user: true,
        },
      });

      if (!tinderProfile) {
        throw new Error("Tinder profile not found");
      }

      if (tinderProfile.user?.email) {
        throw new Error("Tinder profile already claimed");
      }

      const [updatedTinderProfile] = await ctx.db.$transaction([
        ctx.db.tinderProfile.update({
          where: {
            tinderId: input.tinderId,
          },
          data: {
            userId: user?.id,
          },
        }),
        // transfer anon user data over to new user
        ctx.db.event.updateMany({
          where: {
            userId: tinderProfile.user.id,
          },
          data: {
            userId: user?.id,
          },
        }),
        // TODO hinge
        // ctx.db.hingeProfile.updateMany({
        //   where: {
        //     userId: tinderProfile.user!.id,
        //   },
        //   data: {
        //     userId: user?.id,
        //   },
        // }),
        // hinge block
        // todo make into a service
        // moves personal self reported stats
        ctx.db.customData.updateMany({
          where: {
            userId: tinderProfile.user.id,
          },
          data: {
            userId: user?.id,
          },
        }),
        ctx.db.originalAnonymizedFile.updateMany({
          where: {
            userId: tinderProfile.user.id,
          },
          data: {
            userId: user?.id,
          },
        }),

        ctx.db.user.delete({
          where: {
            id: tinderProfile.user.id,
          },
        }),
      ]);

      return updatedTinderProfile;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  subscribeToWaitlist: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        dataProviderId: z.nativeEnum(DataProvider),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const alreadyOnWaitlist = await ctx.db.waitlist.findFirst({
        where: {
          email: input.email,
          dataProvider: input.dataProviderId,
        },
      });

      // TODO let them know they are already on the waitlist
      if (alreadyOnWaitlist) {
        return alreadyOnWaitlist;
      }

      const waitlistEntry = await ctx.db.waitlist.create({
        data: {
          email: input.email,
          dataProvider: input.dataProviderId,
          updatedAt: new Date(),
        },
      });

      analyticsTrackServer(input.email, "Waitlist Signup", {
        email: input.email,
        dataProvider: input.dataProviderId,
      });

      sendInternalSlackMessage("bot-messages", "Waitlist Signup", {
        email: input.email,
      });

      return waitlistEntry;
    }),
  simulateProfileUplad: publicProcedure
    .input(
      z.object({
        tinderId: z.string(),
        anonymizedTinderJson: z.any(),
        timeZone: z.string().optional(),
        country: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      log.info("Initiate Profile Upload Simulation", {
        tinderId: input.tinderId,
        timeZone: input.timeZone,
        country: input.country,
      });

      analyticsTrackServer(
        input.tinderId, // using tinderId instead of normal userId here
        "Profile Upload Simulated",
        {
          tinderId: input.tinderId,
          timeZone: input.timeZone ?? null,
          country: input.country ?? null,
        },
      );

      const tinderJson = input.anonymizedTinderJson as AnonymizedTinderDataJSON;

      const userId = input.tinderId;

      const expandedUsageTimeFrame = expandAndAugmentProfileWithMissingDays({
        appOpens: tinderJson.Usage.app_opens,
        swipeLikes: tinderJson.Usage.swipes_likes,
        swipePasses: tinderJson.Usage.swipes_passes,
      });
      const expandedUsageTimeFrameEntries = Object.entries(
        expandedUsageTimeFrame,
      );
      log.info("Simulated Timeframes", {
        original: Object.keys(tinderJson.Usage.app_opens).length,
        expanded: expandedUsageTimeFrameEntries.length,
      });

      const { matchesInput, messagesInput } = createMessagesAndMatches(
        tinderJson.Messages,
        input.tinderId,
      );
      log.info("Matches and messagess input", {
        matches: matchesInput.length,
        messages: messagesInput.length,
      });

      const tinderProfileInput = createSwipestatsTinderProfileInput(
        input.tinderId,
        userId,
        tinderJson,
      );

      const userBirthDate = new Date(tinderJson.User.birth_date);
      const usageInput = expandedUsageTimeFrameEntries.map(([date, meta]) => {
        return computeUsageInput(
          {
            appOpensCount: tinderJson.Usage.app_opens[date] ?? 0,
            matchesCount: tinderJson.Usage.matches[date] ?? 0,
            swipeLikesCount: tinderJson.Usage.swipes_likes[date] ?? 0,
            swipeSuperLikesCount: tinderJson.Usage.superlikes?.[date] ?? 0,
            swipePassesCount: tinderJson.Usage.swipes_passes[date] ?? 0,
            messagesSentCount: tinderJson.Usage.messages_sent[date] ?? 0,
            messagesReceivedCount:
              tinderJson.Usage.messages_received[date] ?? 0,
          },
          date,
          input.tinderId,
          userBirthDate,
          meta,
        );
      });
      log.info("Usage input created", { usageInput: usageInput.length });

      log.info("Profile Upload Simulation Complete");

      return tinderProfileInput;
    }),

  rankMessageOpeners: publicProcedure
    .input(z.object({ tinderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tp = await ctx.db.tinderProfile.findUniqueOrThrow({
        where: {
          tinderId: input.tinderId,
        },
        include: {
          matches: {
            include: {
              messages: true,
            },
          },
        },
      });

      const openers = tp.matches
        .reduce(
          (acc, match) => {
            const opener = match.messages[0]?.content;

            if (opener) {
              acc.push({
                opener,
                messageCount: match.messages.length,
              });
            }

            return acc;
          },
          [] as {
            opener: string;
            messageCount: number;
          }[],
        )
        .sort((a, b) => b.messageCount - a.messageCount);

      return {
        bestOpener: openers[0],
        top5Openers: openers.slice(0, 5),
        worstOpener: openers[openers.length - 1],
      };
    }),

  updateLocation: publicProcedure
    .input(
      z.object({
        tinderId: z.string(),
        location: z.object({
          city: z.string().nullish(),
          region: z.string().nullish(),
          country: z.string().nullish(),
          continent: z.string().nullish(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tinderProfile.update({
        where: { tinderId: input.tinderId },
        data: {
          city: input.location.city,
          region: input.location.region,
          country: input.location.country,
        },
      });
    }),

  getHingeMatches: publicProcedure
    .input(
      z.object({
        hingeId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Fetch all matches for the hinge profile
      const matches = await ctx.db.match.findMany({
        where: {
          hingeProfileId: input.hingeId,
        },
        select: {
          matchedAt: true,
        },
      });

      // Aggregate matches per month (YYYY-MM)
      const aggregation: Record<string, number> = {};

      for (const match of matches) {
        if (!match.matchedAt) continue;
        const monthKey = match.matchedAt.toISOString().slice(0, 7); // "YYYY-MM"
        aggregation[monthKey] = (aggregation[monthKey] ?? 0) + 1;
      }

      const result = Object.entries(aggregation)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, count]) => ({ month, count }));

      return result;
    }),

  // Likes over time
  getHingeLikes: publicProcedure
    .input(
      z.object({
        hingeId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const likes = await ctx.db.hingeBlock.findMany({
        where: {
          hingeId: input.hingeId,
          interactionType: HingeInteractionType.LIKE,
        },
        select: {
          dateStamp: true,
        },
      });

      const aggregation: Record<string, number> = {};

      for (const like of likes) {
        const monthKey = like.dateStamp.toISOString().slice(0, 7);
        aggregation[monthKey] = (aggregation[monthKey] ?? 0) + 1;
      }

      return Object.entries(aggregation)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, count]) => ({ month, count }));
    }),

  // Blocks / Unlikes over time
  getHingeBlocks: publicProcedure
    .input(
      z.object({
        hingeId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const blocks = await ctx.db.hingeBlock.findMany({
        where: {
          hingeId: input.hingeId,
          interactionType: {
            in: [HingeInteractionType.BLOCK, HingeInteractionType.UNLIKE],
          },
        },
        select: {
          dateStamp: true,
        },
      });

      const aggregation: Record<string, number> = {};

      for (const blk of blocks) {
        const monthKey = blk.dateStamp.toISOString().slice(0, 7);
        aggregation[monthKey] = (aggregation[monthKey] ?? 0) + 1;
      }

      return Object.entries(aggregation)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, count]) => ({ month, count }));
    }),
});
