-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ProfilePreview" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT,
    "password" TEXT,
    "description" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "jobTitle" TEXT,
    "company" TEXT,
    "school" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "age" INTEGER,
    "defaultBio" TEXT,
    "fromCity" TEXT,
    "fromCountry" TEXT,

    CONSTRAINT "ProfilePreview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreviewColumn" (
    "id" TEXT NOT NULL,
    "type" "DataProvider" NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "previewId" TEXT NOT NULL,
    "bio" TEXT,
    "jobTitle" TEXT,
    "company" TEXT,
    "school" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "age" INTEGER,
    "fromCity" TEXT,
    "fromCountry" TEXT,

    CONSTRAINT "PreviewColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreviewPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "location" TEXT,
    "photoType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "columnId" TEXT NOT NULL,

    CONSTRAINT "PreviewPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreviewPrompt" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "columnId" TEXT NOT NULL,

    CONSTRAINT "PreviewPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePreview_slug_key" ON "ProfilePreview"("slug");

-- AddForeignKey
ALTER TABLE "ProfilePreview" ADD CONSTRAINT "ProfilePreview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewColumn" ADD CONSTRAINT "PreviewColumn_previewId_fkey" FOREIGN KEY ("previewId") REFERENCES "ProfilePreview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewPhoto" ADD CONSTRAINT "PreviewPhoto_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "PreviewColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewPrompt" ADD CONSTRAINT "PreviewPrompt_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "PreviewColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;
