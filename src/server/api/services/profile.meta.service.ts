import {
  type Match,
  type Message,
  type Prisma,
  type TinderProfile,
  type TinderUsage,
} from "@prisma/client";
import { addMonths, differenceInDays } from "date-fns";
import { getMessagesMetaFromMatches } from "./profile.messages.service";
// import { createSubLogger } from "@/lib/tslog";

// const log = createSubLogger("profile.meta");

export function createProfileMeta(
  profile: TinderProfileWithUsageAndMatches,
  // assume that above data has been filtered correctly to / from
  options: { from: Date; to: Date },
): Prisma.ProfileMetaCreateInput {
  const daysInProfilePeriod = differenceInDays(options.to, options.from);
  // should be the same as profile.usage.length

  const individualUsageArrays = {
    appOpens: [] as number[],
    swipeLikes: [] as number[],
    swipeSuperLikes: [] as number[],
    swipePasses: [] as number[],
    combinedSwipes: [] as number[],
    messagesSent: [] as number[],
    messagesReceived: [] as number[],
    matches: [] as number[],
  };

  let previousDate = new Date(options.from);
  const usageReduced = profile.usage.reduce(
    (acc, cur) => {
      acc.appOpensTotal += cur.appOpens;
      if (cur.appOpens > 0) {
        acc.daysActiveOnApp++;
      } else {
        acc.daysNotActiveOnApp++;
      }

      acc.matchesTotal += cur.matches;
      acc.swipeLikesTotal += cur.swipeLikes;
      acc.swipeSuperLikesTotal += cur.swipeSuperLikes;
      acc.swipePassesTotal += cur.swipePasses;
      acc.messagesSentTotal += cur.messagesSent;
      acc.messagesReceivedTotal += cur.messagesReceived;

      if (cur.swipeLikes > 0) {
        acc.youSwipedOnXDays++;
      }
      if (cur.messagesSent > 0) {
        acc.youMessagedOnXDays++;
      }

      if (cur.appOpens > 0 && cur.swipeLikes === 0) {
        acc.onXDaysYouOpenedTheAppButDidNotSwipe++;
      }
      if (cur.appOpens > 0 && cur.messagesSent === 0) {
        acc.onXDaysYouOpenedTheAppButDidNotMessage++;
      }
      if (cur.appOpens > 0 && cur.swipeLikes === 0 && cur.messagesSent === 0) {
        acc.onXDaysYouOpenedTheAppButDidNotSwipeOrMessage++;
      }

      individualUsageArrays.appOpens.push(cur.appOpens);
      individualUsageArrays.swipeLikes.push(cur.swipeLikes);
      individualUsageArrays.swipeSuperLikes.push(cur.swipeSuperLikes);
      individualUsageArrays.swipePasses.push(cur.swipePasses);
      individualUsageArrays.messagesSent.push(cur.messagesSent);
      individualUsageArrays.messagesReceived.push(cur.messagesReceived);
      individualUsageArrays.matches.push(cur.matches);
      individualUsageArrays.combinedSwipes.push(cur.swipesCombined);

      if (cur.matches > acc.peakMatches) {
        acc.peakMatches = cur.matches;
        acc.peakMatchesDate = cur.dateStamp;
      }
      if (cur.appOpens > acc.peakAppOpens) {
        acc.peakAppOpens = cur.appOpens;
        acc.peakAppOpensDate = cur.dateStamp;
      }
      if (cur.swipeLikes > acc.peakSwipeLikes) {
        acc.peakSwipeLikes = cur.swipeLikes;
        acc.peakSwipeLikesDate = cur.dateStamp;
      }
      if (cur.swipePasses > acc.peakSwipePasses) {
        acc.peakSwipePasses = cur.swipePasses;
        acc.peakSwipePassesDate = cur.dateStamp;
      }
      if (cur.swipesCombined > acc.peakCombinedSwipes) {
        acc.peakCombinedSwipes = cur.swipesCombined;
        acc.peakCombinedSwipesDate = cur.dateStamp;
      }
      if (cur.messagesSent > acc.peakMessagesSent) {
        acc.peakMessagesSent = cur.messagesSent;
        acc.peakMessagesSentDate = cur.dateStamp;
      }
      if (cur.messagesReceived > acc.peakMessagesReceived) {
        acc.peakMessagesReceived = cur.messagesReceived;
        acc.peakMessagesReceivedDate = cur.dateStamp;
      }

      if (cur.swipesCombined >= 100) {
        acc.dailySwipeLimitsReached++;
      }

      const currentDate = new Date(cur.dateStamp);
      const diffDays = Math.ceil(
        (currentDate.getTime() - previousDate.getTime()) / (1000 * 3600 * 24),
      );

      if (diffDays === 1) {
        // Continue the streak
        acc.currentActiveOnAppStreak++;
      } else {
        // Update longest streak if current streak ends
        acc.longestActiveOnAppStreak = Math.max(
          acc.longestActiveOnAppStreak,
          acc.currentActiveOnAppStreak,
        );
        acc.currentActiveOnAppStreak = 1; // Reset current streak
        // Calculate the gap (subtracting 1 to account for the difference between consecutive days)
        acc.longestActiveOnAppGap = Math.max(
          acc.longestActiveOnAppGap,
          diffDays - 1,
        );
      }

      previousDate = currentDate;

      return acc;
    },
    {
      daysActiveOnApp: 0,
      daysNotActiveOnApp: 0,
      appOpensTotal: 0,
      matchesTotal: 0,
      swipeLikesTotal: 0,
      swipeSuperLikesTotal: 0,
      swipePassesTotal: 0,
      messagesSentTotal: 0,
      messagesReceivedTotal: 0,

      youSwipedOnXDays: 0,
      youMessagedOnXDays: 0,

      onXDaysYouOpenedTheAppButDidNotSwipe: 0,
      onXDaysYouOpenedTheAppButDidNotMessage: 0,
      onXDaysYouOpenedTheAppButDidNotSwipeOrMessage: 0,

      peakMatches: 0,
      peakMatchesDate: options.from,
      peakAppOpens: 0,
      peakAppOpensDate: options.from,
      peakSwipeLikes: 0,
      peakSwipeLikesDate: options.from,
      peakSwipePasses: 0,
      peakSwipePassesDate: options.from,
      peakCombinedSwipes: 0,
      peakCombinedSwipesDate: options.from,
      peakMessagesSent: 0,
      peakMessagesSentDate: options.from,
      peakMessagesReceived: 0,
      peakMessagesReceivedDate: options.from,

      dailySwipeLimitsReached: 0,

      currentActiveOnAppStreak: 1,
      longestActiveOnAppStreak: 1,
      longestActiveOnAppGap: 0,
    },
  );

  // log.info("Usage reduced", usageReduced);

  const longestActivePeriodInDays = Math.max(
    usageReduced.longestActiveOnAppStreak,
    usageReduced.currentActiveOnAppStreak,
  );
  const longestInactivePeriodInDays = usageReduced.longestActiveOnAppGap;

  const combinedSwipesTotal =
    usageReduced.swipeLikesTotal + usageReduced.swipePassesTotal;
  const totalMessages =
    usageReduced.messagesSentTotal + usageReduced.messagesReceivedTotal;
  const noMatchesTotal =
    usageReduced.swipeLikesTotal - usageReduced.matchesTotal;

  const matchRateForPeriod = getRatio(
    usageReduced.matchesTotal,
    usageReduced.swipeLikesTotal,
  );

  const likeRateForPeriod = getRatio(
    usageReduced.swipeLikesTotal,
    combinedSwipesTotal,
  );
  const likeRatio = getRatio(
    usageReduced.swipeLikesTotal,
    usageReduced.swipePassesTotal,
  );

  const messagesSentRateForPeriod = getRatio(
    usageReduced.messagesSentTotal,
    totalMessages,
  );

  const messagesSentRatio = getRatio(
    usageReduced.messagesSentTotal,
    usageReduced.messagesReceivedTotal,
  );

  // log.info("Ratios", {
  //   matchRateForPeriod,
  //   likeRateForPeriod,
  //   likeRatio,
  //   messagesSentRateForPeriod,
  //   messagesSentRatio,
  // });

  const messagesMeta = getMessagesMetaFromMatches(profile.matches);
  // log.info("Messages meta", messagesMeta);

  return {
    // usage meta
    from: options.from,
    to: options.to,

    daysInProfilePeriod,
    daysActiveOnApp: usageReduced.daysActiveOnApp,
    daysNotActiveOnApp: usageReduced.daysNotActiveOnApp,

    appOpensTotal: usageReduced.appOpensTotal,
    swipeLikesTotal: usageReduced.swipeLikesTotal,
    swipeSuperLikesTotal: usageReduced.swipeSuperLikesTotal,
    swipePassesTotal: usageReduced.swipePassesTotal,
    combinedSwipesTotal: combinedSwipesTotal,
    messagesSentTotal: usageReduced.messagesSentTotal,
    messagesReceivedTotal: usageReduced.messagesReceivedTotal,

    matchesTotal: usageReduced.matchesTotal, // profile.matches.length
    noMatchesTotal: noMatchesTotal,

    youMessagedOnXDays: usageReduced.youMessagedOnXDays,
    youSwipedOnXDays: usageReduced.youSwipedOnXDays,
    onXDaysYouOpenedTheAppButDidNotSwipe:
      usageReduced.onXDaysYouOpenedTheAppButDidNotSwipe,
    onXDaysYouOpenedTheAppButDidNotMessage:
      usageReduced.onXDaysYouOpenedTheAppButDidNotMessage,
    onXDaysYouOpenedTheAppButDidNotSwipeOrMessage:
      usageReduced.onXDaysYouOpenedTheAppButDidNotSwipeOrMessage,

    matchRateForPeriod,
    likeRateForPeriod,
    likeRatio,
    messagesSentRateForPeriod,
    messagesSentRatio,

    averageMatchesPerDay: usageReduced.matchesTotal / daysInProfilePeriod,
    averageAppOpensPerDay: usageReduced.appOpensTotal / daysInProfilePeriod,
    averageSwipeLikesPerDay: usageReduced.swipeLikesTotal / daysInProfilePeriod,
    averageSwipePassesPerDay:
      usageReduced.swipePassesTotal / daysInProfilePeriod,
    averageMessagesSentPerDay:
      usageReduced.messagesSentTotal / daysInProfilePeriod,
    averageMessagesReceivedPerDay:
      usageReduced.messagesReceivedTotal / daysInProfilePeriod,

    averageSwipesPerDay: combinedSwipesTotal / daysInProfilePeriod,

    medianMatchesPerDay: getMedian(individualUsageArrays.matches),
    medianAppOpensPerDay: getMedian(individualUsageArrays.appOpens),
    medianSwipeLikesPerDay: getMedian(individualUsageArrays.swipeLikes),
    medianSwipePassesPerDay: getMedian(individualUsageArrays.swipePasses),
    medianMessagesSentPerDay: getMedian(individualUsageArrays.messagesSent),
    medianMessagesReceivedPerDay: getMedian(
      individualUsageArrays.messagesReceived,
    ),
    medianSwipesPerDay: getMedian(individualUsageArrays.combinedSwipes),

    peakAppOpens: usageReduced.peakAppOpens,
    peakAppOpensDate: usageReduced.peakAppOpensDate,
    peakMatches: usageReduced.peakMatches,
    peakMatchesDate: usageReduced.peakMatchesDate,
    peakSwipeLikes: usageReduced.peakSwipeLikes,
    peakSwipeLikesDate: usageReduced.peakSwipeLikesDate,
    peakSwipePasses: usageReduced.peakSwipePasses,
    peakSwipePassesDate: usageReduced.peakSwipePassesDate,
    peakCombinedSwipes: usageReduced.peakCombinedSwipes,
    peakCombinedSwipesDate: usageReduced.peakCombinedSwipesDate,
    peakMessagesSent: usageReduced.peakMessagesSent,
    peakMessagesSentDate: usageReduced.peakMessagesSentDate,
    peakMessagesReceived: usageReduced.peakMessagesReceived,
    peakMessagesReceivedDate: usageReduced.peakMessagesReceivedDate,

    dailySwipeLimitsReached: usageReduced.dailySwipeLimitsReached,

    longestActivePeriodInDays,
    longestInactivePeriodInDays,

    // messages and matches meta
    nrOfConversations: messagesMeta.nrOfConversations,
    nrOfConversationsWithMessages: messagesMeta.nrOfConversationsWithMessages,
    longestConversation: messagesMeta.longestConversation,
    longestConversationInDays: messagesMeta.longestConversationInDays,
    messageCountInLongestConversationInDays:
      messagesMeta.messageCountInLongestConversationInDays,
    longestConversationInDaysWithLessThan2WeeksBetweenMessages:
      messagesMeta.longestConversationInDaysWithLessThan2WeeksBetweenMessages,
    messageCountInLongestConversationInDaysWithLessThan2WeeksBetweenMessages:
      messagesMeta.messageCountInLongestConversationInDaysWithLessThan2WeeksBetweenMessages,
    averageConversationMessageCount:
      messagesMeta.averageConversationMessageCount,
    averageConversationLengthInDays:
      messagesMeta.averageConversationLengthInDays,
    medianConversationMessageCount: messagesMeta.medianConversationMessageCount,
    medianConversationLengthInDays: messagesMeta.medianConversationLengthInDays,
    nrOfOneMessageConversations: messagesMeta.nrOfOneMessageConversations,
    percentOfOneMessageConversations:
      messagesMeta.percentOfOneMessageConversations,

    nrOfGhostingsAfterInitialMatch: messagesMeta.nrOfGhostingsAfterInitialMatch,
  };
}

