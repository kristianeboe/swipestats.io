import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

const override = false;

const createPrismaClient = () =>
  new PrismaClient({
    log: override
      ? ["info", "query", "error", "warn"]
      : env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
