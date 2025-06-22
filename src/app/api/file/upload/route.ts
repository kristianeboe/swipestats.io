import { auth } from "@/server/auth";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Generate a client token for the browser to upload the file
        const { appType } = JSON.parse(clientPayload ?? "{}");

        // Generate a folder path based on user and app type
        const folderPath = appType
          ? `profile-compare/${appType.toLowerCase()}/${session.user.id}`
          : `uploads/${session.user.id}`;

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
          tokenPayload: JSON.stringify({
            userId: session.user.id,
            appType,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        try {
          console.log("blob upload completed", blob, tokenPayload);
          // Can add database operations here if needed
          // const { userId, appType } = JSON.parse(tokenPayload);
          // Can save photo reference to database here if needed
        } catch (error) {
          console.error("Error in onUploadCompleted:", error);
          throw new Error("Failed to process upload completion");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
