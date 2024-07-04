// import { PrismaClient } from "@prisma/client";
// import { PrismaClient as SourceClient } from "../ssMigrations/prisma//generated/sourceClient";
// import {
//   createTinderProfileTxnInput,
//   prismaCreateTinderProfileTxn,
// } from "@/server/api/services/profile.service";
// import { AnonymizedTinderDataJSON } from "@/lib/interfaces/TinderDataJSON";
// import {
//   createSwipestatsProfilePayloadFromJson,
//   isValidTinderJson,
// } from "@/app/upload/[providerId]/extractAnonymizedData";
// import { createSubLogger } from "@/lib/tslog";
// import { DateValueMap } from "@/lib/interfaces/utilInterfaces";
// import { readFileSync } from "fs";

// const idsSoFar = new Set();
// const duplicates: string[] = [];
// const invalid: [] = [];

// const targetPrisma = new PrismaClient();

// const log = createSubLogger("migrateV1toV3");

// const counts = {
//   skippedProfiles: 0,
//   genderM: 0,
//   genderF: 0,
//   genderUnknown: 0,
//   genderOther: 0,
//   errors: 0,
//   invalidProfiles: 0,
//   invalidTinderJson: 0,
//   profilesTotal: 0,
//   profilesParsedSuccessfully: 0,
// };

// const errors = {} as Record<string, number>;

// function validProfile(p: OLD_MONGO_Profile) {
//   if (!Object.keys(p.appOpens).length) {
//     return false;
//   }

//   return true;
// }

// const files = ["female.json", "19_odd.json", "19_even.json", "20_all.json"];

// let cumulativeTotal = 0;

// async function main() {
//   let i = 0;
//   try {
//     for (const file of files) {
//       const mongoProfiles = await loadFile(
//         `./scripts/old_swipestats_profiles/${file}`,
//       );
//       cumulativeTotal += mongoProfiles.length;

//       for (const profile of mongoProfiles) {
//         counts.profilesTotal++;
//         try {
//           if (!validProfile(profile)) {
//             counts.invalidProfiles++;
//             continue;
//           }
//           const tinderJson = mapMongoProfileToOriginalTinderJson(profile); // as unknown as AnonymizedTinderDataJSON;

//           const [jsonDataIsValid, jsonErrors] = isValidTinderJson(tinderJson);

//           if (!jsonDataIsValid) {
//             log.error("Invalid Tinder Json", jsonErrors);
//             counts.invalidTinderJson++;
//             continue;
//           }

//           const ssPayload = await createSwipestatsProfilePayloadFromJson(
//             JSON.stringify(tinderJson),
//             "TINDER",
//           );

//           const txnInput = createTinderProfileTxnInput({
//             user: {
//               userId: ssPayload.tinderId,
//             },
//             tinderId: ssPayload.tinderId,
//             tinderJson: ssPayload.anonymizedTinderJson,
//           });
//           i++;
//           counts.profilesParsedSuccessfully++;

//           if (txnInput.tinderProfileInput.gender === "MALE") {
//             counts.genderM++;
//           } else if (txnInput.tinderProfileInput.gender === "FEMALE") {
//             counts.genderF++;
//           } else if (txnInput.tinderProfileInput.gender === "UNKNOWN") {
//             counts.genderUnknown++;
//           } else {
//             counts.genderOther++;
//           }

//           //   log.info("New Input", {
//           //     tinderId: ssPayload.tinderId,
//           //     count: i,
//           //     cumulativeTotal,
//           //     file: file,
//           //     totalInFile: mongoProfiles.length,
//           //     user: {
//           //       gender: tinderJson.User.gender,
//           //       age: txnInput.tinderProfileInput.ageAtUpload,
//           //     },
//           //     txnInput: {
//           //       usage: txnInput.usageInput.length,
//           //       matches: txnInput.matchesInput.length,
//           //       messages: txnInput.messagesInput.length,
//           //     },
//           //   });
//         } catch (error) {
//           if (error.message) {
//             errors[error.message] = errors[error.message]
//               ? errors[error.message] + 1
//               : 1;
//           }
//           counts.errors++;
//         }
//       }
//     }
//   } catch (error) {
//     log.error("Error", error);
//   } finally {
//     log.error("Errors", errors);
//     log.info("Counts", counts);
//   }
// }

// main()
//   .then(async () => {
//     await targetPrisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);

//     await targetPrisma.$disconnect();
//     process.exit(1);
//   });

// async function loadFile(path: string) {
//   console.log("Starting parsing...");
//   const raw_profiles = readFileSync(path, "utf-8");
//   console.log("Got raw string", raw_profiles.length);
//   const profiles = JSON.parse(raw_profiles) as OLD_MONGO_Profile[];
//   console.log("Got raw profiles", profiles.length);

//   return profiles;
// }

