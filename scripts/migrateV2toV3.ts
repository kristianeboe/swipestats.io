// import { PrismaClient } from "@prisma/client";
// import { PrismaClient as SourceClient } from "../ssMigrations/prisma//generated/sourceClient";
// import {
//   createTinderProfileTxnInput,
//   prismaCreateTinderProfileTxn,
// } from "@/server/api/services/profile.service";
// import { AnonymizedTinderDataJSON } from "@/lib/interfaces/TinderDataJSON";
// import { createSwipestatsProfilePayloadFromJson } from "@/app/upload/[providerId]/extractAnonymizedData";
// import { createSubLogger } from "@/lib/tslog";

// const sourcePrisma = new SourceClient();
// const targetPrisma = new PrismaClient();

// const log = createSubLogger("migrateV2toV3");

// const counts = {
//   skippedProfiles: 0,
//   genderM: 0,
//   genderF: 0,
//   genderUnknown: 0,
//   genderOther: 0,
//   errors: 0,
// };

// const errors = {} as Record<string, number>;

// async function main() {
//   // const oldWaitlist = await sourcePrisma.waitlist.findMany();
//   // const newWaitlist = await targetPrisma.waitlist.findMany();

//   // console.log("Old Waitlist", oldWaitlist.length);
//   // console.log("New Waitlist", newWaitlist.length);

//   let i = 0;
//   let skip = i;
//   const take = 200;

//   const totalFileCount = await sourcePrisma.originalAnonymizedFile.count();

//   const newProfiles = await targetPrisma.tinderProfile.findMany();
//   const newProfileIds = new Set(newProfiles.map((p) => p.tinderId));

//   while (true) {
//     const oldOriginalFiles = await sourcePrisma.originalAnonymizedFile.findMany(
//       {
//         skip: skip,
//         take: take,
//       },
//     );

//     if (oldOriginalFiles.length === 0) {
//       break;
//     }

//     log.info("Old Original Files", oldOriginalFiles.length);
//     for (const ogFile of oldOriginalFiles) {
//       const tinderJson = ogFile.file as unknown as AnonymizedTinderDataJSON;

//       const ssPayload = await createSwipestatsProfilePayloadFromJson(
//         JSON.stringify(tinderJson),
//         "TINDER",
//       );
//       if (newProfileIds.has(ssPayload.tinderId)) {
//         counts.skippedProfiles++;
//         continue;
//       }

//       try {
//         await prismaCreateTinderProfileTxn({
//           tinderId: ssPayload.tinderId,
//           user: {
//             userId: ssPayload.tinderId,
//           },
//           tinderJson: ssPayload.anonymizedTinderJson,
//           swipestatsVersion: "SWIPESTATS_2",
//         });

//         log.info("New Input", {
//           tinderId: ssPayload.tinderId,
//           count: i,
//           total: totalFileCount,
//           user: {
//             gender: tinderJson.User.gender,
//             jobTitle: tinderJson.User.jobs?.[0]?.title?.name,
//             jobTitleDisplayed: tinderJson.User.jobs?.[0]?.title?.displayed,
//             company: tinderJson.User.jobs?.[0]?.company?.name,
//             companyDisplayed: tinderJson.User.jobs?.[0]?.company?.displayed,
//             school: tinderJson.User.schools?.[0]?.name,
//           },
//         });
//       } catch (error) {
//         log.error("Error", error);
//         log.info("file user", tinderJson.User);
//         if (error.message) {
//           errors[error.message] = errors[error.message]
//             ? errors[error.message] + 1
//             : 1;
//         }
//         counts.errors++;
//       }
//       i++;
//     }
//     skip += take;
//   }

//   log.error("Errors", errors);
//   log.info("Counts", counts);
// }

// main()
//   .then(async () => {
//     await sourcePrisma.$disconnect();
//     await targetPrisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await sourcePrisma.$disconnect();
//     await targetPrisma.$disconnect();
//     process.exit(1);
//   });
