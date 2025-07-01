"use client";

import { format } from "date-fns";
import { type TinderUsage } from "@prisma/client";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useInsightsProvider } from "./InsightsProvider";
import {
  type ChartDataPoint,
  type ChartDataKey,
  type FullTinderProfile,
} from "@/lib/interfaces/utilInterfaces";

import { Badge } from "@/app/_components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/_components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { getProfileTitle, getChartColors } from "./insightUtils";
import { toTitleCase } from "@/lib/utils/string";

interface AggregateData {
  xDataKey: string;
  value: number;
}

function initializeMonthlyAggregations(
  startDate: Date,
  endDate: Date,
): Record<string, AggregateData> {
  const aggregationByMonth: Record<string, AggregateData> = {};

  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  for (
    let date = new Date(start);
    date <= end;
    date.setMonth(date.getMonth() + 1)
  ) {
    const monthKey = date.toISOString().slice(0, 7); // Format as "YYYY-MM"
    aggregationByMonth[monthKey] = {
      xDataKey: monthKey,
      value: 0, // Initialize value
    };
  }

  return aggregationByMonth;
}

function initializeYearlyAggregations(
  startDate: Date,
  endDate: Date,
): Record<string, AggregateData> {
  const aggregationByYear: Record<string, AggregateData> = {};

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  for (let year = startYear; year <= endYear; year++) {
    const yearKey = year.toString(); // Format as "YYYY"
    aggregationByYear[yearKey] = {
      xDataKey: yearKey,
      value: 0, // Initialize value
    };
  }

  return aggregationByYear;
}

export function aggregateDataPoints(
  chartDataKey: ChartDataKey,
  timeSeriesData: TinderUsage[],
  startDate: Date,
  endDate: Date,
): {
  byDay: AggregateData[];
  byMonth: AggregateData[];
  byYear: AggregateData[];
} {
  const aggregationByMonth: Record<string, AggregateData> =
    initializeMonthlyAggregations(startDate, endDate);
  const aggregationByYear: Record<string, AggregateData> =
    initializeYearlyAggregations(startDate, endDate);

  timeSeriesData.forEach((dataPoint) => {
    const value = dataPoint[chartDataKey] ?? 0;

    const month = dataPoint.dateStampRaw.substring(0, 7); // Get YYYY-MM format
    const year = dataPoint.dateStampRaw.substring(0, 4); // Get YYYY format

    if (!aggregationByMonth[month]) {
      aggregationByMonth[month] = { xDataKey: month, value: 0 };
    }

    if (!aggregationByYear[year]) {
      aggregationByYear[year] = { xDataKey: year, value: 0 };
    }

    aggregationByMonth[month].value += value;
    aggregationByYear[year].value += value;
  });

  const byMonth: AggregateData[] = Object.values(aggregationByMonth).sort(
    (a, b) => a.xDataKey.localeCompare(b.xDataKey),
  );
  const byYear: AggregateData[] = Object.values(aggregationByYear).sort(
    (a, b) => a.xDataKey.localeCompare(b.xDataKey),
  );

  const byDay: AggregateData[] = timeSeriesData.map((dataPoint) => ({
    xDataKey: dataPoint.dateStampRaw,
    value: dataPoint[chartDataKey] ?? 0,
  }));

  return {
    byDay,
    byMonth,
    byYear,
  };
}

