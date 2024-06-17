"use client";
import {
  type ChartDataPoint,
  type DateString,
} from "@/lib/interfaces/utilInterfaces";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useInsightsProvider } from "./[tinderId]/InsightsProvider";
const testData = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page A", uv: 450, pv: 2500, amt: 2200 },
  { name: "Page A", uv: 500, pv: 2600, amt: 2000 },
];

const testData2 = [
  {
    xDataKey: "Page A",
    yDataKey: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    xDataKey: "Page B",
    yDataKey: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    xDataKey: "Page C",
    yDataKey: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    xDataKey: "Page D",
    yDataKey: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    xDataKey: "Page E",
    yDataKey: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    xDataKey: "Page F",
    yDataKey: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    xDataKey: "Page G",
    yDataKey: 3490,
    pv: 4300,
    amt: 2100,
  },
];

// function LChart(props: {
//   data?: { name: string; uv: number; pv: number; amt: number }[];
// }) {
//   const data = props.data ?? testData;
//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
//         <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//         <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// }

function LChart(props: { data?: ChartDataPoint[] }) {
  const { profiles } = useInsightsProvider();
  const data = props.data ?? testData;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        {profiles.map((profile) => (
          <Line
            key={profile.tinderId}
            type="monotone"
            dataKey={profile.tinderId}
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        ))}

        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip />
        <Legend wrapperStyle={{ color: "#6b7280" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export type ChartTimeSeriesData = {
  date: DateString;
  value: number;
}[];

export type SwipeStatsChartData = {
  dateStampRaw: DateString;
  matches?: number;
  appOpens?: number;
  swipeLikes?: number;
  superLikes?: number;
  swipePasses?: number;
  messagesReceived?: number;
  messagesSent?: number;
  value?: number;
}[];

export type ChartData = {
  xDataKey: string;
  yDataKey: number;
}[];

export type Series = {
  id: string;
  data: SwipeStatsChartData;
};

function AChart(props: { data: ChartData }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        //  width={730}
        // height={250}
        data={props.data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>

          <linearGradient id="yDataColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fc5a8d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#fc5a8d" stopOpacity={0} />
          </linearGradient>

          {/* <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient> */}
        </defs>
        <XAxis
          dataKey="xDataKey"
          domain={["auto", "auto"]}
          // name="Time"
          //   tickFormatter={(unixTime: number) =>
          //     new Date(unixTime).toLocaleDateString()
          //   }
          // type="number"
        />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="yDataKey"
          stroke="#fc5a8d"
          fillOpacity={1}
          fill="url(#yDataColor)"
        />
        {/* <Area
          type="monotone"
          dataKey="pv"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        /> */}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export const Chart = {
  Line: LChart,
  Area: AChart,
};
