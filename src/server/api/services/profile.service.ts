import type {
  AnonymizedTinderDataJSON,
  TinderJsonGender,
} from "@/lib/interfaces/TinderDataJSON";
import he from "he";

import { Gender, SwipestatsVersion, type Prisma } from "@prisma/client";
import {
  type ExpandedUsageValue,
  expandAndAugmentProfileWithMissingDays,
  getFirstAndLastDayOnApp,
} from "@/lib/profile.utils";
import { differenceInDays } from "date-fns/differenceInDays";
import { createSubLogger } from "@/lib/tslog";
import { db } from "@/server/db";
import { createAggregatedProfileMetas } from "./profile.meta.service";
import { createMessagesAndMatches } from "./profile.messages.service";
import { differenceInYears } from "date-fns";

const log = createSubLogger("profile.service");

export function createTinderProfileTxnInput(params: {
  user: {
    userId: string;
    timeZone?: string;
    country?: string;
  };
  tinderId: string;
  tinderJson: AnonymizedTinderDataJSON;
}) {
  const userId = params.user.userId;
  const tinderJson = params.tinderJson;

  const expandedUsageTimeFrame = expandAndAugmentProfileWithMissingDays({
    appOpens: tinderJson.Usage.app_opens,
    swipeLikes: tinderJson.Usage.swipes_likes,
    swipePasses: tinderJson.Usage.swipes_passes,
  });
  const expandedUsageTimeFrameEntries = Object.entries(expandedUsageTimeFrame);

  const { matchesInput, messagesInput } = createMessagesAndMatches(
    tinderJson.Messages,
    params.tinderId,
  );

  const tinderProfileInput = createSwipestatsTinderProfileInput(
    params.tinderId,
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
        messagesReceivedCount: tinderJson.Usage.messages_received[date] ?? 0,
      },
      date,
      params.tinderId,
      userBirthDate,
      meta,
    );
  });

  return {
    tinderProfileInput,
    usageInput,
    matchesInput,
    messagesInput,
  };
}

export async function prismaCreateTinderProfileTxn(params: {
  user: {
    userId: string;
    timeZone?: string;
    country?: string;
  };
  tinderId: string;
  tinderJson: AnonymizedTinderDataJSON;
  swipestatsVersion?: SwipestatsVersion;
}) {
  const { matchesInput, messagesInput, tinderProfileInput, usageInput } =
    createTinderProfileTxnInput(params);

  const swipestatsProfile = await db.$transaction(
    async (txn) => {
      // TODO move to R2
      await txn.originalAnonymizedFile.create({
        data: {
          dataProvider: "TINDER",
          file: params.tinderJson as unknown as Prisma.JsonObject,
          swipestatsVersion: params.swipestatsVersion ?? "SWIPESTATS_3",
          user: {
            connectOrCreate: {
              where: {
                id: params.user.userId, // string just needs to be defined, a cuid is used to create if there is no match
              },
              create: {
                id: params.user.userId,
                timeZone: params.user.timeZone,
                country: params.user.country,
              },
            },
          },
        },
      });
      log.info("File uploaded", {
        tinderId: params.tinderId,
        userId: params.user.userId,
      });

      const tinderProfile = await txn.tinderProfile.create({
        data: tinderProfileInput,
      });
      log.info("Profile created", {
        tinderId: params.tinderId,
      });

      const usageCreateMany = await txn.tinderUsage.createMany({
        skipDuplicates: true,
        data: usageInput,
      });
      log.info("Usage created", { usageCreateMany: usageCreateMany.count });

      const matchesCreateMany = await txn.match.createMany({
        data: matchesInput,
      });
      log.info("Matches created", {
        matchesCreateManymatchesInput: matchesCreateMany.count,
      });

      const messagesCreateMany = await txn.message.createMany({
        data: messagesInput,
      });

      log.info("Messages created", {
        messagesCreateMany: messagesCreateMany.count,
      });

      const tinderProfileWithUsageAndMatches =
        await txn.tinderProfile.findUniqueOrThrow({
          where: {
            tinderId: tinderProfile.tinderId,
          },
          include: {
            usage: true,
            matches: {
              include: {
                messages: true,
              },
            },
          },
        });

      log.info("Profile fetched", {
        tinderId: tinderProfileWithUsageAndMatches.tinderId,
        usageCount: tinderProfileWithUsageAndMatches.usage.length,
        matchesCount: tinderProfileWithUsageAndMatches.matches.length,
      });

      const meta = createAggregatedProfileMetas(
        tinderProfileWithUsageAndMatches,
      );
      log.info("Meta created", {
        globalStart: meta.globalMeta.from,
        globalEnd: meta.globalMeta.to,
        byMonth: meta.metaByMonth.length,
        byYear: meta.metaByYear.length,
      });

      return await txn.tinderProfile.update({
        where: {
          tinderId: params.tinderId,
        },
        data: {
          profileMeta: {
            create: meta.globalMeta,
          },
          profileMetaByMonth: {
            createMany: {
              data: meta.metaByMonth,
            },
          },
          profileMetaByYear: {
            createMany: {
              data: meta.metaByYear,
            },
          },
        },
      });
    },
    {
      maxWait: 20_000, // default 5000
      timeout: 20_000,
    },
  );

  log.info("Swipestats profile transaction complete");

  return swipestatsProfile;
}

