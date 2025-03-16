import { execSync } from "child_process";

const prodDbIdentifier = "ep-mute-glitter-a2z460s2";

if (
  process.env.DATABASE_URL?.includes(prodDbIdentifier) &&
  process.env.VERCEL_ENV !== "production"
) {
  throw new Error(
    "You are trying to deploy to production database from non-production environment. This is not allowed.",
  );
}

execSync("npx prisma migrate deploy", { stdio: "inherit" });
