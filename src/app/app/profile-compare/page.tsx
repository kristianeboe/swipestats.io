import { auth } from "@/server/auth";
import { notFound } from "next/navigation";
import { api, HydrateClient } from "@/trpc/server";
import { ProfileComparisonsDashboard } from "./profile-comparisons-dashboard";

export default async function ProfileCompareIndexPage() {
  const session = await auth();

  if (!session) {
    return notFound();
  }

  void api.profileCompare.getComparisons.prefetch();

  return (
    <HydrateClient>
      <ProfileComparisonsDashboard />
    </HydrateClient>
  );
}
