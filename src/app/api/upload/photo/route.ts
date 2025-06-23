import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { auth } from "@/server/auth";

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const dataProvider = formData.get("dataProvider") as string;
    const isMediaLibrary = dataProvider === "MEDIA_LIBRARY" || !dataProvider;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // For non-media library uploads, dataProvider is required
    if (!isMediaLibrary && !dataProvider) {
      return NextResponse.json(
        { error: "Data provider is required" },
        { status: 400 },
      );
    }

    // Validate file type - only images for now
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "Only image files are allowed. Videos will be supported soon!",
        },
        { status: 400 },
      );
    }

    // More flexible file size limits
    const maxSize = isMediaLibrary ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for media library, 10MB for profile uploads
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `File size too large. Maximum ${maxSizeMB}MB allowed.` },
        { status: 400 },
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    // Different path structure for media library vs profile uploads
    const fileName = isMediaLibrary
      ? `media-library/${session.user.id}/${timestamp}-${randomString}.${fileExtension}`
      : `profile-photos/${session.user.id}/${dataProvider.toLowerCase()}/${timestamp}-${randomString}.${fileExtension}`;

    // Upload to Vercel blob
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      size: file.size,
      type: file.type,
      name: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Extract blob path from URL
    const blobPath = url.split("/").pop();
    if (!blobPath) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Here you would implement blob deletion if needed
    // const { del } = await import("@vercel/blob");
    // await del(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
