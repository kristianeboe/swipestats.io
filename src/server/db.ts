import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

import { env } from "@/env";

neonConfig.webSocketConstructor = ws;
const connectionString = `${env.DATABASE_URL}`;

const createPrismaClient = () => {
  const pool = new Pool({ connectionString: connectionString });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({
    adapter,
    log: ["error"],
    //env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
