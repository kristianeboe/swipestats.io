import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { getProductData } from "@/lib/constants/lemonSqueezy.constants";

export const purchasesRouter = createTRPCRouter({
  getPurchases: publicProcedure
    .input(z.object({ tinderId: z.string() }))
    .query(({ ctx, input }) => {
      return {
        greeting: `Hello `,
      };
    }),

  createCheckout: publicProcedure
    .input(
      z.object({
        tinderId: z.string(),
        product: z.enum(["swipestatsPlus"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const checkoutSession = await createCheckout(
        97795,
        getProductData(input.product).variantId,
        {
          checkoutData: {
            custom: {
              tinderId: input.tinderId,
            },
          },
        },
      );

      console.log(checkoutSession);

      if (!checkoutSession.data?.data.attributes.url) {
        throw new Error("Checkout URL not found");
      }

      return checkoutSession.data?.data.attributes.url;
    }),
});
