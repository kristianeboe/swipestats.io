import { track } from "@vercel/analytics/react";
import posthog from "posthog-js";
import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from "../interfaces/utilInterfaces";

export function analyticsTrackClient(
  eventName: AnalyticsEventName,
  properties: AnalyticsEventProperties = {},
): void {
  track(eventName, properties);
  posthog.capture(eventName, properties);
  console.log("Client track", { eventName, properties });
}
