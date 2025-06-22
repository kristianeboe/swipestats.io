import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { HydrateClient } from "@/trpc/server";
import SharedComparisonView from "./shared-comparison-view";

export default async function SharedProfileComparisonPage({
  params,
}: {
  params: { shareKey: string };
}) {
  try {
    const comparison = await api.profileCompare.getPublicComparison({
      shareKey: params.shareKey,
    });

    return (
      <HydrateClient>
        <SharedComparisonView comparison={comparison} />
      </HydrateClient>
    );
  } catch (error) {
    return notFound();
  }
}
