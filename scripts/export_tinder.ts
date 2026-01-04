#!/usr/bin/env bun
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { dirname, join } from "path";
import postgres from "postgres";

// ============================================================================
// Types
// ============================================================================

type ExportFormat = "json" | "ndjson" | "csv";

interface CLIOptions {
  limit: number;
  after: string | null;
  format: ExportFormat;
  output: string;
  excludeMessages: boolean;
}

interface TinderProfileExport {
  // Profile fields (flat at top level)
  tinderId: string;
  createdAt: string;
  updatedAt: string;
  birthDate: string;
  ageAtUpload: number;
  ageAtLastUsage: number;
  createDate: string;
  activeTime: string | null;
  gender: string;
  genderStr: string;
  bio: string | null;
  bioOriginal: string | null;
  city: string | null;
  country: string | null;
  region: string | null;
  instagramConnected: boolean;
  spotifyConnected: boolean;
  jobTitle: string | null;
  jobTitleDisplayed: boolean | null;
  company: string | null;
  companyDisplayed: boolean | null;
  school: string | null;
  schoolDisplayed: boolean | null;
  educationLevel: string | null;
  ageFilterMin: number;
  ageFilterMax: number;
  interestedIn: string;
  interestedInStr: string;
  genderFilter: string;
  genderFilterStr: string;
  swipestatsVersion: string;
  firstDayOnApp: string;
  lastDayOnApp: string;
  daysInProfilePeriod: number;
  // Related data
  usage: any[];
  matches: any[];
  messages: any[];
  jobs: any[];
  schools: any[];
  profileMeta: any;
}

// ============================================================================
// CLI Parsing
// ============================================================================

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    limit: 1,
    after: null,
    format: "json",
    output: "exports/tinder-export",
    excludeMessages: true,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--limit":
        options.limit = parseInt(args[++i] || "1", 10);
        break;
      case "--after":
        options.after = args[++i] || null;
        break;
      case "--format":
        options.format = (args[++i] || "json") as ExportFormat;
        break;
      case "--output":
        options.output = args[++i] || options.output;
        break;
      case "--exclude-messages":
        options.excludeMessages = true;
        break;
      case "--include-messages":
        options.excludeMessages = false;
        break;
      case "--help":
      case "-h":
        console.log(`
Usage: bun scripts/export_tinder.ts [options]

Options:
  --limit <number>       Number of profiles to export (default: 1)
  --after <tinderId>     Start after this tinderId (keyset pagination)
  --format <format>      Output format: json, ndjson, csv (default: json)
  --output <path>        Output file path (default: exports/tinder-export)
  --exclude-messages     Exclude message data (default: true, use --include-messages to add)
  --include-messages     Include message data (overrides default exclusion)
  --help, -h             Show this help message

Environment Variables:
  DATABASE_URL           PostgreSQL connection string (required)

Examples:
  DATABASE_URL="..." bun scripts/export_tinder.ts
  DATABASE_URL="..." bun scripts/export_tinder.ts --limit 100 --format json
  DATABASE_URL="..." bun scripts/export_tinder.ts --limit 1000 --format csv --exclude-messages
        `);
        process.exit(0);
    }
  }

  return options;
}

// ============================================================================
// Database Queries
// ============================================================================

async function fetchProfiles(
  sql: postgres.Sql,
  limit: number,
  after: string | null,
) {
  const profiles = await sql`
    SELECT *
    FROM "TinderProfile"
    WHERE ${after ? sql`"tinderId" > ${after}` : sql`true`}
    ORDER BY "tinderId" ASC
    LIMIT ${limit}
  `;
  return profiles;
}

