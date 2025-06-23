/*
  Warnings:

  - You are about to drop the column `columnId` on the `PreviewPrompt` table. All the data in the column will be lost.
  - You are about to drop the `PreviewPhoto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `promptType` to the `PreviewPrompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PreviewPrompt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO', 'AUDIO');

-- DropForeignKey
ALTER TABLE "PreviewPhoto" DROP CONSTRAINT "PreviewPhoto_columnId_fkey";

-- DropForeignKey
ALTER TABLE "PreviewPrompt" DROP CONSTRAINT "PreviewPrompt_columnId_fkey";

-- AlterTable
ALTER TABLE "PreviewPrompt" DROP COLUMN "columnId",
ADD COLUMN     "promptType" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "PreviewPhoto";

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL DEFAULT 'PHOTO',
    "name" TEXT,
    "description" TEXT,
    "location" TEXT,
    "assetType" TEXT,
    "tags" TEXT[],
    "rating" INTEGER DEFAULT 0,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "fileSize" INTEGER,
    "duration" INTEGER,
    "dimensions" JSONB,
    "format" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PreviewColumnPrompts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PreviewColumnPrompts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PreviewColumnMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PreviewColumnMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PreviewColumnPrompts_B_index" ON "_PreviewColumnPrompts"("B");

-- CreateIndex
CREATE INDEX "_PreviewColumnMedia_B_index" ON "_PreviewColumnMedia"("B");

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewPrompt" ADD CONSTRAINT "PreviewPrompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreviewColumnPrompts" ADD CONSTRAINT "_PreviewColumnPrompts_A_fkey" FOREIGN KEY ("A") REFERENCES "PreviewColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreviewColumnPrompts" ADD CONSTRAINT "_PreviewColumnPrompts_B_fkey" FOREIGN KEY ("B") REFERENCES "PreviewPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreviewColumnMedia" ADD CONSTRAINT "_PreviewColumnMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreviewColumnMedia" ADD CONSTRAINT "_PreviewColumnMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "PreviewColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;
