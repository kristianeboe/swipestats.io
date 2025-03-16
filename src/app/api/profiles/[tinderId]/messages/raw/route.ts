import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  after: z.string().datetime().optional(),
});
// @ts-expect-error BigInt.prototype.toJSON is not defined in the global scope
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET(request: NextRequest, props: { params: Promise<{ tinderId: string }> }) {
  const params = await props.params;
  try {
    const { tinderId } = params;
    const query = Object.fromEntries(request.nextUrl.searchParams);
    const { limit, after } = QuerySchema.parse(query);

    const messages = await db.message.findMany({
      where: {
        tinderProfileId: tinderId,
        ...(after && {
          sentDate: {
            gte: after,
          },
        }),
      },
      orderBy: { sentDate: "asc" },
      take: limit,
      include: {
        match: {
          select: {
            id: true,
            order: true,
          },
        },
      },
    });

    return NextResponse.json({
      messagesCount: messages.length,
      messages: messages.map((m) => ({
        message: m.content,
        sentDateRaw: m.sentDateRaw,
      })),
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: error.errors,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch matches" },
      { status: 500 },
    );
  }
}