async function fetchRelatedData(
  sql: postgres.Sql,
  tinderIds: string[],
  excludeMessages: boolean,
) {
  const queries = [
    sql`
      SELECT *
      FROM "TinderUsage"
      WHERE "tinderProfileId" = ANY(${tinderIds})
      ORDER BY "tinderProfileId", "dateStamp" ASC
    `,
    sql`
      SELECT *
      FROM "Match"
      WHERE "tinderProfileId" = ANY(${tinderIds})
      ORDER BY "tinderProfileId", "order" ASC
    `,
    excludeMessages
      ? Promise.resolve([])
      : sql`
      SELECT *
      FROM "Message"
      WHERE "tinderProfileId" = ANY(${tinderIds})
      ORDER BY "tinderProfileId", "sentDate" ASC
    `,
    sql`
      SELECT *
      FROM "Job"
      WHERE "tinderProfileId" = ANY(${tinderIds})
      ORDER BY "tinderProfileId"
    `,
    sql`
      SELECT *
      FROM "School"
      WHERE "tinderProfileId" = ANY(${tinderIds})
      ORDER BY "tinderProfileId"
    `,
    sql`
      SELECT *
      FROM "ProfileMeta"
      WHERE "tinderProfileId" = ANY(${tinderIds})
    `,
  ];

  const [usage, matches, messages, jobs, schools, profileMeta] =
    await Promise.all(queries);

  return { usage, matches, messages, jobs, schools, profileMeta };
}

function groupRelatedData(
  profiles: any[],
  relatedData: {
    usage: any[];
    matches: any[];
    messages: any[];
    jobs: any[];
    schools: any[];
    profileMeta: any[];
  },
): TinderProfileExport[] {
  const usageByProfile = new Map<string, any[]>();
  const matchesByProfile = new Map<string, any[]>();
  const messagesByProfile = new Map<string, any[]>();
  const jobsByProfile = new Map<string, any[]>();
  const schoolsByProfile = new Map<string, any[]>();
  const profileMetaByProfile = new Map<string, any>();

  // Group by tinderId
  for (const u of relatedData.usage) {
    if (!usageByProfile.has(u.tinderProfileId)) {
      usageByProfile.set(u.tinderProfileId, []);
    }
    usageByProfile.get(u.tinderProfileId)!.push(u);
  }

  for (const m of relatedData.matches) {
    if (!matchesByProfile.has(m.tinderProfileId)) {
      matchesByProfile.set(m.tinderProfileId, []);
    }
    matchesByProfile.get(m.tinderProfileId)!.push(m);
  }

  for (const msg of relatedData.messages) {
    if (!messagesByProfile.has(msg.tinderProfileId)) {
      messagesByProfile.set(msg.tinderProfileId, []);
    }
    messagesByProfile.get(msg.tinderProfileId)!.push(msg);
  }

  for (const j of relatedData.jobs) {
    if (!jobsByProfile.has(j.tinderProfileId)) {
      jobsByProfile.set(j.tinderProfileId, []);
    }
    jobsByProfile.get(j.tinderProfileId)!.push(j);
  }

  for (const s of relatedData.schools) {
    if (!schoolsByProfile.has(s.tinderProfileId)) {
      schoolsByProfile.set(s.tinderProfileId, []);
    }
    schoolsByProfile.get(s.tinderProfileId)!.push(s);
  }

  for (const pm of relatedData.profileMeta) {
    profileMetaByProfile.set(pm.tinderProfileId, pm);
  }

  // Combine into export format
  return profiles.map((profile) => {
    const tinderId = profile.tinderId;
    return {
      ...profile,
      usage: usageByProfile.get(tinderId) || [],
      matches: matchesByProfile.get(tinderId) || [],
      messages: messagesByProfile.get(tinderId) || [],
      jobs: jobsByProfile.get(tinderId) || [],
      schools: schoolsByProfile.get(tinderId) || [],
      profileMeta: profileMetaByProfile.get(tinderId) || null,
    };
  });
}

// ============================================================================
// Output Writers
// ============================================================================

async function writeJSON(
  records: TinderProfileExport[],
  outputPath: string,
): Promise<void> {
  const filePath = outputPath.endsWith(".json")
    ? outputPath
    : `${outputPath}.json`;
  await writeFile(filePath, JSON.stringify(records, null, 2));
  console.log(`✅ Wrote ${records.length} profiles to ${filePath}`);
}

async function writeNDJSON(
  records: TinderProfileExport[],
  outputPath: string,
): Promise<void> {
  const filePath = outputPath.endsWith(".ndjson")
    ? outputPath
    : `${outputPath}.ndjson`;
  const content = records.map((r) => JSON.stringify(r)).join("\n");
  await writeFile(filePath, content);
  console.log(`✅ Wrote ${records.length} profiles to ${filePath}`);
}

