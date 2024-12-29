import { PrismaClient } from "@prisma/client";
import { processDemographics } from "./demographicHelpers";

const prisma = new PrismaClient();

await processDemographics(true, async (params) => {
  console.log(params);
  const today = new Date();
  const minBirthDate = new Date();
  minBirthDate.setFullYear(today.getFullYear() - params.ageRange.max);

  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(today.getFullYear() - params.ageRange.min);

  const profileCount = await prisma.tinderProfile.count({
    where: {
      gender: params.gender,
      interestedIn: params.interestedIn,
      birthDate: {
        gte: minBirthDate,
        lte: maxBirthDate,
      },
    },
  });

  const profiles = await prisma.tinderProfile.findMany({
    where: {
      gender: params.gender,
      interestedIn: params.interestedIn,
    },
  });
  const totalAge = profiles.reduce((sum, profile) => {
    const birthDate = new Date(profile.birthDate);
    const age = today.getFullYear() - birthDate.getFullYear();
    return sum + age;
  }, 0);

  // Count descriptors by name and choices
  const descriptorCounts: Record<string, Record<string, number>> = {};

  profiles.forEach((profile) => {
    const descriptors =
      (profile.descriptors as { name: string; choices: string[] }[]) || [];
    descriptors.forEach((descriptor) => {
      if (!descriptorCounts[descriptor.name]) {
        descriptorCounts[descriptor.name] = {};
      }

      descriptor.choices.forEach((choice) => {
        // We can remove the if check since we already initialized the object above
        const count = descriptorCounts[descriptor.name]?.[choice] ?? 0;
        // @ts-expect-error this is fine
        descriptorCounts[descriptor.name][choice] = count + 1;
      });
    });
  });

  console.log("Descriptor counts:");
  console.log(JSON.stringify(descriptorCounts, null, 2));

  const averageAge = totalAge / profiles.length;
  console.log(`Average age: ${averageAge.toFixed(1)}`);

  console.log(profileCount);

  console.log();
});
