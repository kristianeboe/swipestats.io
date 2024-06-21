-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('RELATIONSHIP', 'FRIENDS_WITH_BENEFITS', 'TRIP', 'SUBSCRIPTION', 'NEW_LOCATION', 'NEW_PHOTOS', 'NEW_FIRST_PHOTO', 'NEW_JOB', 'GRADUATION', 'JOINED_SWIPESTATS', 'JOINED_TINDER', 'JOINED_HINGE');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'GIF', 'GESTURE', 'ACTIVITY', 'CONTACT_CARD', 'OTHER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'MORE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DataProvider" AS ENUM ('TINDER', 'HINGE', 'BUMBLE', 'GRINDER', 'BADOO', 'BOO', 'OK_CUPID', 'FEELD');

-- CreateEnum
CREATE TYPE "SwipestatsVersion" AS ENUM ('SWIPESTATS_1', 'SWIPESTATS_2', 'SWIPESTATS_3');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeOnTinder" BOOLEAN NOT NULL DEFAULT true,
    "activeOnHinge" BOOLEAN NOT NULL DEFAULT false,
    "activeOnBumble" BOOLEAN NOT NULL DEFAULT false,
    "activeOnHappen" BOOLEAN NOT NULL DEFAULT false,
    "activeOnOther" BOOLEAN NOT NULL DEFAULT false,
    "otherDatingApps" TEXT[],
    "howHotDoYouPerceiveYourselfToBe" INTEGER,
    "howHappyDoYouPerceiveYourselfToBe" INTEGER,
    "timeZone" TEXT,
    "country" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "locationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "jobId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleDisplayed" BOOLEAN NOT NULL,
    "company" TEXT,
    "companyDisplayed" BOOLEAN,
    "tinderProfileId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "School" (
    "schooldId" TEXT NOT NULL,
    "id" TEXT,
    "displayed" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "year" TEXT,
    "metadata_id" TEXT,
    "tinderProfileId" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("schooldId")
);

-- CreateTable
CREATE TABLE "TinderUsage" (
    "dateStamp" TIMESTAMP(3) NOT NULL,
    "dateStampRaw" TEXT NOT NULL,
    "tinderProfileId" TEXT NOT NULL,
    "appOpens" INTEGER NOT NULL,
    "matches" INTEGER NOT NULL,
    "swipeLikes" INTEGER NOT NULL,
    "swipeSuperLikes" INTEGER NOT NULL,
    "swipePasses" INTEGER NOT NULL,
    "swipesCombined" INTEGER NOT NULL,
    "messagesReceived" INTEGER NOT NULL,
    "messagesSent" INTEGER NOT NULL,
    "matchRate" DOUBLE PRECISION NOT NULL,
    "likeRate" DOUBLE PRECISION NOT NULL,
    "messagesSentRate" DOUBLE PRECISION NOT NULL,
    "responseRate" DOUBLE PRECISION NOT NULL,
    "engagementRate" DOUBLE PRECISION NOT NULL,
    "dateIsMissingFromOriginalData" BOOLEAN NOT NULL,
    "daysSinceLastActive" INTEGER,
    "activeUser" BOOLEAN NOT NULL,
    "activeUserInLast7Days" BOOLEAN NOT NULL,
    "activeUserInLast14Days" BOOLEAN NOT NULL,
    "activeUserInLast30Days" BOOLEAN NOT NULL,
    "userAgeThisDay" INTEGER NOT NULL,

    CONSTRAINT "TinderUsage_pkey" PRIMARY KEY ("dateStampRaw","tinderProfileId")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "totalMessageCount" INTEGER NOT NULL,
    "textCount" INTEGER NOT NULL,
    "gifCount" INTEGER NOT NULL,
    "gestureCount" INTEGER NOT NULL,
    "otherMessageTypeCount" INTEGER NOT NULL,
    "primaryLanguage" TEXT,
    "languages" JSONB NOT NULL DEFAULT '[]',
    "initialMessageAt" TIMESTAMP(3),
    "lastMessageAt" TIMESTAMP(3),
    "engagementScore" INTEGER,
    "tinderMatchId" TEXT,
    "tinderProfileId" TEXT,
    "weMet" JSONB,
    "like" JSONB,
    "match" JSONB,
    "likedAt" TIMESTAMP(3),
    "matchedAt" TIMESTAMP(3),
    "hingeProfileId" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HingeBlock" (
    "id" TEXT NOT NULL,
    "blockType" TEXT NOT NULL,
    "dateStamp" TIMESTAMP(3) NOT NULL,
    "dateStampRaw" TEXT NOT NULL,
    "hingeId" TEXT NOT NULL,

    CONSTRAINT "HingeBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "to" INTEGER NOT NULL,
    "sentDate" TIMESTAMP(3) NOT NULL,
    "sentDateRaw" TEXT NOT NULL,
    "contentRaw" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "charCount" INTEGER NOT NULL,
    "messageType" "MessageType" NOT NULL,
    "type" TEXT,
    "gifUrl" TEXT,
    "order" INTEGER NOT NULL,
    "language" TEXT,
    "timeSinceLastMessage" BIGINT NOT NULL,
    "timeSinceLastMessageRelative" TEXT,
    "emotionScore" INTEGER,
    "matchId" TEXT NOT NULL,
    "tinderProfileId" TEXT,
    "hingeProfileId" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawMessages" (
    "messages" JSONB NOT NULL,
    "tinderProfileId" TEXT NOT NULL,

    CONSTRAINT "RawMessages_pkey" PRIMARY KEY ("tinderProfileId")
);