async function writeCSV(
  records: TinderProfileExport[],
  outputPath: string,
  excludeMessages = false,
): Promise<void> {
  const outputDir = outputPath.endsWith(".csv")
    ? dirname(outputPath)
    : outputPath;
  mkdirSync(outputDir, { recursive: true });

  // Helper to escape CSV values
  const escapeCSV = (val: any): string => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Helper to write CSV
  const writeCSVFile = async (
    filename: string,
    rows: any[],
    columns: string[],
  ) => {
    if (rows.length === 0) return;
    const header = columns.join(",");
    const data = rows
      .map((row) => columns.map((col) => escapeCSV(row[col])).join(","))
      .join("\n");
    await writeFile(join(outputDir, filename), `${header}\n${data}`);
  };

  // Profiles
  const profileColumns = [
    "tinderId",
    "createdAt",
    "updatedAt",
    "birthDate",
    "ageAtUpload",
    "ageAtLastUsage",
    "createDate",
    "activeTime",
    "gender",
    "genderStr",
    "bio",
    "city",
    "country",
    "region",
    "instagramConnected",
    "spotifyConnected",
    "jobTitle",
    "company",
    "school",
    "educationLevel",
    "ageFilterMin",
    "ageFilterMax",
    "interestedIn",
    "genderFilter",
    "firstDayOnApp",
    "lastDayOnApp",
    "daysInProfilePeriod",
  ];
  await writeCSVFile("profiles.csv", records, profileColumns);

  // Usage
  const allUsage = records.flatMap((r) => r.usage);
  if (allUsage.length > 0) {
    const usageColumns = Object.keys(allUsage[0]);
    await writeCSVFile("usage.csv", allUsage, usageColumns);
  }

  // Matches
  const allMatches = records.flatMap((r) => r.matches);
  if (allMatches.length > 0) {
    const matchColumns = Object.keys(allMatches[0]);
    await writeCSVFile("matches.csv", allMatches, matchColumns);
  }

  // Messages (only if not excluded)
  if (!excludeMessages) {
    const allMessages = records.flatMap((r) => r.messages);
    if (allMessages.length > 0) {
      const messageColumns = Object.keys(allMessages[0]);
      await writeCSVFile("messages.csv", allMessages, messageColumns);
    }
  }

  // Jobs
  const allJobs = records.flatMap((r) => r.jobs);
  if (allJobs.length > 0) {
    const jobColumns = Object.keys(allJobs[0]);
    await writeCSVFile("jobs.csv", allJobs, jobColumns);
  }

  // Schools
  const allSchools = records.flatMap((r) => r.schools);
  if (allSchools.length > 0) {
    const schoolColumns = Object.keys(allSchools[0]);
    await writeCSVFile("schools.csv", allSchools, schoolColumns);
  }

  // ProfileMeta
  const allProfileMeta = records
    .map((r) => r.profileMeta)
    .filter((pm) => pm !== null);
  if (allProfileMeta.length > 0) {
    const profileMetaColumns = Object.keys(allProfileMeta[0]);
    await writeCSVFile("profile_meta.csv", allProfileMeta, profileMetaColumns);
  }

  console.log(
    `✅ Wrote ${records.length} profiles to CSV files in ${outputDir}/`,
  );
}

async function generateREADME(
  records: TinderProfileExport[],
  options: CLIOptions,
  outputPath: string,
  duration: number,
): Promise<void> {
  const outputDir =
    options.format === "csv"
      ? outputPath
      : dirname(outputPath.includes(".") ? outputPath : `${outputPath}.json`);

  const totalUsage = records.reduce((sum, r) => sum + r.usage.length, 0);
  const totalMatches = records.reduce((sum, r) => sum + r.matches.length, 0);
  const totalMessages = options.excludeMessages
    ? 0
    : records.reduce((sum, r) => sum + r.messages.length, 0);
  const totalJobs = records.reduce((sum, r) => sum + r.jobs.length, 0);
  const totalSchools = records.reduce((sum, r) => sum + r.schools.length, 0);

  const readme = `# Tinder Data Export

## Export Information

- **Export Date**: ${new Date().toISOString()}
- **Format**: ${options.format.toUpperCase()}
- **Total Profiles**: ${records.length}
- **Messages Included**: ${options.excludeMessages ? "No (excluded)" : "Yes"}
- **Export Duration**: ${duration.toFixed(2)}s

## Data Summary

| Table | Records |
|-------|---------|
| Profiles | ${records.length} |
| Usage (daily stats) | ${totalUsage} |
| Matches | ${totalMatches} |
| Messages | ${options.excludeMessages ? "0 (excluded)" : totalMessages} |
| Jobs | ${totalJobs} |
| Schools | ${totalSchools} |

## Data Structure

### Profile Data
Each profile record contains:
- **Profile fields**: Core profile information (gender, age, location, bio, preferences, etc.)
- **usage**: Array of daily usage statistics (app opens, swipes, matches, messages)
- **matches**: Array of match records
- **messages**: Array of messages sent/received
- **jobs**: Array of job/employment entries
- **schools**: Array of school/education entries
- **profileMeta**: Computed aggregate statistics (single object or null)

${
  options.format === "csv"
    ? `
### CSV Files
- \`profiles.csv\`: One row per profile
- \`usage.csv\`: Daily usage stats (linked via \`tinderProfileId\`)
- \`matches.csv\`: Match records (linked via \`tinderProfileId\`)
- \`messages.csv\`: Messages (linked via \`tinderProfileId\` and \`matchId\`)
- \`jobs.csv\`: Job entries (linked via \`tinderProfileId\`)
- \`schools.csv\`: School entries (linked via \`tinderProfileId\`)
- \`profile_meta.csv\`: Aggregate stats (linked via \`tinderProfileId\`)
`
    : ""
}

