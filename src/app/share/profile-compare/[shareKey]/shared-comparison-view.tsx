"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DataProvider,
  type ComparisonColumn,
  type ProfileComparison,
} from "@prisma/client";
import { Textarea } from "@/app/_components/ui/textarea";

// Re-using styles from comparison-column.tsx
const APP_COLORS = {
  [DataProvider.TINDER]:
    "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
  [DataProvider.HINGE]:
    "bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800",
  [DataProvider.BUMBLE]:
    "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  [DataProvider.GRINDER]:
    "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
  [DataProvider.BADOO]:
    "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
  [DataProvider.BOO]:
    "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
  [DataProvider.OK_CUPID]:
    "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  [DataProvider.FEELD]:
    "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800",
};

const APP_HEADER_COLORS = {
  [DataProvider.TINDER]: "bg-red-500 text-white",
  [DataProvider.HINGE]: "bg-pink-500 text-white",
  [DataProvider.BUMBLE]: "bg-yellow-500 text-black",
  [DataProvider.GRINDER]: "bg-orange-500 text-white",
  [DataProvider.BADOO]: "bg-purple-500 text-white",
  [DataProvider.BOO]: "bg-blue-500 text-white",
  [DataProvider.OK_CUPID]: "bg-green-500 text-white",
  [DataProvider.FEELD]: "bg-gray-500 text-white",
};

type SharedComparisonViewProps = {
  comparison: ProfileComparison & {
    columns: (ComparisonColumn & {
      photos: { id: string; url: string; order: number }[];
    })[];
  };
};

export default function SharedComparisonView({
  comparison,
}: SharedComparisonViewProps) {
  const [feedback, setFeedback] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  // TODO: Implement this when adding feedback functionality with tRPC
  const handleSubmitFeedback = () => {
    console.log("Submitting feedback:", { vote, feedback });
    // Reset form
    setFeedback("");
    setShowFeedbackForm(false);
    setVote(null);
  };

  return (
    <div className="space-y-6">
      <Card.Container>
        <CardHeader>
          <CardTitle>{comparison.name || "Untitled Comparison"}</CardTitle>
          <CardDescription>
            Which profile looks better? Leave feedback below.
            {comparison.age && <> • Age: {comparison.age}</>}
            {comparison.city && <> • {comparison.city}</>}
            {comparison.state && <>, {comparison.state}</>}
            {comparison.country && <>, {comparison.country}</>}
          </CardDescription>
          {comparison.defaultBio && (
            <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-800">
              <strong>Default Bio:</strong> {comparison.defaultBio}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {comparison.columns.map((column) => (
              <div
                key={column.id}
                className={cn(
                  "w-72 flex-shrink-0 overflow-hidden rounded-lg border-2",
                  APP_COLORS[column.type],
                )}
              >
                <div
                  className={cn("px-4 py-2", APP_HEADER_COLORS[column.type])}
                >
                  <h3 className="font-semibold">{column.type}</h3>
                </div>
                <div className="space-y-3 p-3">
                  {column.bio && (
                    <div className="rounded-md bg-white p-2 text-sm shadow-sm dark:bg-gray-700">
                      {column.bio}
                    </div>
                  )}
                  {column.photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <Image
                        src={photo.url}
                        alt="Profile photo"
                        width={240}
                        height={320}
                        className="h-auto w-full rounded-md object-cover"
                      />
                    </div>
                  ))}
                  {column.photos.length === 0 && (
                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-300 p-4">
                      <p className="text-sm text-gray-500">No photos added</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-center gap-4">
              <Button
                variant={vote === "up" ? "default" : "outline"}
                onClick={() => setVote("up")}
                className={
                  vote === "up" ? "bg-green-500 hover:bg-green-600" : ""
                }
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Looks Good
              </Button>
              <Button
                variant={vote === "down" ? "default" : "outline"}
                onClick={() => setVote("down")}
                className={vote === "down" ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Needs Work
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Add Comments
              </Button>
            </div>

            {showFeedbackForm && (
              <div className="mt-4 space-y-4">
                <Textarea
                  placeholder="What do you think of these profiles? Any suggestions for improvement?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card.Container>
    </div>
  );
}
