import { createSubLogger } from "@/lib/tslog";
import { PrismaClient, Gender } from "@prisma/client";

const prisma = new PrismaClient();

const log = createSubLogger("createDemographicProfilesNew");

// Add command line argument parsing
const isSimplifiedMode = true;

async function main() {
  log.info("Starting demographic profile generation");
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

  const today = new Date();

  for (const gender of genders) {
    for (const interestedIn of interestedInGenders) {
      log.info(
        `Processing demographic: gender=${gender}, interestedIn=${interestedIn}`,
      );
      for (const ageRange of ageRanges) {
        log.debug(
          `Processing age range: ${ageRange.label} (${ageRange.min}-${ageRange.max})`,
          gender,
          interestedIn,
        );
        const minBirthDate = new Date();
        minBirthDate.setFullYear(today.getFullYear() - ageRange.max);

        const maxBirthDate = new Date();
        maxBirthDate.setFullYear(today.getFullYear() - ageRange.min);

        const profileCount = await prisma.tinderProfile.count({
          where: {
            gender: gender,
            interestedIn: interestedIn,
            birthDate: {
              gte: minBirthDate,
              lte: maxBirthDate,
            },
          },
        });

        if (profileCount === 0) {
          log.debug(
            `Skipping demographic - no profiles found: gender=${gender}, interestedIn=${interestedIn}, ageRange=${ageRange.label}`,
          );
          continue;
        }

        log.info(
          `Found ${profileCount} profiles for demographic: gender=${gender}, interestedIn=${interestedIn}, ageRange=${ageRange.label}`,
        );

        const avgProfileData = await prisma.tinderProfile
          .aggregate({
            where: {
              gender: gender,
              interestedIn: interestedIn,
              birthDate: {
                gte: minBirthDate,
                lte: maxBirthDate,
              },
            },
            _avg: {
              ageFilterMin: true,
              ageFilterMax: true,
              ageAtUpload: true,
              ageAtLastUsage: true,
            },
          })
          .then((data) => ({
            _avg: {
              ageFilterMin: Math.round(data._avg.ageFilterMin ?? 0),
              ageFilterMax: Math.round(data._avg.ageFilterMax ?? 0),
              ageAtUpload: Math.round(data._avg.ageAtUpload ?? 0),
              ageAtLastUsage: Math.round(data._avg.ageAtLastUsage ?? 0),
            },
          }));

        log.debug("Calculated average profile data", { avgProfileData });

        // Replace the usage aggregation logic with a direct DB query
const averagedUsageByDay = await prisma.tinderUsage.groupBy({
    by: ['dateStampRaw'],
    where: {
      tinderProfile: {
        gender: gender,
        interestedIn: interestedIn,
        birthDate: {
          gte: minBirthDate,
          lte: maxBirthDate,
        }
      }
    },
    _avg: {
      appOpens: true,
      matches: true,
      messagesSent: true,
      messagesReceived: true,
      swipeLikes: true,
      swipeSuperLikes: true,
      swipePasses: true,
      swipesCombined: true,
    },
    _count: {
      dateStampRaw: true, // This gives us the number of profiles for each day
    }
  });
  
  // Transform the results to include computed rates
  const processedUsageByDay = averagedUsageByDay.map(day => ({
    dateStampRaw: day.dateStampRaw,
    appOpens: day._avg.appOpens || 0,
    matches: day._avg.matches || 0,
    messagesSent: day._avg.messagesSent || 0,
    messagesReceived: day._avg.messagesReceived || 0,
    swipeLikes: day._avg.swipeLikes || 0,
    swipeSuperLikes: day._avg.swipeSuperLikes || 0,
    swipePasses: day._avg.swipePasses || 0,
    swipesCombined: day._avg.swipesCombined || 0,
    matchRate: (day._avg.matches || 0) / (day._avg.swipeLikes || 1),
    likeRate: (day._avg.swipeLikes || 0) / ((day._avg.swipeLikes || 0) + (day._avg.swipePasses || 0)),
    messagesSentRate: (day._avg.messagesSent || 0) / ((day._avg.messagesReceived || 0) + (day._avg.messagesSent || 0)),
    responseRate: (day._avg.messagesSent || 0) / (day._avg.messagesReceived || 1),
    engagementRate: ((day._avg.swipeLikes || 0) + (day._avg.swipePasses || 0) + (day._avg.messagesSent || 0)) / (day._avg.appOpens || 1),
    profileCount: day._count.dateStampRaw
  }));
  

        const avgUsageData = await prisma.tinderUsage
          .aggregate({
            where: {
              tinderProfile: {
                gender: gender,
                interestedIn: interestedIn,
                birthDate: {
                  gte: minBirthDate,
                  lte: maxBirthDate,
                },
              },
            },
            _avg: {
              appOpens: true,
              matches: true,
              messagesSent: true,
              messagesReceived: true,
              swipeLikes: true,
              swipeSuperLikes: true,
              swipePasses: true,
            },
            _sum: {
              appOpens: true,
              matches: true,
              messagesSent: true,
              messagesReceived: true,
              swipeLikes: true,
              swipeSuperLikes: true,
              swipePasses: true,
            },
          })
          .then((data) => ({
            _avg: {
              appOpens: Math.round(data._avg.appOpens ?? 0),
              matches: Math.round(data._avg.matches ?? 0),
              messagesSent: Math.round(data._avg.messagesSent ?? 0),
              messagesReceived: Math.round(data._avg.messagesReceived ?? 0),
              swipeLikes: Math.round(data._avg.swipeLikes ?? 0),
              swipeSuperLikes: Math.round(data._avg.swipeSuperLikes ?? 0),
              swipePasses: Math.round(data._avg.swipePasses ?? 0),
            },
            _sum: data._sum, // Keep the sums as they are since they're used for totals
          }));

        log.debug("Calculated average usage data", { avgUsageData });

        const demographicId = `average-${gender}-${interestedIn}-${ageRange.label}`;

        try {
          // await prisma.tinderProfile.upsert({
          //   where: {
          //     tinderId: demographicId,
          //   },
          //   update: {
          //     // Update existing fields if necessary
          //   },
          //   create: {
          //     tinderId: demographicId,
          //     computed: true,
          //     gender: gender,
          //     genderStr: gender,
          //     interestedIn: interestedIn,
          //     interestedInStr: interestedIn,
          //     ageFilterMin: avgProfileData._avg.ageFilterMin!,
          //     ageFilterMax: avgProfileData._avg.ageFilterMax!,
          //     ageAtUpload: Math.round(avgProfileData._avg.ageAtUpload!),
          //     ageAtLastUsage: Math.round(avgProfileData._avg.ageAtLastUsage!),
          //     swipestatsVersion: "SWIPESTATS_3",
          //     userId: demographicId, // Assuming unique userId per demographic profile
          //     createDate: new Date(),
          //     birthDate: new Date(
          //       // Taking the average of the min and max ages in the range
          //       // Subtracting that from the current year to get an appropriate birth year
          //       // Keeping the current month and day for simplicity

          //       today.getFullYear() -
          //         Math.round((ageRange.min + ageRange.max) / 2),
          //       today.getMonth(),
          //       today.getDate(),
          //     ),
          //     daysInProfilePeriod: 365, // bad
          //     firstDayOnApp: new Date(
          //       today.getFullYear() - 1,
          //       today.getMonth(),
          //       today.getDate(),
          //     ), // bad
          //     genderFilter: interestedIn,
          //     genderFilterStr:
          //       interestedIn === Gender.MALE
          //         ? "F"
          //         : interestedIn === Gender.FEMALE
          //           ? "M"
          //           : "Other",
          //     instagramConnected: false,
          //     spotifyConnected: false,
          //     lastDayOnApp: new Date(), // bad
          //   },
          // });
          log.info(
            `Would create/update tinder profile for demographic: ${demographicId}`,
            {
              tinderId: demographicId,
              computed: true,
              gender,
              interestedIn,
              ageFilterMin: avgProfileData._avg.ageFilterMin,
              ageFilterMax: avgProfileData._avg.ageFilterMax,
              // ... add other fields you want to inspect
            },
          );

          const combinedSwipesTotal = Math.round(
            (avgUsageData._sum.swipeLikes ?? 0) +
              (avgUsageData._sum.swipePasses ?? 0),
          );
          const noMatchesTotal = Math.round(
            (avgUsageData._sum.swipeLikes ?? 0) -
              (avgUsageData._sum.matches ?? 0),
          );
          const matchRate = avgUsageData._sum.swipeLikes
            ? (avgUsageData._sum.matches ?? 0) / avgUsageData._sum.swipeLikes
            : 0;
          const likeRate = combinedSwipesTotal
            ? (avgUsageData._sum.swipeLikes ?? 0) / combinedSwipesTotal
            : 0;
          const messagesSentRate =
            (avgUsageData._sum.messagesSent ?? 0) +
              (avgUsageData._sum.messagesReceived ?? 0) >
            0
              ? (avgUsageData._sum.messagesSent ?? 0) /
                ((avgUsageData._sum.messagesSent ?? 0) +
                  (avgUsageData._sum.messagesReceived ?? 0))
              : 0;

          const daysInProfilePeriod = Math.round(
            (maxBirthDate.getTime() - minBirthDate.getTime()) /
              (1000 * 60 * 60 * 24),
          );

          const sharedFields = {
            from: minBirthDate,
            to: maxBirthDate,
            daysInProfilePeriod,
            appOpensTotal: Math.round(avgUsageData._sum.appOpens ?? 0),
            swipeLikesTotal: Math.round(avgUsageData._sum.swipeLikes ?? 0),
            swipeSuperLikesTotal: Math.round(
              avgUsageData._sum.swipeSuperLikes ?? 0,
            ),
            swipePassesTotal: Math.round(avgUsageData._sum.swipePasses ?? 0),
            messagesSentTotal: Math.round(avgUsageData._sum.messagesSent ?? 0),
            messagesReceivedTotal: Math.round(
              avgUsageData._sum.messagesReceived ?? 0,
            ),
            matchesTotal: Math.round(avgUsageData._sum.matches ?? 0),

            // New computed fields
            combinedSwipesTotal,
            noMatchesTotal,
            matchRateForPeriod: matchRate,
            likeRateForPeriod: likeRate,
            messagesSentRateForPeriod: messagesSentRate,

            // Averages per day
            averageMatchesPerDay: Math.round(
              (avgUsageData._sum.matches ?? 0) / daysInProfilePeriod,
            ),
            averageAppOpensPerDay: Math.round(
              (avgUsageData._sum.appOpens ?? 0) / daysInProfilePeriod,
            ),
            averageSwipeLikesPerDay: Math.round(
              (avgUsageData._sum.swipeLikes ?? 0) / daysInProfilePeriod,
            ),
            averageSwipePassesPerDay: Math.round(
              (avgUsageData._sum.swipePasses ?? 0) / daysInProfilePeriod,
            ),
            averageMessagesSentPerDay: Math.round(
              (avgUsageData._sum.messagesSent ?? 0) / daysInProfilePeriod,
            ),
            averageMessagesReceivedPerDay: Math.round(
              (avgUsageData._sum.messagesReceived ?? 0) / daysInProfilePeriod,
            ),
            averageSwipesPerDay: Math.round(
              combinedSwipesTotal / daysInProfilePeriod,
            ),
          };

          // await prisma.profileMeta.upsert({
          //   where: {
          //     tinderProfileId: demographicId,
          //   },
          //   update: sharedFields,
          //   create: {
          //     tinderProfileId: demographicId,
          //     ...sharedFields,
          //   },
          // });
          log.info(
            `Would create/update profile meta for demographic: ${demographicId}`,
            {
              ...sharedFields,
            },
          );

          log.info(`Successfully processed demographic: ${demographicId}`);
        } catch (error) {
          log.error(`Failed to process demographic: ${demographicId}`, {
            error,
          });
          throw error;
        }
      }
    }
  }

  log.info("Finished processing all demographics");
  await prisma.$disconnect();
}

main()
  .then(() => {
    log.info("Script completed successfully");
  })
  .catch(async (e) => {
    log.error("Script failed", { error: e as Error });
    await prisma.$disconnect();
    process.exit(1);
  });