## Loading the Data

### Python (pandas)

\`\`\`python
import pandas as pd
${
  options.format === "json"
    ? `
# Load JSON
import json
with open('${outputPath}.json', 'r') as f:
    data = json.load(f)

# Convert to DataFrame
profiles_df = pd.DataFrame(data)

# Access nested data
# e.g., flatten usage data
usage_records = []
for profile in data:
    for usage in profile['usage']:
        usage_records.append({
            'tinderId': profile['tinderId'],
            **usage
        })
usage_df = pd.DataFrame(usage_records)
`
    : options.format === "ndjson"
      ? `
# Load NDJSON
profiles_df = pd.read_json('${outputPath}.ndjson', lines=True)
`
      : `
# Load CSV files
profiles_df = pd.read_csv('profiles.csv')
usage_df = pd.read_csv('usage.csv')
matches_df = pd.read_csv('matches.csv')
messages_df = pd.read_csv('messages.csv')
jobs_df = pd.read_csv('jobs.csv')
schools_df = pd.read_csv('schools.csv')
profile_meta_df = pd.read_csv('profile_meta.csv')

# Join with usage
merged = profiles_df.merge(usage_df, left_on='tinderId', right_on='tinderProfileId')
`
}
\`\`\`

### R

\`\`\`r
library(jsonlite)
library(dplyr)
${
  options.format === "json"
    ? `
# Load JSON
data <- fromJSON('${outputPath}.json', simplifyDataFrame = TRUE)
profiles <- data

# Unnest usage data
usage <- unnest(data, usage)
`
    : options.format === "ndjson"
      ? `
# Load NDJSON (line by line)
data <- stream_in(file('${outputPath}.ndjson'))
`
      : `
# Load CSV files
profiles <- read.csv('profiles.csv')
usage <- read.csv('usage.csv')
matches <- read.csv('matches.csv')
messages <- read.csv('messages.csv')
jobs <- read.csv('jobs.csv')
schools <- read.csv('schools.csv')
profile_meta <- read.csv('profile_meta.csv')

# Join example
merged <- profiles %>% 
  left_join(usage, by = c('tinderId' = 'tinderProfileId'))
