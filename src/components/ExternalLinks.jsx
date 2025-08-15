"use client";
export default function ExternalLinks({ links }) {
  const streaming = (links || []).filter((l) => l?.type === "STREAMING");
  if (!streaming.length)
    return (
      <div className="text-sm text-neutral-400">
        No official streaming links listed.
      </div>
    );
  return (
    <div className="flex flex-wrap gap-2">
      {streaming.map((l, i) => (
        <a
          key={i}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium"
        >
          Watch on {l.site}
        </a>
      ))}
    </div>
  );
}
