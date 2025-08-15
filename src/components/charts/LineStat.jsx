"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";

export default function LineStat({
  title,
  data,
  xKey = "label",
  yKey = "value",
  color = "#60A5FA", // tailwind sky-400
  height = 240,
  yAxisWidth = 40,
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-neutral-200">{title}</h3>
      <ChartContainer className="w-full">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 6, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis
                dataKey={xKey}
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={{ stroke: "#303030" }}
                minTickGap={20}
              />
              <YAxis
                width={yAxisWidth}
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={{ stroke: "#303030" }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend content={<ChartLegend />} />
              <Line
                name={title}
                type="monotone"
                dataKey={yKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </div>
  );
}
