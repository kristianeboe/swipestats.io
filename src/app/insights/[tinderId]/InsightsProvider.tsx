"use client";

import { createGenericContext } from "@/lib/hooks/useGenericContext";
import { type FullTinderProfile } from "@/lib/interfaces/utilInterfaces";
import { api } from "@/trpc/react";
import {
  type User,
  type CustomData,
  type SwipestatsTier,
  type TinderProfile,
} from "@prisma/client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
// import { type TinderUsage } from "@prisma/client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const [useInsightsProvider, InsightsContextProvider] = createGenericContext<{
  myTinderId: string;
  myTinderProfile: TinderProfile & {
    user: User;
    customData: CustomData;
  };
  myCustomData: CustomData;
  profiles: FullTinderProfile[];
  // usageByProfile: Record<string, Record<string, TinderUsage>>;

  loading: boolean;
  addComparisonId: (data: { comparisonId: string }) => void;
  removeComparisonId: (data: { comparisonId: string }) => void;
  swipestatsTier: SwipestatsTier;
  comparisonIdsArray: string[];
}>();

function InsightsProvider(props: {
  children: ReactNode;
  myTinderProfile: TinderProfile & {
    user: User;
    customData: CustomData;
  };
}) {
  const [comparisonIds, setComparisonIds] = useQueryState(
    "comparisonIds",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [loading, setLoading] = useState(true);

  const profilesWithUsageData = api.profile.compare.useQuery(
    {
      tinderId: props.myTinderProfile.tinderId,
      comparisonIds: comparisonIds,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const profiles = useMemo(() => {
    return profilesWithUsageData.data ?? [];
  }, [profilesWithUsageData.data]);

  // const usageByProfile = useMemo(() => {
  //   return profiles.reduce(
  //     (acc, cur) => {
  //       acc[cur.tinderId] = cur.usage.reduce(
  //         (acc, cur) => {
  //           acc[cur.dateStampRaw] = cur;
  //           return acc;
  //         },
  //         {} as Record<string, TinderUsage>,
  //       );
  //       return acc;
  //     },
  //     {} as Record<string, Record<string, TinderUsage>>,
  //   );
  // }, [profiles]);

  function addComparisonId(data: { comparisonId: string }) {
    // now you got a read/write object

    const existingComparisonIds = comparisonIds;

    if (data.comparisonId === props.myTinderProfile.tinderId) {
      toast("You are trying to compare with yourself");
      return;
    }

    if (existingComparisonIds?.includes(data.comparisonId)) {
      toast("You are already comparing with this id");
      return;
    }

    // update as necessary
    const newComparisonIds = existingComparisonIds
      ? [...existingComparisonIds, data.comparisonId]
      : [data.comparisonId];

    void setComparisonIds(newComparisonIds);

    // current.set("comparisonIds", newComparisonIds);

    // router.push(`${pathname}${query}`);
  }

  function removeComparisonId(data: { comparisonId: string }) {
    const existingComparisonIds = comparisonIds;

    const newComparisonIds = existingComparisonIds.filter(
      (id) => id !== data.comparisonId,
    );
    // .join(",");

    void setComparisonIds(newComparisonIds);

    // const query = newComparisonIds ? `?comparisonIds=${newComparisonIds}` : "";
    // router.push(`${pathname}${query}`);
  }

  const swipestatsTier = props.myTinderProfile.user.swipestatsTier;

  return (
    <InsightsContextProvider
      value={{
        myTinderId: props.myTinderProfile.tinderId,
        myTinderProfile: props.myTinderProfile,
        myCustomData: props.myTinderProfile.customData,
        loading,
        profiles,
        // usageByProfile,
        addComparisonId,
        removeComparisonId,
        swipestatsTier,
        comparisonIdsArray: comparisonIds,
      }}
    >
      {profiles.length ? props.children : <LoadingSkeleton />}
    </InsightsContextProvider>
  );
}

export { InsightsProvider, useInsightsProvider };

export default function LoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      {/* Title and Stats Overview */}
      <div className="space-y-6">
        <div className="mx-auto h-8 w-48 animate-pulse rounded-md bg-gray-200" />
        <div className="flex justify-center gap-4">
          <div className="h-24 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-24 w-48 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Main Chart */}
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
        <div className="h-[300px] w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        <div className="mt-2 flex justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 w-16 animate-pulse rounded-md bg-gray-200"
            />
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {[1, 2].map((section) => (
          <div key={section} className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
            <div className="h-[200px] w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          </div>
        ))}
      </div>

      {/* Messages Meta Section */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200" />
            <div className="h-8 w-16 animate-pulse rounded-md bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Feedback Section */}
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded-md bg-gray-200" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-8 animate-pulse rounded-full bg-gray-200"
            />
          ))}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="h-[200px] w-full animate-pulse rounded-xl bg-gradient-to-r from-rose-100 via-rose-200 to-rose-100" />

      {/* Additional Charts */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {[1, 2].map((chart) => (
          <div key={chart} className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
            <div className="h-[200px] w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            <div className="flex justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-6 w-16 animate-pulse rounded-md bg-gray-200"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Banner */}
      <div className="h-[150px] w-full animate-pulse rounded-xl bg-gradient-to-r from-rose-100 via-rose-200 to-rose-100" />

      {/* Footer */}
      <div className="flex justify-center space-x-4 pt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-4 w-16 animate-pulse rounded-md bg-gray-200"
          />
        ))}
      </div>
    </div>
  );
}
