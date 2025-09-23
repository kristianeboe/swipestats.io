/*
  Warnings:

  - You are about to drop the column `blockType` on the `HingeBlock` table. All the data in the column will be lost.
  - Added the required column `interactionType` to the `HingeBlock` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HingeInteractionType" AS ENUM ('LIKE', 'MATCH', 'UNLIKE', 'BLOCK');

-- AlterTable
ALTER TABLE "HingeBlock" DROP COLUMN "blockType",
ADD COLUMN     "body" TEXT,
ADD COLUMN     "detail" TEXT,
ADD COLUMN     "interactionType" "HingeInteractionType" NOT NULL;

-- CreateTable
CREATE TABLE "HingeUsage" (
    "dateStamp" TIMESTAMP(3) NOT NULL,
    "dateStampRaw" TEXT NOT NULL,
    "hingeProfileId" TEXT NOT NULL,
    "matches" INTEGER NOT NULL,
    "likesSent" INTEGER NOT NULL,
    "likesReceived" INTEGER,
    "blocks" INTEGER NOT NULL,
    "messagesSent" INTEGER NOT NULL,
    "messagesReceived" INTEGER,
    "matchRate" DOUBLE PRECISION NOT NULL,
    "responseRate" DOUBLE PRECISION NOT NULL,
    "engagementRate" DOUBLE PRECISION NOT NULL,
    "dateIsMissingFromOriginalData" BOOLEAN NOT NULL,
    "daysSinceLastActive" INTEGER,
    "activeUser" BOOLEAN NOT NULL,
    "activeUserInLast7Days" BOOLEAN NOT NULL,
    "activeUserInLast14Days" BOOLEAN NOT NULL,
    "activeUserInLast30Days" BOOLEAN NOT NULL,

    CONSTRAINT "HingeUsage_pkey" PRIMARY KEY ("dateStampRaw","hingeProfileId")
);

-- AddForeignKey
ALTER TABLE "HingeUsage" ADD CONSTRAINT "HingeUsage_hingeProfileId_fkey" FOREIGN KEY ("hingeProfileId") REFERENCES "HingeProfile"("hingeId") ON DELETE CASCADE ON UPDATE CASCADE;
