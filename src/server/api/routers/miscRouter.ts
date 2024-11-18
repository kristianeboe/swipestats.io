import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { sendInternalSlackMessage } from "../services/internal-slack.service";
import { analyticsTrackServer } from "@/lib/analytics/analyticsTrackServer";
import { env } from "@/env";

// TODO merge with client form
const FeedbackSchema = z.object({
  tinderId: z.string(),
  experienceRating: z.number().min(1).max(5).nullable(),
  howDoTheResultsMakeYouFeel: z
    .enum(["happy", "sad", "neutral", "surprised", "disheartened"])
    .array(),
  wouldYouRecommend: z.enum(["yes", "no", "maybe"]).nullish(),
  otherTextFeedback: z.string(),
});

export const miscRouter = createTRPCRouter({
  submitFeedback: publicProcedure
    .input(FeedbackSchema)
    .mutation(async ({ input }) => {
      try {
        void sendInternalSlackMessage(
          env.NEXT_PUBLIC_MANUAL_ENV === "production"
            ? "bot-messages"
            : "bot-developer",
          "User Feedback Submitted",
          {
            rating: input.experienceRating,
            feelings: input.howDoTheResultsMakeYouFeel.join(", "),
            wouldRecommend: input.wouldYouRecommend,
            feedback: input.otherTextFeedback,
          },
        );

        void analyticsTrackServer(input.tinderId, "Feedback Submitted", {
          rating: input.experienceRating,
          feelings: input.howDoTheResultsMakeYouFeel,
          wouldRecommend: input.wouldYouRecommend,
        });

        return { success: true };
      } catch (error) {
        console.error("Error submitting feedback:", error);
        return { success: false };
      }
    }),
});
