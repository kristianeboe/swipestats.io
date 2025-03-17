import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { env } from "@/env";
import { scrubPII } from "@/server/api/services/pii.service";

export async function GET(request: NextRequest) {
  try {
    // Get the tinderId from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const tinderId = searchParams.get("tinderId");
    const password = searchParams.get("password");
    const sanitize = searchParams.get("sanitize") === "true";

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

    console.log("getting tinder profile", tinderId);
    // Find the tinder profile with matches and messages
    const tinderProfile = await db.tinderProfile.findUnique({
      where: {
        tinderId: tinderId,
      },
      include: {
        matches: {
          include: {
            messages: true,
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

    // If sanitize is true, sanitize the message content to remove PII
    // if (sanitize) {
    //   const sanitizedMatches = tinderProfile.matches.map((match) => {
    //     const sanitizedMessages = match.messages.map((message) => {
    //       if (message.content) {
    //         const { sanetizedContent } = scrubPII(message.content);
    //         return {
    //           ...message,
    //           content: sanetizedContent,
    //         };
    //       }
    //       return message;
    //     });

    //     return {
    //       ...match,
    //       messages: sanitizedMessages,
    //     };
    //   });

    //   return NextResponse.json({
    //     matches: sanitizedMatches,
    //     matchCount: tinderProfile.matches.length,
    //     messageCount: tinderProfile.matches.reduce(
    //       (acc, match) => acc + match.messages.length,
    //       0,
    //     ),
    //   });
    // }

    const meta = {
      matchCount: tinderProfile.matches.length,
      messageCount: tinderProfile.matches.reduce(
        (acc, match) => acc + match.messages.length,
        0,
      ),
    };

    console.log("meta", meta);

    // Return the matches and messages
    return NextResponse.json({
      matches: tinderProfile.matches,
      meta,
    });
  } catch (error) {
    console.error("Error retrieving profile matches:", error);
    return NextResponse.json(
      { error: "Failed to retrieve profile matches" },
      { status: 500 },
    );
  }
}
