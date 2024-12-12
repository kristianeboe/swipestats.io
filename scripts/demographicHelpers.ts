import { Gender } from "@prisma/client";

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
  logger?: { info: (message: string) => void },
): Promise<void> {
  const config = getDemographicConfig(isSimplifiedMode);

  for (const gender of config.genders) {
    for (const interestedIn of config.interestedInGenders) {
      if (logger) {
        logger.info(
          `Processing demographic: gender=${gender}, interestedIn=${interestedIn}`,
        );
      }
      for (const ageRange of config.ageRanges) {
        const demographicId = `average-${gender}-${interestedIn}-${ageRange.label}`;
        
        await callback({ gender, interestedIn, ageRange, demographicId });
      }
    }
  }
}
