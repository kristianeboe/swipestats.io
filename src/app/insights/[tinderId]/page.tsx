import { api } from "@/trpc/server";

import { notFound } from "next/navigation";

import { GraphCardUsage } from "./GraphCardUsage";
import RoastBanner from "@/app/_components/RoastBanner";
import DataRequestCTA from "@/app/_components/DataRequestCTA";
import { MatchRateCard } from "./MatchRateCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/_components/ui/card";
import {
  Calendar,
  CircleSlash,
  Ghost,
  MessageCircle,
  MessagesSquare,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { TooltipWrapper } from "@/app/_components/ui/tooltip";
import React from "react";
import { UserFeedback } from "./UserFeedback";
import Profiles from "./Profiles";
import { SwipestatsPlusCard } from "./SwipestatsPlusCard";

export default async function InsightsPage(props: {
  params: Promise<{
    tinderId: string;
  }>;
}) {
  const params = await props.params;
  const swipestatsProfile = await api.profile.get({
    tinderId: params.tinderId,
  });

  if (!swipestatsProfile) {
    notFound();
  }

  return (
    <main className="container mx-auto px-6 pb-6 md:pt-12">
      {/* <h1 className="text-center text-6xl font-black">Swipestats</h1>

        <ComparisonForm tinderId={params.tinderId} /> */}
      <div className="flex justify-center gap-4">
        {/* <MiniProfileCard /> */}
        <Profiles />
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* <GraphCardUsage chartDataKey="matchRate" title="Match Rate" /> */}
        <GraphCardUsage chartDataKey="matches" title="Matches" />
        <div className="grid gap-10 md:grid-cols-2">
          <MatchRateCard title="Match Rate" />

          <GraphCardUsage chartDataKey="appOpens" title="App Opens" />
        </div>

        <div className="flex flex-wrap gap-5 xl:flex-nowrap">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Messages meta</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <MessagesMetaCard
                title="# of conversations"
                icon={MessagesSquare}
                stat={swipestatsProfile.profileMeta?.numberOfConversations + ""}
              />

              <MessagesMetaCard
                title="Longest conversation"
                icon={Calendar}
                stat={
                  <TooltipWrapper tooltipContent="That is 123 days">
                    {swipestatsProfile.profileMeta?.longestConversationInDays +
                      " days"}
                  </TooltipWrapper>
                }
              />

              <MessagesMetaCard
                title="Median chat length"
                icon={MessageCircle}
                stat={
                  swipestatsProfile.profileMeta
                    ?.medianConversationMessageCount + ""
                }
              />
              <MessagesMetaCard
                title="Average chat length"
                icon={MessageCircle}
                stat={
                  swipestatsProfile.profileMeta
                    ?.averageConversationMessageCount + ""
                }
              />

              <MessagesMetaCard
                title="Longest chat"
                icon={ScrollText}
                stat={
                  swipestatsProfile.profileMeta?.maxConversationMessageCount +
                  ""
                }
              />

              <MessagesMetaCard
                title="# of no reply chats"
                icon={CircleSlash}
                stat={
                  swipestatsProfile.profileMeta
                    ?.numberOfOneMessageConversations + ""
                }
              />

              <MessagesMetaCard
                title="# of times you ghosted"
                icon={Ghost}
                stat={
                  swipestatsProfile.profileMeta
                    ?.nrOfGhostingsAfterInitialMatch + ""
                }
              />

              <MessagesMetaCard
                title="% of no reply chats"
                icon={CircleSlash}
                stat={
                  swipestatsProfile.profileMeta
                    ?.percentageOfOneMessageConversations + "%"
                }
              />
              {/* <AddMetricCard /> */}
            </CardContent>
          </Card>
          {/* <UserFeedback tinderId={params.tinderId} /> */}
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <SwipestatsPlusCard className="lg:col-span-2" />
          <UserFeedback tinderId={params.tinderId} />
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <GraphCardUsage chartDataKey="messagesSent" title="Messages Sent" />

          <GraphCardUsage
            chartDataKey="messagesReceived"
            title="Messages Received"
          />
        </div>
        <RoastBanner />
        <div className="grid gap-10 md:grid-cols-2">
          <GraphCardUsage chartDataKey="swipeLikes" title="Swipe Likes" />
          <GraphCardUsage chartDataKey="swipePasses" title="Swipe Passes" />
        </div>
        <DataRequestCTA />
      </div>
    </main>
  );
}

function MessagesMetaCard(props: {
  title: string;
  icon: LucideIcon;
  stat: React.ReactNode;
  from?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
        {/* <DollarSign className="text-muted-foreground h-4 w-4" /> */}
        <props.icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{props.stat}</div>
        {props.from && (
          <p className="text-muted-foreground text-xs">{props.from}</p>
        )}
      </CardContent>
    </Card>
  );
}

export const generateStaticParams = () => {
  return [{ tinderId: "demo" }];
};

// export async function generateStaticParams() {
//   const tinderProfiles = await db.tinderProfile.findMany({
//     where: {
//       computed: false,
//       profileMeta: {
//         NOT: undefined,
//       },
//       customData: {
//         NOT: undefined,
//       },
//     },
//   });

//   return tinderProfiles.map((tinderProfile) => {
//     return { tinderId: tinderProfile.tinderId };
//   });
// }