-- CreateTable
CREATE TABLE "RawUsage" (
    "tinderProfileId" TEXT NOT NULL,
    "matchesRaw" JSONB NOT NULL,
    "appOpensRaw" JSONB NOT NULL,
    "swipeLikesRaw" JSONB NOT NULL,
    "swipePassesRaw" JSONB NOT NULL,
    "messagesSentRaw" JSONB NOT NULL,
    "messagesReceivedRaw" JSONB NOT NULL,

    CONSTRAINT "RawUsage_pkey" PRIMARY KEY ("tinderProfileId")
);

-- CreateTable
CREATE TABLE "TinderProfile" (
    "computed" BOOLEAN NOT NULL DEFAULT false,
    "tinderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "ageAtUpload" INTEGER NOT NULL,
    "ageAtLastUsage" INTEGER NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL,
    "activeTime" TIMESTAMP(3),
    "gender" "Gender" NOT NULL,
    "genderStr" TEXT NOT NULL,
    "bio" TEXT,
    "bioOriginal" TEXT,
    "city" TEXT,
    "country" TEXT,
    "region" TEXT,
    "user_interests" JSONB,
    "interests" JSONB,
    "sexual_orientations" JSONB,
    "descriptors" JSONB,
    "instagramConnected" BOOLEAN NOT NULL,
    "spotifyConnected" BOOLEAN NOT NULL,
    "jobTitle" TEXT,
    "jobTitleDisplayed" BOOLEAN,
    "company" TEXT,
    "companyDisplayed" BOOLEAN,
    "school" TEXT,
    "schoolDisplayed" BOOLEAN,
    "college" JSONB,
    "jobsRaw" JSONB,
    "schoolsRaw" JSONB,
    "educationLevel" TEXT,
    "ageFilterMin" INTEGER NOT NULL,
    "ageFilterMax" INTEGER NOT NULL,
    "interestedIn" "Gender" NOT NULL,
    "interestedInStr" TEXT NOT NULL,
    "genderFilter" "Gender" NOT NULL,
    "genderFilterStr" TEXT NOT NULL,
    "swipestatsVersion" "SwipestatsVersion" NOT NULL,
    "userId" TEXT NOT NULL,
    "firstDayOnApp" TIMESTAMP(3) NOT NULL,
    "lastDayOnApp" TIMESTAMP(3) NOT NULL,
    "daysInProfilePeriod" INTEGER NOT NULL,

    CONSTRAINT "TinderProfile_pkey" PRIMARY KEY ("tinderId")
);

