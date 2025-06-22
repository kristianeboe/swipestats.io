import { type NextRequest, NextResponse } from "next/server";
import { createSubLogger } from "@/lib/tslog";
import { createDemographicProfiles } from "./globalDemographics.service";

const log = createSubLogger("globalDemographicsCron");

export async function GET(request: NextRequest) {
  try {
    // Verify this is being called by Vercel cron (optional security check)
    const authHeader = request.headers.get("authorization");
    if (
      process.env.ADMIN_PASSWORD &&
      authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`
    ) {
      log.warn("Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    log.info("Starting global demographics cron job");
    const startTime = Date.now();

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const isSimplifiedMode = searchParams.get("simplified") !== "false"; // Default to true

    log.info(`Running in ${isSimplifiedMode ? "simplified" : "full"} mode`);

    // Execute the demographic profile creation
    const result = await createDemographicProfiles(isSimplifiedMode);

    const endTime = Date.now();
    const duration = endTime - startTime;

    log.info("Global demographics cron job completed", {
      success: result.success,
      processedCount: result.processedCount,
      durationMs: duration,
      durationMinutes: Math.round((duration / 60000) * 100) / 100,
    });

    return NextResponse.json({
      success: result.success,
      message: result.message,
      processedCount: result.processedCount,
      durationMs: duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    log.error("Global demographics cron job failed", { error });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
