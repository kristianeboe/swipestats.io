import type { AnonymizedHingeDataJSON } from "@/lib/interfaces/HingeDataJSON";
import { type Prisma, MessageType, HingeInteractionType } from "@prisma/client";
import { differenceInYears } from "date-fns";
import { createSubLogger } from "@/lib/tslog";
import { db } from "@/server/db";

const log = createSubLogger("hingeProfile.service");

export function createHingeProfileTxnInput(params: {
  user: {
    userId: string;
    timeZone?: string;
    country?: string;
  };
  hingeId: string;
  hingeJson: AnonymizedHingeDataJSON;
}) {
  const userId = params.user.userId;
  const hingeJson = params.hingeJson;

  const hingeProfileInput = createSwipestatsHingeProfileInput(
    params.hingeId,
    userId,
    hingeJson,
  );

  // Process matches and messages from conversations
  const { matchesInput, messagesInput, hingeBlocksInput } =
    createHingeMatchesAndMessages(hingeJson.Matches, params.hingeId);

  const hingePromptsInput = createHingePromptsInput(
    hingeJson.Prompts,
    params.hingeId,
  );

  // Aggregate daily usage metrics
  const usageMap: Record<
    string,
    {
      matches: number;
      likesSent: number;
      blocks: number;
      messagesSent: number;
    }
  > = {};

  const dateKey = (d: Date | string) =>
    (typeof d === "string" ? new Date(d) : d).toISOString().slice(0, 10); // YYYY-MM-DD

  // Count matches
  matchesInput.forEach((m) => {
    if (!m.matchedAt) return;
    const key = dateKey(m.matchedAt);
    usageMap[key] ??= { matches: 0, likesSent: 0, blocks: 0, messagesSent: 0 };
    usageMap[key].matches++;
  });

  // Count hinge block interactions (likes & blocks)
  hingeBlocksInput.forEach((b) => {
    const key = dateKey(b.dateStamp);
    usageMap[key] ??= { matches: 0, likesSent: 0, blocks: 0, messagesSent: 0 };
    switch (b.interactionType) {
      case HingeInteractionType.LIKE:
        usageMap[key].likesSent++;
        break;
      case HingeInteractionType.BLOCK:
      case HingeInteractionType.UNLIKE:
        usageMap[key].blocks++;
        break;
      default:
        break;
    }
  });

  // Count messages
  messagesInput.forEach((msg) => {
    const key = dateKey(msg.sentDate);
    usageMap[key] ??= { matches: 0, likesSent: 0, blocks: 0, messagesSent: 0 };
    usageMap[key].messagesSent++;
  });

  const usageInput: Prisma.HingeUsageCreateManyInput[] = Object.entries(
    usageMap,
  ).map(([dateStr, stats]) => {
    const matchRate = stats.likesSent ? stats.matches / stats.likesSent : 0;

    const responseRate = 0; // messagesReceived unknown

    return {
      dateStamp: new Date(dateStr),
      dateStampRaw: dateStr,
      hingeProfileId: params.hingeId,
      matches: stats.matches,
      likesSent: stats.likesSent,
      blocks: stats.blocks,
      messagesSent: stats.messagesSent,
      matchRate,
      responseRate,
      engagementRate: 0,
      dateIsMissingFromOriginalData: false,
      activeUser: true,
      activeUserInLast7Days: true,
      activeUserInLast14Days: true,
      activeUserInLast30Days: true,
    } as Prisma.HingeUsageCreateManyInput;
  });

  return {
    hingeProfileInput,
    hingePromptsInput,
    matchesInput,
    messagesInput,
    hingeBlocksInput,
    usageInput,
  };
}

