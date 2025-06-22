import { createSubLogger } from "@/lib/tslog";
import { omit } from "radash";
import type {
  AnonymizedTinderDataJSON,
  FullTinderDataJSON,
  SwipestatsProfilePayload,
} from "@/lib/interfaces/TinderDataJSON";
import type {
  AnonymizedHingeDataJSON,
  FullHingeDataJSON,
  SwipestatsHingeProfilePayload,
  UserData,
  PromptEntryList,
  Conversations,
  AnonymizedHingeUser,
  HingeValidationData,
} from "@/lib/interfaces/HingeDataJSON";
import { createSHA256Hash } from "@/lib/utils";
import type { DataProvider } from "@prisma/client";

// function getSecretIdOld(tinderData: FullTinderDataJSON) {
//     const secretId = md5(
//       tinderData.User.email +
//         tinderData.User.username +
//         tinderData.User.create_date
//     );

//     return secretId;
//   }

// should be pretty similar to database, except in database there is also the original (anonymized) json

const log = createSubLogger("profile.anonymize");

async function createSwipestatsProfileId(
  birthDate: string,
  appProfileCreateDate: string,
) {
  // pretty unlikely collision IMO
  // can also be regenerated based on stored data
  const profileId = await createSHA256Hash(
    birthDate + "-" + appProfileCreateDate,
  );
  // log.info("Profile id created", profileId);

  return profileId;
}

function combineHingeDataParts(dataParts: unknown[]): FullHingeDataJSON {
  // Initialize the combined structure
  const combined: Partial<FullHingeDataJSON> = {
    User: {} as UserData,
    Matches: [],
    Prompts: [],
    Media: [],
    Subscriptions: [],
  };

  // Process each data part - identify file type and merge appropriately
  for (const part of dataParts) {
    // Detect file type based on structure/content
    if (isUserFile(part)) {
      // user.json - merge user data
      combined.User = part;
    } else if (isMatchesFile(part)) {
      // matches.json - set matches array
      combined.Matches = part;
    } else if (isPromptsFile(part)) {
      // prompts.json - set prompts array
      combined.Prompts = part;
    } else if (isMediaFile(part)) {
      // media.json - add to media array (structure TBD)
      if (Array.isArray(part)) {
        combined.Media = part;
      }
    } else if (isSubscriptionsFile(part)) {
      // subscriptions.json - add to subscriptions array (structure TBD)
      if (Array.isArray(part)) {
        combined.Subscriptions = part;
      }
    } else {
      // Fallback: try to merge any unrecognized structure
      if (typeof part === "object" && part !== null) {
        for (const [key, value] of Object.entries(part)) {
          if (!combined[key as keyof FullHingeDataJSON]) {
            (combined as Record<string, unknown>)[key] = value;
          }
        }
      }
    }
  }

  return combined as FullHingeDataJSON;
}

// Helper functions to detect file types based on the actual data structures
function isUserFile(data: unknown): data is UserData {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return !!(obj.preferences || obj.identity || obj.account || obj.profile);
}

function isMatchesFile(data: unknown): data is Conversations {
  if (!Array.isArray(data)) return false;
  // Check if it's an array of conversation threads
  return (
    data.length === 0 ||
    (typeof data[0] === "object" &&
      data[0] !== null &&
      ("chats" in data[0] ||
        "like" in data[0] ||
        "match" in data[0] ||
        "block" in data[0] ||
        "we_met" in data[0]))
  );
}

function isPromptsFile(data: unknown): data is PromptEntryList {
  if (!Array.isArray(data)) return false;
  // Check if it's an array of prompt entries
  return (
    data.length === 0 ||
    (typeof data[0] === "object" &&
      data[0] !== null &&
      "prompt" in data[0] &&
      "text" in data[0] &&
      "type" in data[0])
  );
}

function isMediaFile(data: unknown): boolean {
  // Placeholder logic - will be updated when we see real media.json structure
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === "object" &&
    data[0] !== null &&
    ("url" in data[0] || "media" in data[0])
  );
}

