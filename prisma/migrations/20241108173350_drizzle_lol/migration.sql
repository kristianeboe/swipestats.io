/*
  Warnings:

  - You are about to drop the column `longestConversation` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `longestConversationInDaysWithLessThan2WeeksBetweenMessages` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `messageCountInLongestConversationInDaysWithLessThan2WeeksBetwee` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `nrOfConversations` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `nrOfConversationsWithMessages` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `nrOfOneMessageConversations` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `onXDaysYouOpenedTheAppButDidNotMessage` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `onXDaysYouOpenedTheAppButDidNotSwipe` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `onXDaysYouOpenedTheAppButDidNotSwipeOrMessage` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `percentOfOneMessageConversations` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `youMessagedOnXDays` on the `ProfileMeta` table. All the data in the column will be lost.
  - You are about to drop the column `youSwipedOnXDays` on the `ProfileMeta` table. All the data in the column will be lost.
  - The primary key for the `School` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `schooldId` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `howHappyDoYouPerceiveYourselfToBe` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `howHotDoYouPerceiveYourselfToBe` on the `User` table. All the data in the column will be lost.
  - Made the column `userId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `daysAppOpenedNoMessage` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daysAppOpenedNoSwipe` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daysAppOpenedNoSwipeOrMessage` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daysYouMessaged` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daysYouSwiped` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longestConversationInDaysTwoWeekMax` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxConversationMessageCount` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageCountInConversationTwoWeekMax` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfConversations` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfConversationsWithMessages` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfOneMessageConversations` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentageOfOneMessageConversations` to the `ProfileMeta` table without a default value. This is not possible if the table is not empty.
  - The required column `schoolId` was added to the `School` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.

-- Add new enum values to existing enums
ALTER TYPE "EventType" ADD VALUE 'NEW_BIO';
ALTER TYPE "EventType" ADD VALUE 'CUSTOM';

ALTER TYPE "SwipestatsVersion" ADD VALUE 'SWIPESTATS_4';

-- Remove default values from 'updatedAt' columns
ALTER TABLE "CustomData" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "EmailReminder" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "HingeProfile" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "OriginalAnonymizedFile" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Waitlist" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- Adjust 'Event' table
-- Remove existing foreign key constraint
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- Set 'userId' column to NOT NULL
ALTER TABLE "Event" ALTER COLUMN "userId" SET NOT NULL;

-- Re-add foreign key constraint
ALTER TABLE "Event"
    ADD CONSTRAINT "Event_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Adjust 'ProfileMeta' table
-- Rename columns instead of dropping and adding
ALTER TABLE "ProfileMeta"
    RENAME COLUMN "onXDaysYouOpenedTheAppButDidNotMessage" TO "daysAppOpenedNoMessage";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "onXDaysYouOpenedTheAppButDidNotSwipe" TO "daysAppOpenedNoSwipe";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "onXDaysYouOpenedTheAppButDidNotSwipeOrMessage" TO "daysAppOpenedNoSwipeOrMessage";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "youMessagedOnXDays" TO "daysYouMessaged";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "youSwipedOnXDays" TO "daysYouSwiped";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "nrOfConversations" TO "numberOfConversations";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "nrOfConversationsWithMessages" TO "numberOfConversationsWithMessages";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "nrOfOneMessageConversations" TO "numberOfOneMessageConversations";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "percentOfOneMessageConversations" TO "percentageOfOneMessageConversations";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "longestConversationInDaysWithLessThan2WeeksBetweenMessages" TO "longestConversationInDaysTwoWeekMax";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "messageCountInLongestConversationInDaysWithLessThan2WeeksBetweenMessages" TO "messageCountInConversationTwoWeekMax";

ALTER TABLE "ProfileMeta"
    RENAME COLUMN "longestConversation" TO "maxConversationMessageCount";

-- Adjust 'School' table
-- Rename 'schooldId' to 'schoolId' and adjust primary key if necessary
ALTER TABLE "School"
    RENAME COLUMN "schooldId" TO "schoolId";

-- (Optional) Ensure the primary key constraint is correctly referencing 'schoolId'
-- This is usually handled automatically, but you can explicitly drop and re-add the primary key if needed
-- ALTER TABLE "School" DROP CONSTRAINT "School_pkey";
-- ALTER TABLE "School" ADD CONSTRAINT "School_pkey" PRIMARY KEY ("schoolId");

-- Adjust 'User' table
-- Rename columns instead of dropping and adding
ALTER TABLE "User"
    RENAME COLUMN "howHappyDoYouPerceiveYourselfToBe" TO "currentHappiness";

ALTER TABLE "User"
    RENAME COLUMN "howHotDoYouPerceiveYourselfToBe" TO "currentHotness";

-- Add new columns with default values where necessary
ALTER TABLE "User"
    ADD COLUMN "firstStartedWithDatingApps" TIMESTAMP(3),
    ADD COLUMN "happinessHistory" JSONB NOT NULL DEFAULT '[]',
    ADD COLUMN "hotnessHistory" JSONB NOT NULL DEFAULT '[]',
    ADD COLUMN "locationHistory" JSONB NOT NULL DEFAULT '[]',
    ADD COLUMN "pastDatingApps" JSONB NOT NULL DEFAULT '[]',
    ADD COLUMN "relationshipHistory" JSONB NOT NULL DEFAULT '[]';

-- Remove default from 'updatedAt' column
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- Adjust default value of 'activeOnTinder'
ALTER TABLE "User" ALTER COLUMN "activeOnTinder" SET DEFAULT false;

-- Remove default from 'Waitlist' 'updatedAt' column
ALTER TABLE "Waitlist" ALTER COLUMN "updatedAt" DROP DEFAULT;
