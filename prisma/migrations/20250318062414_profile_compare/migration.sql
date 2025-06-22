/*
  Warnings:

  - Made the column `timeSinceLastMessage` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "timeSinceLastMessage" SET NOT NULL;

-- CreateTable
CREATE TABLE "ProfileComparison" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareKey" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "age" INTEGER,
    "defaultBio" TEXT,

    CONSTRAINT "ProfileComparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonColumn" (
    "id" TEXT NOT NULL,
    "type" "DataProvider" NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "comparisonId" TEXT NOT NULL,
    "bio" TEXT,

    CONSTRAINT "ComparisonColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "columnId" TEXT NOT NULL,

    CONSTRAINT "ComparisonPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileComparison_shareKey_key" ON "ProfileComparison"("shareKey");

-- AddForeignKey
ALTER TABLE "ProfileComparison" ADD CONSTRAINT "ProfileComparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonColumn" ADD CONSTRAINT "ComparisonColumn_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "ProfileComparison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonPhoto" ADD CONSTRAINT "ComparisonPhoto_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "ComparisonColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;
