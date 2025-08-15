
"use client";
import { useState } from "react";
import { gql, Q } from "@/lib/anilist";
import { useLocalCache } from "@/lib/hooks";
import Section from "@/components/Section";
import Paginator from "@/components/Paginator";
import AnimeCard from "@/components/AnimeCard";
import AdSlot from "@/components/AdSlot";

export default function SearchPage(){
  const [q,setQ]=useState(""); const [format,setFormat]=useState(""); const [year,setYear]=useState(""); const [genre,setGenre]=useState(""); const [page,setPage]=useState(1);
  const genres = useLocalCache("genres", ()=>gql(Q.GENRES), []);
  const key=`search-${q}-${format}-${year}-${genre}-${page}`;
  const search = useLocalCache(key, ()=>gql(Q.SEARCH,{ q:q||undefined, page, perPage:24, format: format? [format]:undefined, genre: genre? [genre]:undefined, year: year? Number(year):undefined }), [q,format,year,genre,page]);
  return (
    <div>
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 mb-6">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <input value={q} onChange={(e)=>{setQ(e.target.value); setPage(1);}} placeholder="Search anime..." className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800" />
          <select value={format} onChange={(e)=>{setFormat(e.target.value); setPage(1);}} className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800"><option value="">Any Format</option>{["TV","TV_SHORT","MOVIE","OVA","ONA","SPECIAL","MUSIC"].map(f=> <option key={f} value={f}>{f}</option>)}</select>
          <input value={year} onChange={(e)=>{setYear(e.target.value); setPage(1);}} placeholder="Year (e.g., 2024)" className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800" />
          <select value={genre} onChange={(e)=>{setGenre(e.target.value); setPage(1);}} className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800"><option value="">Any Genre</option>{genres.data?.GenreCollection?.map(g=> <option key={g} value={g}>{g}</option>)}</select>
        </div>
      </div>
      {search.loading && <div className="text-sm text-neutral-400">Type to search...{q?" Loading...":""}</div>}
      {search.error && <div className="text-sm text-red-400">{String(search.error.message||search.error)}</div>}
      {search.data && (
        <>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {search.data.Page.media.map(m=> <AnimeCard key={m.id} m={m} />)}
          </div>
          <Paginator pageInfo={search.data.Page.pageInfo} onPage={setPage} />
        </>
      )}
      <AdSlot label="Search Page Ad" />
    </div>
  );
}
