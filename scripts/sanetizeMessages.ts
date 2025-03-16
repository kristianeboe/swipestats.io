import fs from "fs";
import path from "path";
import Papa from "papaparse";
import {
  scrubPII,
  scrubPIIWithAI,
  type RedactionCounts,
} from "../src/server/api/services/pii.service";
import { createSubLogger } from "@/lib/tslog";
import type { MessageType } from "@prisma/client";

const logger = createSubLogger("sanetizeMessages");

// Define the path to the input and output CSV files
const inputFilePath = path.resolve(__dirname, "../fixtures/20kMessages.csv");
const outputFilePath = path.resolve(
  __dirname,
  "../fixtures/SanitizedMessagesOpenAI.csv",
);

// Define a counter object to track total redactions
interface TotalRedactionCounts extends RedactionCounts {
  total: number;
  messagesProcessed: number;
  messagesWithPII: number;
}

// Define the Message interface based on the Prisma schema and CSV structure
interface MessageRecord {
  id: string;
  to: string;
  sentDate: string;
  sentDateRaw: string;
  contentRaw: string;
  content: string;
  charCount: string;
  messageType: MessageType;
  type: string | null;
  gifUrl: string | null;
  order: string;
  language: string | null;
  timeSinceLastMessage: string;
  timeSinceLastMessageRelative: string | null;
  emotionScore: string | null;
  matchId: string;
  tinderProfileId: string | null;
  hingeProfileId: string | null;
  // Added fields for sanitized output
  originalContent?: string;
  sanitizedContent?: string;
  aiSanitizedContent?: string;
}

