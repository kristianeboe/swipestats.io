import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { cn } from "@/lib/utils";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import React from "react";

interface HingeLineChartProps {
  /**
   * Array of objects representing data points.
   * Example: [{ month: "2024-01", count: 12 }]
   */
  data: Record<string, string | number>[];
  /** Key on each data object that represents the X-axis value */
  xKey: string;
  /** Key on each data object that represents the Y-axis value */
  yKey: string;
  /** Label shown in the tooltip & legend */
  label?: string;
  /** Tailwind/hex/hsl color for the line */
  lineColor?: string;
  /** Height / additional classes for the chart wrapper */
  className?: string;
}

export function HingeLineChart({
  data,
  xKey,
  yKey,
  label = "Value",
  lineColor = "hsl(var(--chart-1))",
  className,
}: HingeLineChartProps) {
  // Fill missing months so that a single point doesn't leave the line invisible
  const normalizedData = React.useMemo(() => {
    if (!data.length) return [] as typeof data;

    // expect YYYY-MM format
    const parse = (s: string): { y: number; m: number } => {
      const [yStr, mStr] = s.split("-");
      return { y: Number(yStr), m: Number(mStr) };
    };

    const monthsToStr = (y: number, m: number) =>
      `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}`;

    const sorted = [...data].sort((a, b) =>
      String(a[xKey]).localeCompare(String(b[xKey])),
    );

    // After early return above, we know sorted has at least one item, but TS doesn't.
    // Safely assert the first and last items exist.
    const firstItem = sorted[0]!;
    const lastItem = sorted[sorted.length - 1]!;

    const first = parse(firstItem[xKey] as string);
    const last = parse(lastItem[xKey] as string);

    const filled: Record<string, (typeof sorted)[0]> = {};
    sorted.forEach((d) => {
      filled[d[xKey] as string] = d;
    });

    for (let y = first.y; y <= last.y; y++) {
      const startM = y === first.y ? first.m : 1;
      const endM = y === last.y ? last.m : 12;
      for (let m = startM; m <= endM; m++) {
        const key = monthsToStr(y, m);
        if (!filled[key]) {
          filled[key] = { [xKey]: key, [yKey]: 0 } as Record<
            string,
            string | number
          >;
        }
      }
    }

    return Object.values(filled).sort((a, b) =>
      String(a[xKey]).localeCompare(String(b[xKey])),
    );
  }, [data, xKey, yKey]);

  // Configure ChartContainer colors/labels
  const chartConfig = {
    [yKey]: {
      label,
      color: lineColor,
    },
  } as const;

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto h-64 w-full", className)}
    >
      <RechartsAreaChart
        data={normalizedData}
        margin={{ top: 5, right: 10, left: 16, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`fill-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={`var(--color-${yKey})`}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={`var(--color-${yKey})`}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value: string) => {
            const [year, month] = value.split("-");
            const date = new Date(Number(year), Number(month) - 1);
            return date.toLocaleString("default", { month: "short" });
          }}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey={yKey}
          type="natural"
          fill={`url(#fill-${yKey})`}
          stroke={`var(--color-${yKey})`}
          dot={{ fill: `var(--color-${yKey})`, r: 2 }}
          activeDot={{ r: 5 }}
          connectNulls
        />
      </RechartsAreaChart>
    </ChartContainer>
  );
}
