"use client";
import React from "react";
import Tags from "@/components/Tags";
import ExternalLinks from "@/components/ExternalLinks";
import TrailerBlock from "@/components/TrailerBlock";
import { titleEnFirst } from "@/lib/anilist";
import { useRouter } from "next/navigation";

export default function DetailCard({ m }) {
  const title = titleEnFirst(m.title);
  const router = useRouter();

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-5">
      <div className="mb-3">
        <button
          onClick={() =>
            window.history.length > 1 ? router.back() : router.push("/")
          }
          className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-700 text-sm"
        >
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-[1fr] md:grid-cols-[220px,1fr] gap-5 items-start">
        <div>
          <img
            src={m.coverImage?.extraLarge}
            alt={title}
            className="w-full max-w-[220px] md:max-w-none rounded-xl border border-neutral-800 shadow"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="mt-1 text-sm text-neutral-300 flex flex-wrap gap-2 items-center">
            {m.averageScore ? <span>★ {m.averageScore}</span> : null}
            {m.episodes ? <span>· {m.episodes} eps</span> : null}
            {m.duration ? <span>· {m.duration} min/ep</span> : null}
            {m.seasonYear ? <span>· {m.seasonYear}</span> : null}
            {m.format ? <span>· {m.format}</span> : null}
          </div>
          <div className="mt-2">
            <Tags tags={m.tags || []} />
          </div>
          <div className="mt-3 text-sm leading-relaxed text-neutral-200">
            {m.description || "No description."}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Watch legally</h3>
            <ExternalLinks links={m.externalLinks} />
          </div>
          <TrailerBlock links={m.externalLinks} />
        </div>
      </div>
    </div>
  );
}