-- CreateTable
CREATE TABLE "HingeProfile" (
    "hingeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "ageAtUpload" INTEGER NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL,
    "heightCentimeters" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "genderIdentity" TEXT NOT NULL,
    "genderIdentityDisplayed" BOOLEAN NOT NULL,
    "ethnicities" TEXT[],
    "ethnicitiesDisplayed" BOOLEAN NOT NULL,
    "religions" TEXT[],
    "religionsDisplayed" BOOLEAN NOT NULL,
    "workplaces" TEXT[],
    "workplacesDisplayed" BOOLEAN NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobTitleDisplayed" BOOLEAN NOT NULL,
    "schools" TEXT[],
    "schoolsDisplayed" BOOLEAN NOT NULL,
    "hometowns" TEXT[],
    "hometownsDisplayed" BOOLEAN NOT NULL,
    "smoking" BOOLEAN NOT NULL,
    "smokingDisplayed" BOOLEAN NOT NULL,
    "drinking" BOOLEAN NOT NULL,
    "drinkingDisplayed" BOOLEAN NOT NULL,
    "marijuana" BOOLEAN NOT NULL,
    "marijuanaDisplayed" BOOLEAN NOT NULL,
    "drugs" BOOLEAN NOT NULL,
    "drugsDisplayed" BOOLEAN NOT NULL,
    "children" TEXT NOT NULL,
    "childrenDisplayed" BOOLEAN NOT NULL,
    "familyPlans" TEXT NOT NULL,
    "familyPlansDisplayed" BOOLEAN NOT NULL,
    "educationAttained" TEXT NOT NULL,
    "politics" TEXT NOT NULL,
    "politicsDisplayed" BOOLEAN NOT NULL,
    "instagramDisplayed" BOOLEAN NOT NULL,
    "datingIntention" TEXT NOT NULL,
    "datingIntentionDisplayed" BOOLEAN NOT NULL,
    "languagesSpoken" TEXT NOT NULL,
    "languagesSpokenDisplayed" BOOLEAN NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "relationshipTypeDisplayed" BOOLEAN NOT NULL,
    "selfieVerified" BOOLEAN NOT NULL,
    "distanceMilesMax" INTEGER NOT NULL,
    "ageMin" INTEGER NOT NULL,
    "ageMax" INTEGER NOT NULL,
    "ageDealbreaker" BOOLEAN NOT NULL,
    "heightMin" INTEGER NOT NULL,
    "heightMax" INTEGER NOT NULL,
    "heightDealbreaker" BOOLEAN NOT NULL,
    "genderPreference" TEXT NOT NULL,
    "ethnicityPreference" TEXT[],
    "ethnicityDealbreaker" BOOLEAN NOT NULL,
    "religionPreference" TEXT[],
    "religionDealbreaker" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "HingeProfile_pkey" PRIMARY KEY ("hingeId")
);

