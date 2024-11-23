"use client";

import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Textarea } from "@/app/_components/ui/textarea";
import { Input } from "@/app/_components/ui/input";

const BioSection: React.FC = () => {
  const [currentBio, setCurrentBio] = useState("");
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // New state for user inputs
  const [userInputs, setUserInputs] = useState({
    interests: "",
    occupation: "",
    personality: "",
  });

  const handleGenerate = async () => {
    // TODO: Implement API call to generate bios
    const fakeBios = [
      "Adventure seeker with a passion for photography and good coffeeAdventure seeker with a passion for photography and good coffeeAdventure seeker with a passion for photography and good coffeeAdventure seeker with a passion for photography and good coffee.",
      "Bookworm by day, stargazer by night. Let's explore the world together!",
      "Fitness enthusiast and foodie. Looking for someone to share laughs and meals with.",
      "Tech geek with a creative side. Always up for trying new things!",
      "Animal lover and outdoor enthusiast. Seeking a partner in crime for hikes and movie nights.",
    ];
    setGeneratedBios(fakeBios);
  };

  const handleCopy = useCallback((bio: string, index: number) => {
    void navigator.clipboard.writeText(bio);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  }, []);

  // New function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Excellent choice. Let&apos;s unf*ck that bio of yours.
      </h2>
      <Textarea
        placeholder="Enter your current bio (optional)"
        value={currentBio}
        onChange={(e) => setCurrentBio(e.target.value)}
      />

      {/* New input fields */}
      <div className="space-y-2">
        <Input
          name="interests"
          placeholder="What are your interests? (e.g., photography, travel)"
          value={userInputs.interests}
          onChange={handleInputChange}
        />
        <Input
          name="occupation"
          placeholder="What's your occupation? (e.g., software engineer, artist)"
          value={userInputs.occupation}
          onChange={handleInputChange}
        />
        <Input
          name="personality"
          placeholder="Describe your personality (e.g., outgoing, creative)"
          value={userInputs.personality}
          onChange={handleInputChange}
        />
      </div>

      <Button onClick={handleGenerate}>Generate Improved Bios</Button>

      {generatedBios.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Generated Bios:</h3>
          {generatedBios.map((bio, index) => (
            <div
              key={index}
              className="relative flex items-center rounded border p-2"
            >
              <p className="flex-grow pr-14">{bio}</p>
              <Button
                variant="outline"
                onClick={() => handleCopy(bio, index)}
                className="absolute right-2 top-1/2 h-auto min-h-0 -translate-y-1/2 transform px-1.5 py-0.5 text-xs"
              >
                {copiedIndex === index ? "✔️" : "Copy"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BioSection;