// Main function to process the CSV file
async function sanitizeMessages(): Promise<TotalRedactionCounts> {
  try {
    // Read the input CSV file
    logger.info(`Reading CSV file from ${inputFilePath}`);
    const csvData = fs.readFileSync(inputFilePath, "utf8");

    // Parse the CSV data using PapaParse
    const parseResult = Papa.parse<MessageRecord>(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep everything as strings for CSV processing
    });

    if (parseResult.errors && parseResult.errors.length > 0) {
      logger.error("CSV parsing errors:", parseResult.errors);
    }

    // Log metadata about the CSV file
    logger.info(`Total records in CSV: ${parseResult.data.length}`);
    logger.info(`CSV Headers: ${parseResult.meta.fields?.join(", ")}`);

    // Sample the first few records to verify structure
    if (parseResult.data.length > 0) {
      const sampleRecord = parseResult.data[0];
      logger.info("Sample record structure:");
      logger.info(
        JSON.stringify(sampleRecord, null, 2).substring(0, 500) + "...",
      );
    }

    // Initialize counters
    const counts: TotalRedactionCounts = {
      total: 0,
      email: 0,
      phone: 0,
      socialMedia: 0,
      address: 0,
      ssn: 0,
      messagesProcessed: 0,
      messagesWithPII: 0,
    };

    // Comparison counters
    const comparisonStats = {
      totalCompared: 0,
      regexOnly: 0,
      aiOnly: 0,
      bothDetected: 0,
      identical: 0,
      different: 0,
      nameDetections: 0,
      otherDetections: 0,
    };

    // Limit to first 10 messages
    const limitedData = parseResult.data.slice(0, 10);
    logger.info(
      `Processing first ${limitedData.length} messages for comparison`,
    );

    // Process each record
    const sanitizedRecords: (MessageRecord | null)[] = [];

    // Process records sequentially instead of with Promise.all
    for (const record of limitedData) {
      counts.messagesProcessed++;

      // Skip records with empty content
      if (!record.content || record.content.trim() === "") {
        logger.info(`Skipping record ${record.id} with empty content`);
        sanitizedRecords.push(null);
        continue;
      }

      // Get the content to sanitize
      const originalContent = record.content;

      // Sanitize with regex-based method
      const regexResult = scrubPII(originalContent);
      if (regexResult.didRedact) {
        logger.info(`Regex result:`, {
          originalContent: originalContent,
          regexResult: regexResult.sanetizedContent,
        });
      }
      // Sanitize with AI-based method
      const aiStartTime = Date.now();
      logger.info(`Sanitizing with OpenAI for record "${record.id}"`, {
        originalContent: originalContent,
        regexResult: regexResult.sanetizedContent,
      });
      const aiResult = await scrubPIIWithAI(originalContent).catch((err) => {
        logger.error(`Error sanitizing with OpenAI: ${err}`, {
          originalContent: originalContent,
        });
        throw err;
      });
      const aiEndTime = Date.now();
      const aiDuration = aiEndTime - aiStartTime;

      if (aiResult.didRedact) {
        logger.info(`OpenAI result (took ${aiDuration}ms):`, {
          originalContent: originalContent,
          aiResult: aiResult.sanetizedContent,
        });
      } else {
        logger.debug(`OpenAI processing took ${aiDuration}ms (no PII found)`);
      }

      if (!regexResult.didRedact && !aiResult.didRedact) {
        logger.info(`No redaction occurred for record "${record.content}"`);
      }

      // Compare results
      comparisonStats.totalCompared++;

      if (regexResult.didRedact && aiResult.didRedact) {
        comparisonStats.bothDetected++;

        if (regexResult.sanetizedContent === aiResult.sanetizedContent) {
          comparisonStats.identical++;
        } else {
          comparisonStats.different++;
        }
      } else if (regexResult.didRedact) {
        comparisonStats.regexOnly++;
      } else if (aiResult.didRedact) {
        comparisonStats.aiOnly++;
      }

      // Track additional AI detections
      if (aiResult.redactionCounts.name && aiResult.redactionCounts.name > 0) {
        comparisonStats.nameDetections++;
      }

      if (
        aiResult.redactionCounts.other &&
        aiResult.redactionCounts.other > 0
      ) {
        comparisonStats.otherDetections++;
      }

      // If either method detected PII, include in results
      if (regexResult.didRedact || aiResult.didRedact) {
        // Update counters based on regex results for consistency
        if (regexResult.didRedact) {
          counts.messagesWithPII++;
          counts.total++;

          // Add the redaction counts from this message to the total counts
          counts.email += regexResult.redactionCounts.email;
          counts.phone += regexResult.redactionCounts.phone;
          counts.socialMedia += regexResult.redactionCounts.socialMedia;
          counts.address += regexResult.redactionCounts.address;
          counts.ssn += regexResult.redactionCounts.ssn;
        }

        // Log the redaction with specific counts (but only for the first 20 to avoid log spam)
        if (counts.messagesWithPII <= 20) {
          logger.info(`Sanitized message ${record.id}: Found PII data`);

          // Log detailed redaction info for both methods
          if (regexResult.didRedact) {
            logger.info(
              `Regex - Emails: ${regexResult.redactionCounts.email}, ` +
                `Phones: ${regexResult.redactionCounts.phone}, ` +
                `Social Media: ${regexResult.redactionCounts.socialMedia}, ` +
                `Addresses: ${regexResult.redactionCounts.address}, ` +
                `SSNs: ${regexResult.redactionCounts.ssn}`,
            );
          }

          if (aiResult.didRedact) {
            logger.info(
              `OpenAI - Emails: ${aiResult.redactionCounts.email}, ` +
                `Phones: ${aiResult.redactionCounts.phone}, ` +
                `Social Media: ${aiResult.redactionCounts.socialMedia}, ` +
                `Addresses: ${aiResult.redactionCounts.address}, ` +
                `SSNs: ${aiResult.redactionCounts.ssn}` +
                (aiResult.redactionCounts.name
                  ? `, Names: ${aiResult.redactionCounts.name}`
                  : "") +
                (aiResult.redactionCounts.other
                  ? `, Other PII: ${aiResult.redactionCounts.other}`
                  : ""),
            );
          }

          // Log a sample of the content before and after sanitization (truncated)
          const contentPreview = originalContent.substring(0, 100);
          logger.info(
            `Original: ${contentPreview}${contentPreview.length >= 100 ? "..." : ""}`,
          );

          if (regexResult.didRedact) {
            const regexSanitizedPreview =
              regexResult.sanetizedContent.substring(0, 100);
            logger.info(
              `Regex Sanitized: ${regexSanitizedPreview}${regexSanitizedPreview.length >= 100 ? "..." : ""}`,
            );
          }

          if (aiResult.didRedact) {
            const aiSanitizedPreview = aiResult.sanetizedContent.substring(
              0,
              100,
            );
            logger.info(
              `OpenAI Sanitized: ${aiSanitizedPreview}${aiSanitizedPreview.length >= 100 ? "..." : ""}`,
            );
          }
        } else if (counts.messagesWithPII === 21) {
          logger.info("Suppressing further detailed PII logs to avoid spam...");
        }

        // Log progress every 100 messages (since we're only processing 1000)
        if (counts.messagesProcessed % 100 === 0) {
          logger.info(
            `Processed ${counts.messagesProcessed} messages, found PII in ${counts.messagesWithPII} messages`,
          );
        }

        // Return a new record with original, regex-sanitized, and AI-sanitized content
        sanitizedRecords.push({
          ...record,
          originalContent,
          sanitizedContent: regexResult.sanetizedContent,
          aiSanitizedContent: aiResult.sanetizedContent,
        });
      } else {
        sanitizedRecords.push(null); // Push null for records that weren't sanitized
      }
    }

    const validRecords = sanitizedRecords.filter(Boolean) as MessageRecord[];

    // Only write to output file if there are sanitized records
    if (validRecords.length > 0) {
      // Create the output CSV using PapaParse
      const outputCsv = Papa.unparse(validRecords);

      // Write to the output file
      fs.writeFileSync(outputFilePath, outputCsv);
      logger.info(
        `Wrote ${validRecords.length} sanitized messages to ${outputFilePath}`,
      );
    } else {
      logger.info("No PII found in any messages. No output file created.");
    }

    // Log final counts
    logger.info("Sanitization complete. Summary:");
    logger.info(`Total messages processed: ${counts.messagesProcessed}`);
    logger.info(
      `Messages containing PII: ${counts.messagesWithPII} (${((counts.messagesWithPII / counts.messagesProcessed) * 100).toFixed(2)}%)`,
    );
    logger.info(
      `Total PII instances found: ${counts.email + counts.phone + counts.socialMedia + counts.address + counts.ssn}`,
    );
    logger.info(`Email addresses redacted: ${counts.email}`);
    logger.info(`Phone numbers redacted: ${counts.phone}`);
    logger.info(`Social media handles redacted: ${counts.socialMedia}`);
    logger.info(`Addresses redacted: ${counts.address}`);
    logger.info(`SSNs redacted: ${counts.ssn}`);

    // Log comparison stats
    logger.info("\nComparison between regex and OpenAI sanitization:");
    logger.info(`Total messages compared: ${comparisonStats.totalCompared}`);
    logger.info(
      `PII detected by both methods: ${comparisonStats.bothDetected}`,
    );
    logger.info(`PII detected by regex only: ${comparisonStats.regexOnly}`);
    logger.info(`PII detected by OpenAI only: ${comparisonStats.aiOnly}`);
    logger.info(`Identical sanitization results: ${comparisonStats.identical}`);
    logger.info(`Different sanitization results: ${comparisonStats.different}`);
    logger.info(`OpenAI detected names: ${comparisonStats.nameDetections}`);
    logger.info(
      `OpenAI detected other PII: ${comparisonStats.otherDetections}`,
    );

    return counts;
  } catch (error) {
    logger.error("Error sanitizing messages:", error);
    throw error;
  }
}

