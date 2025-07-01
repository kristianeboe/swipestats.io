import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { profileRouter } from "./routers/profileRouter";
import { aggregationRouter } from "./routers/aggregationRouter";
import { newsletterRouter } from "./routers/newsletterRouter";
import { messagesRouter } from "./routers/messagesRouter";
import { miscRouter } from "./routers/miscRouter";
import { purchasesRouter } from "./routers/purchasesRouter";
import { aiDatingPhotosRouter } from "./routers/aiDatingPhotos";
import { profilePreviewsRouter } from "./routers/profilePreviewsRouter";
import { mediaLibraryRouter } from "./routers/mediaLibraryRouter";
import { userRouter } from "./routers/userRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  profile: profileRouter,
  aggregation: aggregationRouter,
  newsletter: newsletterRouter,
  aiDatingPhotosRouter: aiDatingPhotosRouter,
  messages: messagesRouter,
  misc: miscRouter,
  purchases: purchasesRouter,
  profilePreviews: profilePreviewsRouter,
  mediaLibrary: mediaLibraryRouter,
  user: userRouter,
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
