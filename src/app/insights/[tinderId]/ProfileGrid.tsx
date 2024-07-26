"use client";
import { Card } from "@/app/_components/ui/card";
import { useInsightsProvider } from "./InsightsProvider";
import ProfileCard from "./ProfileCard";
import { Button } from "@/app/_components/ui/button";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { api } from "@/trpc/react";

export function ProfileGrid() {
  const { profiles } = useInsightsProvider();

  const [comparisonIds, setComparisonIds] = useQueryState(
    "comparisonIds",
    parseAsArrayOf(parseAsString, ",").withDefault([]),
  );

  const getRandomTinderProfileMutation = api.profile.compareRandom.useMutation({
    onSuccess: (randomTinderId) =>
      setComparisonIds([...comparisonIds, randomTinderId]),
  });

  return (
    <div className="grid grid-cols-3 gap-10 py-10">
      {profiles.map((profile) => (
        <ProfileCard key={profile.tinderId} profile={profile} />
      ))}
      <Card.Container>
        <Card.Header>
          <Card.Title>Add comparison</Card.Title>
        </Card.Header>
        <Card.Content className="flex gap-4">
          <Button
            onClick={() =>
              getRandomTinderProfileMutation.mutate({
                excludeIds: profiles.map((p) => p.tinderId),
              })
            }
          >
            Random
          </Button>
          <Button
            disabled={profiles.some(
              (p) =>
                p.tinderId ===
                "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5",
            )}
            onClick={() =>
              setComparisonIds([
                ...comparisonIds,
                "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5",
              ])
            }
          >
            Founder
          </Button>
          <Button>Other Swipestats User</Button>
        </Card.Content>
      </Card.Container>
    </div>
  );
}
