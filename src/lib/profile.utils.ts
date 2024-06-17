import {
  type DateKeyString,
  type DateValueMap,
} from "./interfaces/utilInterfaces";

export function getFirstAndLastDayOnApp(appOpens: DateValueMap): {
  firstDayOnApp: Date;
  lastDayOnApp: Date;
} {
  const sortedDates = Object.entries(appOpens).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const firstDayOnApp = new Date(sortedDates[0]![0]);
  const lastDayOnApp = new Date(sortedDates[sortedDates.length - 1]![0]);

  return { firstDayOnApp, lastDayOnApp };
}

export type ExpandedUsageValue = {
  dateIsMissingFromOriginalData: boolean;
  activeUser: boolean;
  daysSinceLastActive: number | null;
  activeUserInLast7Days: boolean;
  activeUserInLast14Days: boolean;
  activeUserInLast30Days: boolean;
};
export function expandAndAugmentProfileWithMissingDays(dateValueMaps: {
  appOpens: DateValueMap;
  swipeLikes: DateValueMap;
  swipePasses: DateValueMap;
}): Record<DateKeyString, ExpandedUsageValue> {
  // true if data is extended
  const expandedMap: Record<DateKeyString, ExpandedUsageValue> = {};
  const { firstDayOnApp, lastDayOnApp } = getFirstAndLastDayOnApp(
    dateValueMaps.appOpens,
  );

  const currentDate = new Date(firstDayOnApp);
  const endDate = new Date(lastDayOnApp);

  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split("T")[0]!; // Converts date to YYYY-MM-DD format
    const appOpens = dateValueMaps.appOpens[dateKey];

    const dateIsMissingFromOriginalData = appOpens === undefined;

    const activity = isConsideredActiveUserOnDate(dateKey, dateValueMaps);

    expandedMap[dateKey] = {
      activeUser: activity.activeUser,
      daysSinceLastActive: activity.daysSinceLastActive,
      activeUserInLast7Days: activity.activeUserInLast7Days,
      activeUserInLast14Days: activity.activeUserInLast14Days,
      activeUserInLast30Days: activity.activeUserInLast30Days,

      dateIsMissingFromOriginalData,
    };
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return expandedMap;
}

function isConsideredActiveUserOnDate(
  dateKey: string,
  dateValueMaps: {
    appOpens: DateValueMap;
    swipeLikes: DateValueMap;
    swipePasses: DateValueMap;
  },
) {
  const targetDate = new Date(dateKey);
  let daysSinceLastActive = null;
  let activeLast30Days = false;
  let activeLast14Days = false;
  let activeLast7Days = false;

  for (let i = -30; i <= 0; i++) {
    // Check preceding dates and the current date
    const date = new Date(targetDate);
    date.setDate(date.getDate() + i);
    const currentKey = date.toISOString().split("T")[0]!;
    const appOpens = dateValueMaps.appOpens[currentKey];
    const swipeLikes = dateValueMaps.swipeLikes[currentKey];
    const swipePasses = dateValueMaps.swipePasses[currentKey];
    const activityDetected = !!appOpens || !!swipeLikes || !!swipePasses;

    if (activityDetected) {
      daysSinceLastActive = Math.abs(i);
    }

    if (i >= -30 && activityDetected) {
      activeLast30Days = true;
    }
    if (i >= -14 && i <= 0 && activityDetected) {
      activeLast14Days = true;
    }
    if (i >= -7 && i <= 0 && activityDetected) {
      activeLast7Days = true;
    }
  }

  return {
    activeUser: activeLast7Days || activeLast14Days || activeLast30Days,
    daysSinceLastActive,
    activeUserInLast7Days: activeLast7Days,
    activeUserInLast14Days: activeLast14Days,
    activeUserInLast30Days: activeLast30Days,
  };
}