export async function prismaCreateHingeProfileTxn(params: {
  user: {
    userId: string;
    timeZone?: string;
    country?: string;
  };
  hingeId: string;
  hingeJson: AnonymizedHingeDataJSON;
}) {
  const {
    hingeProfileInput,
    hingePromptsInput,
    matchesInput,
    messagesInput,
    hingeBlocksInput,
    usageInput,
  } = createHingeProfileTxnInput(params);

  const hingeProfile = await db.$transaction(
    async (txn) => {
      // Store original file
      await txn.originalAnonymizedFile.create({
        data: {
          dataProvider: "HINGE",
          file: params.hingeJson as unknown as Prisma.JsonObject,
          swipestatsVersion: "SWIPESTATS_3",
          user: {
            connectOrCreate: {
              where: {
                id: params.user.userId,
              },
              create: {
                id: params.user.userId,
                timeZone: params.user.timeZone,
                country: params.user.country,
                activeOnHinge: true,
              },
            },
          },
        },
      });
      log.debug("Hinge file uploaded", {
        hingeId: params.hingeId,
        userId: params.user.userId,
      });

      const hingeProfile = await txn.hingeProfile.create({
        data: hingeProfileInput,
      });
      log.debug("Hinge profile created", {
        hingeId: params.hingeId,
      });

      // Create prompts
      if (hingePromptsInput.length > 0) {
        await txn.hingePrompt.createMany({
          data: hingePromptsInput,
        });
        log.debug("Hinge prompts created", {
          promptsCount: hingePromptsInput.length,
        });
      }

      // Create matches
      if (matchesInput.length > 0) {
        await txn.match.createMany({
          data: matchesInput,
        });
        log.debug("Hinge matches created", {
          matchesCount: matchesInput.length,
        });
      }

      // Create messages
      if (messagesInput.length > 0) {
        await txn.message.createMany({
          data: messagesInput,
        });
        log.debug("Hinge messages created", {
          messagesCount: messagesInput.length,
        });
      }

      // Create blocks
      if (hingeBlocksInput.length > 0) {
        await txn.hingeBlock.createMany({
          data: hingeBlocksInput,
        });
        log.debug("Hinge blocks created", {
          blocksCount: hingeBlocksInput.length,
        });
      }

      // Create usage
      if (usageInput.length > 0) {
        await txn.hingeUsage.createMany({
          data: usageInput,
        });
        log.debug("Hinge usage created", {
          usageCount: usageInput.length,
        });
      }

      log.info("Hinge profile transaction summary", {
        hingeId: hingeProfile.hingeId,
        promptsCount: hingePromptsInput.length,
        matchesCount: matchesInput.length,
        messagesCount: messagesInput.length,
        blocksCount: hingeBlocksInput.length,
        usageCount: usageInput.length,
      });

      return hingeProfile;
    },
    {
      maxWait: 120_000,
      timeout: 120_000,
    },
  );

  log.silly("Hinge profile transaction complete");
  return hingeProfile;
}

