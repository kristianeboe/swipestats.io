import { db } from "@/server/db";

export async function getRandomTinderProfileIds(
  n: number,
  excludeIds: string[] = [],
) {
  const tinderIds: { tinderId: string }[] = await db.$queryRaw`
    SELECT "tinderId" FROM "TinderProfile"
    WHERE "tinderId" NOT IN (${excludeIds})
    ORDER BY RANDOM()
    LIMIT ${n};
    `;

  return tinderIds.map((tinderId) => tinderId.tinderId);
}

export async function getRandomTinderProfiles(n: number, excludeIds: string[]) {
  const tinderIds: string[] = await getRandomTinderProfileIds(n, excludeIds);

  const tinderProfiles = await db.tinderProfile.findMany({
    where: {
      tinderId: {
        in: tinderIds,
      },
    },
    include: {
      profileMeta: true,
    },
  });

  return tinderProfiles;
}
