import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const aggregationRouter = createTRPCRouter({
  maleAverage: publicProcedure
    .input(z.object({ tinderId: z.string() }))
    .query(({}) => {
      return {
        greeting: `Hello `,
      };
    }),
});
