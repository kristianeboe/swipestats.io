import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { env } from "@/env";

export async function GET(request: NextRequest) {
  try {
    // Get the tinderId from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const tinderId = searchParams.get("tinderId");
    const password = searchParams.get("password");

    // Check if the password is provided and matches the admin password
    if (!password || password !== env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    // Check if tinderId is provided
    if (!tinderId) {
      return NextResponse.json(
        { error: "tinderId is required" },
        { status: 400 },
      );
    }

    // Find the tinder profile
    const tinderProfile = await db.tinderProfile.findUnique({
      where: {
        tinderId: tinderId,
      },
      include: {
        user: {
          include: {
            originalAnonymizedFiles: true,
          },
        },
      },
    });

    if (!tinderProfile) {
      return NextResponse.json(
        { error: "Tinder profile not found" },
        { status: 404 },
      );
    }

    // Get the original file
    const originalFiles = tinderProfile.user?.originalAnonymizedFiles;

    if (!originalFiles || originalFiles.length === 0) {
      return NextResponse.json(
        { error: "No original files found for this profile" },
        { status: 404 },
      );
    }

    // Return the original files
    return NextResponse.json({ originalFiles });
  } catch (error) {
    console.error("Error retrieving profile file:", error);
    return NextResponse.json(
      { error: "Failed to retrieve profile file" },
      { status: 500 },
    );
  }
}
