import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { logger } from "@/lib/tslog";

const log = logger.getSubLogger({ name: "api" });

export const aggregationRouter = createTRPCRouter({
  maleAverage: publicProcedure
    .input(z.object({ tinderId: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello `,
      };
    }),
});
