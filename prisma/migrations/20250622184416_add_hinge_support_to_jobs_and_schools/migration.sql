/*
  Warnings:

  - You are about to drop the column `schools` on the `HingeProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HingeProfile" DROP COLUMN "schools",
ADD COLUMN     "jobsRaw" JSONB,
ADD COLUMN     "schoolsOriginal" TEXT[],
ADD COLUMN     "schoolsRaw" JSONB,
ADD COLUMN     "workplacesRaw" JSONB;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "hingeProfileId" TEXT,
ALTER COLUMN "tinderProfileId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "hingeProfileId" TEXT,
ALTER COLUMN "tinderProfileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_hingeProfileId_fkey" FOREIGN KEY ("hingeProfileId") REFERENCES "HingeProfile"("hingeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_hingeProfileId_fkey" FOREIGN KEY ("hingeProfileId") REFERENCES "HingeProfile"("hingeId") ON DELETE CASCADE ON UPDATE CASCADE;
