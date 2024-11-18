import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { profileRouter } from "./routers/profileRouter";
import { aggregationRouter } from "./routers/aggregationRouter";
import { newsletterRouter } from "./routers/newsletterRouter";
import { aiDatingPhotosRouter } from "./routers/aiDatingPhotos";
import { messagesRouter } from "./routers/messagesRouter";
import { miscRouter } from "./routers/miscRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  aggregation: aggregationRouter,
  newsletter: newsletterRouter,
  aiDatingPhotosRouter: aiDatingPhotosRouter,
  messages: messagesRouter,
  misc: miscRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
