import { track } from "@vercel/analytics/react";
import posthog from "posthog-js";
import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
  VercelAllowedPropertyValues,
} from "../interfaces/utilInterfaces";

export function analyticsTrackClient(
  eventName: AnalyticsEventName,
  properties: AnalyticsEventProperties = {},
): void {
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

  track(eventName, cleanedProperties);
  posthog.capture(eventName, properties);
  console.log("Client track", { eventName, properties });
}
