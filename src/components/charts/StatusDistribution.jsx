"use client";

import {
  BarChart,
  Bar,
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

const STATUS_COLORS = {
  CURRENT: "#22C55E",
  PLANNING: "#60A5FA",
  PAUSED: "#A78BFA",
  DROPPED: "#F97316",
  COMPLETED: "#EF4444",
};

export default function StatusDistribution({
  title = "Status Distribution",
  data,
}) {
  // data should be [{status:'CURRENT', amount: 93530}, ...]
  const chartData = data.map((d) => ({
    ...d,
    label: statusLabel(d.status),
    fill: STATUS_COLORS[d.status] ?? "#6B7280",
  }));

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-neutral-200">{title}</h3>
      <ChartContainer>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 6, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={{ stroke: "#303030" }}
              />
              <YAxis
                stroke="#9CA3AF"
                tickLine={false}
                axisLine={{ stroke: "#303030" }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend content={<ChartLegend />} />
              <Bar name="Users" dataKey="amount">
                {chartData.map((entry, index) => (
                  <rect key={`bar-seg-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </div>
  );
}

function statusLabel(s) {
  switch (s) {
    case "CURRENT":
      return "Current";
    case "PLANNING":
      return "Planning";
    case "PAUSED":
      return "Paused";
    case "DROPPED":
      return "Dropped";
    case "COMPLETED":
      return "Completed";
    default:
      return s;
  }
}
