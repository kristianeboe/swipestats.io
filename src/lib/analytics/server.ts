import { track } from "@vercel/analytics/server";

import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from "../interfaces/utilInterfaces";
import PostHogClient from "./posthog";

export async function analyticsTrackServer(
  userId: string,
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
  const posthogClient = PostHogClient();
  posthogClient.capture({
    event: eventName,
    distinctId: userId,
    properties,
  });
  await PostHogClient().shutdown();
}
