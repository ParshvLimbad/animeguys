"use client";
import React, { useMemo } from "react";
import Sparkline from "@/components/Sparkline";
import { compactNumber } from "@/lib/anilist";

function RankTile({ icon = "⭐", label, right }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 flex items-center gap-3">
      <span className="text-yellow-400">{icon}</span>
      <div className="text-xs flex-1">
        <div className="text-neutral-300">{label}</div>
      </div>
      <div className="text-xs text-neutral-400">{right}</div>
    </div>
  );
}

export default function StatsPanel({
  rankings = [],
  statusDist = [],
  scoreDist = [],
  trends = [],
}) {
  const activity = useMemo(
    () => trends.map((t) => ({ value: t.trending || 0 })),
    [trends]
  );
  const scoreProg = useMemo(
    () => trends.map((t) => ({ value: t.averageScore || 0 })),
    [trends]
  );
  const watchersProg = useMemo(
    () => trends.map((t) => ({ value: t.inProgress ?? t.popularity ?? 0 })),
    [trends]
  );

  return (
    <div className="space-y-6">
      {/* Rankings */}
      {rankings?.length ? (
        <div>
          <h4 className="font-semibold mb-2">Rankings</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rankings.slice(0, 6).map((r) => (
              <RankTile
                key={r.id}
                label={`#${r.rank} ${
                  r.type === "RATED" ? "Highest Rated" : "Most Popular"
                } ${r.allTime ? "All Time" : r.year || r.season || ""}`}
                right={r.context}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Activity */}
      <div>
        <h4 className="font-semibold mb-2">Recent Activity Per Day</h4>
        <Sparkline data={activity} valueKey="value" height={160} />
      </div>

      {/* Score Progression */}
      <div>
        <h4 className="font-semibold mb-2">Airing Score Progression</h4>
        <Sparkline data={scoreProg} valueKey="value" height={160} />
      </div>

      {/* Watchers Progression */}
      <div>
        <h4 className="font-semibold mb-2">Airing Watchers Progression</h4>
        <Sparkline data={watchersProg} valueKey="value" height={160} />
      </div>

      {/* Status Distribution */}
      {!!statusDist?.length && (
        <div>
          <h4 className="font-semibold mb-2">Status Distribution</h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {statusDist.map((s) => (
              <div
                key={s.status}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 flex items-center justify-between"
              >
                <span className="text-xs capitalize">
                  {s.status.toLowerCase()}
                </span>
                <span className="text-xs text-neutral-400">
                  {compactNumber(s.amount)} users
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
