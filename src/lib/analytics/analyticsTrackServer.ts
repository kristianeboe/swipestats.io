import { track } from "@vercel/analytics/server";

import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
  VercelAllowedPropertyValues,
} from "../interfaces/utilInterfaces";
import PostHogClient from "./posthog";
import { openpanel } from "./openpanel";
import { waitUntil } from "@vercel/functions";

async function analyticsTrackServerWait(
  userId: string,
  eventName: AnalyticsEventName,
  properties: AnalyticsEventProperties = {},
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

  // VA
  await track(eventName, cleanedProperties);
  // posthog
  const posthogClient = PostHogClient();
  posthogClient.capture({
    event: eventName,
    distinctId: userId,
    properties,
  });
  await PostHogClient().shutdown();

  await openpanel.track(eventName, {
    profileId: userId,
    ...cleanedProperties,
  });
  console.log("Server track", {
    userId,
    eventName,
    properties,
  });
}

export function analyticsTrackServer(
  userId: string,
  eventName: AnalyticsEventName,
  properties: AnalyticsEventProperties = {},
) {
  return waitUntil(analyticsTrackServerWait(userId, eventName, properties));
}
