"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { SwipestatsHingeProfilePayload } from "@/lib/interfaces/HingeDataJSON";
import { api } from "@/trpc/react";
import { logger } from "@/lib/tslog";

import { Button } from "@/app/_components/ui/button";
import { SLink } from "@/app/_components/ui/SLink";
import { toast } from "sonner";
import { analyticsTrackClient } from "@/lib/analytics/analyticsTrackClient";
import {
  getCountryFromBrowserTimeZone,
  getTimeZoneFromBrowser,
} from "@/lib/utils/getCountryFromTimeZone";
import { HingeUploadProfileCard } from "./HingeUploadProfileCard";

export function HingeUploadCTA(props: {
  swipestatsHingeProfilePayload: SwipestatsHingeProfilePayload;
}) {
  const log = logger.getSubLogger({ name: "hinge-upload-cta" });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [timeZone, _setTimeZone] = useState(() => getTimeZoneFromBrowser());
  const [country, _setCountry] = useState(() =>
    getCountryFromBrowserTimeZone(),
  );

  const hingeProfileCreateMutation = api.profile.createHinge.useMutation({
    onSuccess: (data) => {
      log.info("Hinge profile created API Return %O", data);
      router.push("/insights/hinge/" + data.hingeId);
    },
    onError: (error) => {
      toast.error("Failed to create Hinge profile");
      console.error(error);
      setLoading(false);
    },
  });

  async function uploadHingeProfile() {
    setLoading(true);

    analyticsTrackClient("Hinge Profile Upload Initialized", {
      providerId: "HINGE",
    });

    try {
      hingeProfileCreateMutation.mutate({
        hingeId: props.swipestatsHingeProfilePayload.hingeId,
        anonymizedHingeJson:
          props.swipestatsHingeProfilePayload.anonymizedHingeJson,
        timeZone,
        country,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-around gap-5">
        <div className="text-center md:text-left">
          <h2 className="text-base font-semibold uppercase tracking-wide text-rose-600">
            Upload
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Ready
          </p>
          <p className="mt-5 max-w-xl text-xl text-gray-500">
            Upload your Hinge data anonymously and get insights into your dating
            patterns!
          </p>
          <div className="">
            <div className="bg-muted rounded-lg">
              <p className="mx-auto mt-5 max-w-xl text-gray-500">
                This is your Swipestats Hinge Id. Save it, or find it by
                uploading your files again:
              </p>
              <p className="mt-2 inline-block rounded bg-slate-100 p-2 font-mono text-xs">
                {props.swipestatsHingeProfilePayload.hingeId}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-4 flex justify-center md:mx-0 md:mt-8 md:justify-start">
            <Button
              onClick={uploadHingeProfile}
              loading={loading}
              fluid
              disabled={loading}
            >
              {loading
                ? "Creating your Hinge profile..."
                : "Upload Hinge Profile"}
            </Button>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            By uploading you agree to our{" "}
            <SLink href="/tos" newTab>
              Terms of Service
            </SLink>
          </p>
        </div>

        <div className="pt-12 sm:pt-0">
          <HingeUploadProfileCard
            swipestatsHingeProfilePayload={props.swipestatsHingeProfilePayload}
          />
        </div>
      </div>
    </div>
  );
}
