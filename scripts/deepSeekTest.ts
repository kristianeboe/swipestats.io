import { generateObject } from "ai";
import { deepseek } from "@ai-sdk/deepseek";
import { z } from "zod";

async function testDeepSeekObjectGeneration() {
  // Define a simple schema for testing
  const TestSchema = z.object({
    summary: z.string().describe("A brief summary of the text"),
    sentiment: z.enum(["positive", "negative", "neutral"]),
    wordCount: z.number(),
    topics: z.array(z.string()),
  });

  // Sample text to analyze
  const sampleText = `
    I absolutely love this new phone! The camera quality is amazing and the battery 
    life lasts all day. The price was a bit high, but the features make it worth it.
    The user interface is really intuitive and smooth.
  `;

  console.log("Original Text:");
  console.log(sampleText);
  console.log("\n" + "-".repeat(80) + "\n");

  try {
    // Generate structured output using Deepseek
    const result = await generateObject({
      model: deepseek("deepseek-chat"),
      system:
        "You are a text analysis assistant. Analyze the provided text and return structured information about its content, sentiment, and key topics.",
      prompt: sampleText,
      temperature: 0.1,
      schema: TestSchema,
    });

    console.log("Deepseek Analysis Result:");
    console.log(JSON.stringify(result.object, null, 2));
  } catch (error) {
    console.error("Error in Deepseek object generation test:", error);
  }
}

// Run the test
testDeepSeekObjectGeneration()
  .then(() => console.log("\nTest completed."))
  .catch((error) => console.error("Test failed:", error));
