"use client";
export default function Tags({ tags = [] }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t.id}
          title={
            t.isGeneralSpoiler || t.isMediaSpoiler ? "Contains spoilers" : ""
          }
          className={`text-xs px-2 py-1 rounded-full border ${
            t.isGeneralSpoiler || t.isMediaSpoiler
              ? "border-red-500/40 text-red-300"
              : "border-neutral-700 bg-neutral-900"
          }`}
        >
          {t.name}
          {typeof t.rank === "number" ? ` • ${t.rank}` : ""}
        </span>
      ))}
    </div>
  );
}
