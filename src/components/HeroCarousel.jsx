// src/components/HeroCarousel.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { titleEnFirst } from "@/lib/ssr-utils";

export default function HeroCarousel({ items = [] }) {
  const list = useMemo(() => items.filter(Boolean).slice(0, 10), [items]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!list.length) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(id);
  }, [list.length]);

  const cur = list[idx];
  if (!cur) return null;

  const title = titleEnFirst(cur.title);
  const backdrop = cur.bannerImage || cur.coverImage?.extraLarge;

  return (
    <Link
      href={`/anime/${cur.id}`}
      className="block relative overflow-hidden rounded-2xl border border-neutral-800"
    >
      {backdrop && (
        <img
          src={backdrop}
          alt={title}
          className="w-full h-[320px] object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 p-5">
        <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow">
          {title}
        </h1>
        <div className="mt-2 text-sm text-neutral-300 flex gap-3">
          {cur.averageScore ? <span>★ {cur.averageScore}</span> : null}
          {cur.seasonYear ? <span>· {cur.seasonYear}</span> : null}
          {cur.format ? <span>· {cur.format}</span> : null}
        </div>
      </div>

      <div className="absolute right-4 bottom-4 flex gap-1">
        {list.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-4 rounded-full ${
              i === idx ? "bg-white" : "bg-white/40"
            }`}
            onClick={(e) => {
              e.preventDefault(); // don’t navigate when clicking dot
              setIdx(i);
            }}
          />
        ))}
      </div>
    </Link>
  );
}
