import { track } from "@vercel/analytics/server";
import posthog from "posthog-js";
import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from "../interfaces/utilInterfaces";

export async function analyticsTrackServer(
  eventName: AnalyticsEventName,
  properties: AnalyticsEventProperties = {},
  options?: {
    awaitTrack?: boolean;
  },
): Promise<void> {
  if (options?.awaitTrack) {
    await track(eventName, properties);
  } else {
    void track(eventName, properties);
  }
  posthog.capture(eventName, properties);
}
