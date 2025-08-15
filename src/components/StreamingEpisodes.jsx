import React from "react";

export default function StreamingEpisodes({ episodes = [] }) {
  if (!episodes?.length) {
    return (
      <div className="text-sm text-neutral-400">
        No episode list available. Check streaming links above.
      </div>
    );
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {episodes.map((e, idx) => (
        <a
          key={idx}
          href={e.url}
          target="_blank"
          rel="noreferrer"
          className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
        >
          <div className="aspect-video w-full overflow-hidden">
            {e.thumbnail ? (
              <img
                src={e.thumbnail}
                alt={e.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition"
              />
            ) : (
              <div className="w-full h-full bg-neutral-800" />
            )}
          </div>
          <div className="p-3 text-sm font-medium line-clamp-2">{e.title}</div>
        </a>
      ))}
    </div>
  );
}
