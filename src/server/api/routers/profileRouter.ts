import { z } from "zod";
import { nanoid } from "nanoid";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { DataProvider, type TinderProfile } from "@prisma/client";
import type { AnonymizedTinderDataJSON } from "@/lib/interfaces/TinderDataJSON";
import { createSubLogger } from "@/lib/tslog";
import { track } from "@vercel/analytics/server";

import {
  createSwipestatsTinderProfileInput,
  prismaCreateTinderProfileTxn,
} from "../services/profile.service";
import { createMessagesAndMatches } from "../services/profile.messages.service";

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
      const tinderProfile = ctx.db.tinderProfile.findUnique({
        where: {
          tinderId: input.tinderId,
        },
        include: {
          profileMeta: true,
          usage: {
            orderBy: {
              dateStamp: "asc",
            },
          },
        },
      });

      return tinderProfile;
    }),

  compare: publicProcedure
    .input(
      z.object({
        tinderId: z.string(),
        comparisonIds: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const myProfile = await ctx.db.tinderProfile.findUniqueOrThrow({
        where: {
          tinderId: input.tinderId,
        },
      });

      const tinderProfiles = await ctx.db.tinderProfile.findMany({
        where: {
          tinderId: {
            in: input.comparisonIds,
          },
        },
        include: {
          usage: {
            where: {
              dateStamp: {
                gt: myProfile.firstDayOnApp,
                lt: myProfile.lastDayOnApp,
              },
            },
          },
        },
      });

      return tinderProfiles;
    }),

  create: publicProcedure
    .input(
      z.object({ tinderId: z.string().min(1), anonymizedTinderJson: z.any() }),
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

      log.info("Initiate prisma create");

      log.info("Location", {
        city: tinderJson.User.city?.name,
        region: tinderJson.User.city?.region,
      });

      const userId = user?.id ?? nanoid(); // defaults to nanoid

      const swipestatsProfile = await prismaCreateTinderProfileTxn({
        userId,
        tinderId: input.tinderId,
        tinderJson,
      });

      await track("Profile Created", {
        tinderId: input.tinderId,
        gender: swipestatsProfile.gender,
        age: swipestatsProfile.ageAtUpload,
        city: swipestatsProfile.city,
        region: swipestatsProfile.region,
      });

      return swipestatsProfile;
    }),

  update: publicProcedure
    .input(
      z.object({ tinderId: z.string().min(1), anonymizedTinderJson: z.any() }),
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
          userId,
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
          userId,
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

      return waitlistEntry;
    }),
  simulateProfileUplad: publicProcedure
    .input(z.object({ tinderId: z.string(), anonymizedTinderJson: z.any() }))
    .mutation(async ({ input, ctx }) => {
      const tinderJson = input.anonymizedTinderJson as AnonymizedTinderDataJSON;

      const userId = nanoid();

      const tinderProfileInput = createSwipestatsTinderProfileInput(
        input.tinderId,
        userId,
        tinderJson,
      );

      createMessagesAndMatches(tinderJson.Messages, input.tinderId);

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
});
