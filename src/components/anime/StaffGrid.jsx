"use client";
import React from "react";

export default function StaffGrid({ edges = [], onLoadMore, hasMore }) {
  if (!edges?.length)
    return <div className="text-sm text-neutral-400">No staff listed.</div>;

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
            Load more staff
          </button>
        </div>
      )}
    </>
  );
}
