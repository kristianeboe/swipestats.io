// lib/googleDrive.ts
import { env } from "@/env";
import { type drive_v3, google } from "googleapis";
import { JWT } from "google-auth-library";

export async function initializeDriveClient(): Promise<drive_v3.Drive> {
  const jwtClient = new JWT({
    email: "swipestats-drive@sustained-axis-429506-v1.iam.gserviceaccount.com",
    key: env.GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  await jwtClient.authorize();
  return google.drive({ version: "v3", auth: jwtClient });
}

// Function to create a folder
export async function createFolder(
  folderName: string,
  parentFolderId?: string,
): Promise<string> {
  const drive = await initializeDriveClient();
  const fileMetadata: drive_v3.Schema$File = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };

  if (parentFolderId) {
    fileMetadata.parents = [parentFolderId];
  }

  try {
    console.log(`Attempting to create folder: ${folderName}`);
    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
    });
    console.log(`Folder created successfully. ID: ${response.data.id}`);
    return response.data.id!;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
}

// Function to share a folder
export async function shareFolder(
  folderId: string,
  emailAddress: string,
  role: "reader" | "writer" | "commenter" = "reader",
): Promise<void> {
  const drive = await initializeDriveClient();
  try {
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        type: "user",
        role: role,
        emailAddress: emailAddress,
      },
    });
    console.log(`Folder shared with ${emailAddress}`);
  } catch (error) {
    console.error("Error sharing folder:", error);
    throw error;
  }
}

export async function listFolders(
  parentFolderId?: string,
): Promise<drive_v3.Schema$File[]> {
  const drive = await initializeDriveClient();
  console.log("Listing folders. Parent folder ID:", parentFolderId ?? "root");

  try {
    const query = [
      "mimeType='application/vnd.google-apps.folder'",
      "trashed=false",
    ];

    if (parentFolderId) {
      query.push(`'${parentFolderId}' in parents`);
    }

    const finalQuery = query.join(" and ");
    console.log("Query:", finalQuery);

    const response = await drive.files.list({
      q: finalQuery,
      fields: "nextPageToken, files(id, name, createdTime, parents)",
      orderBy: "createdTime desc",
      pageSize: 1000, // Adjust as needed
    });

    console.log("API Response:", JSON.stringify(response.data, null, 2));

    if (response.data.files && response.data.files.length > 0) {
      console.log(`Found ${response.data.files.length} folders`);
      return response.data.files;
    } else {
      console.log("No folders found");
      return [];
    }
  } catch (error) {
    console.error("Error listing folders:", error);
    throw error;
  }
}

const AI_DATING_PHOTOS_FOLDER_ID = "1puGrf-o3KknS22_Bn2CH_xaBxAmoxuRe";
export async function initializeAiDatingPhotosFolderForCustomer(
  customerEmail: string,
) {
  const newCustomerFolderId = await createFolder(
    customerEmail,
    AI_DATING_PHOTOS_FOLDER_ID,
  );

  const uploadFolderId = await createFolder("Your Photos", newCustomerFolderId);
  const downloadFolderId = await createFolder("AI Photos", newCustomerFolderId);

  await shareFolder(newCustomerFolderId, customerEmail, "writer");
  await shareFolder(
    newCustomerFolderId,
    env.AI_PHOTOS_PROVIDER_EMAIL,
    "writer",
  );

  return {
    newCustomerFolderId,
    uploadFolderId,
    downloadFolderId,
  };
}
