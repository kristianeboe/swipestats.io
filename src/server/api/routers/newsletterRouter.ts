import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createSHA256Hash } from "@/lib/utils";
import { sendInternalSlackMessage } from "../services/internal-slack.service";
import { analyticsTrackServer } from "@/lib/analytics/analyticsTrackServer";

export const newsletterRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        sendInternalSlackMessage("bot-messages", "Nesletter Signup", {
          email: input.email,
        });

        analyticsTrackServer(input.email, "Newsletter Signup", {
          email: input.email,
        });

        return await ctx.db.newsletter.create({
          data: {
            email: input.email,
            emailHash: await createSHA256Hash(input.email),
            threeDayReminder: true,
            doubleOptInConfirmation: false,
          },
        });
      } catch (error) {
        console.log("Error subscribing to newsletter: ", error);
      }
    }),
});
