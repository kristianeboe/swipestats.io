const { generateText, generateObject } = await import("ai");
const { openai } = await import("@ai-sdk/openai");
//const { deepseek } = await import("@ai-sdk/deepseek");
import { z } from "zod";

export interface RedactionCounts {
  email: number;
  phone: number;
  socialMedia: number;
  address: number;
  ssn: number;
  name?: number;
  other?: number;
}

export function scrubPII(content: string): {
  sanetizedContent: string;
  didRedact: boolean;
  redactionCounts: RedactionCounts;
} {
  // Common patterns:
  // 1) Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

  // 2) Phone numbers: e.g. 555-123-4567, (555) 123-4567, 555.123.4567
  const phoneRegex = /\b\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

  // 3) Social media handles: e.g. @john_doe
  const socialMediaRegex = /\B@\w+/g;

  // 4) Addresses (simplistic):
  //    - Number + multiple words + Street Suffix + optional city + state + zip
  //    - You can adjust this to be more flexible as needed.
  const addressRegex =
    /\b\d+\s+[A-Za-z]+(?:\s+[A-Za-z]+)*\s+(?:St|Street|Rd|Road|Ave|Avenue|Dr|Drive|Ln|Lane|Blvd|Boulevard)\s*,?\s*[A-Za-z]+(?:\s+[A-Za-z]+)*,\s*[A-Za-z]{2}\s*\d{5}(?:-\d{4})?\b/g;

  // 5) SSNs (optional):
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;

  let scrubbed = content;

  // Initialize redaction counts
  const redactionCounts: RedactionCounts = {
    email: 0,
    phone: 0,
    socialMedia: 0,
    address: 0,
    ssn: 0,
  };

  // Count and replace emails
  const emailMatches = content.match(emailRegex);
  if (emailMatches) {
    redactionCounts.email = emailMatches.length;
  }
  scrubbed = scrubbed.replace(emailRegex, "[EMAIL REDACTED]");

  // Count and replace phone numbers
  const phoneMatches = content.match(phoneRegex);
  if (phoneMatches) {
    redactionCounts.phone = phoneMatches.length;
  }
  scrubbed = scrubbed.replace(phoneRegex, "[PHONE REDACTED]");

  // Count and replace social media handles
  const socialMediaMatches = content.match(socialMediaRegex);
  if (socialMediaMatches) {
    redactionCounts.socialMedia = socialMediaMatches.length;
  }
  scrubbed = scrubbed.replace(socialMediaRegex, "[SOCIAL_MEDIA REDACTED]");

  // Count and replace addresses
  const addressMatches = content.match(addressRegex);
  if (addressMatches) {
    redactionCounts.address = addressMatches.length;
  }
  scrubbed = scrubbed.replace(addressRegex, "[ADDRESS REDACTED]");

  // Count and replace SSNs
  const ssnMatches = content.match(ssnRegex);
  if (ssnMatches) {
    redactionCounts.ssn = ssnMatches.length;
  }
  scrubbed = scrubbed.replace(ssnRegex, "[SSN REDACTED]");

  return {
    sanetizedContent: scrubbed,
    didRedact: scrubbed !== content,
    redactionCounts,
  };
}

/**
 * Sanitizes PII from content using AI instead of regex patterns
 * Uses the Vercel AI SDK with OpenAI to identify and redact PII
 */
export async function scrubPIIWithAI(content: string): Promise<{
  sanetizedContent: string;
  didRedact: boolean;
  redactionCounts: RedactionCounts;
}> {
  try {
    // Define a simpler Zod schema for the AI response
    const PIIResponseSchema = z.object({
      sanitizedContent: z
        .string()
        .describe("The original text with all PII redacted"),
      piiDetected: z.object({
        anyPII: z.boolean().describe("Whether any PII was detected"),
        email: z
          .boolean()
          .describe("Whether any email addresses were detected"),
        phone: z.boolean().describe("Whether any phone numbers were detected"),
        socialMedia: z
          .boolean()
          .describe("Whether any social media handles were detected"),
        address: z.boolean().describe("Whether any addresses were detected"),
        ssn: z.boolean().describe("Whether any SSNs were detected"),
        name: z
          .boolean()
          .optional()
          .describe("Whether any personal names were detected"),
        other: z
          .boolean()
          .optional()
          .describe("Whether any other PII was detected"),
      }),
    });

    // Use AI to sanitize the content with structured output
    const result = await generateObject({
      model: openai("gpt-4o"),
      system: `You are a privacy protection assistant. Your task is to identify and redact personally identifiable information (PII) from the provided text.
      
      Replace the following types of PII with the corresponding placeholders:
      - Email addresses → [EMAIL REDACTED]
      - Phone numbers → [PHONE REDACTED]
      - Social media handles (usually starting with @) → [SOCIAL_MEDIA REDACTED]
      - Physical addresses → [ADDRESS REDACTED]
      - Social Security Numbers → [SSN REDACTED]
      - Personal names → [NAME REDACTED] (only if clearly identifiable as a full name)
      - Other PII → [PII REDACTED] (for any other sensitive information)
      
      Do not modify any other content. Return the text with only PII redacted.
      
      Also indicate which types of PII were found in the text using boolean flags.`,
      prompt: content,
      temperature: 0.1, // Low temperature for more deterministic output
      schema: PIIResponseSchema,
    });

    // Count redactions by comparing the sanitized content with the original
    const sanetizedContent = result.object.sanitizedContent;
    const didRedact = result.object.piiDetected.anyPII;

    // Initialize redaction counts
    const redactionCounts: RedactionCounts = {
      email: 0,
      phone: 0,
      socialMedia: 0,
      address: 0,
      ssn: 0,
    };

    // Count occurrences of each redaction type in the sanitized content
    if (didRedact) {
      if (result.object.piiDetected.email) {
        redactionCounts.email = (
          sanetizedContent.match(/\[EMAIL REDACTED\]/g) ?? []
        ).length;
      }

      if (result.object.piiDetected.phone) {
        redactionCounts.phone = (
          sanetizedContent.match(/\[PHONE REDACTED\]/g) ?? []
        ).length;
      }

      if (result.object.piiDetected.socialMedia) {
        redactionCounts.socialMedia = (
          sanetizedContent.match(/\[SOCIAL_MEDIA REDACTED\]/g) ?? []
        ).length;
      }

      if (result.object.piiDetected.address) {
        redactionCounts.address = (
          sanetizedContent.match(/\[ADDRESS REDACTED\]/g) ?? []
        ).length;
      }

      if (result.object.piiDetected.ssn) {
        redactionCounts.ssn = (
          sanetizedContent.match(/\[SSN REDACTED\]/g) ?? []
        ).length;
      }

      if (result.object.piiDetected.name) {
        redactionCounts.name = (
          sanetizedContent.match(/\[NAME REDACTED\]/g) ?? []
        ).length;
      }

      if (result.object.piiDetected.other) {
        redactionCounts.other = (
          sanetizedContent.match(/\[PII REDACTED\]/g) ?? []
        ).length;
      }
    }

    return {
      sanetizedContent,
      didRedact,
      redactionCounts,
    };
  } catch (error) {
    console.error("Error in AI-based PII sanitization:", error);

    // Fallback to regex-based sanitization if AI fails
    return scrubPII(content);
  }
}
