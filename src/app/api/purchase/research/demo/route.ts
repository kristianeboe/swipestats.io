import { db } from "@/server/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const demoProfile = await db.tinderProfile.findUniqueOrThrow({
    where: {
      tinderId:
        "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5",
    },
    include: {
      profileMeta: true,
      usage: true,
      matches: {
        include: {
          messages: true,
        },
      },
    },
  });

  // Create a new Response with the JSON data
  const response = new NextResponse(JSON.stringify([demoProfile], null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=demo-profile.json",
    },
  });

  return response;
}