`
}
\`\`\`

## Key Fields

### Profile Fields
- \`tinderId\`: Unique profile identifier
- \`gender\`: User's gender (MALE, FEMALE, OTHER, etc.)
- \`birthDate\`: User's birth date (ISO format)
- \`ageAtUpload\`: Age when data was uploaded
- \`createDate\`: When user joined Tinder
- \`bio\`: Profile bio text
- \`city\`, \`country\`, \`region\`: Location information
- \`ageFilterMin\`, \`ageFilterMax\`: Age preferences
- \`interestedIn\`: Gender preference
- \`firstDayOnApp\`, \`lastDayOnApp\`: Activity period

### Usage Fields (daily stats)
- \`dateStamp\`: Date of activity
- \`appOpens\`: Number of times app was opened
- \`matches\`: Matches made that day
- \`swipeLikes\`, \`swipePasses\`: Right/left swipes
- \`messagesSent\`, \`messagesReceived\`: Message counts

### Match Fields
- \`id\`: Match ID
- \`tinderMatchId\`: Tinder's match ID
- \`totalMessageCount\`: Total messages in conversation
- \`matchedAt\`: When the match occurred

### Message Fields
- \`id\`: Message ID
- \`matchId\`: Associated match
- \`to\`: Message direction (0=sent, 1=received)
- \`sentDate\`: Timestamp
- \`content\`: Message text
- \`messageType\`: TEXT, GIF, GESTURE, etc.

## Notes

- All dates are in ISO 8601 format
- Profile data has been anonymized (no User table or original files)
- Message content may be sanitized in \`contentSanitized\` field
- Some fields may be null if not provided by user

---

**Export Tool**: SwipeStats Tinder Export (PostgreSQL to JSON/CSV)  
**Contact**: support@swipestats.io  
**Website**: https://swipestats.io
`;

  await writeFile(join(outputDir, "README.md"), readme);
  console.log(`✅ Generated README.md in ${outputDir}/`);
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const startTime = Date.now();
  const options = parseArgs();

  // Validate DATABASE_URL
  // eslint-disable-next-line turbo/no-undeclared-env-vars, no-restricted-properties
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ Missing DATABASE_URL environment variable");
    process.exit(1);
  }

  console.log("🔌 DATABASE_URL:", databaseUrl);

  console.log("🚀 Starting Tinder data export");
  console.log(`📊 Options:`, {
    limit: options.limit,
    after: options.after || "(none)",
    format: options.format,
    output: options.output,
    excludeMessages: options.excludeMessages,
  });

  // Connect to database
  console.log("\n🔌 Connecting to database...");
  const sql = postgres(databaseUrl);

  try {
    // Test connection
    await sql`SELECT 1`;
    console.log("✅ Database connected");

    // Fetch profiles
    console.log(
      `\n📥 Fetching up to ${options.limit} profiles${options.after ? ` after ${options.after}` : ""}...`,
    );
    const profiles = await fetchProfiles(sql, options.limit, options.after);
    console.log(`✅ Found ${profiles.length} profiles`);

    if (profiles.length === 0) {
      console.log("⚠️  No profiles to export");
      await sql.end();
      return;
    }

    // Fetch related data
    console.log("\n📥 Fetching related data...");
    const tinderIds = profiles.map((p) => p.tinderId);
    const relatedData = await fetchRelatedData(
      sql,
      tinderIds,
      options.excludeMessages,
    );

    console.log(`  - Usage records: ${relatedData.usage.length}`);
    console.log(`  - Matches: ${relatedData.matches.length}`);
    console.log(
      `  - Messages: ${options.excludeMessages ? "0 (excluded)" : relatedData.messages.length}`,
    );
    console.log(`  - Jobs: ${relatedData.jobs.length}`);
    console.log(`  - Schools: ${relatedData.schools.length}`);
    console.log(`  - ProfileMeta: ${relatedData.profileMeta.length}`);

    // Group data
    console.log("\n🔄 Grouping data by profile...");
    const records = groupRelatedData(profiles, relatedData);
    console.log(`✅ Prepared ${records.length} complete profile records`);

    // Create output directory
    const outputDir =
      options.format === "csv"
        ? options.output
        : dirname(
            options.output.includes(".")
              ? options.output
              : `${options.output}.json`,
          );
    mkdirSync(outputDir, { recursive: true });

    // Write output
    console.log(`\n💾 Writing ${options.format.toUpperCase()} output...`);
    switch (options.format) {
      case "json":
        await writeJSON(records, options.output);
        break;
      case "ndjson":
        await writeNDJSON(records, options.output);
        break;
      case "csv":
        await writeCSV(records, options.output, options.excludeMessages);
        break;
    }

    // Generate README
    const duration = (Date.now() - startTime) / 1000;
    await generateREADME(records, options, options.output, duration);

    console.log(`\n✅ Export complete in ${duration.toFixed(2)}s`);
    console.log(
      `📁 Output: ${options.format === "csv" ? `${options.output}/` : options.output}`,
    );

    if (profiles.length === options.limit) {
      const lastId = profiles[profiles.length - 1].tinderId;
      console.log(
        `\n💡 To continue from where you left off, use: --after "${lastId}"`,
      );
    }
  } catch (error) {
    console.error("\n❌ Export failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
