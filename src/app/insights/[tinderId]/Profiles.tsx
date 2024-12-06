"use client";

import DemographicsModal from "./DemographicsModal";
import { useInsightsProvider } from "./InsightsProvider";
import MiniProfileCard from "./MiniProfileCard";

export default function Profiles() {
  const { myTinderProfile, profiles } = useInsightsProvider();

  console.log("my tinder profile", myTinderProfile);

  return (
    <div className="flex w-full flex-wrap justify-center gap-4">
      {profiles.map((profile) => (
        <MiniProfileCard
          key={profile.tinderId}
          age={profile.ageAtUpload}
          gender={profile.gender}
          location={{
            city: profile.city ?? "",
            region: profile.region ?? "",
            country: profile.country ?? "",
          }}
          instagramConnected={profile.instagramConnected}
        />
      ))}
      <DemographicsModal />
    </div>
  );
}
