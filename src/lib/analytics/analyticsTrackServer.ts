import { track } from "@vercel/analytics/server";

import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
  VercelAllowedPropertyValues,
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
  const cleanedProperties: Record<string, VercelAllowedPropertyValues> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined) {
      cleanedProperties[key] = null;
    }
    if (Array.isArray(value)) {
      cleanedProperties[key] = value.join(", ");
    } else {
      cleanedProperties[key] = value as VercelAllowedPropertyValues;
    }
  }

  if (options?.awaitTrack) {
    await track(eventName, cleanedProperties);
  } else {
    void track(eventName, cleanedProperties);
  }
  const posthogClient = PostHogClient();
  posthogClient.capture({
    event: eventName,
    distinctId: userId,
    properties,
  });
  console.log("Server track", {
    userId,
    eventName,
    properties,
    options,
  });
  await PostHogClient().shutdown();
}
