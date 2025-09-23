import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import ComparisonDetail from "../comparison-detail";
import { HydrateClient } from "@/trpc/server";

export default async function ProfileCompareDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    return notFound();
  }

  try {
    const comparison = await api.profileCompare.getComparison({
      id: (await params).id,
    });

    return (
      <HydrateClient>
        <ComparisonDetail comparison={comparison} />
      </HydrateClient>
    );
  } catch (error) {
    return notFound();
  }
}
