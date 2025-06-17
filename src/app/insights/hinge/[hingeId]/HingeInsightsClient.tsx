"use client";

import { api } from "@/trpc/react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import { HingeLineChart } from "./HingeChart";
import React from "react";

interface HingeInsightsClientProps {
  hingeId: string;
}

export function HingeInsightsClient({ hingeId }: HingeInsightsClientProps) {
  const { data: hingeProfile, isLoading } = api.profile.getHinge.useQuery({
    hingeId,
  });

  const { data: matchStats, isLoading: matchesLoading } =
    api.profile.getHingeMatches.useQuery({
      hingeId,
    });

  const { data: likeStats, isLoading: likesLoading } =
    api.profile.getHingeLikes.useQuery({
      hingeId,
    });

  const { data: blockStats, isLoading: blocksLoading } =
    api.profile.getHingeBlocks.useQuery({
      hingeId,
    });

  // Calculate total and peak matches once data arrives
  const { totalMatches, peakMatches } = React.useMemo(() => {
    if (!matchStats?.length) {
      return { totalMatches: 0, peakMatches: 0 } as const;
    }
    const total = matchStats.reduce((sum, m) => sum + m.count, 0);
    const peak = matchStats.reduce((max, m) => Math.max(max, m.count), 0);
    return { totalMatches: total, peakMatches: peak } as const;
  }, [matchStats]);

  const { totalLikes, peakLikes } = React.useMemo(() => {
    if (!likeStats?.length) return { totalLikes: 0, peakLikes: 0 } as const;
    const total = likeStats.reduce((s, l) => s + l.count, 0);
    const peak = likeStats.reduce((p, l) => Math.max(p, l.count), 0);
    return { totalLikes: total, peakLikes: peak } as const;
  }, [likeStats]);

  const { totalBlocks, peakBlocks } = React.useMemo(() => {
    if (!blockStats?.length) return { totalBlocks: 0, peakBlocks: 0 } as const;
    const total = blockStats.reduce((s, b) => s + b.count, 0);
    const peak = blockStats.reduce((p, b) => Math.max(p, b.count), 0);
    return { totalBlocks: total, peakBlocks: peak } as const;
  }, [blockStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!hingeProfile) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No profile data found</p>
      </div>
    );
  }

  // Prepare chart data for preferences
  const preferencesData = [
    {
      category: "Age Range",
      min: hingeProfile.ageMin,
      max: hingeProfile.ageMax,
      value: hingeProfile.ageMax - hingeProfile.ageMin,
    },
    {
      category: "Height Range",
      min: Math.round(hingeProfile.heightMin / 2.54), // Convert to inches
      max: Math.round(hingeProfile.heightMax / 2.54), // Convert to inches
      value: Math.round(
        (hingeProfile.heightMax - hingeProfile.heightMin) / 2.54,
      ),
    },
    {
      category: "Distance",
      min: 0,
      max: hingeProfile.distanceMilesMax,
      value: hingeProfile.distanceMilesMax,
    },
  ];

  const chartConfig = {
    value: {
      label: "Range",
      color: "hsl(var(--chart-1))",
    },
  } as const;

  // Lifestyle preferences data
  const lifestyleData = [
    {
      name: "Smoking",
      value: hingeProfile.smoking ? "Yes" : "No",
      displayed: hingeProfile.smokingDisplayed,
    },
    {
      name: "Drinking",
      value: hingeProfile.drinking ? "Yes" : "No",
      displayed: hingeProfile.drinkingDisplayed,
    },
    {
      name: "Marijuana",
      value: hingeProfile.marijuana ? "Yes" : "No",
      displayed: hingeProfile.marijuanaDisplayed,
    },
    {
      name: "Drugs",
      value: hingeProfile.drugs ? "Yes" : "No",
      displayed: hingeProfile.drugsDisplayed,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Matches Over Time Chart */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Matches Over Time
          </h3>
          {matchStats && matchStats.length > 0 && !matchesLoading && (
            <div className="flex gap-6 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-gray-900">
                  {totalMatches}
                </span>{" "}
                total
              </div>
              <div>
                <span className="font-semibold text-gray-900">
                  {peakMatches}
                </span>{" "}
                peak
              </div>
            </div>
          )}
        </div>
        {matchesLoading || !matchStats ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
          </div>
        ) : matchStats.length === 0 ? (
          <p className="text-center text-gray-500">No match data found</p>
        ) : (
          <HingeLineChart
            data={matchStats.map((m) => ({ month: m.month, count: m.count }))}
            xKey="month"
            yKey="count"
            label="Matches"
            className="h-64"
          />
        )}
      </div>

      {/* Likes & Blocks Charts */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Likes Chart */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Likes Over Time
            </h3>
            {likeStats && likeStats.length > 0 && !likesLoading && (
              <div className="flex gap-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">
                    {totalLikes}
                  </span>{" "}
                  total
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {peakLikes}
                  </span>{" "}
                  peak
                </div>
              </div>
            )}
          </div>
          {likesLoading || !likeStats ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
            </div>
          ) : likeStats.length === 0 ? (
            <p className="text-center text-gray-500">No like data found</p>
          ) : (
            <HingeLineChart
              data={likeStats.map((l) => ({ month: l.month, count: l.count }))}
              xKey="month"
              yKey="count"
              label="Likes"
              className="h-64"
            />
          )}
        </div>

        {/* Blocks / Unlikes Chart */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Blocks / Unlikes Over Time
            </h3>
            {blockStats && blockStats.length > 0 && !blocksLoading && (
              <div className="flex gap-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">
                    {totalBlocks}
                  </span>{" "}
                  total
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {peakBlocks}
                  </span>{" "}
                  peak
                </div>
              </div>
            )}
          </div>
          {blocksLoading || !blockStats ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
            </div>
          ) : blockStats.length === 0 ? (
            <p className="text-center text-gray-500">No block data found</p>
          ) : (
            <HingeLineChart
              data={blockStats.map((b) => ({ month: b.month, count: b.count }))}
              xKey="month"
              yKey="count"
              label="Blocks / Unlikes"
              className="h-64"
            />
          )}
        </div>
      </div>

      {/* Lifestyle Preferences */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Lifestyle Choices
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {lifestyleData.map((item) => (
            <div
              key={item.name}
              className="rounded-lg bg-gray-50 p-4 text-center"
            >
              <div className="mb-2 text-2xl">
                {item.value === "Yes" ? "✅" : "❌"}
              </div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">
                {item.displayed ? "Displayed" : "Hidden"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dating Preferences Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Looking For
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Gender Preference</p>
              <p className="font-medium capitalize text-gray-900">
                {hingeProfile.genderPreference}
              </p>
            </div>
            {hingeProfile.datingIntention && (
              <div>
                <p className="text-sm text-gray-600">Dating Intention</p>
                <p className="font-medium text-gray-900">
                  {hingeProfile.datingIntention}
                </p>
              </div>
            )}
            {hingeProfile.relationshipType && (
              <div>
                <p className="text-sm text-gray-600">Relationship Type</p>
                <p className="font-medium text-gray-900">
                  {hingeProfile.relationshipType}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Family & Future
          </h3>
          <div className="space-y-3">
            {hingeProfile.children && (
              <div>
                <p className="text-sm text-gray-600">Children</p>
                <p className="font-medium text-gray-900">
                  {hingeProfile.children}
                </p>
              </div>
            )}
            {hingeProfile.familyPlans && (
              <div>
                <p className="text-sm text-gray-600">Family Plans</p>
                <p className="font-medium text-gray-900">
                  {hingeProfile.familyPlans}
                </p>
              </div>
            )}
            {hingeProfile.politics && (
              <div>
                <p className="text-sm text-gray-600">Politics</p>
                <p className="font-medium text-gray-900">
                  {hingeProfile.politics}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dealbreakers Section */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Dealbreakers
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <div className="mb-2 text-2xl">🚫</div>
            <p className="font-medium text-gray-900">Age</p>
            <p className="text-sm text-gray-600">
              {hingeProfile.ageDealbreaker ? "Strict" : "Flexible"}
            </p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <div className="mb-2 text-2xl">📏</div>
            <p className="font-medium text-gray-900">Height</p>
            <p className="text-sm text-gray-600">
              {hingeProfile.heightDealbreaker ? "Strict" : "Flexible"}
            </p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <div className="mb-2 text-2xl">🌍</div>
            <p className="font-medium text-gray-900">Ethnicity</p>
            <p className="text-sm text-gray-600">
              {hingeProfile.ethnicityDealbreaker ? "Strict" : "Flexible"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
