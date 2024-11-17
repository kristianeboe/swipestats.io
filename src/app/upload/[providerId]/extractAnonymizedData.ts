import { createSubLogger } from "@/lib/tslog";
import { omit } from "radash";
import type {
  AnonymizedTinderDataJSON,
  FullTinderDataJSON,
  SwipestatsProfilePayload,
} from "@/lib/interfaces/TinderDataJSON";
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

export async function createSwipestatsProfilePayloadFromJson(
  jsonString: string,
  provider: DataProvider,
): Promise<SwipestatsProfilePayload> {
  switch (provider) {
    case "TINDER":
      try {
        const tinderJson = JSON.parse(jsonString) as FullTinderDataJSON;
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

    default:
      throw new Error("Invalid provider");
  }
}
