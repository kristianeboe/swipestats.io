import { Usage } from "@/lib/interfaces/TinderDataJSON";
import { type DateString, DateValueMap } from "@/lib/interfaces/utilInterfaces";
import { createSubLogger } from "@/lib/tslog";
import { PrismaClient, Gender, type TinderUsage } from "@prisma/client";

const prisma = new PrismaClient();
const log = createSubLogger("createAverageDemographicProfiles");

const isSimplifiedMode = true;

async function main() {
  log.info("Starting average demographic profile generation");
  const genders = isSimplifiedMode
    ? [Gender.MALE, Gender.FEMALE]
    : [Gender.MALE, Gender.FEMALE, Gender.OTHER];

  const interestedInGenders = isSimplifiedMode
    ? [Gender.MALE, Gender.FEMALE]
    : [Gender.MALE, Gender.FEMALE, Gender.OTHER];

  const ageRanges = isSimplifiedMode
    ? [{ label: "all", min: 18, max: 100 }]
    : [
        { label: "all", min: 18, max: 100 },
        { label: "18-20", min: 18, max: 20 },
        { label: "18-24", min: 18, max: 24 },
        { label: "20-25", min: 20, max: 25 },
        { label: "25-34", min: 25, max: 34 },
        { label: "35-44", min: 35, max: 44 },
        { label: "45-54", min: 45, max: 54 },
        { label: "55-64", min: 55, max: 64 },
        { label: "65+", min: 65, max: 100 },
      ];

  // Your main logic will go here

  const today = new Date();
  for (const gender of genders) {
    for (const interestedIn of interestedInGenders) {
      log.info(
        `Processing demographic: gender=${gender}, interestedIn=${interestedIn}`,
      );
      for (const ageRange of ageRanges) {
        const minBirthDate = new Date();
        minBirthDate.setFullYear(today.getFullYear() - ageRange.max);
        const maxBirthDate = new Date();
        maxBirthDate.setFullYear(today.getFullYear() - ageRange.min);

        // Get all profiles that match our criteria
        const profiles = await prisma.tinderProfile.findMany({
          where: {
            gender: gender,
            interestedIn: interestedIn,
            birthDate: {
              gte: minBirthDate,
              lte: maxBirthDate,
            },
          },
          include: {
            usage: true,
            profileMeta: true,
          },
        });

        if (profiles.length === 0) {
          log.debug(
            `Skipping demographic - no profiles found: gender=${gender}, interestedIn=${interestedIn}, ageRange=${ageRange.label}`,
          );
          continue;
        }

        // Initialize aggregators
        const aggregatedProfile = {
          ageFilterMin: 0,
          ageFilterMax: 0,
          ageAtUpload: 0,
          ageAtLastUsage: 0,
          // ... other profile fields to average
        };

  

        const averagedUsage: Record<DateString, TinderUsage[]> = {};

        // Iterate through each profile and their daily usage
        for (const profile of profiles) {
          // Aggregate profile data
          aggregatedProfile.ageFilterMin += profile.ageFilterMin;
          aggregatedProfile.ageFilterMax += profile.ageFilterMax;
          aggregatedProfile.ageAtUpload += profile.ageAtUpload;
          aggregatedProfile.ageAtLastUsage += profile.ageAtLastUsage;

          for (const usage of profile.usage) {
            const existingDataForDay = averagedUsage[usage.dateStampRaw];
            if (existingDataForDay) {
              existingDataForDay.appOpens += usage.appOpens;
              existingDataForDay.matches += usage.matches;
              existingDataForDay.messagesSent += usage.messagesSent;
              existingDataForDay.messagesReceived += usage.messagesReceived;
              existingDataForDay.swipeLikes += usage.swipeLikes;
              existingDataForDay.swipeSuperLikes += usage.swipeSuperLikes;
              existingDataForDay.swipePasses += usage.swipePasses;
              existingDataForDay.swipesCombined += usage.swipesCombined;

              // Update computed rates
              existingDataForDay.matchRate =
                existingDataForDay.matches / existingDataForDay.swipeLikes;
              existingDataForDay.likeRate =
                existingDataForDay.swipeLikes /
                (existingDataForDay.swipeLikes +
                  existingDataForDay.swipePasses);
              existingDataForDay.messagesSentRate =
                existingDataForDay.messagesSent /
                (existingDataForDay.messagesReceived +
                  existingDataForDay.messagesSent);
              existingDataForDay.responseRate =
                existingDataForDay.messagesSent /
                existingDataForDay.messagesReceived;
              existingDataForDay.engagementRate =
                (existingDataForDay.swipeLikes +
                  existingDataForDay.swipePasses +
                  existingDataForDay.messagesSent) /
                existingDataForDay.appOpens;
            } else {
              averagedUsage[usage.dateStampRaw] = usage;
            }
          }
        }

        // Calculate averages
        const averageAgeFilterMin =
          aggregatedProfile.ageFilterMin / profiles.length;
        const averageAgeFilterMax =
          aggregatedProfile.ageFilterMax / profiles.length;
        const averageAgeAtUpload =
          aggregatedProfile.ageAtUpload / profiles.length;
        const averageAgeAtLastUsage =
          aggregatedProfile.ageAtLastUsage / profiles.length;
        const averageTotalDays = aggregatedUsage.totalDays / profiles.length;
        const averageAppOpens = aggregatedUsage.appOpens / profiles.length;
        const averageMatches = aggregatedUsage.matches / profiles.length;
        const averageMessagesSent =
          aggregatedUsage.messagesSent / profiles.length;
        const averageMessagesReceived =
          aggregatedUsage.messagesReceived / profiles.length;
        const averageSwipeLikes = aggregatedUsage.swipeLikes / profiles.length;

        // Log the results
        log.info(
          `Average demographic: gender=${gender}, interestedIn=${interestedIn}, ageRange=${ageRange.label}`,
        );
        log.info(`Average ageFilterMin: ${averageAgeFilterMin}`);
        log.info(`Average ageFilterMax: ${averageAgeFilterMax}`);
        log.info(`Average ageAtUpload: ${averageAgeAtUpload}`);
        log.info(`Average ageAtLastUsage: ${averageAgeAtLastUsage}`);
        log.info(`Average totalDays: ${averageTotalDays}`);
        log.info(`Average appOpens: ${averageAppOpens}`);
        log.info(`Average matches: ${averageMatches}`);
        log.info(`Average messagesSent: ${averageMessagesSent}`);
        log.info(`Average messagesReceived: ${averageMessagesReceived}`);
        log.info(`Average swipeLikes: ${averageSwipeLikes}`);

        const demographicId = `average-${gender}-${interestedIn}-${ageRange.label}`;
      }
    }
  }

  log.info("Finished processing all demographics");
}

main()
  .then(async () => {
    log.info("Script completed successfully");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    log.error("Script failed", { error: e as Error });
    await prisma.$disconnect();
    process.exit(1);
  });
