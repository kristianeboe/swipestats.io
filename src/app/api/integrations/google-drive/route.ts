import {
  createFolder,
  initializeAiDatingPhotosFolderForCustomer,
  listFolders,
  shareFolder,
} from "@/server/api/integrations/googleDrive";

import { type NextRequest, NextResponse } from "next/server";

interface CreateFolderRequest {
  action: "createFolder";
  folderName: string;
  parentFolderId?: string;
}

interface ShareFolderRequest {
  action: "shareFolder";
  folderId: string;
  shareEmail: string;
  shareRole?: "reader" | "writer" | "commenter";
}

interface GetFoldersRequest {
  action: "getFolders";
  parentFolderId?: string;
}

interface InitializeAiDatingPhotosFolderForCustomerRequest {
  action: "initializeAiDatingPhotosFolderForCustomer";
  customerEmail: string;
}

type DriveRequest =
  | CreateFolderRequest
  | ShareFolderRequest
  | GetFoldersRequest
  | InitializeAiDatingPhotosFolderForCustomerRequest;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DriveRequest;

    switch (body.action) {
      case "createFolder":
        const folderId = await createFolder(
          body.folderName,
          body.parentFolderId,
        );

        return NextResponse.json({ folderId });

      case "shareFolder":
        await shareFolder(body.folderId, body.shareEmail, body.shareRole);
        return NextResponse.json({ message: "Folder shared successfully" });

      case "getFolders":
        const folders = listFolders();

        return NextResponse.json({ folders });

      case "initializeAiDatingPhotosFolderForCustomer":
        const res = await initializeAiDatingPhotosFolderForCustomer(
          body.customerEmail,
        );
        return NextResponse.json({
          message: "Folder initialized successfully",
          customerEmail: body.customerEmail,
          res,
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
