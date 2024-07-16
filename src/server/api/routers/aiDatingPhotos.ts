import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { sendInternalSlackMessage } from "../services/internal-slack.service";
import { analyticsTrackServer } from "@/lib/analytics/analyticsTrackServer";
import { initializeAiDatingPhotosFolderForCustomer } from "../integrations/googleDrive";

export const aiDatingPhotosRouter = createTRPCRouter({
  onPurchase: publicProcedure
    .input(
      z.object({
        customerEmail: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        void sendInternalSlackMessage(
          "ai-photos",
          "AI Dating Photos Purchase",
          {
            customerEmail: input.customerEmail,
          },
        );

        void analyticsTrackServer(
          input.customerEmail,
          "AI Dating Photos Purchase",
          {
            customerEmail: input.customerEmail,
          },
        );

        // await ctx.db.aiDatingPhotos.create({
        //     data: {
        //         customerEmail: ctx.input.customerEmail,
        //         folderId: AI_DATING_PHOTOS_FOLDER_ID,
        //         status: "PENDING",
        //     },
        // });

        await initializeAiDatingPhotosFolderForCustomer(input.customerEmail);
      } catch (error) {
        console.log("Error purchasing AI dating photos: ", error);
      }
    }),
});
