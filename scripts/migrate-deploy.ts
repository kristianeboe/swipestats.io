import { execSync } from "child_process";

const branchLevel = process.env.GIT_BRANCH_LEVEL!;
const nodeEnv = process.env.NODE_ENV;

if (
  nodeEnv === "production" &&
  (branchLevel === "staging" || branchLevel === "production")
) {
  console.log("deploying migrations");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} else {
  console.log(
    "Skipping migration deploy because this is not a staging or production branch. BranchLevel: ",
    branchLevel,
  );
}
