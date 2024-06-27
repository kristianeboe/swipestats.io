import "server-only";

import { PostHog } from "posthog-node";
import { env } from "@/env";

export default function PostHogClient() {
  const posthogClient = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
    disabled: env.NEXT_PUBLIC_MANUAL_ENV !== "production",
  });
  return posthogClient;
}
