/*
  Warnings:

  - You are about to drop the column `fromCity` on the `PreviewColumn` table. All the data in the column will be lost.
  - You are about to drop the column `fromCountry` on the `PreviewColumn` table. All the data in the column will be lost.
  - You are about to drop the `_PreviewColumnMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UnitSystem" AS ENUM ('METRIC', 'IMPERIAL');

-- AlterEnum
ALTER TYPE "DataProvider" ADD VALUE 'RAYA';

-- DropForeignKey
ALTER TABLE "_PreviewColumnMedia" DROP CONSTRAINT "_PreviewColumnMedia_A_fkey";

-- DropForeignKey
ALTER TABLE "_PreviewColumnMedia" DROP CONSTRAINT "_PreviewColumnMedia_B_fkey";

-- AlterTable
ALTER TABLE "PreviewColumn" DROP COLUMN "fromCity",
DROP COLUMN "fromCountry",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "heightCm" INTEGER,
ADD COLUMN     "hideUnusedPhotoSlots" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hometown" TEXT,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "nationality" TEXT;

-- AlterTable
ALTER TABLE "ProfilePreview" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "heightCm" INTEGER,
ADD COLUMN     "hometown" TEXT,
ADD COLUMN     "nationality" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "heightCm" INTEGER,
ADD COLUMN     "hometown" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "unitPreference" "UnitSystem" NOT NULL DEFAULT 'METRIC';

-- DropTable
DROP TABLE "_PreviewColumnMedia";

-- CreateTable
CREATE TABLE "PreviewColumnMediaAsset" (
    "id" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreviewColumnMediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreviewColumnMediaAsset_columnId_mediaAssetId_key" ON "PreviewColumnMediaAsset"("columnId", "mediaAssetId");

-- AddForeignKey
ALTER TABLE "PreviewColumnMediaAsset" ADD CONSTRAINT "PreviewColumnMediaAsset_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "PreviewColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewColumnMediaAsset" ADD CONSTRAINT "PreviewColumnMediaAsset_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
