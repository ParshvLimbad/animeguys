// src/app/browse/trending/page.jsx
"use client";
import { useEffect, useState } from "react";
import { gql, Q } from "@/lib/anilist";
import AnimeCard from "@/components/AnimeCard";
import Masonry from "@/components/Masonry";

export default function TrendingBrowse() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function load(p = 1) {
    setLoading(true);
    setErr(null);
    try {
      const data = await gql(Q.TRENDING, { page: p, perPage: 30 });
      const media = data?.Page?.media || [];
      const pi = data?.Page?.pageInfo;
      setRows((r) => (p === 1 ? media : [...r, ...media]));
      setHasNext(pi?.hasNextPage);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Trending — All</h1>
        <div className="text-sm text-neutral-500">
          Loaded {rows.length} items
        </div>
      </div>

      {err && (
        <div className="text-sm text-red-400">{String(err.message || err)}</div>
      )}

      <Masonry minCol={220}>
        {rows.map((m) => (
          <AnimeCard key={m.id} m={m} />
        ))}
      </Masonry>

      <div className="mt-6 flex justify-center">
        <button
          disabled={!hasNext || loading}
          onClick={() => load(page + 1) && setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 disabled:opacity-50"
        >
          {loading ? "Loading…" : hasNext ? "Load more" : "No more results"}
        </button>
      </div>
    </main>
  );
}
