-- CreateEnum
CREATE TYPE "SwipestatsTier" AS ENUM ('FREE', 'PLUS', 'ELITE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "swipestatsTier" "SwipestatsTier" NOT NULL DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tinderProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;
