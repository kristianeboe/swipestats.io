"use client";

import { env } from "@/env";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import SuspendedPostHogPageView from "../PostHogPageView";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      // api_host: "https://eu.i.posthog.com",
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
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
  }, []);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}
