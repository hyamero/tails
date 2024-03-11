import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";
import { env } from "~/env";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: env.UPLOADTHING_APP_ID,
    uploadthingSecret: env.UPLOADTHING_SECRET,
    callbackUrl: "https://tails-welfare.vercel.app/api/uploadthing/callback",
  },
});