function getGenderFromString(gender: TinderJsonGender): Gender {
  if (gender === "M") {
    return Gender.MALE;
  } else if (gender === "F") {
    return Gender.FEMALE;
  } else if (gender === "Other") {
    return Gender.OTHER;
  } else if (gender === "Unknown") {
    return Gender.UNKNOWN;
  }

  // Should include More here, but defaulting to Unknown for now

  return Gender.UNKNOWN;
}

export function createSwipestatsTinderProfileInput(
  tinderId: string,
  userId: string,
  tinderJson: AnonymizedTinderDataJSON,
): Prisma.TinderProfileCreateInput {
  const usage = tinderJson.Usage;

  // ! what if there are no app opens? I guess it's ok for it to crash in that case
  const { firstDayOnApp, lastDayOnApp } = getFirstAndLastDayOnApp(
    usage.app_opens,
  );

  const daysInProfilePeriod = differenceInDays(lastDayOnApp, firstDayOnApp) + 1;
  const userBirthDate = new Date(tinderJson.User.birth_date);
  return {
    user: {
      connect: {
        id: userId,
      },
    },
    tinderId: tinderId,

    birthDate: userBirthDate,
    ageAtUpload: differenceInYears(new Date(), tinderJson.User.birth_date),
    ageAtLastUsage: differenceInYears(lastDayOnApp, userBirthDate),
    createDate: tinderJson.User.create_date,
    activeTime: tinderJson.User.active_time, // last seen?
    gender: getGenderFromString(tinderJson.User.gender),
    genderStr: tinderJson.User.gender,
    bio: tinderJson.User.bio ? he.decode(tinderJson.User.bio) : null,
    bioOriginal: tinderJson.User.bio,
    city: tinderJson.User.city?.name,
    region: tinderJson.User.city?.region,
    // create / connect location?

    user_interests: tinderJson.User.user_interests ?? [],
    interests: tinderJson.User.interests as unknown as Prisma.JsonArray,
    sexual_orientations: tinderJson.User.sexual_orientations, // Should probably be enum
    descriptors: tinderJson.User.descriptors as unknown as Prisma.JsonArray,

    instagramConnected: tinderJson.User.instagram,
    spotifyConnected: tinderJson.User.spotify,

    jobTitle: tinderJson.User.jobs?.[0]?.title?.name,
    jobTitleDisplayed: tinderJson.User.jobs?.[0]?.title?.displayed,
    company: tinderJson.User.jobs?.[0]?.company?.name,
    companyDisplayed: tinderJson.User.jobs?.[0]?.company?.displayed,
    school: tinderJson.User.schools?.[0]?.name,
    schoolDisplayed: tinderJson.User.schools?.[0]?.displayed,
    college: tinderJson.User.college as unknown as Prisma.JsonObject,
    jobsRaw: tinderJson.User.jobs as unknown as Prisma.JsonArray,
    schoolsRaw: tinderJson.User.schools as unknown as Prisma.JsonArray,

    educationLevel: tinderJson.User.education,

    ageFilterMin: tinderJson.User.age_filter_min,
    ageFilterMax: tinderJson.User.age_filter_max,
    interestedIn: getGenderFromString(tinderJson.User.interested_in),
    interestedInStr: tinderJson.User.interested_in,
    genderFilter: getGenderFromString(tinderJson.User.gender_filter),
    genderFilterStr: tinderJson.User.gender_filter,

    swipestatsVersion: "SWIPESTATS_3",

    firstDayOnApp: firstDayOnApp,
    lastDayOnApp: lastDayOnApp,
    daysInProfilePeriod,

    customData: {
      create: {},
    },

    jobs: {
      create: tinderJson.User.jobs?.map((j) => ({
        title: j.title?.name ?? "",
        titleDisplayed: !!j.title?.displayed,
        company: j.company?.name ?? null,
        companyDisplayed: j.company?.displayed ?? null,
      })),
    },
    schools: {
      create: tinderJson.User.schools?.map((s) => ({
        name: s.name,
        displayed: !!s.displayed,
      })),
    },

    rawUsage: {
      create: {
        appOpensRaw: usage.app_opens as unknown as Prisma.JsonObject,
        matchesRaw: usage.matches as unknown as Prisma.JsonObject,
        swipeLikesRaw: usage.swipes_likes as unknown as Prisma.JsonObject,
        swipePassesRaw: usage.swipes_passes as unknown as Prisma.JsonObject,
        messagesSentRaw: usage.messages_sent as unknown as Prisma.JsonObject,
        messagesReceivedRaw:
          usage.messages_received as unknown as Prisma.JsonObject,
      },
    },
    rawMessages: {
      create: {
        messages: tinderJson.Messages as unknown as Prisma.JsonArray,
      },
    },
  };
}

