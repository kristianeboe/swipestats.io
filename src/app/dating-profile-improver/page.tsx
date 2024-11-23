"use client";

import React, { useState } from "react";
import BioSection from "@/app/_components/BioSection";
import PromptSection from "@/app/_components/PromptSection";
import { Button } from "@/app/_components/ui/button";
import { Text } from "@/app/_components/ui/text";

const ProfileImprover: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<
    "bio" | "prompt" | null
  >(null);

  return (
    <div className="profile-improver container mx-auto flex max-w-[720px] flex-col items-center px-4 py-8">
      <div className="mb-8 flex w-full items-center justify-between">
        {selectedSection && (
          <Button
            onClick={() => setSelectedSection(null)}
            variant="outline"
            className="mr-4"
          >
            ◀️
          </Button>
        )}
        <h1 className="flex-grow text-center text-3xl font-bold">
          Dating Profile Improver
        </h1>
        {selectedSection && <div className="w-[73px]" />}{" "}
        {/* Spacer for alignment */}
      </div>

      {!selectedSection ? (
        <div className="space-y-6 text-center">
          <Text.P>
            Take your dating profile from shit to legit in just a few clicks.
          </Text.P>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setSelectedSection("bio")}>
              Improve Bio
            </Button>
            <Button onClick={() => setSelectedSection("prompt")}>
              Improve Prompt
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-6 text-center">
          {selectedSection === "bio" ? <BioSection /> : <PromptSection />}
        </div>
      )}
    </div>
  );
};

export default ProfileImprover;
