"use client";
import React from "react";

export default function Sparkline({
  data = [],
  width = 800,
  height = 140,
  strokeWidth = 2,
  showArea = true,
  valueKey = "value",
  label,
}) {
  const vals = data.map((d) => Number(d[valueKey] ?? d));
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 1);
  const padX = 16;
  const padY = 18;
  const w = width - padX * 2;
  const h = height - padY * 2;

  const pts = vals.map((v, i) => {
    const x = padX + (i / Math.max(vals.length - 1, 1)) * w;
    const y = padY + (1 - (v - min) / Math.max(max - min || 1, 1)) * h;
    return [x, y];
  });

  const d = pts
    .map((p, i) => (i ? `L${p[0]},${p[1]}` : `M${p[0]},${p[1]}`))
    .join(" ");

  // Area path
  const area = showArea
    ? d + ` L${padX + w},${padY + h} L${padX},${padY + h} Z`
    : "";

  const last = pts[pts.length - 1];

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="block">
        {showArea && (
          <path d={area} fill="rgba(16,185,129,0.15)" stroke="none" />
        )}
        <path
          d={d}
          stroke="rgb(16,185,129)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {last && (
          <>
            <circle cx={last[0]} cy={last[1]} r="3.5" fill="rgb(16,185,129)" />
            {label && (
              <text
                x={last[0] + 8}
                y={last[1] - 6}
                fontSize="11"
                fill="#9ca3af"
              >
                {label}
              </text>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
