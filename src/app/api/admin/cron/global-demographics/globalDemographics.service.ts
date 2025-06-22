import { createSubLogger } from "@/lib/tslog";
import { db } from "@/server/db";
import { Gender } from "@prisma/client";
import { differenceInYears } from "date-fns";

const log = createSubLogger("globalDemographics");

export interface AgeRange {
  label: string;
  min: number;
  max: number;
}

export interface DemographicConfig {
  genders: Gender[];
  interestedInGenders: Gender[];
  ageRanges: AgeRange[];
}

export interface DemographicIteration {
  gender: Gender;
  interestedIn: Gender;
  ageRange: AgeRange;
  demographicId: string;
}

export function getDemographicConfig(
  isSimplifiedMode: boolean,
): DemographicConfig {
  return {
    genders: isSimplifiedMode
      ? [Gender.MALE, Gender.FEMALE]
      : [Gender.MALE, Gender.FEMALE, Gender.OTHER],

    interestedInGenders: isSimplifiedMode
      ? [Gender.MALE, Gender.FEMALE]
      : [Gender.MALE, Gender.FEMALE, Gender.OTHER],

    ageRanges: isSimplifiedMode
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
        ],
  };
}

export async function processDemographics(
  isSimplifiedMode: boolean,
  callback: (params: DemographicIteration) => Promise<void>,
): Promise<void> {
  const config = getDemographicConfig(isSimplifiedMode);

  for (const gender of config.genders) {
    for (const interestedIn of config.interestedInGenders) {
      log.info(
        `Processing demographic: gender=${gender}, interestedIn=${interestedIn}`,
      );
      for (const ageRange of config.ageRanges) {
        const demographicId = `average-${gender}-${interestedIn}-${ageRange.label}`;

        await callback({ gender, interestedIn, ageRange, demographicId });
      }
    }
  }
}

