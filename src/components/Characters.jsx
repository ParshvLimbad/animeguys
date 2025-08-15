"use client";

import React from "react";
import HScroll from "./HScroll";

export default function Characters({ edges = [] }) {
  if (!edges.length) return null;

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Characters</h3>
      </div>

      <HScroll autoAdvanceMs={5000}>
        {edges.map((e) => {
          const key = `${e?.id || e?.node?.id || Math.random()}-${
            e?.role || ""
          }`;
          const charName = e?.node?.name?.full || "Character";
          const charImg = e?.node?.image?.large;
          const role = e?.role || "";
          const va = e?.voiceActors?.[0];
          const vaName = va?.name?.full;
          const vaImg = va?.image?.large;

          return (
            <div key={key} className="min-w-[180px] snap-start">
              <div className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                <div className="aspect-[2/3] w-full overflow-hidden">
                  {charImg ? (
                    <img
                      src={charImg}
                      alt={charName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800" />
                  )}
                </div>
                <div className="p-2">
                  <div className="text-sm font-medium line-clamp-2">
                    {charName}
                  </div>
                  {role && (
                    <div className="text-xs text-neutral-400 mt-1">{role}</div>
                  )}
                  {vaName && (
                    <div className="mt-2 flex items-center gap-2">
                      {vaImg ? (
                        <img
                          src={vaImg}
                          alt={vaName}
                          className="w-6 h-6 rounded-full"
                          loading="lazy"
                        />
                      ) : null}
                      <div className="text-xs text-neutral-300 line-clamp-1">
                        {vaName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </HScroll>
    </section>
  );
}
