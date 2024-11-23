import { getRandomTinderProfiles } from "@/server/api/services/researchPurchase.service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const maxDuration = 180; // 3 min max duration

// @ts-expect-error BigInt.prototype.toJSON is not defined in the global scope
BigInt.prototype.toJSON = function () {
  return this.toString();
};
export async function GET() {
    
  const sampleProfiles = await getRandomTinderProfiles(10);

  // Create a new Response with the JSON data
  const response = new NextResponse(JSON.stringify(sampleProfiles, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=sample-profiles.json",
    },
  });

  return response;
}
