import { userRouter } from "./routers/user";
import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { transactionRouter } from "./routers/transaction";
import { adoptionRouter } from "./routers/adoption";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  transaction: transactionRouter,
  adoption: adoptionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
