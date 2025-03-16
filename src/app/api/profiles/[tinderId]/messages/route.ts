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

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ tinderId: string }> },
) {
  const params = await props.params;
  try {
    const { tinderId } = params;
    const query = Object.fromEntries(request.nextUrl.searchParams);
    const { limit, after } = QuerySchema.parse(query);

    const matches = await db.match.findMany({
      where: {
        tinderProfileId: tinderId,
        totalMessageCount: {
          gt: 0,
        },
        ...(after && {
          messages: {
            some: {
              sentDate: {
                gte: after,
              },
            },
          },
        }),
      },
      include: {
        messages: {
          where: after ? { sentDate: { gte: after } } : undefined,
          orderBy: { sentDate: "asc" },
        },
      },
      orderBy: { lastMessageAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      matchCount: matches.length,
      messagesCount: matches.reduce((acc, m) => acc + m.messages.length, 0),
      matches,
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
