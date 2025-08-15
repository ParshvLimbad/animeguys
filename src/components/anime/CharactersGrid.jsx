"use client";
import React from "react";
import { titleEnFirst } from "@/lib/anilist";

export default function CharactersGrid({ edges = [], onLoadMore, hasMore }) {
  if (!edges?.length)
    return (
      <div className="text-sm text-neutral-400">No characters listed.</div>
    );

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {edges.map((e, i) => (
          <div
            key={i}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex gap-3"
          >
            <img
              src={e.node?.image?.large}
              alt={e.node?.name?.full}
              className="w-16 h-20 object-cover rounded"
            />
            <div className="text-sm">
              <div className="font-medium">{e.node?.name?.full}</div>
              <div className="text-neutral-400 text-xs">{e.role}</div>
              {!!e.voiceActors?.length && (
                <div className="mt-2 flex items-center gap-2">
                  {e.voiceActors.slice(0, 2).map((va) => (
                    <div
                      key={va.id}
                      title={`${va.name?.full} (${va.languageV2})`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={va.image?.large}
                        alt={va.name?.full}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs">{va.name?.full}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-3">
          <button
            onClick={onLoadMore}
            className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-sm"
          >
            Load more characters
          </button>
        </div>
      )}
    </>
  );
}