function getMedian(arr: number[]) {
  //if (arr.length === 0) throw new Error("Array is empty");
  if (arr.length === 0) return 0;
  const sorted = arr.slice().sort();
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]!
    : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

function getRatio(x: number, dividedBy: number) {
  if (dividedBy === 0) return 0;
  return x / dividedBy;
}

export type TinderProfileWithUsageAndMatches = TinderProfile & {
  usage: TinderUsage[];
  matches: (Match & { messages: Message[] })[];
};

export function createAggregatedProfileMetas(
  tp: TinderProfileWithUsageAndMatches,
) {
  const globalMeta = createProfileMeta(tp, {
    from: tp.firstDayOnApp,
    to: tp.lastDayOnApp,
  });

  const { byMonth, byYear } = aggregateUsageAndMessages({
    usage: tp.usage,
    matches: tp.matches,
  });

  // ! Don't log this, too much data
  // log.info("Aggregated usage and messages by month and year", {
  //   byMonth,
  //   byYear,
  // });

  const metaByMonth = Object.entries(byMonth).map(
    ([month, { usage, matches }]) => {
      return createProfileMeta(
        {
          ...tp,
          usage: usage,
          matches: matches,
        },
        {
          from: new Date(month),
          to: addMonths(new Date(month), 1),
        },
      );
    },
  );

  const metaByYear = Object.entries(byYear).map(
    ([year, { usage, matches }]) => {
      return createProfileMeta(
        {
          ...tp,
          usage: usage,
          matches: matches,
        },
        {
          from: new Date(year),
          to: addMonths(new Date(year), 12),
        },
      );
    },
  );

  return {
    globalMeta,
    metaByMonth,
    metaByYear,
  };
}

