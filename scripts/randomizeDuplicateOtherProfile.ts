// import { getAgeFromBirthdate } from "@/lib/utils";
// import { computeUsageInput } from "@/server/api/services/profile.service";
// import { PrismaClient } from "@prisma/client";
// import { nanoid } from "nanoid";
// import { random } from "radash";

// const prisma = new PrismaClient();

// async function main() {
//   const profileToDuplicate = await prisma.tinderProfile.findUniqueOrThrow({
//     where: {
//       tinderId: "",
//     },
//     include: {
//       usage: true,
//     },
//   });
//   const tinderId = nanoid();

//   const duplicateProfile = await prisma.tinderProfile.create({
//     data: {
//       tinderId,
//       birthDate: profileToDuplicate.birthDate,
//       ageAtUpload: getAgeFromBirthdate(profileToDuplicate.birthDate),
//       ageAtLastUsage: getAgeFromBirthdate(profileToDuplicate.lastDayOnApp),
//       createDate: profileToDuplicate.createDate,
//       gender: profileToDuplicate.gender,
//       genderStr: profileToDuplicate.genderStr,
//       instagramConnected: profileToDuplicate.instagramConnected,
//       spotifyConnected: profileToDuplicate.spotifyConnected,

//       ageFilterMin: profileToDuplicate.ageFilterMin,
//       ageFilterMax: profileToDuplicate.ageFilterMax,

//       interestedIn: profileToDuplicate.interestedIn,
//       interestedInStr: profileToDuplicate.interestedInStr,
//       genderFilter: profileToDuplicate.genderFilter,
//       genderFilterStr: profileToDuplicate.genderFilterStr,
//       swipestatsVersion: profileToDuplicate.swipestatsVersion,

//       appOpensTotal: profileToDuplicate.appOpensTotal,
//       matchesTotal: profileToDuplicate.matchesTotal,
//       messagesSentTotal: profileToDuplicate.messagesSentTotal,
//       messagesReceivedTotal: profileToDuplicate.messagesReceivedTotal,
//       swipeSuperLikesTotal: profileToDuplicate.swipeSuperLikesTotal,
//       swipeLikesTotal: profileToDuplicate.swipeLikesTotal,
//       swipePassesTotal: profileToDuplicate.swipePassesTotal,

//       firstDayOnApp: profileToDuplicate.firstDayOnApp,
//       lastDayOnApp: profileToDuplicate.lastDayOnApp,
//       daysOnApp: profileToDuplicate.daysOnApp,

//       userId: nanoid(), // TODO BIG FIXME
//       computed: true,
//       usage: {
//         createMany: {
//           skipDuplicates: true,
//           data: profileToDuplicate.usage.map((usage) => {
//             return computeUsageInput(
//               {
//                 appOpensCount: generateData(usage.appOpens),
//                 matchesCount: generateData(usage.matches),
//                 swipeLikesCount: generateData(usage.swipeLikes),
//                 swipeSuperLikesCount: generateData(usage.swipeSuperLikes),
//                 swipePassesCount: generateData(usage.swipePasses),
//                 messagesSentCount: generateData(usage.messagesSent),
//                 messagesReceivedCount: generateData(usage.messagesReceived),
//               },
//               usage.dateStampRaw,
//               tinderId,
//             );
//           }),
//         },
//       },
//     },
//   });
// }

// function generateData(base: number) {
//   return base
//     ? // if base is not 0, return a random number between 1 and base
//       random(1, base)
//     : // if base is 0, lean towards returning 0, but allow for some random 1-10
//       Math.random() > 0.7
//       ? random(0, 10)
//       : 0;
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
