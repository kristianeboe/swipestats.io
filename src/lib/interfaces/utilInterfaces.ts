import { type TinderUsage, type TinderProfile } from "@prisma/client";

export type DateString = string; // YYYY-MM-DD

export type DateKeyString = string; //`${number}-${number}-${number}`;

export type DateValueMap = Record<DateKeyString, number>;

export type FullTinderProfile = TinderProfile & {
  usage: TinderUsage[];
};
export type ChartDataKey =
  | "appOpens"
  | "matches"
  | "messagesSent"
  | "messagesReceived"
  | "swipeLikes"
  | "swipePasses"
  | "swipeSuperLikes"
  | "matchRate";

export type ChartDataPoint = {
  xDataKey: string;
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
} & {
  [tinderId: string]: number;
};
