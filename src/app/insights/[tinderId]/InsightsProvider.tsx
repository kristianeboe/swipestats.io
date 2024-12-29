"use client";

import { createGenericContext } from "@/lib/hooks/useGenericContext";
import { type FullTinderProfile } from "@/lib/interfaces/utilInterfaces";
import { api } from "@/trpc/react";
import {
  type User,
  type CustomData,
  type SwipestatsTier,
} from "@prisma/client";

import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
// import { type TinderUsage } from "@prisma/client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const [useInsightsProvider, InsightsContextProvider] = createGenericContext<{
  myTinderId: string;
  myTinderProfile: FullTinderProfile & {
    user: User;
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
  myTinderProfile: FullTinderProfile & {
    user: User;
  };
}) {
  const [comparisonIds, setComparisonIds] = useQueryState(
    "comparisonIds",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [loading, setLoading] = useState(true);

  const comparisonData = api.profile.compare.useQuery(
    {
      tinderId: props.myTinderProfile.tinderId,
      comparisonIds: comparisonIds,
    },
    {
      enabled: !!comparisonIds.length,
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
      {props.children}
    </InsightsContextProvider>
  );
}

export { InsightsProvider, useInsightsProvider };
