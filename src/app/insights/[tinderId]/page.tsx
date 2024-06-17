import { api } from "@/trpc/server";

import { notFound } from "next/navigation";

import { InsightsProvider } from "./InsightsProvider";
import { ComparisonForm } from "./ComparisonForm";

import { GraphCardUsage } from "./GraphCardUsage";
import RoastBanner from "@/app/_components/RoastBanner";
import DataRequestCTA from "@/app/_components/DataRequestCTA";
import { MatchRateCard } from "./MatchRateCard";
import { Card } from "@/app/_components/ui/card";
import {
  Calendar,
  CircleSlash,
  DollarSign,
  Ghost,
  MessageCircle,
  MessagesSquare,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { TooltipWrapper } from "@/app/_components/ui/tooltip";
import React from "react";

export default async function InsightsPage({
  params,
}: {
  params: {
    tinderId: string;
  };
}) {
  const swipestatsProfile = await api.profile.get({
    tinderId: params.tinderId,
  });

  if (!swipestatsProfile) {
    notFound();
  }

  return (
    <main className="container mx-auto px-6 pb-6 pt-12 md:pt-24">
      <InsightsProvider myTinderProfile={swipestatsProfile}>
        <h1 className="text-center text-6xl font-black">Insights</h1>

        <ComparisonForm tinderId={params.tinderId} />
        <div className="grid grid-cols-1 gap-10">
          {/* <GraphCardUsage chartDataKey="matchRate" title="Match Rate" /> */}
          <GraphCardUsage chartDataKey="matches" title="Matches" />
          <div className="grid gap-10 md:grid-cols-2">
            <MatchRateCard title="Match Rate" />
            <GraphCardUsage chartDataKey="appOpens" title="App Opens" />
          </div>
          <Card.Container>
            <Card.Header>
              <Card.Title>Messages meta</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <MessagesMetaCard
                title="# of conversations"
                icon={MessagesSquare}
                stat={swipestatsProfile.profileMeta?.nrOfConversations + ""}
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
                stat={swipestatsProfile.profileMeta?.longestConversation + ""}
              />

              <MessagesMetaCard
                title="# of no reply chats"
                icon={CircleSlash}
                stat={
                  swipestatsProfile.profileMeta?.nrOfOneMessageConversations +
                  ""
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
                    ?.percentOfOneMessageConversations + "%"
                }
              />
            </Card.Content>
          </Card.Container>
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
          {/* <GraphCardUsage chartDataKey="likeRate" title="Swipe Rate" /> */}
        </div>
        {/* <div className="grid grid-cols-2 gap-20">
        // fails becaose of use clinet?
          <GraphCardUsage chartDataKey="matches" title="Matches" />
        </div> */}

        {/* {false && (
        <>
          <div className="mb-1 mt-2 block  text-center text-gray-500 md:mb-0">
            or a specific Demographic
          </div>
          <div className="mx-6 justify-center md:flex md:items-center">
            <button
              className="focus:shadow-outline mt-2 rounded bg-rose-500 px-4 py-2 text-white  shadow hover:bg-red-300 focus:outline-none md:ml-4"
              type="button"
              onClick={() =>
                compareWithUser(
                  "96d5e7ba8f42af5f40b1ea25a3deafc035ebd5350521b925a5e6478e2aebfee5",
                )
              }
            >
              Creator
            </button>
            <button
              className="focus:shadow-outline mt-2 rounded bg-rose-500 px-4 py-2 text-white  shadow hover:bg-red-300 focus:outline-none md:ml-4"
              type="button"
              onClick={() =>
                compareWithUser(
                  "3f4b3a376a55ccbf7b57de1c1e19891ef36bd7ccdf370037e339d251ba5c85e9",
                )
              }
            >
              Deepa
            </button>
            <button
              className="focus:shadow-outline mt-2 rounded bg-rose-500 px-4 py-2 text-white  shadow hover:bg-red-300 focus:outline-none md:ml-4"
              type="button"
            >
              Random
            </button>
            <button
              className="focus:shadow-outline mt-2 rounded bg-rose-500 px-4 py-2 text-white  shadow hover:bg-red-300 focus:outline-none md:ml-4"
              type="button"
            >
              Global average
            </button>
            <button
              className="focus:shadow-outline mt-2 rounded bg-rose-500 px-4 py-2 text-white  shadow hover:bg-red-300 focus:outline-none md:ml-4"
              type="button"
            >
              Men
            </button>
            <button
              className="focus:shadow-outline mt-2 rounded bg-rose-500 px-4 py-2 text-white  shadow hover:bg-red-300 focus:outline-none md:ml-4"
              type="button"
            >
              Women
            </button>
            <button
              className="focus:shadow-outline mt-2 rounded bg-rose-500 px-4 py-2 text-white  shadow hover:bg-red-300 focus:outline-none md:ml-4"
              type="button"
            >
              Country
            </button>
          </div>
        </>
      )}

      {errors.length > 0 && (
        <Alert
          category="danger"
          title="Error"
          descriptionList={errors.map((e) => e.message)}
        />
      )} */}

        {/* <RoastBanner />
      <DataRequestCTA /> */}
      </InsightsProvider>
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
    <Card.Container>
      <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title className="text-sm font-medium">{props.title}</Card.Title>
        {/* <DollarSign className="text-muted-foreground h-4 w-4" /> */}
        <props.icon className="text-muted-foreground h-4 w-4" />
      </Card.Header>
      <Card.Content>
        <div className="text-2xl font-bold">{props.stat}</div>
        {props.from && (
          <p className="text-muted-foreground text-xs">{props.from}</p>
        )}
      </Card.Content>
    </Card.Container>
  );
}
