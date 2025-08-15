"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { gql, Q } from "@/lib/anilist";
import { getSeasonAndYear } from "@/lib/ssr-utils";
import { useLocalCache } from "@/lib/client-cache";
import HeroCarousel from "@/components/HeroCarousel";
import HScroll from "@/components/HScroll";
import AnimeCard from "@/components/AnimeCard";

export default function HomePage() {
  const [trendPage, setTrendPage] = useState(1);
  const [popPage, setPopPage] = useState(1);
  const { season, year } = useMemo(() => getSeasonAndYear(), []);
  const [seaPage, setSeaPage] = useState(1);

  const trending = useLocalCache(
    `trending-${trendPage}`,
    () => gql(Q.TRENDING, { page: trendPage, perPage: 20 }),
    [trendPage]
  );
  const popular = useLocalCache(
    `popular-${popPage}`,
    () => gql(Q.POPULAR, { page: popPage, perPage: 20 }),
    [popPage]
  );
  const seasonal = useLocalCache(
    `seasonal-${season}-${year}-${seaPage}`,
    () =>
      gql(Q.SEASONAL, { season, seasonYear: year, page: seaPage, perPage: 20 }),
    [season, year, seaPage]
  );

  const heroItems =
    trending.data?.Page?.media?.slice(0, 8) ||
    popular.data?.Page?.media?.slice(0, 8) ||
    [];

  return (
    <div className="max-w-6xl mx-auto">
      <HeroCarousel items={heroItems} />

      {/* Trending Now */}
      <section className="mb-10 mt-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-semibold">Trending Now</h2>
          <Link
            href="/browse/trending"
            className="text-sm text-emerald-400 hover:underline"
          >
            View more
          </Link>
        </div>
        {trending.loading && (
          <div className="text-sm text-neutral-400">Loading...</div>
        )}
        {trending.error && (
          <div className="text-sm text-red-400">
            {String(trending.error.message || trending.error)}
          </div>
        )}
        {trending.data && (
          <HScroll>
            {trending.data.Page.media.map((m) => (
              <AnimeCard key={m.id} m={m} />
            ))}
          </HScroll>
        )}
      </section>

      {/* Popular */}
      <section className="mb-10">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-semibold">Popular</h2>
        </div>
        {popular.loading && (
          <div className="text-sm text-neutral-400">Loading...</div>
        )}
        {popular.error && (
          <div className="text-sm text-red-400">
            {String(popular.error.message || popular.error)}
          </div>
        )}
        {popular.data && (
          <HScroll>
            {popular.data.Page.media.map((m) => (
              <AnimeCard key={m.id} m={m} />
            ))}
          </HScroll>
        )}
      </section>

      {/* This Season */}
      <section className="mb-10">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-semibold">{`Season · ${season} ${year}`}</h2>
        </div>
        {seasonal.loading && (
          <div className="text-sm text-neutral-400">Loading...</div>
        )}
        {seasonal.error && (
          <div className="text-sm text-red-400">
            {String(seasonal.error.message || seasonal.error)}
          </div>
        )}
        {seasonal.data && (
          <HScroll>
            {seasonal.data.Page.media.map((m) => (
              <AnimeCard key={m.id} m={m} />
            ))}
          </HScroll>
        )}
      </section>
    </div>
  );
}