function isSubscriptionsFile(data: unknown): boolean {
  // Placeholder logic - will be updated when we see real subscriptions.json structure
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] === "object" &&
    data[0] !== null &&
    ("subscription" in data[0] || "plan" in data[0])
  );
}

export function isValidTinderJson(
  tinderJson: FullTinderDataJSON | AnonymizedTinderDataJSON,
) {
  const errors: Record<string, { message: string; [key: string]: unknown }> =
    {};
  if (!Object.values(tinderJson.Usage.app_opens).length) {
    errors.app_opens = {
      message: "No app opens detected",
      appOpens: tinderJson.Usage.app_opens,
    };
  }
  if (!tinderJson.User.create_date) {
    const appOpens = Object.keys(tinderJson.Usage.app_opens).sort();
    const earliestDate = appOpens[0];
    if (earliestDate) {
      tinderJson.User.create_date = earliestDate;
    } else {
      errors.user_create_date = {
        message: "No create_date detected",
        user: tinderJson.User,
        usageDayCount: Object.keys(tinderJson.Usage.app_opens).length,
        appOpens: Object.values(tinderJson.Usage.app_opens).reduce(
          (sum, val) => sum + val,
          0,
        ),
      };
    }
  }

  if (Object.keys(errors).length === 0) {
    return [true, {}];
  } else {
    return [false, errors];
  }
}

export function isValidHingeJson(
  hingeJson: FullHingeDataJSON | AnonymizedHingeDataJSON,
) {
  const errors: Record<string, { message: string; [key: string]: unknown }> =
    {};

  // Extract validation data from the nested structure
  const validationData: HingeValidationData = {
    birth_date: undefined,
    create_date: undefined,
    signup_time: hingeJson.User.account?.signup_time,
    age: hingeJson.User.profile?.age,
  };

  // For Hinge, birth_date might be calculated from age, and create_date from signup_time
  if (!validationData.age && !validationData.birth_date) {
    errors.birth_date = {
      message: "No birth date or age detected",
      user: hingeJson.User,
    };
  }

  if (!validationData.signup_time) {
    errors.create_date = {
      message: "No signup time detected",
      user: hingeJson.User,
    };
  }

  // Check if we have any meaningful data (matches, prompts)
  const hasMatches = hingeJson.Matches && hingeJson.Matches.length > 0;
  const hasPrompts = hingeJson.Prompts && hingeJson.Prompts.length > 0;

  if (!hasMatches && !hasPrompts) {
    errors.no_data = {
      message: "No meaningful data detected (no matches or prompts)",
      matchesCount: hingeJson.Matches?.length ?? 0,
      promptsCount: hingeJson.Prompts?.length ?? 0,
    };
  }

  if (Object.keys(errors).length === 0) {
    return [true, {}];
  } else {
    return [false, errors];
  }
}

export async function createSwipestatsProfilePayloadFromJson(
  jsonString: string,
  provider: DataProvider,
): Promise<SwipestatsProfilePayload | SwipestatsHingeProfilePayload> {
  return createSwipestatsProfilePayloadFromJsons([jsonString], provider);
}

