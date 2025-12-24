# Tinder Data Export Tool

A TypeScript utility to export Tinder profile data from PostgreSQL to various formats for research and analysis.

## Quick Start

```bash
# Basic export (1500 profiles, JSON format, without messages)
DATABASE_URL="postgresql://..." bun scripts/export_tinder.ts

# Export 100 profiles as CSV
DATABASE_URL="postgresql://..." bun scripts/export_tinder.ts --limit 100 --format csv

# Export 1000 profiles as NDJSON with messages
DATABASE_URL="postgresql://..." bun scripts/export_tinder.ts --limit 1000 --format ndjson --include-messages --output exports/tinder-1k.ndjson
```

## Prerequisites

- Bun runtime installed
- `postgres` package (already in package.json)
- `DATABASE_URL` environment variable with PostgreSQL connection string

## Command Line Options

| Option               | Description                                  | Default               |
| -------------------- | -------------------------------------------- | --------------------- |
| `--limit <number>`   | Number of profiles to export                 | 1500                  |
| `--after <tinderId>` | Start after this profile ID (for pagination) | none                  |
| `--format <format>`  | Output format: `json`, `ndjson`, or `csv`    | json                  |
| `--output <path>`    | Output file/directory path                   | exports/tinder-export |
| `--exclude-messages` | Exclude message data (reduces file size)     | true                  |
| `--include-messages` | Include message data (overrides default)     | -                     |
| `--help`, `-h`       | Show help message                            | -                     |

## Output Formats

### JSON Format

Single JSON array file containing all profiles with nested related data.

```bash
bun scripts/export_tinder.ts --format json --output exports/data.json
```

**Output:**

- `exports/data.json` - Complete dataset
- `exports/README.md` - Auto-generated documentation

### NDJSON Format

Newline-delimited JSON - one profile per line. Great for streaming and large datasets.

```bash
bun scripts/export_tinder.ts --format ndjson --output exports/data.ndjson
```

**Output:**

- `exports/data.ndjson` - One JSON object per line
- `exports/README.md` - Auto-generated documentation

### CSV Format

Multiple CSV files with relational structure. Best for Excel, R, and traditional data analysis.

```bash
bun scripts/export_tinder.ts --format csv --output exports/csv-data
```

**Output:**

- `exports/csv-data/profiles.csv` - Profile data
- `exports/csv-data/usage.csv` - Daily usage statistics
- `exports/csv-data/matches.csv` - Match records
- `exports/csv-data/messages.csv` - Message data
- `exports/csv-data/jobs.csv` - Job entries
- `exports/csv-data/schools.csv` - School entries
- `exports/csv-data/profile_meta.csv` - Aggregate statistics
- `exports/csv-data/README.md` - Auto-generated documentation with join examples

## Data Structure

Each exported profile includes:

- **Profile fields** (flat at top level): Core user data - gender, age, location, bio, preferences, etc.
- **usage[]**: Daily usage statistics (app opens, swipes, matches, messages per day)
- **matches[]**: Match records with metadata
- **messages[]**: Message history with sanitized content (optional, can be excluded)
- **jobs[]**: Employment/job entries
- **schools[]**: Education/school entries
- **profileMeta**: Computed aggregate statistics (single object or null)

> **Note**: Messages can make exports 10-100x larger. Use `--exclude-messages` if you only need profile statistics and match data.

## Large Dataset Export (Pagination)

For exporting large datasets, use keyset pagination with `--after`:

```bash
# Export first batch
DATABASE_URL="..." bun scripts/export_tinder.ts --limit 1000 --format ndjson --output exports/batch-1.ndjson

# The script will show: "To continue from where you left off, use: --after 'xyz123'"

# Export next batch
DATABASE_URL="..." bun scripts/export_tinder.ts --limit 1000 --after "xyz123" --format ndjson --output exports/batch-2.ndjson

# Combine NDJSON files
cat exports/batch-*.ndjson > exports/complete-export.ndjson
```

## What's Exported

### Included Tables

- `TinderProfile` - User profile data
- `TinderUsage` - Daily activity statistics
- `Match` - Match records
- `Message` - Message history
- `Job` - Employment entries
- `School` - Education entries
- `ProfileMeta` - Computed aggregate statistics

### Excluded Tables

- `User` - Authentication/account data (privacy)
- `OriginalAnonymizedFile` - Raw upload files
- `Media` - Photo/image files

## Privacy & Data Handling

- Profile data in the database is already anonymized
- No User account information is exported
- Message content is available in both raw and sanitized forms
- The auto-generated README includes complete schema documentation

## Examples

### Full export for University of Chicago

```bash
# Export all profiles as JSON (messages excluded by default)
DATABASE_URL="..." bun scripts/export_tinder.ts --limit 10000 --output exports/uchicago.json

# Export with messages if needed (will be very large)
DATABASE_URL="..." bun scripts/export_tinder.ts --limit 10000 --include-messages --output exports/uchicago-full.json

# Export as CSV (easier to work with for large datasets)
DATABASE_URL="..." bun scripts/export_tinder.ts --limit 10000 --format csv --output exports/uchicago-csv
```

### Sample export for testing

```bash
# Export 2 profiles to test data structure (tiny sample)
DATABASE_URL="..." bun scripts/export_tinder.ts --limit 2 --output exports/sample.json

# Export 50 profiles with messages to test full structure
DATABASE_URL="..." bun scripts/export_tinder.ts --limit 50 --include-messages --output exports/sample-with-messages.json
```

## Output Documentation

The script automatically generates a `README.md` in the export directory with:

- Export metadata (date, duration, record counts)
- Complete schema documentation
- Code examples for loading in Python (pandas) and R
- Field descriptions and data types

## Troubleshooting

**Missing DATABASE_URL:**

```
❌ Missing DATABASE_URL environment variable
```

→ Set the `DATABASE_URL` environment variable

**No profiles found:**

```
⚠️  No profiles to export
```

→ Check your `--after` value or database contents

**Out of memory:**
→ Use smaller `--limit` or switch to NDJSON format for streaming

## Script Output

The script provides detailed logging:

```
🚀 Starting Tinder data export
📊 Options: { limit: 100, format: 'json', ... }
🔌 Connecting to database...
✅ Database connected
📥 Fetching up to 100 profiles...
✅ Found 100 profiles
📥 Fetching related data...
  - Usage records: 45234
  - Matches: 8901
  - Messages: 23456
🔄 Grouping data by profile...
✅ Prepared 100 complete profile records
💾 Writing JSON output...
✅ Wrote 100 profiles to exports/tinder-export.json
✅ Generated README.md in exports/
✅ Export complete in 12.34s
📁 Output: exports/tinder-export.json
💡 To continue from where you left off, use: --after "xyz123"
```
