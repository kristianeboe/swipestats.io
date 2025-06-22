"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { DataProvider } from "@prisma/client";
import { db } from "@/server/db";

export async function uploadPhoto(
  file: File,
  userId: string,
  appType: DataProvider,
): Promise<string> {
  // Generate a unique filename
  const filename = `profile-compare/${appType.toLowerCase()}/${userId}/${Date.now()}-${file.name}`;

  // Upload to Vercel Blob
  const blob = await put(filename, file, {
    access: "public",
  });

  // Create a Media record in the database
  let profileId: string | null = null;

  // Determine which profile to associate with based on app type
  if (appType === DataProvider.TINDER) {
    const profile = await db.tinderProfile.findUnique({
      where: { userId },
    });
    profileId = profile?.tinderId || null;
  } else if (appType === DataProvider.HINGE) {
    const profile = await db.hingeProfile.findUnique({
      where: { userId },
    });
    profileId = profile?.hingeId || null;
  }

  // Create the media record
  await db.media.create({
    data: {
      type: "photo",
      url: blob.url,
      fromSoMe: false,
      ...(appType === DataProvider.TINDER && profileId
        ? {
            tinderProfileId: profileId,
          }
        : {}),
      ...(appType === DataProvider.HINGE && profileId
        ? {
            hingeProfileId: profileId,
          }
        : {}),
    },
  });

  revalidatePath("/photo-comparison");

  return blob.url;
}