export async function createSwipestatsProfilePayloadFromJsons(
  jsonStrings: string[],
  provider: DataProvider,
): Promise<SwipestatsProfilePayload | SwipestatsHingeProfilePayload> {
  switch (provider) {
    case "TINDER":
      try {
        const tinderJson = JSON.parse(jsonStrings[0]!) as FullTinderDataJSON;
        // log.info(
        //   "Tinder data parsed successfully",
        //   Object.keys(tinderJson),
        //   tinderJson.User,
        // );

        const birthDate = tinderJson.User.birth_date;
        const createDate = tinderJson.User.create_date;

        const [jsonDataIsValid, invalidKeysAndValues] =
          isValidTinderJson(tinderJson);

        if (!jsonDataIsValid) {
          console.error("Tinder data is invalid", invalidKeysAndValues);
          throw new Error("Tinder data json is invalid");
        }

        const anonymizedTinderJson = {
          // including messages
          ...tinderJson,
          User: {
            ...omit(tinderJson.User, [
              "email",
              "full_name",
              "name",
              "username",
              "phone_id",
            ]),
            instagram: !!tinderJson.User.instagram,
            spotify: !!tinderJson.User.spotify?.spotify_connected,
          },
        } as AnonymizedTinderDataJSON;
        // log.info(
        //   "Tinder data anonymized successfully",
        //   Object.keys(anonymizedTinderJson),
        //   anonymizedTinderJson.User,
        // );

        const profileId = await createSwipestatsProfileId(
          anonymizedTinderJson.User.birth_date,
          anonymizedTinderJson.User.create_date,
        );

        const swipestatsProfilePayload: SwipestatsProfilePayload = {
          tinderId: profileId,
          anonymizedTinderJson,
        };

        return swipestatsProfilePayload;
      } catch (error) {
        console.error("Tinder data extraction failed", error);
        throw new Error("Something went wrong with profile extraction");
      }

    case "HINGE":
      try {
        // Hinge data comes in multiple files, so we need to parse and combine them
        const hingeDataParts = jsonStrings.map((jsonString) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          JSON.parse(jsonString),
        );

        log.info(
          "Hinge data parts parsed",
          `Found ${hingeDataParts.length} files`,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          hingeDataParts.map((part) => Object.keys(part || {})),
        );

        // Combine all the Hinge data parts into a single structure
        const hingeJson = combineHingeDataParts(hingeDataParts);

        log.info(
          "Hinge data combined successfully",
          Object.keys(hingeJson),
          "User fields:",
          Object.keys(hingeJson.User || {}),
        );

        const [jsonDataIsValid, invalidKeysAndValues] =
          isValidHingeJson(hingeJson);

        if (!jsonDataIsValid) {
          console.error("Hinge data is invalid", invalidKeysAndValues);
          throw new Error("Hinge data json is invalid");
        }

        // Create anonymized version
        const anonymizedHingeJson: AnonymizedHingeDataJSON = {
          ...hingeJson,
          User: {
            preferences: hingeJson.User.preferences,
            identity: {
              fbid: hingeJson.User.identity.fbid,
              instagram_authorized:
                hingeJson.User.identity.instagram_authorized,
              has_email: !!hingeJson.User.identity.email,
              has_phone: !!hingeJson.User.identity.phone_number,
            },
            account: hingeJson.User.account,
            installs: hingeJson.User.installs.map((install) =>
              omit(install, ["ip_address", "idfa", "idfv"]),
            ),
            profile: {
              ...omit(hingeJson.User.profile, ["first_name", "last_name"]),
              has_first_name: !!hingeJson.User.profile.first_name,
              has_last_name: !!hingeJson.User.profile.last_name,
            },
          } as AnonymizedHingeUser,
        };

        log.info(
          "Hinge data anonymized successfully",
          Object.keys(anonymizedHingeJson),
          "User fields:",
          Object.keys(anonymizedHingeJson.User),
        );

        // Use signup_time as create_date equivalent and age for birth_date equivalent
        const createDateEquivalent =
          anonymizedHingeJson.User.account.signup_time;
        const birthDateEquivalent =
          anonymizedHingeJson.User.profile.age.toString();

        const profileId = await createSwipestatsProfileId(
          birthDateEquivalent,
          createDateEquivalent,
        );

        const swipestatsHingeProfilePayload: SwipestatsHingeProfilePayload = {
          hingeId: profileId,
          anonymizedHingeJson,
        };

        return swipestatsHingeProfilePayload;
      } catch (error) {
        console.error("Hinge data extraction failed", error);
        throw new Error("Something went wrong with Hinge profile extraction");
      }

    default:
      throw new Error("Invalid provider");
  }
}
