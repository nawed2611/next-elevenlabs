import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = async (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  mediaPost: f({
    video: { maxFileSize: "256MB", maxFileCount: 1 },
    audio: { maxFileSize: "256MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async (data) => {
      // Do something with the data
      console.log("kk", data);
      return { success: true, message: "File uploaded successfully", data };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
