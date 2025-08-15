"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Minimal shadcn-style primitives (JSX version)
export function ChartContainer({ config, className, children, ...props }) {
  return (
    <div
      data-chart
      className={cn(
        "rounded-xl border border-neutral-800 bg-neutral-950 p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ChartTooltip({ active, payload, label, content }) {
  if (!active || !payload?.length) return null;
  const C = content ?? ChartTooltipContent;
  return <C label={label} payload={payload} />;
}

export function ChartTooltipContent({ label, payload }) {
  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm shadow">
      {label && <div className="mb-1 text-neutral-300">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-neutral-200">{p.name}:</span>
          <span className="text-neutral-400">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartLegend({ payload }) {
  if (!payload?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-3 text-xs">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-neutral-300">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  );
}
