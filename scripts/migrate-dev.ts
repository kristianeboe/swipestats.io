import { execSync } from "child_process";

const DATABASE_URL = process.env.DATABASE_URL!;

console.log("DATABASE_URL:", DATABASE_URL);

if (true || DATABASE_URL.startsWith("postgresql://user:")) {
  // local docker db
  console.log("db migrating");
  execSync("npx prisma migrate dev", { stdio: "inherit" });
} else {
  throw new Error(
    `STOP STOP STOP STOP STOP STOP. Check your ENV file. You almost ran migrate dev on a cloud database. That is NOT OK! Have a coffee and take a lap around the block.\nIf you really want to do this, go change the script migrate-dev.ts. Maniac.`,
  );
}
