import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { createSubLogger } from "@/lib/tslog";

const log = createSubLogger("messages.router");

export const messagesRouter = createTRPCRouter({
  getByMatch: publicProcedure
    .input(
      z.object({
        matchId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.message.findMany({
        where: {
          matchId: input.matchId,
        },
        orderBy: {
          sentDate: "asc",
        },
      });

      return messages;
    }),

  getByProfile: publicProcedure
    .input(
      z.object({
        tinderId: z.string().optional(),
        hingeId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.tinderId && !input.hingeId) {
        throw new Error("Must provide either tinderId or hingeId");
      }

      const messages = await ctx.db.message.findMany({
        where: {
          OR: [
            {
              tinderProfileId: input.tinderId,
            },
            {
              hingeProfileId: input.hingeId,
            },
          ],
        },
        include: {
          match: true,
        },
        orderBy: {
          sentDate: "desc",
        },
      });

      return messages;
    }),

  getByProfileGroupedByMatch: publicProcedure
    .input(
      z.object({
        tinderId: z.string().optional(),
        hingeId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const demoId =
        "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5";

      const matches = await ctx.db.match.findMany({
        where: {
          OR: [
            {
              tinderProfileId:
                input.tinderId === "demo" ? demoId : input.tinderId,
            },
            { hingeProfileId: input.hingeId },
          ],
        },
        include: {
          messages: true,
        },
      });

      log.info("Got messages grouped by match", {
        matches: matches.length,
        messages: matches.reduce((acc, m) => acc + m.messages.length, 0),
      });

      return matches;
    }),

  getOpeningMessagesThatLeadToLongestConversations: publicProcedure
    .input(
      z.object({
        tinderId: z.string().optional(),
        hingeId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const demoId =
        "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5";

      const matches = await ctx.db.match.findMany({
        where: {
          OR: [
            {
              tinderProfileId:
                input.tinderId === "demo" ? demoId : input.tinderId,
            },
            { hingeProfileId: input.hingeId },
          ],
        },
        include: {
          messages: true,
        },
        orderBy: {
          messages: {
            _count: "desc",
          },
        },
        take: 10,
      });

      log.info("Got matches with most messages", {
        matches: matches.length,
        totalMessages: matches.reduce((acc, m) => acc + m.messages.length, 0),
      });

      return matches;
    }),

  getOpenersThatLeadToLongestAverageConversations: publicProcedure
    .input(
      z.object({
        tinderId: z.string().optional(),
        hingeId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const demoId =
        "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5";

      // Get all matches
      const matches = await ctx.db.match.findMany({
        where: {
          OR: [
            {
              tinderProfileId:
                input.tinderId === "demo" ? demoId : input.tinderId,
            },
            { hingeProfileId: input.hingeId },
          ],
        },
        include: {
          messages: {
            orderBy: {
              sentDate: "asc",
            },
            take: 1,
          },
        },
      });

      const matchesWithAllMessages = await ctx.db.match.findMany({
        where: {
          OR: [
            {
              tinderProfileId:
                input.tinderId === "demo" ? demoId : input.tinderId,
            },
            { hingeProfileId: input.hingeId },
          ],
        },
        include: {
          messages: true,
        },
      });

      // Create a map of opening messages to their average conversation length
      const openingMessageStats = new Map<string, number>();

      // For each match with messages, get the opening message and count total messages
      matchesWithAllMessages.forEach((match) => {
        const openingMessage = match.messages[0]?.content;
        if (!openingMessage) return;

        // Find corresponding match with all messages to get total count
        const fullMatch = matchesWithAllMessages.find((m) => m.id === match.id);
        if (!fullMatch) return;

        const messageCount = fullMatch.messages.length;

        // Add or update the stats for this opening message
        openingMessageStats.set(
          openingMessage,
          (openingMessageStats.get(openingMessage) ?? 0) + messageCount,
        );
      });

      // Filter out matches with no messages
      const matchesWithMessages = matches.filter(
        (match) => match.messages.length > 0,
      );

      log.info("Got first messages from all conversations", {
        totalMatches: matches.length,
        matchesWithMessages: matchesWithMessages.length,
      });

      return matchesWithMessages;
    }),

  getMessageStats: publicProcedure
    .input(
      z.object({
        tinderId: z.string().optional(),
        hingeId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.tinderId && !input.hingeId) {
        throw new Error("Must provide either tinderId or hingeId");
      }

      const messages = await ctx.db.message.findMany({
        where: {
          OR: [
            {
              tinderProfileId: input.tinderId,
            },
            {
              hingeProfileId: input.hingeId,
            },
          ],
        },
      });

      const totalMessages = messages.length;
      const averageMessageLength = Math.round(
        messages.reduce((acc, m) => acc + m.content.length, 0) / totalMessages,
      );

      return {
        totalMessages,
        messagesSent: totalMessages,
        messagesReceived: 0,
        averageMessageLength,
      };
    }),
});
