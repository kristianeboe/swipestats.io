import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { sendInternalSlackMessage } from "../services/internal-slack.service";
import { analyticsTrackServer } from "@/lib/analytics/analyticsTrackServer";
import { initializeAiDatingPhotosFolderForCustomer } from "../integrations/googleDrive";

import {
  createCheckout,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import { env } from "@/env";
import { sendDynamicEmail } from "../services/email.service";

lemonSqueezySetup({
  apiKey: env.LEMONSQUEEZY_API_KEY,
});

export const researchPurchaseRouter = createTRPCRouter({
  initiateLemonSqueezyCheckout: publicProcedure
    .input(
      z.object({
        customerEmail: z.string().email(),
        productId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // Logic to initiate Lemon Squeezy checkout
        const checkoutSession = await createCheckout(97795, 453444);

        return {
          success: true,
          checkoutUrl: checkoutSession.data?.data.attributes.url,
        };
      } catch (error) {
        console.log("Error initiating Lemon Squeezy checkout: ", error);
        return {
          success: false,
          message: "Failed to initiate checkout",
        };
      }
    }),

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

        const { newCustomerFolderId } =
          await initializeAiDatingPhotosFolderForCustomer(input.customerEmail);

        await sendDynamicEmail({
          template: "aiPhotosPurchase",
          templateData: {
            customerEmail: input.customerEmail,
            googleDriveFolderUrl: `https://drive.google.com/drive/folders/${newCustomerFolderId}`,
          },
          to: input.customerEmail,
        });
      } catch (error) {
        console.log("Error purchasing AI dating photos: ", error);
      }
    }),
});
