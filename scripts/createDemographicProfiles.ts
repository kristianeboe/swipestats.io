// import { getAgeFromBirthdate } from "@/lib/utils";
// import { computeUsageInput } from "@/server/api/services/profile.service";
// import { Gender, PrismaClient } from "@prisma/client";
// import { number } from "zod";
// const prisma = new PrismaClient();

// function generatePrismaWhere() {
//   const ids = [];
//   const genders = [Gender.Male, Gender.Female, Gender.Other];
//   const interestedIn = [Gender.Male, Gender.Female, Gender.Other];

//   const ages = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
//   const birthYearRanges = [
//     "1960-1969",
//     "1970-1979",
//     "1980-1989",
//     "1990-1999",
//     "2000-2009",
//     "2010-2019",
//   ];

//   for (const gender of genders) {
//     for (const age of ages) {
//       ids.push(`${gender}-${age}`);
//     }
//   }
// }

// async function main() {
//   // TODO create one for each age, or actually birth years

//   const hetroMalePrismaWhere = {
//     gender: Gender.Male,
//     interestedIn: Gender.Female,
//   };

//   const allHeteroMales = await prisma.tinderProfile.findMany({
//     where: hetroMalePrismaWhere,
//   });

//   // lets start simple, the average male

//   const totals = allHeteroMales.reduce(
//     (acc, m) => {
//       return {
//         birthDate: acc.birthDate + m.birthDate.getTime(),
//         createDate: acc.createDate + m.createDate.getTime(),
//         ageFilterMin: acc.ageFilterMin + m.ageFilterMin,
//         ageFilterMax: acc.ageFilterMax + m.ageFilterMax,

//         appOpensTotal: acc.appOpensTotal + m.appOpensTotal,
//         matchesTotal: acc.matchesTotal + m.matchesTotal,
//         messagesSentTotal: acc.messagesSentTotal + m.messagesSentTotal,
//         messagesReceivedTotal:
//           acc.messagesReceivedTotal + m.messagesReceivedTotal,
//         swipeSuperLikesTotal: acc.swipeSuperLikesTotal + m.swipeSuperLikesTotal,
//         swipeLikesTotal: acc.swipeLikesTotal + m.swipeLikesTotal,
//         swipePassesTotal: acc.swipePassesTotal + m.swipePassesTotal,

//         daysOnApp: acc.daysOnApp + m.daysOnApp,
//         firstDayOnApp: acc.firstDayOnApp + m.firstDayOnApp.getTime(),
//         lastDayOnApp: acc.lastDayOnApp + m.lastDayOnApp.getTime(),
//       };
//     },
//     {
//       //? could initialize them to empty arrays, that would make it easier to score median later
//       birthDate: 0,
//       createDate: 0,
//       ageFilterMin: 0,
//       ageFilterMax: 0,
//       appOpensTotal: 0,
//       matchesTotal: 0,
//       messagesSentTotal: 0,
//       messagesReceivedTotal: 0,
//       swipeSuperLikesTotal: 0,
//       swipeLikesTotal: 0,
//       swipePassesTotal: 0,

//       daysOnApp: 0,
//       firstDayOnApp: 0,
//       lastDayOnApp: 0,
//     },
//   );

//   const averageBirthDate = new Date(
//     Math.floor(totals.birthDate / allHeteroMales.length),
//   );
//   const averageCreateDate = new Date(
//     Math.floor(totals.createDate / allHeteroMales.length),
//   );
//   const firstDayOnApp = new Date(
//     Math.floor(totals.firstDayOnApp / allHeteroMales.length),
//   );
//   const lastDayOnApp = new Date(
//     Math.floor(totals.lastDayOnApp / allHeteroMales.length),
//   );

//   const allUsage2 = await prisma.tinderUsage.findMany({
//     where: {
//       tinderProfile: hetroMalePrismaWhere,
//     },
//     orderBy: {
//       dateStamp: "asc",
//     },
//   });

//   const allUsageByDate = allUsage2.reduce(
//     (acc, cur) => {
//       const date = cur.dateStampRaw;
//       if (!acc[date]) {
//         acc[date] = {
//           matches: cur.matches,
//           swipes_likes: cur.swipeLikes,
//           superlikes: cur.swipeSuperLikes,
//           swipes_passes: cur.swipePasses,
//           messages_sent: cur.messagesSent,
//           messages_received: cur.messagesReceived,
//         };
//       } else {
//         acc[date]!.matches += cur.matches;
//         acc[date]!.swipes_likes += cur.swipeLikes;
//         acc[date]!.superlikes += cur.swipeSuperLikes;
//         acc[date]!.swipes_passes += cur.swipePasses;
//         acc[date]!.messages_sent += cur.messagesSent;
//         acc[date]!.messages_received += cur.messagesReceived;
//       }

//       return acc;
//     },
//     {} as Record<
//       string,
//       {
//         matches: number;
//         swipes_likes: number;
//         superlikes: number;
//         swipes_passes: number;
//         messages_sent: number;
//         messages_received: number;
//       }
//     >,
//   );

