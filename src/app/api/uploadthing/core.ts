import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      return { message: "Upload complete!" };
    })
    .onUploadComplete(async ({ file }) => {
      return { image: file };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
