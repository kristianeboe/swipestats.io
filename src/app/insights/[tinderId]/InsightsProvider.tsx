"use client";

import { createGenericContext } from "@/lib/hooks/useGenericContext";
import { type FullTinderProfile } from "@/lib/interfaces/utilInterfaces";
import { api } from "@/trpc/react";
import { type CustomData } from "@prisma/client";
// import { type TinderUsage } from "@prisma/client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const [useInsightsProvider, InsightsContextProvider] = createGenericContext<{
  myTinderId: string;
  myTinderProfile: FullTinderProfile;
  myCustomData: CustomData;
  profiles: FullTinderProfile[];
  // usageByProfile: Record<string, Record<string, TinderUsage>>;

  loading: boolean;
  addComparisonId: (data: { comparisonId: string }) => void;
  removeComparisonId: (data: { comparisonId: string }) => void;
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

  const router = useRouter();
  const pathname = usePathname();
  function addComparisonId(data: { comparisonId: string }) {
    // now you got a read/write object
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form
    const comparisonIdsQueryParam = current.get("comparisonIds");
    const existingComparisonIds = comparisonIdsQueryParam?.split(",");

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
      ? `${existingComparisonIds.join(",")},${data.comparisonId}`
      : data.comparisonId;

    const query = `?comparisonIds=${newComparisonIds}`;
    console.log({
      existingComparisonIds,
      newComparisonIds,
      query,
    });

    // current.set("comparisonIds", newComparisonIds);

    router.push(`${pathname}${query}`);
  }

  function removeComparisonId(data: { comparisonId: string }) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const comparisonIdsQueryParam = current.get("comparisonIds");
    const existingComparisonIds = comparisonIdsQueryParam?.split(",") ?? [];

    const newComparisonIds = existingComparisonIds
      .filter((id) => id !== data.comparisonId)
      .join(",");

    const query = newComparisonIds ? `?comparisonIds=${newComparisonIds}` : "";
    router.push(`${pathname}${query}`);
  }

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
      }}
    >
      {props.children}
    </InsightsContextProvider>
  );
}

export { InsightsProvider, useInsightsProvider };
