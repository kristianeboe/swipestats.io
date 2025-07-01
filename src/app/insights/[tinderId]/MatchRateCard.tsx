"use client";
import { useMemo, useState } from "react";
import { useInsightsProvider } from "./InsightsProvider";
import {
  MultiAChart2Combined,
  aggregateDataPoints,
  findPeak,
} from "./GraphCardUsage";
import { type ChartDataPoint } from "@/lib/interfaces/utilInterfaces";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/_components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { Badge } from "@/app/_components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { format } from "date-fns";
import { Info } from "lucide-react";

export function MatchRateCard(props: {
  title: string;
  description?: string;
  footer?: string;
}) {
  const [active, setActive] = useState<"year" | "month">("month");
  const { myTinderProfile, profiles } = useInsightsProvider();

  const aggregateProfileMatches = useMemo(
    () =>
      profiles.map((p) => ({
        tinderId: p.tinderId,
        firstDayOnApp: p.firstDayOnApp,
        lastDayOnApp: p.lastDayOnApp,
        ...aggregateDataPoints(
          "matches",
          p.usage,
          myTinderProfile.firstDayOnApp,
          myTinderProfile.lastDayOnApp,
        ),
      })),
    [profiles, myTinderProfile],
  );

  const aggregateProfileSwipeLikes = useMemo(
    () =>
      profiles.map((p) => ({
        tinderId: p.tinderId,
        firstDayOnApp: p.firstDayOnApp,
        lastDayOnApp: p.lastDayOnApp,
        ...aggregateDataPoints(
          "swipeLikes",
          p.usage,
          myTinderProfile.firstDayOnApp,
          myTinderProfile.lastDayOnApp,
        ),
      })),
    [profiles, myTinderProfile],
  );

  const chartData = useMemo(() => {
    const tinderIdTemplate = profiles.reduce(
      (acc, profile) => {
        acc[profile.tinderId] = 0; // Initialize each Tinder ID with a value of 0
        return acc;
      },
      {} as Record<string, number>,
    );

    const cd: ChartDataPoint[] = [];

    profiles.forEach((p, i) => {
      const aggregateSwipeLikes = aggregateProfileSwipeLikes[i]!;
      const aggregateMatches = aggregateProfileMatches[i]!;

      const timeSeriesSwipeLikes =
        active === "year"
          ? aggregateSwipeLikes.byYear
          : active === "month"
            ? aggregateSwipeLikes.byMonth
            : aggregateSwipeLikes.byDay;

      const timeSeriesMatches =
        active === "year"
          ? aggregateMatches.byYear
          : active === "month"
            ? aggregateMatches.byMonth
            : aggregateMatches.byDay;

      timeSeriesSwipeLikes.forEach((dp, i) => {
        const existingCdp = cd.find((c) => c.xDataKey === dp.xDataKey);
        const matchCountThisDay = timeSeriesMatches[i]!;

        const value = dp.value ? (matchCountThisDay.value / dp.value) * 100 : 0; // made into %

        if (!existingCdp) {
          cd.push({
            xDataKey: dp.xDataKey,
            ...tinderIdTemplate,
            [p.tinderId]: value,
          } as ChartDataPoint);
        } else {
          existingCdp[p.tinderId] = value;
        }
      });
    });

    return cd;
  }, [active, aggregateProfileSwipeLikes, aggregateProfileMatches, profiles]);

  // todo move to backend, maybe
  const badges = useMemo(() => {
    const timeSeries = chartData.map((dp) => ({
      xDataKey: dp.xDataKey,
      value: dp[myTinderProfile.tinderId]!,
    }));

    const peak = findPeak(timeSeries);

    const average = !timeSeries.length
      ? 0
      : timeSeries.reduce((acc, dp) => acc + dp.value, 0) / timeSeries.length;

    return {
      peak,
      average,
    };
  }, [chartData, myTinderProfile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        {props.description && (
          <CardDescription>{props.description}</CardDescription>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge variant={"secondary"}>
            {badges.average.toFixed(1)}% average per {active}
          </Badge>
          {!badges.peak ? null : badges.peak.value > 1 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant={"secondary"} className="items-center">
                    {badges.peak.value.toFixed(1)}% peak in{" "}
                    {format(new Date(badges.peak.date), "MMMM yyyy")}
                    <Info className="ml-1 h-3 w-3" />
                  </Badge>
                </TooltipTrigger>

                <TooltipContent>
                  <p>
                    Peak can be over 100% if you got swiped a lot at the end of
                    <br />
                    one month, and then matched a lot at the beginning of the
                    <br />
                    next month
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Badge variant={"secondary"}>
              {badges.peak.value.toFixed(1)} peak on{" "}
              {format(new Date(badges.peak.date), "MMMM yyyy")}
            </Badge>
          )}
        </div>
      </CardHeader>
      {/* <CardContent>
        <Chart.Line />
      </CardContent> */}
      <CardContent className="pl-0">
        {/* <Chart.Area data={chartData} /> */}
        <MultiAChart2Combined data={chartData} mode={active} yPercent />
        {/* <Chart.Line data={chartData} /> */}
      </CardContent>
      {props.footer && (
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      )}
      <CardFooter className="flex justify-center">
        <Tabs value={active} className="">
          <TabsList>
            <TabsTrigger value="year" onClick={() => setActive("year")}>
              Year
            </TabsTrigger>
            <TabsTrigger value="month" onClick={() => setActive("month")}>
              Month
            </TabsTrigger>
            {/* <TabsTrigger value="day" onClick={() => setActive("day")}>
                Day
              </TabsTrigger> */}
          </TabsList>
        </Tabs>
      </CardFooter>
    </Card>
  );
}
