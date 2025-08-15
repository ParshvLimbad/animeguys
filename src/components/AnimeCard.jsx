// src/components/AnimeCard.jsx
"use client";
import { titleEnFirst } from "@/lib/ssr-utils";
import Link from "next/link";

export default function AnimeCard({ m, snap = false, minW = 160 }) {
  const title = titleEnFirst(m?.title);
  const img = m?.coverImage?.large || m?.coverImage?.extraLarge;

  return (
    <Link
      href={`/anime/${m.id}`}
      className={`group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 ${
        snap ? "snap-start" : ""
      }`}
      style={{ minWidth: `${minW}px` }}
    >
      <div className="aspect-[2/3] w-full overflow-hidden relative">
        {img ? (
          <>
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
          </>
        ) : (
          <div className="w-full h-full bg-neutral-800" />
        )}
      </div>
      <div className="p-2">
        <div className="text-sm font-medium line-clamp-2">{title}</div>
        <div className="mt-1 text-xs text-neutral-400 flex items-center gap-2">
          {m.averageScore ? <span>★ {m.averageScore}</span> : null}
          {m.seasonYear ? <span>· {m.seasonYear}</span> : null}
          {m.format ? (
            <span className="ml-auto bg-neutral-800 px-1.5 py-0.5 rounded">
              {m.format}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
