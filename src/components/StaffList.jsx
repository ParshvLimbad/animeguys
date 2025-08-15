import React from "react";

export default function StaffList({ edges = [] }) {
  if (!edges.length) return null;
  return (
    <section className="mt-6">
      <h3 className="font-semibold mb-3">Staff</h3>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {edges.map((ed, i) => (
          <div
            key={i}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex gap-3"
          >
            <img
              src={ed.node?.image?.large}
              alt={ed.node?.name?.full}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="text-sm">
              <div className="font-medium">{ed.node?.name?.full}</div>
              <div className="text-neutral-400 text-xs">{ed.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
