"use client";
import { GraphCardUsage } from "./GraphCardUsage";

export function GraphCardsUsage() {
  return (
    <div className="grid grid-cols-2 gap-20">
      <GraphCardUsage chartDataKey="matches" title="Matches" />
      <GraphCardUsage chartDataKey="appOpens" title="App Opens" />
      <GraphCardUsage chartDataKey="messagesSent" title="Messages Sent" />
      <GraphCardUsage
        chartDataKey="messagesReceived"
        title="Messages Received"
      />
      <GraphCardUsage chartDataKey="swipeLikes" title="Swipe Likes" />
      <GraphCardUsage chartDataKey="swipePasses" title="Swipe Passes" />

      {/* <GraphCardUsage chartDataKey="appOpens" title="App opens" /> */}
    </div>
  );
}