// export interface OLD_MONGO_Profile {
//   _id: string;
//   userId: string;
//   conversations: {
//     match_id: string; // Match 739
//     messages: {
//       message?: string;
//       to: number; // same as match_id, but one less // 738
//       from: string; // "You"
//       sent_date: string; // ISO date string
//     }[];
//   }[];
//   conversationsMeta: {
//     nrOfConversations: number; //739
//     longestConversation: number; // 133
//     longestConversationInDays: number; // 683.5574421296296
//     averageConversationLength: number; // 8.56021650879567
//     averageConversationLengthInDays: number; // 10.236619931839824
//     medianConversationLength: number; // 3
//     medianConversationLengthInDays: number; // 0.08113425925925925
//     nrOfOneMessageConversations: number; // 226
//     percentOfOneMessageConversations: number; // 30.581867388362653
//     nrOfGhostingsAfterInitialMessage: number; // 66
//   };
//   appOpens: DateValueMap;
//   matches: DateValueMap;
//   messages: {
//     sent: DateValueMap;
//     received: DateValueMap;
//   };
//   messagesReceived: DateValueMap;
//   messagesSent: DateValueMap;
//   swipeLikes: DateValueMap;
//   swipePasses: DateValueMap;
//   swipes: {
//     likes: DateValueMap;
//     passes: DateValueMap;
//   };
//   user: {
//     birthDate: string; // iso string
//     ageFilterMin: number;
//     ageFilterMax: number;
//     cityName: string;
//     country: string;
//     createDate: string; // iso date
//     education: string; // "Has high school and/or college education"
//     gender: "M" | "F";
//     interestedIn: "M" | "F";
//     genderFilter: "M" | "F";
//     instagram: boolean;
//     spotify: boolean;
//     educationLevel: string; // "Has high school and/or college education"
//     schools: {
//       displayed: boolean;
//       name: string;
//       id?: string;
//       type?: string; // College
//       year?: number;
//     }[];
//     jobs: [
//       {
//         companyDisplayed: boolean;
//         titleDisplayed: boolean;
//         title: string | boolean;
//       },
//     ];
//   };
// }

// function mapMongoProfileToOriginalTinderJson(
//   mongoProfile: OLD_MONGO_Profile,
// ): AnonymizedTinderDataJSON {
//   return {
//     User: {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
//       active_time: null as any,
//       age_filter_max: mongoProfile.user.ageFilterMax,
//       age_filter_min: mongoProfile.user.ageFilterMin,
//       birth_date: mongoProfile.user.birthDate,
//       create_date: mongoProfile.user.createDate,
//       gender: mongoProfile.user.gender,
//       gender_filter: mongoProfile.user.genderFilter,
//       interested_in: mongoProfile.user.interestedIn,
//       ip_address: "",
//       is_traveling: false,
//       pos: {
//         at: "",
//         lat: 0,
//         lon: 0,
//       },
//       travel_location_info: [],
//       travel_pos: {
//         lat: 0,
//         lon: 0,
//       },
//       college: [],
//       education: mongoProfile.user.education,
//       instagram: mongoProfile.user.instagram,
//       spotify: mongoProfile.user.spotify,
//       jobs: mongoProfile.user.jobs.map((job) => ({
//         company: {
//           displayed: job.companyDisplayed,
//           name: "",
//         },
//         title: {
//           displayed: job.titleDisplayed,
//           name: typeof job.title === "string" ? job.title : "",
//         },
//       })),
//       schools: mongoProfile.user.schools?.map((school) => ({
//         displayed: school.displayed,
//         name: school.name,
//       })),
//     },
//     Usage: {
//       app_opens: mongoProfile.appOpens,
//       swipes_likes: mongoProfile.swipeLikes,
//       swipes_passes: mongoProfile.swipePasses,
//       matches: mongoProfile.matches,
//       messages_sent: mongoProfile.messagesSent,
//       messages_received: mongoProfile.messagesReceived,
//       advertising_id: {},
//       idfa: {},
//     },
//     Campaigns: {
//       current_campaigns: [],
//       expired_campaigns: [],
//     },
//     Experiences: {},
//     Purchases: {
//       subscription: [],
//       consumable: [],
//       boost_tracking: [],
//       super_like_tracking: [],
//     },
//     Photos: [],
//     Spotify: {
//       spotify_connected: mongoProfile.user.spotify,
//     },
//     Messages: mongoProfile.conversations.map((convo) => ({
//       match_id: convo.match_id,
//       messages: convo.messages.map((msg) => ({
//         to: msg.to,
//         from: msg.from,
//         message: msg.message,
//         sent_date: msg.sent_date,
//         type: undefined,
//       })),
//     })),
//     RoomsAndInteractions: {
//       rooms: [
//         {
//           role: null,
//           is_active: true,
//           is_open: true,
//           room_type: "sync_swipe",
//           created_at: new Date().toISOString(),
//           interactions: [],
//         },
//       ],
//     },
//     SwipeNotes: [],
//     SwipeParty: {
//       assignments: [],
//     },
//     StudentVerifications: {
//       entries: [],
//     },
//   };
// }
