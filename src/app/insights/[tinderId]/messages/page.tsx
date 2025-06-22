import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/app/_components/ui/card";

export default async function MessagesPage(props: {
  params: Promise<{ tinderId: string }>;
}) {
  const params = await props.params;
  const swipestatsProfile = await api.profile.get({
    tinderId: params.tinderId,
  });

  if (!swipestatsProfile) {
    notFound();
  }

  const messagesByMatch = await api.messages.getByProfileGroupedByMatch({
    tinderId: params.tinderId,
  });

  const longestConversations =
    await api.messages.getOpeningMessagesThatLeadToLongestConversations({
      tinderId: params.tinderId,
    });

  return (
    <main className="container mx-auto py-10">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Longest conversations</h2>
        <div className="grid grid-cols-2 gap-6">
          {longestConversations.map((match) => (
            <Card key={match.id}>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-500">
                    Matched at:{" "}
                    {match.matchedAt
                      ? new Date(match.matchedAt).toLocaleString()
                      : "Unknown"}
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    {match.messages.map((m) => (
                      <div key={m.id}>{m.content}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <h2 className="text-3xl font-bold">All matches</h2>
        <div className="grid grid-cols-2 gap-6">
          {messagesByMatch.map((match) => (
            <Card key={match.id}>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-gray-500">
                    Matched at:{" "}
                    {match.matchedAt
                      ? new Date(match.matchedAt).toLocaleString()
                      : "Unknown"}
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    {match.messages.map((m) => (
                      <div key={m.id}>{m.content}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