export function createSwipestatsHingeProfileInput(
  hingeId: string,
  userId: string,
  hingeJson: AnonymizedHingeDataJSON,
): Prisma.HingeProfileCreateInput {
  const user = hingeJson.User;
  const signupDate = new Date(user.account.signup_time);
  const ageAtUpload = user.profile.age;

  // Calculate birth date from age
  const birthDate = new Date(
    signupDate.getTime() - ageAtUpload * 365.25 * 24 * 60 * 60 * 1000,
  );

  // Helper function to safely parse JSON strings to arrays
  const parseJsonArray = (jsonString: string | undefined): string[] => {
    if (!jsonString) return [];
    try {
      const parsed = JSON.parse(jsonString) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Helper function to convert string boolean to boolean
  const stringToBoolean = (value: string | undefined): boolean => {
    if (!value) return false;
    return value.toLowerCase() === "yes" || value.toLowerCase() === "true";
  };

  return {
    hingeId: hingeId,
    birthDate: birthDate,
    ageAtUpload: ageAtUpload,
    createDate: signupDate,
    heightCentimeters: user.profile.height_centimeters,
    gender: user.profile.gender,

    // Identity fields
    genderIdentity: user.profile.gender || "Unknown",
    genderIdentityDisplayed: false, // Not available in current interface

    // Array fields - parse JSON strings to arrays
    ethnicities: parseJsonArray(user.profile.ethnicities),
    ethnicitiesDisplayed: user.profile.ethnicities_displayed || false,
    religions: parseJsonArray(user.profile.religions),
    religionsDisplayed: user.profile.religions_displayed || false,
    workplaces: [], // Not in current interface
    workplacesDisplayed: false,
    schools: parseJsonArray(user.profile.schools),
    schoolsDisplayed: user.profile.schools_displayed || false,
    hometowns: parseJsonArray(user.profile.hometowns),
    hometownsDisplayed: user.profile.hometowns_displayed || false,

    // Job and education
    jobTitle: user.profile.job_title || "",
    jobTitleDisplayed: user.profile.job_title_displayed || false,
    educationAttained: user.profile.education_attained || "",

    // Lifestyle fields
    smoking: stringToBoolean(user.profile.smoking),
    smokingDisplayed: user.profile.smoking_displayed || false,
    drinking: stringToBoolean(user.profile.drinking),
    drinkingDisplayed: user.profile.drinking_displayed || false,
    marijuana: stringToBoolean(user.profile.marijuana),
    marijuanaDisplayed: user.profile.marijuana_displayed || false,
    drugs: stringToBoolean(user.profile.drugs),
    drugsDisplayed: user.profile.drugs_displayed || false,

    // Family and relationship
    children: user.profile.children || "",
    childrenDisplayed: user.profile.children_displayed || false,
    familyPlans: user.profile.family_plans || "",
    familyPlansDisplayed: user.profile.family_plans_displayed || false,

    // Politics and values
    politics: user.profile.politics || "",
    politicsDisplayed: user.profile.politics_displayed || false,
    datingIntention: user.profile.dating_intention || "",
    datingIntentionDisplayed: user.profile.dating_intention_displayed || false,
    relationshipType: user.profile.relationship_types || "",
    relationshipTypeDisplayed:
      user.profile.relationship_type_displayed || false,

    // Social media
    instagramDisplayed: user.profile.instagram_displayed || false,

    // Fields not in current interface - using defaults
    languagesSpoken: "",
    languagesSpokenDisplayed: false,
    selfieVerified: false,

    // Preferences
    distanceMilesMax: user.preferences.distance_miles_max,
    ageMin: user.preferences.age_min,
    ageMax: user.preferences.age_max,
    ageDealbreaker: user.preferences.age_dealbreaker,
    heightMin: user.preferences.height_min,
    heightMax: user.preferences.height_max,
    heightDealbreaker: user.preferences.height_dealbreaker,
    genderPreference: user.preferences.gender_preference,

    // Preference arrays
    ethnicityPreference: parseJsonArray(user.preferences.ethnicity_preference),
    ethnicityDealbreaker: user.preferences.ethnicity_dealbreaker,
    religionPreference: parseJsonArray(user.preferences.religion_preference),
    religionDealbreaker: user.preferences.religion_dealbreaker,

    // Relations
    user: {
      connectOrCreate: {
        where: { id: userId },
        create: {
          id: userId,
          activeOnHinge: true,
        },
      },
    },
    customData: {
      create: {},
    },
  };
}

export function createHingePromptsInput(
  prompts: NonNullable<AnonymizedHingeDataJSON["Prompts"]>,
  hingeId: string,
): Prisma.HingePromptCreateManyInput[] {
  return prompts.map((prompt) => ({
    type: prompt.type,
    prompt: prompt.prompt,
    answerText: prompt.text,
    createdPromptAt: new Date(prompt.created),
    updatedPromptAt: new Date(prompt.user_updated),
    hingeProfileId: hingeId,
  }));
}

// Helper function to validate Hinge data before processing
export function validateHingeData(hingeJson: AnonymizedHingeDataJSON): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!hingeJson.User) {
    errors.push("User data is required");
  }

  if (!hingeJson.User?.account?.signup_time) {
    errors.push("User signup time is required");
  }

  if (!hingeJson.User?.profile?.age) {
    errors.push("User age is required");
  }

  if (!hingeJson.User?.profile?.gender) {
    errors.push("User gender is required");
  }

  if (!hingeJson.User?.preferences) {
    errors.push("User preferences are required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function createHingeMatchesAndMessages(
  conversations: NonNullable<AnonymizedHingeDataJSON["Matches"]>,
  hingeId: string,
): {
  matchesInput: Prisma.MatchCreateManyInput[];
  messagesInput: Prisma.MessageCreateManyInput[];
  hingeBlocksInput: Prisma.HingeBlockCreateManyInput[];
} {
  const matchesInput: Prisma.MatchCreateManyInput[] = [];
  const messagesInput: Prisma.MessageCreateManyInput[] = [];
  const hingeBlocksInput: Prisma.HingeBlockCreateManyInput[] = [];

  conversations.forEach((conversation, conversationIndex) => {
    let matchId: string | undefined;
    let likedAt: Date | undefined;
    let matchedAt: Date | undefined;

    // Process likes first to get the initial interaction
    if (conversation.like && conversation.like.length > 0) {
      conversation.like.forEach((likeEntry) => {
        likeEntry.like.forEach((like) => {
          // capture earliest like timestamp for this thread
          if (!likedAt || new Date(like.timestamp) < likedAt) {
            likedAt = new Date(like.timestamp);
          }

          // Persist every like as a HingeBlock row
          hingeBlocksInput.push({
            interactionType: HingeInteractionType.LIKE,
            body: like.comment ?? null,
            dateStamp: new Date(like.timestamp),
            dateStampRaw: like.timestamp,
            hingeId,
          });
        });
      });
    }

    // Process matches
    if (conversation.match && conversation.match.length > 0) {
      const firstMatch = conversation.match[0];
      if (firstMatch) {
        matchedAt = new Date(firstMatch.timestamp);
        matchId = `hinge_${hingeId}_${conversationIndex}`;

        // Calculate message counts
        const totalMessageCount = conversation.chats?.length ?? 0;
        const textCount =
          conversation.chats?.filter((msg) => msg.body?.trim()).length ?? 0;

        // Find first and last message times
        let initialMessageAt: Date | undefined;
        let lastMessageAt: Date | undefined;

        if (conversation.chats && conversation.chats.length > 0) {
          const messageTimes = conversation.chats
            .map((chat) => new Date(chat.timestamp))
            .sort((a, b) => a.getTime() - b.getTime());

          initialMessageAt = messageTimes[0];
          lastMessageAt = messageTimes[messageTimes.length - 1];
        }

        matchesInput.push({
          id: matchId,
          order: conversationIndex,
          totalMessageCount,
          textCount,
          gifCount: 0, // Hinge doesn't have GIFs in the same way
          gestureCount: 0,
          otherMessageTypeCount: 0,
          primaryLanguage: null,
          languages: [],
          initialMessageAt,
          lastMessageAt,
          likedAt,
          matchedAt,
          hingeProfileId: hingeId,
        });

        // Also store a MATCH interaction for timeline completeness
        hingeBlocksInput.push({
          interactionType: HingeInteractionType.MATCH,
          body: null,
          dateStamp: matchedAt,
          dateStampRaw: firstMatch.timestamp,
          hingeId,
        });
      }
    }

    // Process messages
    if (conversation.chats && matchId) {
      conversation.chats.forEach((chat, messageIndex) => {
        const sentDate = new Date(chat.timestamp);

        // Calculate time since last message
        let timeSinceLastMessage = 0;
        if (messageIndex > 0 && conversation.chats) {
          const previousMessage = conversation.chats[messageIndex - 1];
          if (previousMessage) {
            const previousDate = new Date(previousMessage.timestamp);
            timeSinceLastMessage = Math.floor(
              (sentDate.getTime() - previousDate.getTime()) / 1000,
            );
          }
        }

        const body = chat.body ?? "";
        if (!chat.body) {
          log.warn("Hinge message body missing", {
            hingeId,
            conversationIndex,
            messageIndex,
          });
          log.info(chat);
        }

        messagesInput.push({
          id: `hinge_msg_${hingeId}_${conversationIndex}_${messageIndex}`,
          to: 0, // We don't know who sent what in Hinge data
          sentDate,
          sentDateRaw: chat.timestamp,
          contentRaw: body,
          content: body,
          contentSanitized: body, // Could add sanitization later
          charCount: body.length,
          messageType: MessageType.TEXT,
          type: "text",
          order: messageIndex,
          timeSinceLastMessage,
          timeSinceLastMessageRelative:
            messageIndex === 0
              ? null
              : `${Math.floor(timeSinceLastMessage / 60)} minutes`,
          matchId,
          hingeProfileId: hingeId,
        });
      });
    }

    // Process blocks
    if (conversation.block) {
      conversation.block.forEach((block) => {
        const interactionType =
          block.block_type === "remove"
            ? HingeInteractionType.UNLIKE
            : HingeInteractionType.BLOCK;

        hingeBlocksInput.push({
          interactionType,
          detail: block.block_type,
          body: null,
          dateStamp: new Date(block.timestamp),
          dateStampRaw: block.timestamp,
          hingeId,
        });
      });
    }
  });

  return {
    matchesInput,
    messagesInput,
    hingeBlocksInput,
  };
}
