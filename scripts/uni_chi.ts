import { readFileSync } from "fs";
import { join } from "path";

console.log("🚀 Script started!");
console.log("📁 Running from:", process.cwd());

// Read the JSON file
const filePath = join(process.cwd(), "db_dumps/uni_chi/filtered_dump.json");
console.log("📖 Reading file:", filePath);

const fileContent = readFileSync(filePath, "utf-8");
console.log("📏 File size:", fileContent.length, "characters");
console.log("📄 First 500 characters:", fileContent.substring(0, 500));

let data: any;

// Try to parse as regular JSON first
try {
  data = JSON.parse(fileContent);
  console.log("✅ Parsed as regular JSON");
} catch (error) {
  // If that fails, try NDJSON (newline-delimited JSON)
  console.log("⚠️  Regular JSON parse failed, trying NDJSON format...");
  const lines = fileContent
    .trim()
    .split("\n")
    .filter((line) => line.trim());
  console.log("📋 Found", lines.length, "lines");

  if (lines.length > 0) {
    // Parse first line to check structure
    try {
      const firstLine = JSON.parse(lines[0]!);
      console.log("✅ Parsed as NDJSON (newline-delimited JSON)");
      console.log("📊 Sample first object keys:", Object.keys(firstLine));

      // Parse all lines into an array, skipping invalid ones
      const parsed: any[] = [];
      let skipped = 0;
      const errorLines: number[] = [];

      for (let i = 0; i < lines.length; i++) {
        try {
          const parsedLine = JSON.parse(lines[i]!);
          parsed.push(parsedLine);
        } catch (lineError) {
          skipped++;
          if (skipped <= 5) {
            // Log first few errors for debugging
            console.log(
              `⚠️  Skipping invalid line ${i + 1}:`,
              String(lineError).substring(0, 100),
            );
            errorLines.push(i + 1);
          }
        }
      }

      data = parsed;
      console.log(
        `✅ Parsed ${data.length} objects from NDJSON (skipped ${skipped} invalid lines)`,
      );
      if (skipped > 0) {
        console.log(
          `⚠️  First few error line numbers: ${errorLines.slice(0, 10).join(", ")}`,
        );
      }
    } catch (ndjsonError) {
      console.error("❌ Failed to parse as NDJSON:", ndjsonError);
      throw new Error(
        "File is neither valid JSON nor NDJSON. First line sample: " +
          lines[0]?.substring(0, 200),
      );
    }
  } else {
    throw new Error("File appears to be empty or invalid");
  }
}

console.log("\n📊 Data type:", Array.isArray(data) ? "Array" : typeof data);
console.log(
  "📏 Size:",
  Array.isArray(data) ? `${data.length} items` : "Object",
);

// Recursive function to log all keys
function logKeys(obj: any, path = "", depth = 0, maxDepth = 10): void {
  if (depth > maxDepth) {
    console.log(`${"  ".repeat(depth)}... (max depth reached)`);
    return;
  }

  const indent = "  ".repeat(depth);

  if (Array.isArray(obj)) {
    console.log(`${indent}📋 Array[${obj.length}]`);
    if (obj.length > 0) {
      console.log(`${indent}  └─ First item structure:`);
      logKeys(obj[0], `${path}[0]`, depth + 2, maxDepth);
    }
  } else if (obj !== null && typeof obj === "object") {
    const keys = Object.keys(obj);
    console.log(
      `${indent}📦 Object${path ? ` at ${path}` : ""} (${keys.length} keys)`,
    );

    for (const key of keys) {
      const value = obj[key];
      const newPath = path ? `${path}.${key}` : key;
      const valueType = Array.isArray(value)
        ? `Array[${value.length}]`
        : value === null
          ? "null"
          : typeof value;

      console.log(`${indent}  ├─ ${key}: ${valueType}`);

      // Recursively log nested objects/arrays (but limit depth)
      if (typeof value === "object" && value !== null && depth < 5) {
        logKeys(value, newPath, depth + 1, maxDepth);
      }
    }
  } else {
    console.log(
      `${indent}${path}: ${typeof obj} = ${String(obj).substring(0, 50)}`,
    );
  }
}

console.log("\n🔍 JSON Structure:\n");
logKeys(data);

console.log("\n✅ Script completed successfully!");