export function GraphCardUsage(props: {
  chartDataKey: ChartDataKey;
  title: string;
  description?: string;
  footer?: string;
}) {
  const [active, setActive] = useState<"year" | "month" | "day">("month");
  const { myTinderProfile, profiles } = useInsightsProvider();

  const aggregateProfiles = useMemo(
    () =>
      profiles.map((p) => ({
        tinderId: p.tinderId,
        firstDayOnApp: p.firstDayOnApp,
        lastDayOnApp: p.lastDayOnApp,
        ...aggregateDataPoints(
          props.chartDataKey,
          p.usage,
          myTinderProfile.firstDayOnApp,
          myTinderProfile.lastDayOnApp,
        ),
      })),
    [profiles, props.chartDataKey, myTinderProfile],
  );

  //? I used to think this belongs on the backend, but because of the aggregate nature, I think at least it can wait til later
  const badges = useMemo(() => {
    return aggregateProfiles.map((p) => {
      const total = p.byYear
        .flatMap((dp) => dp.value)
        .reduce((acc, val) => acc + val, 0);
      const timeSeries =
        active === "year" ? p.byYear : active === "month" ? p.byMonth : p.byDay;
      const peak = findPeak(timeSeries);
      const average =
        timeSeries.reduce((acc, dp) => acc + dp.value, 0) / timeSeries.length;

      return {
        total,
        peak,
        average,
      };
    });
  }, [active, aggregateProfiles]);

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
      const aggregateData = aggregateProfiles[i]!;
      const timeSeries =
        active === "year"
          ? aggregateData.byYear
          : active === "month"
            ? aggregateData.byMonth
            : aggregateData.byDay;

      timeSeries.forEach((dp) => {
        const existingCdp = cd.find((c) => c.xDataKey === dp.xDataKey);

        if (!existingCdp) {
          cd.push({
            xDataKey: dp.xDataKey,
            ...tinderIdTemplate,
            [p.tinderId]: dp.value,
          } as ChartDataPoint);
        } else {
          existingCdp[p.tinderId] = dp.value;
        }
      });
    });

    return cd;
  }, [active, aggregateProfiles, profiles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        {props.description && (
          <CardDescription>{props.description}</CardDescription>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge>{badges[0]?.total} total</Badge>
          <Badge variant={"secondary"}>
            {badges[0]?.average?.toFixed(1)} average per {active}
          </Badge>
          <Badge variant={"secondary"}>
            {badges[0]?.peak?.value} peak on {badges[0]?.peak?.date}{" "}
          </Badge>
        </div>
      </CardHeader>
      {/* <CardContent>
          <Chart.Line />
        </CardContent> */}
      <CardContent className="pl-0">
        {/* <Chart.Area data={chartData} /> */}
        <MultiAChart2Combined data={chartData} mode={active} />
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
            <TabsTrigger value="day" onClick={() => setActive("day")}>
              Day
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardFooter>
    </Card>
  );
}

export function findPeak(data: AggregateData[]):
  | {
      value: number;
      date: string;
    }
  | undefined {
  if (data.length === 0) {
    return undefined; // or alternatively, return { value: 0, date: "" } if you want to return default values when there is no data
  }

  return data.reduce(
    (peak, dp) => {
      if (dp.value > peak.value) {
        return { value: dp.value, date: dp.xDataKey };
      }
      return peak;
    },
    { value: 0, date: data.at(0)!.xDataKey },
  );
}

export function MultiAChart2Combined(props: {
  data: ChartDataPoint[];
  mode?: "day" | "month" | "year";
  yPercent?: boolean;
}) {
  const mode = props.mode ?? "month";
  const { profiles } = useInsightsProvider();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={props.data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          {profiles.map((p, index) => {
            const colors = getChartColors(p.tinderId, index);
            return (
              <linearGradient
                key={p.tinderId}
                id={`gradient-${p.tinderId}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={colors.area} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors.area} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <XAxis
          dataKey="xDataKey"
          domain={["auto", "auto"]}
          tickLine={false}
          tickFormatter={(value: string, i) => {
            switch (mode) {
              case "year":
                return format(new Date(value), "yyyy");
              case "month":
                return format(new Date(value), "MMM yyyy");
              case "day":
                return format(new Date(value), "MMM d, yyyy");
              default:
                return value;
            }
          }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={props.yPercent ? (v) => `${v}%` : undefined}
        />
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <Tooltip
          content={
            // @ts-expect-error this works
            <CustomTooltip profiles={profiles} />
          }
        />
        {profiles.map((p, index) => {
          const colors = getChartColors(p.tinderId, index);

          return (
            <Area
              key={p.tinderId}
              type="monotone"
              dataKey={p.tinderId}
              stroke={colors.line}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#gradient-${p.tinderId})`}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip = ({
  profiles,
  active,
  payload,
  label,
}: {
  profiles: FullTinderProfile[];
  payload: {
    name: string;
    dataKey: string;
    value: number;
    payload: { xDataKey: string };
  }[];
  label: string;
  active: boolean;
}) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-white p-2 text-sm shadow-lg">
        <p className="font-bold text-gray-800">{label}</p>
        {payload.map((pld, i) => {
          const profile = profiles[i];
          if (!profile) return null;

          const specialTitle = getProfileTitle(profile.tinderId);
          const profileLabel =
            i === 0
              ? "You"
              : (specialTitle ??
                `${toTitleCase(profile.gender)}, ${profile.ageAtUpload}`);

          return (
            <p key={i} className="text-gray-600">
              {profileLabel}: {pld.value}
            </p>
          );
        })}
      </div>
    );
  }

  return null;
};
