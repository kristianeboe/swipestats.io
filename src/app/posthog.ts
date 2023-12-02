// app/posthog.js
import { env } from "@/env";
import { PostHog } from "posthog-node";

export default function PostHogClient() {
  const posthogClient = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}

export async function posthogTrackServer(
  eventName: string,
  userId?: string,
  properties: Record<string, string | number> = {},
) {
  const posthog = PostHogClient();

  posthog.capture({
    distinctId: userId ?? "server",
    event: eventName,
    properties,
  });

  await posthog.shutdownAsync();
}
