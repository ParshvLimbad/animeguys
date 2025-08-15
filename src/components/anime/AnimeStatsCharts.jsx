// src/components/anime/AnimeStatsCharts.jsx
"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

function Card({ title, children }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="h-[220px]">{children}</div>
    </div>
  );
}

export default function AnimeStatsCharts({
  activityPerDay = [],
  scoreProgression = [],
  watchersProgression = [],
  statusDistribution = [],
}) {
  const statusData = statusDistribution.map((s) => ({
    name: s.status,
    value: s.amount,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Recent Activity Per Episode">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activityPerDay}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopOpacity={0.6} stopColor="#16a34a" />
                <stop offset="95%" stopOpacity={0} stopColor="#16a34a" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              fill="url(#g1)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Airing Score Progression">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scoreProgression}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#60a5fa"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Airing Watchers Progression">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={watchersProgression}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#fbbf24"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Status Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusData}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
              }}
            />
            <Bar dataKey="value" fill="#a78bfa" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