export async function createDemographicProfiles(
  isSimplifiedMode = true,
): Promise<{ success: boolean; message: string; processedCount: number }> {
  let processedCount = 0;

  try {
    log.info("Starting demographic profile generation");

    const today = new Date();

    await processDemographics(
      isSimplifiedMode,
      async ({ gender, interestedIn, ageRange, demographicId }) => {
        log.debug(
          `Processing age range: ${ageRange.label} (${ageRange.min}-${ageRange.max})`,
          demographicId,
          gender,
          interestedIn,
        );

        // Delete existing user if it exists
        log.debug("deleting existing user if it exists", { demographicId });
        try {
          await db.user.delete({
            where: {
              id: demographicId,
            },
          });
          log.info("deleted existing user", { demographicId });
        } catch (error) {
          log.warn("no existing user to delete", { demographicId });
        }

        const minBirthDate = new Date();
        minBirthDate.setFullYear(today.getFullYear() - ageRange.max);

        const maxBirthDate = new Date();
        maxBirthDate.setFullYear(today.getFullYear() - ageRange.min);

        log.debug("counting profiles");
        const profileCount = await db.tinderProfile.count({
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
          return;
        }

        log.info(
          `Found ${profileCount} profiles for demographic: gender=${gender}, interestedIn=${interestedIn}, ageRange=${ageRange.label}`,
        );

        const avgProfileData = await db.tinderProfile
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

        const queryStartTime = performance.now();
        const averagedUsageByDay = await db.tinderUsage.groupBy({
          by: ["dateStamp"],
          where: {
            activeUserInLast14Days: true,
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
            swipesCombined: true,
          },
          _max: {
            appOpens: true,
            matches: true,
            messagesSent: true,
            messagesReceived: true,
            swipeLikes: true,
            swipeSuperLikes: true,
            swipePasses: true,
          },
          _count: {
            dateStampRaw: true,
          },
          orderBy: {
            dateStamp: "asc",
          },
        });
        const queryEndTime = performance.now();
        const queryDurationMs = queryEndTime - queryStartTime;

        log.info(
          `Usage aggregation query took ${queryDurationMs.toFixed(2)}ms`,
          {
            demographic: `${gender}-${interestedIn}`,
            ageRange: ageRange.label,
            averagedUsageByDay: averagedUsageByDay.length,
          },
        );

        // Transform the results to include computed rates
        const processedUsageByDay = averagedUsageByDay.map((day) => {
          const safeRate = (numerator: number, denominator: number) => {
            const num = numerator ?? 0;
            const den = denominator ?? 0;
            return den === 0 ? 0 : num / den;
          };

          return {
            dateStamp: day.dateStamp,
            appOpens: day._avg.appOpens ?? 0,
            matches: day._avg.matches ?? 0,
            messagesSent: day._avg.messagesSent ?? 0,
            messagesReceived: day._avg.messagesReceived ?? 0,
            swipeLikes: day._avg.swipeLikes ?? 0,
            swipeSuperLikes: day._avg.swipeSuperLikes ?? 0,
            swipePasses: day._avg.swipePasses ?? 0,
            swipesCombined: day._avg.swipesCombined ?? 0,
            matchRate: safeRate(
              day._avg.matches ?? 0,
              day._avg.swipeLikes ?? 0,
            ),
            likeRate: safeRate(
              day._avg.swipeLikes ?? 0,
              (day._avg.swipeLikes ?? 0) + (day._avg.swipePasses ?? 0),
            ),
            messagesSentRate: safeRate(
              day._avg.messagesSent ?? 0,
              (day._avg.messagesReceived ?? 0) + (day._avg.messagesSent ?? 0),
            ),
            responseRate: safeRate(
              day._avg.messagesSent ?? 0,
              day._avg.messagesReceived ?? 0,
            ),
            engagementRate: safeRate(
              (day._avg.swipeLikes ?? 0) +
                (day._avg.swipePasses ?? 0) +
                (day._avg.messagesSent ?? 0),
              day._avg.appOpens ?? 0,
            ),
            profileCount: day._count.dateStampRaw,
          };
        });

        log.debug("Processed usage data", {
          totalProcessedDays: processedUsageByDay.length,
          firstDay: processedUsageByDay[0]?.dateStamp,
          lastDay:
            processedUsageByDay[processedUsageByDay.length - 1]?.dateStamp,
          averageProfileCount:
            processedUsageByDay.reduce(
              (acc, day) => acc + day.profileCount,
              0,
            ) / processedUsageByDay.length,
        });

        try {
          const demographicBirthDate = new Date(
            today.getFullYear() - avgProfileData._avg.ageAtUpload,
            today.getMonth(),
            today.getDate(),
          );

          log.info("demographicBirthDate", { demographicBirthDate });

          const transaction = await db.$transaction(
            async (txn) => {
              const tinderProfile = await txn.tinderProfile.create({
                data: {
                  user: {
                    connectOrCreate: {
                      where: {
                        id: demographicId,
                      },
                      create: {
                        id: demographicId,
                      },
                    },
                  },

                  computed: true, // !! IMPORTANT

                  tinderId: demographicId,

                  birthDate: demographicBirthDate,
                  ageAtUpload: avgProfileData._avg.ageAtUpload,
                  ageAtLastUsage: avgProfileData._avg.ageAtLastUsage,
                  createDate: new Date(),
                  activeTime: new Date(),
                  gender: gender,
                  genderStr:
                    gender === Gender.MALE
                      ? "M"
                      : gender === Gender.FEMALE
                        ? "F"
                        : "Other",
                  bio: null,
                  bioOriginal: null,
                  city: null,
                  region: null,

                  ageFilterMin: avgProfileData._avg.ageFilterMin,
                  ageFilterMax: avgProfileData._avg.ageFilterMax,
                  interestedIn: interestedIn,
                  interestedInStr: interestedIn,
                  genderFilter: interestedIn,
                  genderFilterStr:
                    interestedIn === Gender.MALE
                      ? "M"
                      : interestedIn === Gender.FEMALE
                        ? "F"
                        : "Other",

                  swipestatsVersion: "SWIPESTATS_3",

                  firstDayOnApp: averagedUsageByDay[0]!.dateStamp,
                  lastDayOnApp:
                    averagedUsageByDay[averagedUsageByDay.length - 1]!
                      .dateStamp,
                  daysInProfilePeriod: averagedUsageByDay.length,

                  instagramConnected: false,
                  spotifyConnected: false,
                },
              });
              log.info("tinderProfile created", {
                tinderId: tinderProfile.tinderId,
                ageAtUpload: tinderProfile.ageAtUpload,
              });

              const usageCreateMany = await txn.tinderUsage.createMany({
                skipDuplicates: true,
                data: processedUsageByDay.map((day) => ({
                  tinderProfileId: demographicId,
                  appOpens: day.appOpens,
                  matches: day.matches,

                  swipeLikes: day.swipeLikes,
                  swipeSuperLikes: day.swipeSuperLikes,
                  swipePasses: day.swipePasses,
                  swipesCombined: day.swipesCombined,

                  messagesSent: day.messagesSent,
                  messagesReceived: day.messagesReceived,

                  dateStamp: day.dateStamp,
                  dateStampRaw: new Date(day.dateStamp).toISOString(),

                  matchRate: day.matchRate,
                  likeRate: day.likeRate,
                  messagesSentRate: day.messagesSentRate,
                  engagementRate: day.engagementRate,
                  responseRate: day.responseRate,

                  dateIsMissingFromOriginalData: false,
                  activeUser: false,
                  daysSinceLastActive: 0,
                  activeUserInLast7Days: false,
                  activeUserInLast14Days: false,
                  activeUserInLast30Days: false,
                  userAgeThisDay: differenceInYears(
                    day.dateStamp,
                    demographicBirthDate,
                  ),
                })),
              });

              log.info("usages created", {
                usageCount: usageCreateMany.count,
              });

              return {
                tinderProfile,
                usageCreateMany,
              };
            },
            {
              maxWait: 60_000,
              timeout: 60_000,
            },
          );

          log.info(`Successfully processed demographic: ${demographicId}`);
          processedCount++;
        } catch (error) {
          log.error(`Failed to process demographic: ${demographicId}`, {
            error,
          });
          throw error;
        }
      },
    );

    log.info("Finished processing all demographics", { processedCount });

    return {
      success: true,
      message: `Successfully processed ${processedCount} demographics`,
      processedCount,
    };
  } catch (error) {
    log.error("Script failed", { error: error as Error });
    return {
      success: false,
      message: `Failed to process demographics: ${error instanceof Error ? error.message : "Unknown error"}`,
      processedCount,
    };
  }
}
