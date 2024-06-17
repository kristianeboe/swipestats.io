"use client";

import { createGenericContext } from "@/lib/hooks/useGenericContext";
import { type FullTinderProfile } from "@/lib/interfaces/utilInterfaces";
import { api } from "@/trpc/react";
// import { type TinderUsage } from "@prisma/client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

const [useInsightsProvider, InsightsContextProvider] = createGenericContext<{
  myTinderId: string;
  myTinderProfile: FullTinderProfile;
  profiles: FullTinderProfile[];
  // usageByProfile: Record<string, Record<string, TinderUsage>>;

  loading: boolean;
}>();

function InsightsProvider(props: {
  children: ReactNode;
  myTinderProfile: FullTinderProfile;
}) {
  const searchParams = useSearchParams();
  const comparisonIds = searchParams.get("comparisonIds");

  const [loading, setLoading] = useState(true);

  const comparisonData = api.profile.compare.useQuery(
    {
      tinderId: props.myTinderProfile.tinderId,
      comparisonIds: comparisonIds ? comparisonIds.split(",") : [],
    },
    {
      enabled: !!comparisonIds?.length,
      refetchOnWindowFocus: false,
    },
  );

  const profiles = useMemo(() => {
    return [props.myTinderProfile, ...(comparisonData.data ?? [])];
  }, [comparisonData.data, props.myTinderProfile]);

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

  return (
    <InsightsContextProvider
      value={{
        myTinderId: props.myTinderProfile.tinderId,
        myTinderProfile: props.myTinderProfile,
        loading,
        profiles,
        // usageByProfile,
      }}
    >
      {props.children}
    </InsightsContextProvider>
  );
}

export { InsightsProvider, useInsightsProvider };
