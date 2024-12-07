import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

const productToVariantId = {
  basic: 624630,
  plus: 624661,
  premium: 624632,
} as const;

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
        product: z.enum(["basic", "plus", "premium"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const checkoutSession = await createCheckout(
        97795,
        productToVariantId[input.product],
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
