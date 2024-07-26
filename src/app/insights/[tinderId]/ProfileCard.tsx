/**
 * v0 by Vercel.
 * @see https://v0.dev/t/dbOBOOU1v38
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardHeader, CardContent } from "@/app/_components/ui/card";
import { type FullTinderProfile } from "@/lib/interfaces/utilInterfaces";
import { cn, getLabelForTinderProfile } from "@/lib/utils";
import { useState } from "react";

export default function ProfileCard(props: { profile: FullTinderProfile }) {
  const location = `${props.profile.city ? `${props.profile.city}${props.profile.region ? `, ${props.profile.region}` : ""}` : props.profile.region ?? ""}${props.profile.country ? ` ${props.profile.country}` : ""}`;

  const meta = props.profile.profileMeta;

  const [expandBio, setExpandBio] = useState(false);

  return (
    <Card.Container className="relative mx-auto w-full">
      <Card.Header className="rounded-t bg-gray-800 p-6">
        <Card.Title className="text-white">
          {getLabelForTinderProfile(props.profile)}
        </Card.Title>
        <Card.Description className="text-gray-300">
          Looking for{" "}
          {props.profile.genderFilter === "FEMALE" ? "women" : "men"} ages{" "}
          {props.profile.ageFilterMin} - {props.profile.ageFilterMax}
        </Card.Description>
      </Card.Header>
      <Card.Content className="mt-4 flex gap-4">
        <div className="flex w-1/2 flex-col">
          {location && (
            <div className="text-muted-foreground text-sm">
              <strong>Location:</strong> {location}
            </div>
          )}

          {props.profile.jobTitle && (
            <div className="text-muted-foreground text-sm">
              <strong>Job Title:</strong> {props.profile.jobTitle}
            </div>
          )}

          {props.profile.company && (
            <div className="text-muted-foreground text-sm">
              <strong>Company:</strong> {props.profile.company}
            </div>
          )}

          {props.profile.school && (
            <div className="text-muted-foreground text-sm">
              <strong>School:</strong> {props.profile.school}
            </div>
          )}
        </div>

        <div
          className="prose flex w-1/2"
          onClick={() => setExpandBio(!expandBio)}
        >
          <p className={cn(expandBio ? "" : "line-clamp-6")}>
            {props.profile.bio}
          </p>
        </div>
      </Card.Content>

      {/* <Card.Content>
        <div className="mt-4 grid gap-4">
          <div>
            <h3 className="text-lg font-semibold">Activity Overview</h3>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Days on Tinder: {props.profile.daysInProfilePeriod}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Days Active on Tinder: {meta.daysActiveOnApp}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Last Active Time: {props.profile.lastDayOnApp.toString()}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Interaction Statistics</h3>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Total Matches: {meta.matchesTotal}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Total Messages Sent: {meta.messagesSentTotal}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Total Messages Received: {meta.messagesReceivedTotal}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Match Rate: {meta.matchRateForPeriod * 100}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Like Rate: {meta.likeRateForPeriod * 100}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Messages Sent Rate: {meta.messagesSentRateForPeriod * 100}%
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Engagement Metrics</h3>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Average Matches per Day: {meta.averageMatchesPerDay.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Average App Opens per Day: {meta.averageAppOpensPerDay}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Average Swipe Likes per Day: {meta.averageSwipeLikesPerDay}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Average Messages Sent per Day:{" "}
                {meta.averageMessagesSentPerDay.toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Average Messages Received per Day:{" "}
                {meta.averageMessagesReceivedPerDay.toFixed(2)}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Peak Activity</h3>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Peak Matches: {meta.peakMatches} on{" "}
                {meta.peakMatchesDate.toISOString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Peak App Opens: {meta.peakAppOpens} on{" "}
                {meta.peakAppOpensDate.toISOString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Peak Swipe Likes: {meta.peakSwipeLikes} on{" "}
                {meta.peakSwipeLikesDate.toISOString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Peak Messages Sent: {meta.peakMessagesSent} on{" "}
                {meta.peakMessagesSentDate.toISOString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground text-sm">
                Peak Messages Received: {meta.peakMessagesReceived} on{" "}
                {meta.peakMessagesReceivedDate.toISOString()}
              </div>
            </div>
          </div>
        </div>
      </Card.Content> */}
    </Card.Container>
  );
}
