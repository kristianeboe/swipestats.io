import {
  type TinderUsage,
  type TinderProfile,
  type CustomData,
} from "@prisma/client";

export type DateString = string; // YYYY-MM-DD

export type DateKeyString = string; //`${number}-${number}-${number}`;

export type DateValueMap = Record<DateKeyString, number>;

export type FullTinderProfile = TinderProfile & {
  usage: TinderUsage[];
  customData: CustomData;
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

type FileEvent =
  | "File reading Initialized"
  | "File reading Aborted"
  | "File reading Failed"
  | "File reading Succeeded"
  | "File reading Rejected";
type ProfileEvent =
  | "Profile Anonymised Successfully"
  | "Profile Anonymised Failed"
  | "Profile Gender Data Auto Updated"
  | "Profile Gender Data Confirmed"
  | "Profile Gender Data Update Initiated"
  | "Profile Gender Data Updated"
  | "Profile Upload Initialized"
  | "Profile Created"
  | "Profile Updated"
  | "Profile Deleted"
  | "Profile Upload Simulated";

// reminder of happy path order
// File reading Initialized
// File reading Succeeded
// Profile Anonymised Successfully
// Profile Upload Initialized
// Profile Created

type MiscEvent =
  | "Newsletter Signup"
  | "Waitlist Signup"
  | "FAQ Question Clicked"
  | "Feedback Submitted";
// TODO split client and server events

type AiPhotosEvent = "AI Dating Photos Purchase";

type PurchaseEvent =
  | "Dataset Purchase"
  | "AI Dating Photos Purchase"
  | "Plus Subscription Purchase"
  | "Lemon Squeezy Webhook Error";

export type AnalyticsEventName =
  | ProfileEvent
  | FileEvent
  | MiscEvent
  | AiPhotosEvent
  | PurchaseEvent;
export type AnalyticsEventProperties = Record<
  string,
  string | number | boolean | null | string[] | undefined
>;

export type VercelAllowedPropertyValues = string | number | boolean | null;