sanitizeMessages()
  .then(() => {
    logger.info("Message sanitization completed successfully");
  })
  .catch((error) => {
    logger.error("Message sanitization failed:", error);
    process.exit(1);
  });

/**
 * Example usage of both PII sanitization methods
 */
async function testPIISanitization() {
  // Sample text with various types of PII
  const sampleText = `
    Hello, my name is John Doe. You can reach me at john.doe@example.com or call me at (555) 123-4567.
    My social media handle is @johndoe123.
    I live at 123 Main Street, Anytown, CA 90210.
    My SSN is 123-45-6789.
    Let's meet to discuss the project details next week.
  `;

  console.log("Original Text:");
  console.log(sampleText);
  console.log("\n" + "-".repeat(80) + "\n");

  // Test regex-based PII sanitization
  console.log("Regex-based PII Sanitization:");
  const regexResult = scrubPII(sampleText);
  console.log(regexResult.sanetizedContent);
  console.log("\nRedaction occurred:", regexResult.didRedact);
  console.log("Redaction counts:", regexResult.redactionCounts);
  console.log("\n" + "-".repeat(80) + "\n");

  // Test OpenAI-based PII sanitization
  console.log("OpenAI-based PII Sanitization:");
  try {
    const aiResult = await scrubPIIWithAI(sampleText);
    console.log(aiResult.sanetizedContent);
    console.log("\nRedaction occurred:", aiResult.didRedact);
    console.log("Redaction counts:", aiResult.redactionCounts);
  } catch (error) {
    console.error("Error testing OpenAI-based sanitization:", error);
  }
}

// testPIISanitization()
//   .then(() => console.log("\nTest completed."))
//   .catch((error) => console.error("Test failed:", error));
