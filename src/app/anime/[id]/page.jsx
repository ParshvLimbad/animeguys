// src/app/anime/[id]/page.jsx
import React from "react";
import { gql, Q } from "@/lib/anilist";
import { fmtDate, fromUnix, titleEnFirst } from "@/lib/ssr-utils";
import BackButton from "@/components/BackButton";
import StreamingEpisodes from "@/components/StreamingEpisodes";
import Reviews from "@/components/Reviews";
import Characters from "@/components/Characters"; // <— add this
import StaffList from "@/components/StaffList";
import CommentsSupabase from "@/components/CommentsSupabase";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) return { title: "Anime" };
  try {
    const data = await gql(Q.DETAIL, { id: numId, airPage: 1, revPage: 1 });
    const m = data?.Media;
    return { title: m ? titleEnFirst(m.title) : "Anime" };
  } catch {
    return { title: "Anime" };
  }
}

export default async function Page({ params }) {
  const { id } = await params; // <-- async params in Next 15
  const numId = Number(id);
  if (!Number.isFinite(numId)) return notFound();

  const data = await gql(Q.DETAIL, { id: numId, airPage: 1, revPage: 1 });
  const m = data?.Media;
  const air = data?.Page?.airingSchedules || [];
  if (!m) return notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <BackButton className="mb-4" />

      {m.bannerImage && (
        <div className="w-full h-32 md:h-44 overflow-hidden rounded-2xl border border-neutral-800 mb-4">
          <img
            src={m.bannerImage}
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-5">
        <div className="grid grid-cols-[1fr] md:grid-cols-[220px,1fr] gap-5 items-start">
          <div>
            <img
              src={m.coverImage?.extraLarge}
              alt={titleEnFirst(m.title)}
              className="w-full max-w-[220px] md:max-w-none rounded-xl border border-neutral-800 shadow"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{titleEnFirst(m.title)}</h1>
            <div className="mt-1 text-sm text-neutral-300 flex flex-wrap gap-2 items-center">
              {m.averageScore ? <span>★ {m.averageScore}</span> : null}
              {m.episodes ? <span>· {m.episodes} eps</span> : null}
              {m.duration ? <span>· {m.duration} min/ep</span> : null}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(m.genres || []).map((g) => (
                <span
                  key={g}
                  className="text-xs bg-neutral-800 px-2 py-1 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
            {m.tags?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {m.tags.slice(0, 12).map((t) => (
                  <span
                    key={t.id}
                    className="text-xs bg-neutral-800/70 px-2 py-1 rounded"
                  >
                    {t.name} {typeof t.rank === "number" ? `(${t.rank})` : ""}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="mt-3 text-sm leading-relaxed text-neutral-200">
              {m.description || "No description."}
            </div>
          </div>
        </div>
      </div>

      {/* Episodes */}
      <section className="mt-6">
        <h3 className="font-semibold mb-3">Streaming Episodes</h3>
        <StreamingEpisodes episodes={m.streamingEpisodes} />
      </section>

      {/* Characters — now HScroll that auto-advances every 5s */}
      <Characters edges={m.characters?.edges || []} />

      {/* Staff */}
      <StaffList edges={m.staff?.edges || []} />

      {/* Reviews */}
      <Reviews reviews={m.reviews} />

      {/* Upcoming airings */}
      <section className="mt-8">
        <h3 className="font-semibold mb-2">Upcoming Airings</h3>
        {!air.length && (
          <div className="text-sm text-neutral-400">
            No upcoming schedule listed.
          </div>
        )}
        <div className="space-y-2">
          {air.map((a) => (
            <div
              key={a.id}
              className="text-sm bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 flex items-center gap-3"
            >
              <span className="text-neutral-400">Ep {a.episode}</span>
              <span>· {fmtDate(fromUnix(a.airingAt))}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Comments (client) */}
      <CommentsSupabase
        animeId={numId}
        title={titleEnFirst(m.title) || "Anime"}
      />
    </div>
  );
}
