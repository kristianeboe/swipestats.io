import { db } from "@/server/db";
import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { scrubPIIWithAI } from "./pii.service";

export async function postProcessProfile(tinderId: string) {
  const profile = await db.tinderProfile.findUniqueOrThrow({
    where: {
      tinderId,
    },
    include: {
      matches: {
        include: {
          messages: true,
        },
      },
    },
  });

  for (const match of profile.matches) {
    const messages = match.messages;

    if (messages.length === 0) {
      continue;
    }

    const result = await generateObject({
      schema: z.object({
        engagementScore: z
          .number()
          .describe("The engagement score of the match"),
        piiDetected: z.boolean().describe("Whether any PII was detected"),
        primaryLanguage: z
          .enum([
            // Major global languages
            "English",
            "Mandarin",
            "Cantonese",
            "Spanish",
            "Hindi",
            "Arabic",
            "French",
            "Portuguese",
            "Japanese",
            "German",
            "Korean",

            // European languages
            "Italian",
            "Dutch",
            "Polish",
            "Russian",
            "Swedish",
            "Greek",

            // Eastern European languages
            "Ukrainian",
            "Romanian",
            "Czech",
            "Hungarian",
            "Bulgarian",
            "Serbian",

            // Additional languages based on city data
            "Finnish", // Helsinki, Espoo
            "Danish", // Aalborg
            "Norwegian", // Oslo, Trondheim
            "Lithuanian", // Vilnius, Kaunas
            "Slovak", // Bratislava
            "Catalan", // Barcelona region
            "German_Swiss", // Zürich, Basel (Swiss German)

            // Regional catch-all categories
            "Other_Asian", // For Thai, Vietnamese, Indonesian, etc.
            "Other_European", // For remaining European languages
            "Other_Indian", // For Telugu, Tamil, Punjabi, etc.
            "Other_African", // For Swahili, Amharic, Zulu, etc.
            "Other", // For any other languages
          ])
          .describe("The primary language of the match"),
        languages: z
          .array(z.string())
          .describe("The languages spoken by the match"),
      }),
      model: openai("gpt-4o"),
      prompt: messages.map((m) => m.content).join("\n"),
      system: `You are a helpful assistant that analyzes a match between two people on a dating app. Your task is to evaluate the engagement score of the match based on the messages exchanged between the two people.
      
      The engagement score is a number between 0 and 100 that represents the level of engagement between the two people.
      
      The primary language of the match is the language of the messages exchanged between the two people.
      
      `,
    });

    await db.match.update({
      where: {
        id: match.id,
      },
      data: {
        engagementScore: result.object.engagementScore,
        primaryLanguage: result.object.primaryLanguage,
        languages: result.object.languages,
      },
    });

    for (const message of messages) {
      if (result.object.piiDetected) {
        const { sanetizedContent, didRedact, redactionCounts } =
          await scrubPIIWithAI(message.content);

        await db.message.update({
          where: {
            id: message.id,
          },
          data: {
            contentSanitized: sanetizedContent,
          },
        });
      }
    }
  }
}
