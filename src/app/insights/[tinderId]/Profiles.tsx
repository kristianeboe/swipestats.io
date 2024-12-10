"use client";

import DemographicsModal from "./DemographicsModal";
import { useInsightsProvider } from "./InsightsProvider";
import MiniProfileCard from "./MiniProfileCard";

export default function Profiles() {
  const { myTinderProfile, profiles } = useInsightsProvider();

  console.log("my tinder profile", myTinderProfile);

  return (
    <div className="flex w-full flex-wrap justify-center gap-4 pb-12">
      {profiles.map((profile) => (
        <MiniProfileCard
          tinderId={profile.tinderId}
          key={profile.tinderId}
          age={profile.ageAtUpload}
          gender={profile.gender}
          location={{
            city: profile.city ?? "",
            region: profile.region ?? "",
            country: profile.country ?? "",
          }}
          job={{
            title: profile.jobTitle ?? "",
            company: profile.company ?? "",
          }}
          instagramConnected={profile.instagramConnected}
          dataFrom={profile.firstDayOnApp}
          dataTo={profile.lastDayOnApp}
        />
      ))}
      <DemographicsModal />
    </div>
  );
}