function initializeYearlyAggregations(
  startDate: Date,
  endDate: Date,
): UsageAndMessagesByPeriod {
  const aggregationByYear: UsageAndMessagesByPeriod = {};

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  for (let year = startYear; year <= endYear; year++) {
    const yearKey = year.toString(); // Format as "YYYY"
    aggregationByYear[yearKey] = {
      usage: [],
      matches: [],
    };
  }

  return aggregationByYear;
}

interface UsageAndMessages {
  usage: TinderUsage[];
  matches: (Match & { messages: Message[] })[];
}

type UsageAndMessagesByPeriod = Record<string, UsageAndMessages>;

function initializeMonthlyAggregations(
  startDate: Date,
  endDate: Date,
): UsageAndMessagesByPeriod {
  const aggregationByMonth: UsageAndMessagesByPeriod = {};

  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  for (
    let date = new Date(start);
    date <= end;
    date.setMonth(date.getMonth() + 1)
  ) {
    const monthKey = date.toISOString().slice(0, 7); // Format as "YYYY-MM"
    aggregationByMonth[monthKey] = {
      usage: [],
      matches: [],
    };
  }

  return aggregationByMonth;
}

export function aggregateUsageAndMessages(params: {
  usage: TinderUsage[];
  matches: (Match & { messages: Message[] })[];
}): {
  byMonth: UsageAndMessagesByPeriod;
  byYear: UsageAndMessagesByPeriod;
} {
  const startDate = params.usage[0]!.dateStamp;
  const endDate = params.usage[params.usage.length - 1]!.dateStamp;

  const aggregationByMonth: Record<
    string,
    {
      usage: TinderUsage[];
      matches: (Match & { messages: Message[] })[];
    }
  > = initializeMonthlyAggregations(startDate, endDate);
  const aggregationByYear = initializeYearlyAggregations(startDate, endDate);

  params.usage.forEach((usageDay) => {
    const month = usageDay.dateStampRaw.substring(0, 7); // Get YYYY-MM format
    const year = usageDay.dateStampRaw.substring(0, 4); // Get YYYY format

    aggregationByMonth[month]?.usage!.push(usageDay);
    aggregationByYear[year]?.usage!.push(usageDay);
  });

  params.matches.forEach((match) => {
    if (match.initialMessageAt) {
      const month = match.initialMessageAt.toISOString().substring(0, 7); // Get YYYY-MM format
      const year = match.initialMessageAt.toISOString().substring(0, 4); // Get YYYY format

      aggregationByMonth[month]?.matches!.push(match);
      aggregationByYear[year]?.matches!.push(match);
    }
  });

  return {
    byMonth: aggregationByMonth,
    byYear: aggregationByYear,
  };
}