-- CreateTable
CREATE TABLE "HingePrompt" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "answerText" TEXT NOT NULL,
    "createdPromptAt" TIMESTAMP(3) NOT NULL,
    "updatedPromptAt" TIMESTAMP(3) NOT NULL,
    "hingeProfileId" TEXT,

    CONSTRAINT "HingePrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomData" (
    "id" TEXT NOT NULL,
    "messaged" INTEGER,
    "goodConversation" INTEGER,
    "movedToADifferentApp" INTEGER,
    "phoneNumbersExchanged" INTEGER,
    "dateArranged" INTEGER,
    "dateAttended" INTEGER,
    "dateNoShow" INTEGER,
    "dateCreepy" INTEGER,
    "dateNoSpark" INTEGER,
    "onlyOneDate" INTEGER,
    "oneNightStands" INTEGER,
    "multipleDates" INTEGER,
    "sleptWithOnFirstDate" INTEGER,
    "sleptWithEventually" INTEGER,
    "friendsWithBenefits" INTEGER,
    "justFriends" INTEGER,
    "relationshipsStarted" INTEGER,
    "cohabitation" INTEGER,
    "married" INTEGER,
    "divorce" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tinderProfileId" TEXT,
    "hingeProfileId" TEXT,
    "userId" TEXT,

    CONSTRAINT "CustomData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileMeta" (
    "id" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "daysInProfilePeriod" INTEGER NOT NULL,
    "daysActiveOnApp" INTEGER NOT NULL,
    "daysNotActiveOnApp" INTEGER NOT NULL,
    "appOpensTotal" INTEGER NOT NULL,
    "swipeLikesTotal" INTEGER NOT NULL,
    "swipeSuperLikesTotal" INTEGER NOT NULL,
    "swipePassesTotal" INTEGER NOT NULL,
    "combinedSwipesTotal" INTEGER NOT NULL,
    "messagesSentTotal" INTEGER NOT NULL,
    "messagesReceivedTotal" INTEGER NOT NULL,
    "matchesTotal" INTEGER NOT NULL,
    "noMatchesTotal" INTEGER NOT NULL,
    "youSwipedOnXDays" INTEGER NOT NULL,
    "youMessagedOnXDays" INTEGER NOT NULL,
    "onXDaysYouOpenedTheAppButDidNotSwipe" INTEGER NOT NULL,
    "onXDaysYouOpenedTheAppButDidNotMessage" INTEGER NOT NULL,
    "onXDaysYouOpenedTheAppButDidNotSwipeOrMessage" INTEGER NOT NULL,
    "matchRateForPeriod" DOUBLE PRECISION NOT NULL,
    "likeRateForPeriod" DOUBLE PRECISION NOT NULL,
    "likeRatio" DOUBLE PRECISION NOT NULL,
    "messagesSentRateForPeriod" DOUBLE PRECISION NOT NULL,
    "messagesSentRatio" DOUBLE PRECISION NOT NULL,
    "averageMatchesPerDay" INTEGER NOT NULL,
    "averageAppOpensPerDay" INTEGER NOT NULL,
    "averageSwipeLikesPerDay" INTEGER NOT NULL,
    "averageSwipePassesPerDay" INTEGER NOT NULL,
    "averageMessagesSentPerDay" INTEGER NOT NULL,
    "averageMessagesReceivedPerDay" INTEGER NOT NULL,
    "averageSwipesPerDay" INTEGER NOT NULL,
    "medianMatchesPerDay" INTEGER NOT NULL,
    "medianAppOpensPerDay" INTEGER NOT NULL,
    "medianSwipeLikesPerDay" INTEGER NOT NULL,
    "medianSwipePassesPerDay" INTEGER NOT NULL,
    "medianMessagesSentPerDay" INTEGER NOT NULL,
    "medianMessagesReceivedPerDay" INTEGER NOT NULL,
    "medianSwipesPerDay" INTEGER NOT NULL,
    "peakMatches" INTEGER NOT NULL,
    "peakMatchesDate" TIMESTAMP(3) NOT NULL,
    "peakAppOpens" INTEGER NOT NULL,
    "peakAppOpensDate" TIMESTAMP(3) NOT NULL,
    "peakSwipeLikes" INTEGER NOT NULL,
    "peakSwipeLikesDate" TIMESTAMP(3) NOT NULL,
    "peakSwipePasses" INTEGER NOT NULL,
    "peakSwipePassesDate" TIMESTAMP(3) NOT NULL,
    "peakMessagesSent" INTEGER NOT NULL,
    "peakMessagesSentDate" TIMESTAMP(3) NOT NULL,
    "peakMessagesReceived" INTEGER NOT NULL,
    "peakMessagesReceivedDate" TIMESTAMP(3) NOT NULL,
    "peakCombinedSwipes" INTEGER NOT NULL,
    "peakCombinedSwipesDate" TIMESTAMP(3) NOT NULL,
    "dailySwipeLimitsReached" INTEGER NOT NULL,
    "longestActivePeriodInDays" INTEGER NOT NULL,
    "longestInactivePeriodInDays" INTEGER NOT NULL,
    "nrOfConversations" INTEGER NOT NULL,
    "nrOfConversationsWithMessages" INTEGER NOT NULL,
    "longestConversation" INTEGER NOT NULL,
    "longestConversationInDays" INTEGER NOT NULL,
    "messageCountInLongestConversationInDays" INTEGER NOT NULL,
    "longestConversationInDaysWithLessThan2WeeksBetweenMessages" INTEGER NOT NULL,
    "messageCountInLongestConversationInDaysWithLessThan2WeeksBetweenMessages" INTEGER NOT NULL,
    "averageConversationMessageCount" INTEGER NOT NULL,
    "averageConversationLengthInDays" INTEGER NOT NULL,
    "medianConversationMessageCount" INTEGER NOT NULL,
    "medianConversationLengthInDays" INTEGER NOT NULL,
    "nrOfOneMessageConversations" INTEGER NOT NULL,
    "percentOfOneMessageConversations" INTEGER NOT NULL,
    "nrOfGhostingsAfterInitialMatch" INTEGER NOT NULL,
    "tinderProfileId" TEXT,
    "hingeProfileId" TEXT,
    "tinderProfileIdByMonth" TEXT,
    "tinderProfileIdByYear" TEXT,

    CONSTRAINT "ProfileMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "prompt" TEXT,
    "caption" TEXT,
    "url" TEXT NOT NULL,
    "fromSoMe" BOOLEAN,
    "hingeProfileId" TEXT,
    "tinderProfileId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "country" TEXT NOT NULL,
    "countryShort" TEXT NOT NULL,
    "adminArea1" TEXT NOT NULL,
    "adminArea1Short" TEXT NOT NULL,
    "adminArea2" TEXT NOT NULL,
    "cbsa" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "sublocality" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "postalSuffix" TEXT NOT NULL,
    "locationSource" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OriginalAnonymizedFile" (
    "id" TEXT NOT NULL,
    "dataProvider" "DataProvider" NOT NULL,
    "swipestatsVersion" "SwipestatsVersion" NOT NULL,
    "file" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OriginalAnonymizedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dataProvider" "DataProvider" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailReminder" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dataProvider" "DataProvider" NOT NULL,
    "remindOn" TIMESTAMP(3) NOT NULL,
    "doubleOptedIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "emailHash" TEXT NOT NULL,
    "threeDayReminder" BOOLEAN NOT NULL,
    "doubleOptInConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "globalUnsubscribe" BOOLEAN NOT NULL DEFAULT false,
    "receiveDatingTips" BOOLEAN NOT NULL DEFAULT true,
    "receiveProductUpdates" BOOLEAN NOT NULL DEFAULT true,
    "receiveResearchNews" BOOLEAN NOT NULL DEFAULT true,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sequence" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "opened" TIMESTAMP(3),
    "clicked" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "newsletterId" TEXT NOT NULL,

    CONSTRAINT "Sequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Match_tinderProfileId_order_key" ON "Match"("tinderProfileId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Match_hingeProfileId_order_key" ON "Match"("hingeProfileId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "RawMessages_tinderProfileId_key" ON "RawMessages"("tinderProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "RawUsage_tinderProfileId_key" ON "RawUsage"("tinderProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "TinderProfile_tinderId_key" ON "TinderProfile"("tinderId");

-- CreateIndex
CREATE UNIQUE INDEX "TinderProfile_userId_key" ON "TinderProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HingeProfile_hingeId_key" ON "HingeProfile"("hingeId");

-- CreateIndex
CREATE UNIQUE INDEX "HingeProfile_userId_key" ON "HingeProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomData_tinderProfileId_key" ON "CustomData"("tinderProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomData_hingeProfileId_key" ON "CustomData"("hingeProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomData_userId_key" ON "CustomData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileMeta_tinderProfileId_key" ON "ProfileMeta"("tinderProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileMeta_hingeProfileId_key" ON "ProfileMeta"("hingeProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_emailHash_key" ON "Newsletter"("emailHash");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TinderUsage" ADD CONSTRAINT "TinderUsage_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_hingeProfileId_fkey" FOREIGN KEY ("hingeProfileId") REFERENCES "HingeProfile"("hingeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HingeBlock" ADD CONSTRAINT "HingeBlock_hingeId_fkey" FOREIGN KEY ("hingeId") REFERENCES "HingeProfile"("hingeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_hingeProfileId_fkey" FOREIGN KEY ("hingeProfileId") REFERENCES "HingeProfile"("hingeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMessages" ADD CONSTRAINT "RawMessages_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawUsage" ADD CONSTRAINT "RawUsage_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TinderProfile" ADD CONSTRAINT "TinderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HingeProfile" ADD CONSTRAINT "HingeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HingePrompt" ADD CONSTRAINT "HingePrompt_hingeProfileId_fkey" FOREIGN KEY ("hingeProfileId") REFERENCES "HingeProfile"("hingeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomData" ADD CONSTRAINT "CustomData_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomData" ADD CONSTRAINT "CustomData_hingeProfileId_fkey" FOREIGN KEY ("hingeProfileId") REFERENCES "HingeProfile"("hingeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomData" ADD CONSTRAINT "CustomData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMeta" ADD CONSTRAINT "ProfileMeta_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMeta" ADD CONSTRAINT "ProfileMeta_hingeProfileId_fkey" FOREIGN KEY ("hingeProfileId") REFERENCES "HingeProfile"("hingeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMeta" ADD CONSTRAINT "ProfileMeta_tinderProfileIdByMonth_fkey" FOREIGN KEY ("tinderProfileIdByMonth") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileMeta" ADD CONSTRAINT "ProfileMeta_tinderProfileIdByYear_fkey" FOREIGN KEY ("tinderProfileIdByYear") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_hingeProfileId_fkey" FOREIGN KEY ("hingeProfileId") REFERENCES "HingeProfile"("hingeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_tinderProfileId_fkey" FOREIGN KEY ("tinderProfileId") REFERENCES "TinderProfile"("tinderId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OriginalAnonymizedFile" ADD CONSTRAINT "OriginalAnonymizedFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sequence" ADD CONSTRAINT "Sequence_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "Newsletter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
