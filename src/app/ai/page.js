
"use client";
import { useEffect, useMemo, useState } from "react";
import { gql, Q } from "@/lib/anilist";
import { safeSanitize, titleEnFirst } from "@/lib/utils";
import AdSlot from "@/components/AdSlot";
import AnimeCard from "@/components/AnimeCard";
import { getOpenRouterKey } from "@/lib/supabaseClient";

function extractJSONBlock(s){
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) throw new Error("No JSON found");
  const candidate = s.slice(first, last + 1);
  return JSON.parse(candidate);
}

function AICard({ m, reason }){
  const title = titleEnFirst(m?.title);
  const img = m?.coverImage?.large || m?.coverImage?.extraLarge;
  return (
    <a href={`/anime/${m.id}`} className="group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700">
      <div className="aspect-[2/3] w-full overflow-hidden relative">{img ? (<><img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-[1.03] transition" loading="lazy"/><div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0"/></>) : (<div className="w-full h-full bg-neutral-800" />)}</div>
      <div className="p-3">
        <div className="text-sm font-semibold line-clamp-2">{title}</div>
        {reason && <div className="mt-2 text-xs text-neutral-400 line-clamp-3">{reason}</div>}
      </div>
    </a>
  );
}

export default function AIRecsPage(){
  const [query, setQuery] = useState("");
  const [seed, setSeed] = useState(()=> Math.floor(Math.random()*1e9));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const [page1, setPage1] = useState(null);
  const [page2, setPage2] = useState(null);
  useEffect(()=>{ (async()=>{ try{ const d1 = await gql(Q.CATALOG,{page:1, perPage:50}); const d2 = await gql(Q.CATALOG,{page:2, perPage:50}); setPage1(d1); setPage2(d2); }catch(e){ console.error(e);} })(); },[]);

  const catalog = useMemo(()=>{
    const arr = [page1?.Page?.media||[], page2?.Page?.media||[]].flat();
    return arr.map(m=>({
      id: m.id,
      title: (titleEnFirst(m.title) || "").slice(0,80).replace(/\"/g, "'"),
      genres: (m.genres||[]).slice(0,5).join(", "),
      year: m.seasonYear,
      format: m.format,
      desc: safeSanitize(m.description).slice(0,280),
      coverImage: m.coverImage,
      titleObj: m.title
    }));
  }, [page1, page2]);

  async function getAI(){
    setLoading(true); setError(null); setResults([]);
    try{
      if(!catalog.length) throw new Error("Catalog still loading. Try again in a moment.");
      const picked = [...catalog].sort(()=>Math.random()-0.5).slice(0,60);
      const catalogText = picked.map(m=>`{id:${m.id}, title:'${m.title}', genres:'${m.genres}', year:${m.year||""}, format:${m.format||""}, desc:'${m.desc}'}`).join("\n");
      const parts = [
        "You are an anime recommender. Return STRICT JSON only.",
        "From the catalog lines, pick EXACTLY 4 distinct anime IDs that best match the user's request. Prefer diversity.",
        "Return JSON with keys ids (array of 4 numbers) and reasons (array of 4 short strings).",
        "User request: "+(query || "surprise me based on popular anime."),
        "Random seed: "+seed,
        "Catalog:",
        catalogText
      ];
      const userPrompt = parts.join("\n");
      const body = {
        model: "openai/gpt-oss-20b:free",
        messages: [
          { role: "system", content: "You are an anime recommender. Return STRICT JSON only." },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8
      };
      const headers = { "Authorization": "Bearer "+getOpenRouterKey(), "Content-Type": "application/json", "X-Title": "Revuu Anime" };
      try{ headers["HTTP-Referer"] = window?.location?.origin || ""; }catch{}
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers, body: JSON.stringify(body) });
      if(!res.ok){ const txt = await res.text(); throw new Error("OpenRouter error: "+txt); }
      const json = await res.json();
      const content = json.choices?.[0]?.message?.content || "";
      const obj = extractJSONBlock(content);
      const ids = Array.isArray(obj.ids)? obj.ids.slice(0,4) : [];
      const reasons = Array.isArray(obj.reasons)? obj.reasons : [];
      const map = new Map(catalog.map(m=>[m.id, m]));
      const items = ids.map((id, i)=> ({ media: map.get(Number(id)), reason: reasons[i] })).filter(x=>x.media);
      setResults(items);
    }catch(e){ setError(String(e.message||e)); }
    finally{ setLoading(false); }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-3">AI Picks (GPT-OSS via OpenRouter)</h1>
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 mb-4">
        <div className="flex items-start gap-2">
          <textarea value={query} onChange={(e)=>setQuery(e.target.value)} rows={3} placeholder={"Describe what you want:\n(e.g., \"dark fantasy with strong worldbuilding and moral dilemmas\")"} className="flex-1 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm" />
          <div className="flex flex-col gap-2">
            <button onClick={getAI} disabled={loading} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm">{loading? "Thinking...":"Get AI picks"}</button>
            <button onClick={()=>{ setSeed(Math.floor(Math.random()*1e9)); if(!loading) getAI(); }} className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm">Reroll</button>
          </div>
        </div>
        <div className="text-xs text-neutral-500 mt-2">Seed: {seed} · New seed each refresh for variety.</div>
        {error && <div className="mt-2 text-xs text-red-400">{error}</div>}
      </div>

      {!results.length && !loading && <div className="text-sm text-neutral-400">No picks yet. Describe your vibe and hit Get AI picks.</div>}

      {results.length>0 && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {results.map((r,idx)=> <AICard key={idx} m={{...r.media, title: r.media.titleObj}} reason={r.reason} />)}
        </div>
      )}

      <AdSlot label="AI Recs Ad" />
    </div>
  );
}
