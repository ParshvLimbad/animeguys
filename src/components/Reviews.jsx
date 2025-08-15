import React from "react";

export default function Reviews({ reviews }) {
  const nodes = reviews?.nodes || [];
  return (
    <section className="mt-6">
      <h3 className="font-semibold mb-3">AniList Reviews</h3>
      {!nodes.length && (
        <div className="text-sm text-neutral-400">No reviews available.</div>
      )}
      <div className="space-y-3">
        {nodes.map((r) => (
          <a
            key={r.id}
            href={`https://anilist.co/review/${r.id}`}
            target="_blank"
            rel="noreferrer"
            className="block bg-neutral-900 border border-neutral-800 rounded-xl p-3 hover:border-neutral-700"
          >
            <div className="flex items-center gap-3 mb-2">
              {r.user?.avatar?.large ? (
                <img
                  src={r.user.avatar.large}
                  alt={r.user?.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-neutral-800" />
              )}
              <div className="text-sm">
                <div className="font-medium">{r.user?.name || "User"}</div>
                <div className="text-neutral-400 text-xs">
                  Score: {r.score ?? "-"} ·{" "}
                  {new Date(r.createdAt * 1000).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-sm leading-relaxed text-neutral-200 line-clamp-4">
              {r.summary || r.body}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