export function computeUsageInput(
  params: {
    appOpensCount: number;
    matchesCount: number;
    swipeLikesCount: number;
    swipeSuperLikesCount: number;
    swipePassesCount: number;
    messagesSentCount: number;
    messagesReceivedCount: number;
  },
  dateStampRaw: string,
  tinderProfileId: string,
  userBirthDate: Date,
  meta: ExpandedUsageValue,
): Prisma.TinderUsageCreateManyInput {
  const matchRate = params.swipeLikesCount
    ? params.matchesCount / params.swipeLikesCount
    : 0;
  const likeRate =
    params.swipeLikesCount + params.swipePassesCount
      ? params.swipeLikesCount /
        (params.swipeLikesCount + params.swipePassesCount)
      : 0;
  const messagesSentRate =
    params.messagesSentCount + params.messagesReceivedCount
      ? params.messagesSentCount /
        (params.messagesSentCount + params.messagesReceivedCount)
      : 0;

  const engagementRate = params.appOpensCount
    ? (params.swipeLikesCount +
        params.swipePassesCount +
        params.messagesSentCount) /
      params.appOpensCount
    : 0;

  const responseRate = params.messagesReceivedCount
    ? params.messagesSentCount / params.messagesReceivedCount
    : 0;

  const dateStamp = new Date(dateStampRaw);
  const userAgeThisDay = differenceInYears(dateStamp, userBirthDate);

  return {
    appOpens: params.appOpensCount,
    matches: params.matchesCount,

    swipeLikes: params.swipeLikesCount,
    swipeSuperLikes: params.swipeSuperLikesCount,
    swipePasses: params.swipePassesCount,
    swipesCombined: params.swipeLikesCount + params.swipePassesCount,

    messagesSent: params.messagesSentCount,
    messagesReceived: params.messagesReceivedCount,

    dateStamp,
    dateStampRaw,

    matchRate: matchRate,
    likeRate: likeRate,
    messagesSentRate: messagesSentRate,

    engagementRate,
    responseRate,
    tinderProfileId: tinderProfileId,

    dateIsMissingFromOriginalData: meta.dateIsMissingFromOriginalData,
    activeUser: meta.activeUser,
    daysSinceLastActive: meta.daysSinceLastActive,
    activeUserInLast7Days: meta.activeUserInLast7Days,
    activeUserInLast14Days: meta.activeUserInLast14Days,
    activeUserInLast30Days: meta.activeUserInLast30Days,
    userAgeThisDay,
  };
}

// not currently used, but keeping for reference / history
// everything is now done in createProfileMeta
function _getUsageMeta(usageCategory: [string, number][]) {
  if (usageCategory.length === 0) {
    return {
      total: 0,
      peak: 0,
      average: 0,
      median: 0,
      longestStreak: 0,
      longestGap: 0,
    };
  }

  usageCategory.sort(
    ([date1], [date2]) => new Date(date1).getTime() - new Date(date2).getTime(),
  );

  const counts: number[] = [];
  let total = 0;
  let peak = 0;
  let longestStreak = 1;
  let currentStreak = 1;
  let longestGap = 0;
  let currentGap = 0;
  let currentDate = new Date(usageCategory[0]![0]);
  counts.push(usageCategory[0]![1]);

  total += usageCategory[0]![1];
  peak = Math.max(peak, usageCategory[0]![1]);

  for (let i = 1; i < usageCategory.length; i++) {
    const nextDate = new Date(usageCategory[i]![0]);
    const diffDays = Math.ceil(
      (nextDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24),
    );

    for (let j = 1; j < diffDays; j++) {
      counts.push(0); // Fill in missing days with zero
      if (currentStreak > 0) {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 0;
      }
      currentGap++;
    }

    total += usageCategory[i]![1];
    peak = Math.max(peak, usageCategory[i]![1]);
    counts.push(usageCategory[i]![1]);

    if (usageCategory[i]![1] > 0) {
      if (currentStreak === 0 && currentGap > 0) {
        longestGap = Math.max(longestGap, currentGap);
        currentGap = 0;
      }
      currentStreak++;
    }

    currentDate = nextDate;
  }

  // Final checks after loop
  longestStreak = Math.max(longestStreak, currentStreak);
  if (currentGap > 0) {
    longestGap = Math.max(longestGap, currentGap);
  }

  counts.sort((a, b) => a - b);
  const mid = Math.floor(counts.length / 2);
  const median =
    counts.length % 2 !== 0
      ? counts[mid]
      : (counts[mid - 1]! + counts[mid]!) / 2;
  const average = total / counts.length;

  return {
    total,
    peak,
    average,
    median,
    longestStreak,
    longestGap,
  };
}
