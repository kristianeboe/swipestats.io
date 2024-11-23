"use client";

import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "@/app/_components/ui/textarea";

const PromptSection: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [generatedAnswers, setGeneratedAnswers] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    // TODO: Implement API call to generate prompt answers
    const fakeAnswers = [
      "I'd bring a sense of adventure and a camera to capture the memories!",
      "My ideal travel companion is curiosity - it always leads to the best stories.",
      "I'd pack a good book, comfy shoes, and an open mind for new experiences.",
      "A playlist full of eclectic music to set the mood for any journey.",
      "My witty sense of humor - laughter is the best way to connec humor - laughter is the best way to connec humor - laughter is the best way to connec humor - laughter is the best way to connec humor - laughter is the best way to connec humor - laughter is the best way to connec humor - laughter is the best way to connect with locals!",
    ];
    setGeneratedAnswers(fakeAnswers);
  };

  const handleCopy = useCallback((answer: string, index: number) => {
    void navigator.clipboard.writeText(answer);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Nice move, Tarzan. Let&apos;s rizz up that prompt answer.
      </h2>
      <Input
        placeholder="Enter the prompt (e.g., 'The one thing I'd bring to a deserted island is...')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Textarea
        placeholder="Enter your current answer (optional)"
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
      />
      <Button onClick={handleGenerate}>Generate Improved Answers</Button>
      {generatedAnswers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Generated Answers:</h3>
          {generatedAnswers.map((answer, index) => (
            <div
              key={index}
              className="relative flex items-center rounded border p-2"
            >
              <p className="flex-grow pr-14">{answer}</p>
              <Button
                variant="outline"
                onClick={() => handleCopy(answer, index)}
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

export default PromptSection;
