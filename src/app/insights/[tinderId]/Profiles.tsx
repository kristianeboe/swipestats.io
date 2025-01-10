"use client";

import DemographicsModal from "./DemographicsModal";
import { useInsightsProvider } from "./InsightsProvider";
import MiniProfileCard from "./MiniProfileCard";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/app/_components/ui/card";

export default function Profiles() {
  const { myTinderProfile, profiles, comparisonIdsArray } =
    useInsightsProvider();

  const comparisonIdsNotYetLoaded = useMemo(() => {
    return comparisonIdsArray.filter((comparisonId) => {
      return !profiles.some((profile) => profile.tinderId === comparisonId);
    });
  }, [comparisonIdsArray, profiles]);

  console.log("my tinder profile", myTinderProfile);
  console.log(
    "profiles",
    profiles.map((profile) => profile.usage),
  );

  return (
    <div className="flex w-full flex-wrap justify-center gap-4 pb-12">
      {profiles.map((profile) => (
        <MiniProfileCard fullTinderProfile={profile} key={profile.tinderId} />
      ))}
      {comparisonIdsNotYetLoaded.map((comparisonId) => (
        <Card.Container
          key={comparisonId}
          className="w-full max-w-sm overflow-hidden"
        >
          <div className="relative h-12 bg-gradient-to-r from-rose-400 to-rose-300 p-4"></div>
          <Card.Content className="space-y-6 p-6">
            {/* Gender and age */}
            <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />

            {/* Location */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            </div>

            {/* Looking for */}
            {/* <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
            </div> */}

            {/* Date range */}
            {/* <div className="h-5 w-64 animate-pulse rounded bg-gray-200" /> */}
          </Card.Content>
        </Card.Container>
      ))}
      <DemographicsModal />
    </div>
  );
}
