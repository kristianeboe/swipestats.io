import { execSync } from "child_process";
import readLine from "readline";

const DATABASE_URL = process.env.DATABASE_URL!; //  process.env.DATABASE_URL!;

console.log("DATABASE_URL:", DATABASE_URL);

if (DATABASE_URL.startsWith("postgresql://user:")) {
  // local docker db
  execSync("npx prisma migrate reset --force", { stdio: "inherit" });
  // console.log("docker db reset, starting seeding");
  // execSync("tsx prisma/seed.ts", { stdio: "inherit" });
  // console.log("🌱 seed done");
  //execSync("tsx meetsy-migration/meetsyMigration2.ts", { stdio: "inherit" });
  // console.log("Migration done");
} else {
  const readline = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question(
    "Wow cowboy, are you sure you want to do this? You are about to reset a cloud database, not your local one. Type 'Yes' to continue or ctrc+c to exit\n",
    (firstInput) => {
      if (firstInput === "Yes") {
        readline.question(
          "Bruh, you sure? You could restore the db with point restore, but it would be pretty embarassing if you deleted prod. Type 'Yes do it' to proceed\n",
          (secondInput) => {
            if (secondInput === "Yes do it") {
              console.log(`Okay then, here we go!`);
              execSync("npx prisma migrate reset", {
                stdio: "inherit",
              });
              // execSync("tsx prisma/seed.ts", { stdio: "inherit" });
            }
            readline.close();
          },
        );
      } else {
        console.log(`Shutting down, no harm done`);
        readline.close();
      }
    },
  );
}
