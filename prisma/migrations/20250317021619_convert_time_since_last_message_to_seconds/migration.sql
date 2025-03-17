-- First create the new column
ALTER TABLE "Message" ADD COLUMN "timeSinceLastMessage_seconds" INTEGER;

-- Convert the existing data from milliseconds to seconds
UPDATE "Message" 
SET "timeSinceLastMessage_seconds" = CAST("timeSinceLastMessage" / 1000 AS INTEGER)
WHERE "timeSinceLastMessage" IS NOT NULL;

-- Drop the old column
ALTER TABLE "Message" DROP COLUMN "timeSinceLastMessage";

-- Rename the new column to the original name
ALTER TABLE "Message" RENAME COLUMN "timeSinceLastMessage_seconds" TO "timeSinceLastMessage";