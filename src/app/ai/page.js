"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { fetchCatalog } from "@/lib/anilist";

// local safeSanitize guard (do not import to avoid missing export warnings)
function safeSanitize(text) {
  if (!text) return "";
  return String(text)
    .replace(/<br\s*\/?>(\n)?/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/["\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// tiny JSON extractor stays the same if you have one elsewhere
function extractJSONBlock(s) {
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) throw new Error("No JSON found");
  return JSON.parse(s.slice(first, last + 1));
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  // catalog states
  const [page1, setPage1] = useState(null);
  const [page2, setPage2] = useState(null);
  const loadingCatalogRef = useRef(false);

  const catalog = useMemo(() => {
    const arr = [page1?.Page?.media || [], page2?.Page?.media || []].flat();
    return arr.map((m) => ({
      id: m.id,
      title: (m?.title?.english || m?.title?.romaji || m?.title?.native || "").slice(0, 80).replace(/\"/g, "'"),
      genres: (m.genres || []).slice(0, 5).join(", "),
      year: m.seasonYear,
      format: m.format,
      desc: safeSanitize(m.description).slice(0, 280),
      coverImage: m.coverImage,
      titleObj: m.title,
    }));
  }, [page1, page2]);

  const catalogReady = catalog.length > 0;

  async function ensureCatalogLoaded() {
    if (catalogReady || loadingCatalogRef.current) return;
    loadingCatalogRef.current = true;
    try {
      const [d1, d2] = await Promise.all([fetchCatalog(1, 50), fetchCatalog(2, 50)]);
      setPage1(d1);
      setPage2(d2);
    } finally {
      loadingCatalogRef.current = false;
    }
  }

  // initial load
  useEffect(() => {
    ensureCatalogLoaded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getAI() {
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      // if user spam-clicks before load finishes, wait here
      if (!catalogReady) {
        await ensureCatalogLoaded();
      }
      // still not ready? show inline message instead of throwing
      if (!catalogReady) {
        setError("Loading the catalog… please try again in a second.");
        return;
      }

      // pick a subset
      const picked = [...catalog].sort(() => Math.random() - 0.5).slice(0, 60);
      const catalogText = picked
        .map(
          (m) =>
            `{id:${m.id}, title:'${m.title}', genres:'${m.genres}', year:${m.year || ""}, format:${m.format || ""}, desc:'${m.desc}'}`
        )
        .join("\n");

      const parts = [
        "You are an anime recommender. Return STRICT JSON only.",
        "From the catalog lines, pick EXACTLY 4 distinct anime IDs that best match the user's request. Prefer diversity.",
        "Return JSON with keys ids (array of 4 numbers) and reasons (array of 4 short strings).",
        "User request: " + (query || "surprise me based on popular anime."),
        "Random seed: " + seed,
        "Catalog:",
        catalogText,
      ];
      const userPrompt = parts.join("\n");

      const body = {
        model: "openai/gpt-oss-20b:free",
        messages: [
          { role: "system", content: "You are an anime recommender. Return STRICT JSON only." },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
      };

      const headers = {
        Authorization:
          "Bearer " +
          (typeof window !== "undefined"
            ? window.OPENROUTER_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
            : process.env.NEXT_PUBLIC_OPENROUTER_API_KEY),
        "Content-Type": "application/json",
        "X-Title": "Revuu Anime",
      };
      try {
        headers["HTTP-Referer"] = typeof window !== "undefined" ? window?.location?.origin || "" : "";
      } catch {}

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error("OpenRouter error: " + txt);
      }
      const json = await res.json();
      const content = json.choices?.[0]?.message?.content || "";
      const obj = extractJSONBlock(content);
      const ids = Array.isArray(obj.ids) ? obj.ids.slice(0, 4) : [];
      const reasons = Array.isArray(obj.reasons) ? obj.reasons : [];

      const map = new Map(catalog.map((m) => [m.id, m]));
      const items = ids
        .map((id, i) => ({ media: map.get(Number(id)), reason: reasons[i] }))
        .filter((x) => x.media);

      setResults(items);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-xl font-semibold mb-3">AI Picks (GPT-OSS via OpenRouter)</h1>

      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 mb-4">
        <div className="flex items-start gap-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            placeholder={'Describe what you want:\n(e.g., "dark fantasy with strong worldbuilding and moral dilemmas")'}
            className="flex-1 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm"
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={getAI}
              disabled={loading || !catalogReady}
              className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm disabled:opacity-50"
              title={!catalogReady ? "Loading catalog…" : "Get AI picks"}
            >
              {loading ? "Thinking..." : "Get AI picks"}
            </button>
            <button
              onClick={async () => {
                setSeed(Math.floor(Math.random() * 1e9));
                if (!loading) await getAI();
              }}
              disabled={loading || !catalogReady}
              className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm disabled:opacity-50"
              title={!catalogReady ? "Loading catalog…" : "Reroll"}
            >
              Reroll
            </button>
          </div>
        </div>
        <div className="text-xs text-neutral-500 mt-2">
          Seed: {seed} · New seed each refresh for variety.{!catalogReady ? " · Loading catalog…" : ""}
        </div>
        {error && <div className="mt-2 text-xs text-red-400">{error}</div>}
      </div>

      {!results.length && !loading && (
        <div className="text-sm text-neutral-400">
          {catalogReady ? "No picks yet. Describe your vibe and hit Get AI picks." : "Loading popular catalog…"}
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {results.map((r, idx) => (
            <a
              key={idx}
              href={`/anime/${r.media.id}`}
              className="group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700"
            >
              <div className="aspect-[2/3] w-full overflow-hidden relative">
                {r.media.coverImage?.large || r.media.coverImage?.extraLarge ? (
                  <>
                    <img
                      src={r.media.coverImage?.large || r.media.coverImage?.extraLarge}
                      alt={r.media.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
                  </>
                ) : (
                  <div className="w-full h-full bg-neutral-800" />
                )}
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold line-clamp-2">{r.media.title}</div>
                {r.reason && <div className="mt-2 text-xs text-neutral-400 line-clamp-3">{r.reason}</div>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

if (typeof window !== "undefined" && !window.__ai_catalog_tested) {
  window.__ai_catalog_tested = true;
  console.assert(typeof fetchCatalog === "function", "fetchCatalog exists");
}
