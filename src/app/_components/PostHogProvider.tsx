"use client";

import { env } from "@/env";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "https://eu.i.posthog.com",
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    capture_pageleave: true, // Enable pageleave capture
    loaded: function (ph) {
      // if (env.NEXT_PUBLIC_MANUAL_ENV !== "production") {
      //   ph.opt_out_capturing(); // opts a user out of event capture
      //   ph.set_config({ disable_session_recording: true });
      // }
    },
    _onCapture: function (event) {
      console.log("PostHog client event captured", event);
    },
  });
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
