import natural from "natural";

const tokenizer = new natural.WordTokenizer();
const lexicon = new natural.Lexicon("EN", "N");
const ruleSet = new natural.RuleSet("EN");
const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

export function scrub(text: string): string {
  // Combine all regex patterns
  const patterns = [
    { regex: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: "[PHONE_NUMBER]" },
    {
      regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      replacement: "[EMAIL]",
    },
    { regex: /\B@\w+/g, replacement: "[SOCIAL_MEDIA_HANDLE]" },
    {
      regex:
        /\d+\s+([A-Za-z]+\s+){1,3}(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)\.?/gi,
      replacement: "[ADDRESS]",
    },
  ];
  const replacements = patterns.map(({ regex, replacement }) => replacement);

  // Apply all regex patterns in one pass
  for (const { regex, replacement } of patterns) {
    text = text.replace(regex, replacement);
  }

  console.log("After regex replacements:", text);

  // Use NER to identify and redact names
  const tokens = tokenizer.tokenize(text);
  const taggedWords = tagger.tag(tokens);

  const redactedTokens = taggedWords.taggedWords.map(({ tag, token }) => {
    // if (tag.startsWith("NNP")) {
    //   // Proper noun (singular or plural)
    //   return "[NAME]";
    // }

    if (replacements.some((r) => r.includes(token))) {
      return "[" + token + "]";
    }
    return token;
  });

  return redactedTokens.join(" ");
}

// Usage example

const sensitiveText =
  "John Doe's phone number is 123-456-7890 and his email is john@example.com. He lives at 123 Main St, Anytown, USA. Follow him @johndoe on Twitter.";
const scrubbed = scrub(sensitiveText);
console.log("Scrubbed text:", scrubbed);
