import { describe, it, expect } from "bun:test";
import { scrubPII } from "./pii.service";

describe("scrubPII", () => {
  it("should redact email addresses", () => {
    const input = "Contact me at john.doe@example.com";
    const expectedContent = "Contact me at [EMAIL REDACTED]";
    const result = scrubPII(input);
    expect(result.sanetizedContent).toBe(expectedContent);
    expect(result.didRedact).toBe(true);
  });

  it("should redact phone numbers", () => {
    const input = "Call me at 555-123-4567 or (555) 123-4567";
    const expectedContent = "Call me at [PHONE REDACTED] or [PHONE REDACTED]";
    const result = scrubPII(input);
    expect(result.sanetizedContent).toBe(expectedContent);
    expect(result.didRedact).toBe(true);
  });

  it("should redact social media handles", () => {
    const input = "Follow me on Twitter @john_doe";
    const expectedContent = "Follow me on Twitter [SOCIAL_MEDIA REDACTED]";
    const result = scrubPII(input);
    expect(result.sanetizedContent).toBe(expectedContent);
    expect(result.didRedact).toBe(true);
  });

  it("should redact addresses", () => {
    const input = "Send it to 123 Main St, Springfield, IL 62704";
    const expectedContent = "Send it to [ADDRESS REDACTED]";
    const result = scrubPII(input);
    expect(result.sanetizedContent).toBe(expectedContent);
    expect(result.didRedact).toBe(true);
  });

  it("should redact SSNs", () => {
    const input = "My SSN is 123-45-6789";
    const expectedContent = "My SSN is [SSN REDACTED]";
    const result = scrubPII(input);
    expect(result.sanetizedContent).toBe(expectedContent);
    expect(result.didRedact).toBe(true);
  });

  it("should handle text with no PII", () => {
    const input = "This is a safe text with no PII.";
    const expectedContent = "This is a safe text with no PII.";
    const result = scrubPII(input);
    expect(result.sanetizedContent).toBe(expectedContent);
    expect(result.didRedact).toBe(false);
  });

  it("should handle empty strings", () => {
    const input = "";
    const expectedContent = "";
    const result = scrubPII(input);
    expect(result.sanetizedContent).toBe(expectedContent);
    expect(result.didRedact).toBe(false);
  });
});
