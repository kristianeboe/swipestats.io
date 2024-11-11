import { PrismaClient } from "@prisma/client";
import { PrismaClient as SourceClient } from "../ssMigrations/prisma//generated/sourceClient";
import {
  createTinderProfileTxnInput,
  prismaCreateTinderProfileTxn,
} from "@/server/api/services/profile.service";
import { type AnonymizedTinderDataJSON } from "@/lib/interfaces/TinderDataJSON";
import { createSwipestatsProfilePayloadFromJson } from "@/app/upload/[providerId]/extractAnonymizedData";
import { createSubLogger } from "@/lib/tslog";

const sourcePrisma = new SourceClient();
const targetPrisma = new PrismaClient();

const log = createSubLogger("migrateV2toV3");

const counts = {
  skippedProfiles: 0,
  genderM: 0,
  genderF: 0,
  genderUnknown: 0,
  genderOther: 0,
  errors: 0,
  profilesWithNoUsage: 0,
  profilesParsedSuccessfully: 0,
};

const errorIds = new Set<string>();

const errors = {} as Record<string, number>;

async function main() {
  let i = 0;
  const BATCH_SIZE = 10;
  let skip = 0;
  const take = 200;

  const totalFileCount = await sourcePrisma.originalAnonymizedFile.count();
  log.info("Total Old File Count", totalFileCount);

  const newProfiles = await targetPrisma.tinderProfile.findMany();
  const newProfileIds = new Set(newProfiles.map((p) => p.tinderId));
  log.info("New Profile Count", newProfiles.length);

  while (true) {
    const oldOriginalFiles = await sourcePrisma.originalAnonymizedFile.findMany(
      {
        skip: skip,
        take: take,
      },
    );

    if (oldOriginalFiles.length === 0) break;

    for (let j = 0; j < oldOriginalFiles.length; j += BATCH_SIZE) {
      const batch = oldOriginalFiles.slice(j, j + BATCH_SIZE);

      await Promise.all(
        batch.map(async (ogFile) => {
          const tinderJson = ogFile.file as unknown as AnonymizedTinderDataJSON;
          const ssPayload = await createSwipestatsProfilePayloadFromJson(
            JSON.stringify(tinderJson),
            "TINDER",
          );

          if (newProfileIds.has(ssPayload.tinderId)) {
            counts.skippedProfiles++;
            return;
          }

          if (
            Object.keys(ssPayload.anonymizedTinderJson.Usage.app_opens)
              .length === 0
          ) {
            // we don't want to create profiles with missing data, they should never have been let in
            counts.profilesWithNoUsage++;
            return;
          }

          try {
            const startTime = performance.now();
            const ssProfile = await prismaCreateTinderProfileTxn({
              tinderId: ssPayload.tinderId,
              user: { userId: ssPayload.tinderId },
              tinderJson: ssPayload.anonymizedTinderJson,
              swipestatsVersion: "SWIPESTATS_2",
            });
            const endTime = performance.now();
            const durationInSeconds = ((endTime - startTime) / 1000).toFixed(2);

            counts.profilesParsedSuccessfully++;
            log.info("Parsed successfully", {
              count: `${i++}/${totalFileCount}`,
              tinderId: ssPayload.tinderId,
              duration: `${durationInSeconds}s`,
              user: `${ssProfile.gender}, ${ssProfile.ageAtUpload}, ${ssProfile.city}, ${ssProfile.region}`,
              skippedProfileCount: counts.skippedProfiles,
              profilesWithNoUsage: counts.profilesWithNoUsage,
            });

            if (ssProfile.gender === "MALE") counts.genderM++;
            else if (ssProfile.gender === "FEMALE") counts.genderF++;
            else if (ssProfile.gender === "UNKNOWN") counts.genderUnknown++;
            else counts.genderOther++;
          } catch (error) {
            log.error("Error", error);
            errorIds.add(ssPayload.tinderId);
            log.info("file user", tinderJson.User);
            if (error instanceof Error) {
              errors[error.message] = (errors[error.message] ?? 0) + 1;
            }
            counts.errors++;
          }
        }),
      );
    }
    skip += take;
  }

  log.error("Errors", errors);
  log.info("Counts", counts);
}

main()
  .then(async () => {
    await sourcePrisma.$disconnect();
    await targetPrisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await sourcePrisma.$disconnect();
    await targetPrisma.$disconnect();
    process.exit(1);
  });
