import { db } from "@/server/db";

export async function postProcessProfile(tinderId: string) {
  const profile = await db.tinderProfile.findUniqueOrThrow({
    where: {
      tinderId,
    },
    include: {
      matches: {
        include: {
          messages: true,
        },
      },
    },
  });

  for (const match of profile.matches) {
    const messages = match.messages;

    await db.match.update({
      where: {
        id: match.id,
      },
      data: {},
    });

    for (const message of messages) {
      await db.message.update({
        where: {
          id: message.id,
        },
        data: {
          contentSanitized: "",
        },
      });
    }
  }
}