//   const averageHeteroMale = await prisma.tinderProfile.create({
//     data: {
//       tinderId: "averageMale",
//       birthDate: averageBirthDate,
//       ageAtUpload: getAgeFromBirthdate(averageBirthDate),
//       ageAtLastUsage: getAgeFromBirthdate(lastDayOnApp),
//       createDate: averageCreateDate,
//       gender: "Male",
//       genderStr: "M",
//       instagramConnected: false, // Todo find out if the average male has instagram connected
//       spotifyConnected: false, // same

//       ageFilterMin: Math.floor(totals.ageFilterMin / allHeteroMales.length),
//       ageFilterMax: Math.floor(totals.ageFilterMax / allHeteroMales.length),

//       interestedIn: "Female",
//       interestedInStr: "F",
//       genderFilter: "Female",
//       genderFilterStr: "F",
//       swipestatsVersion: "SWIPESTATS_3",

//       appOpensTotal: Math.floor(totals.appOpensTotal / allHeteroMales.length),
//       matchesTotal: Math.floor(totals.matchesTotal / allHeteroMales.length),
//       messagesSentTotal: Math.floor(
//         totals.messagesSentTotal / allHeteroMales.length,
//       ),
//       messagesReceivedTotal: Math.floor(
//         totals.messagesReceivedTotal / allHeteroMales.length,
//       ),
//       swipeSuperLikesTotal: Math.floor(
//         totals.swipeSuperLikesTotal / allHeteroMales.length,
//       ),
//       swipeLikesTotal: Math.floor(
//         totals.swipeLikesTotal / allHeteroMales.length,
//       ),
//       swipePassesTotal: Math.floor(
//         totals.swipePassesTotal / allHeteroMales.length,
//       ),

//       firstDayOnApp,
//       lastDayOnApp,
//       daysOnApp: Math.floor(totals.daysOnApp / allHeteroMales.length),

//       userId: "averageMale", // will this crash? might have to create user first
//       computed: true,
//       usage: {
//         createMany: {
//           skipDuplicates: true,
//           data: allUsage2.map((usage) => {
//             return computeUsageInput(
//               {
//                 appOpensCount:
//                   allUsageByDate[usage.dateStampRaw]!.matches /
//                   allHeteroMales.length,
//                 matchesCount:
//                   allUsageByDate[usage.dateStampRaw]!.matches /
//                   allHeteroMales.length,
//                 swipeLikesCount:
//                   allUsageByDate[usage.dateStampRaw]!.swipes_likes /
//                   allHeteroMales.length,
//                 swipeSuperLikesCount:
//                   allUsageByDate[usage.dateStampRaw]!.superlikes /
//                   allHeteroMales.length,
//                 swipePassesCount:
//                   allUsageByDate[usage.dateStampRaw]!.swipes_passes /
//                   allHeteroMales.length,
//                 messagesSentCount:
//                   allUsageByDate[usage.dateStampRaw]!.messages_sent /
//                   allHeteroMales.length,
//                 messagesReceivedCount:
//                   allUsageByDate[usage.dateStampRaw]!.messages_received /
//                   allHeteroMales.length,
//               },
//               usage.dateStampRaw,
//               "averageMale",
//             );
//           }),
//         },
//       },
//     },
//   });
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

// function getAverageDate(birthDates: Date[]) {
//   const averageBirthDate = new Date(
//     birthDates.reduce((acc, date) => acc + date.getTime(), 0) /
//       birthDates.length,
//   );
//   return averageBirthDate;
// }

// function getAverage(arr: number[]) {
//   return arr.reduce((acc, val) => acc + val, 0) / arr.length;
// }
// function getMedian(arr: number[]) {
//   const sorted = arr.slice().sort();
//   const mid = Math.floor(sorted.length / 2);
//   return sorted.length % 2 !== 0
//     ? sorted[mid]
//     : (sorted[mid - 1]! + sorted[mid]!) / 2;
// }

// type SwipeStatsChartData = {
//   dateStampRaw: string;
//   matches?: number;
//   appOpens?: number;
//   swipeLikes?: number;
//   superLikes?: number;
//   swipePasses?: number;
//   messagesReceived?: number;
//   messagesSent?: number;
//   value?: number;
// }[];

// function createTotalsCountDict(list: SwipeStatsChartData) {
//   return list.reduce(
//     (acc, item) => {
//       const dayCount = (item.appOpens ?? item.matches ?? item.swipeLikes)!;
//       if (!acc.counts[item.dateStampRaw]) {
//         acc.totals[item.dateStampRaw] = dayCount;
//         acc.counts[item.dateStampRaw] = 1;
//       } else {
//         acc.totals[item.dateStampRaw] += dayCount;
//         acc.counts[item.dateStampRaw] += 1;
//       }

//       return acc;
//     },
//     {} as {
//       totals: Record<string, number>;
//       counts: Record<string, number>;
//     },
//   );
// }
