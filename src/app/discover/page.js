
"use client";
import { useState } from "react";
import { gql, Q } from "@/lib/anilist";
import { useLocalCache } from "@/lib/hooks";
import Section from "@/components/Section";
import HScroll from "@/components/HScroll";
import AnimeCard from "@/components/AnimeCard";
import AdSlot from "@/components/AdSlot";

export default function DiscoverPage(){
  const [moviesPage,setMoviesPage]=useState(1); const movies=useLocalCache(`movies-${moviesPage}`, ()=>gql(Q.SEARCH,{ page:moviesPage, perPage:24, format:["MOVIE"] }), [moviesPage]);
  const [tvPage,setTvPage]=useState(1); const tv=useLocalCache(`tv-${tvPage}`, ()=>gql(Q.SEARCH,{ page:tvPage, perPage:24, format:["TV"] }), [tvPage]);
  return (
    <div>
      <Section title="TV Series">{tv.loading && <div className="text-sm text-neutral-400">Loading...</div>}{tv.error && <div className="text-sm text-red-400">{String(tv.error.message||tv.error)}</div>}{tv.data && (<><HScroll>{tv.data.Page.media.map(m=> <AnimeCard key={m.id} m={m} />)}</HScroll></>)}</Section>
      <AdSlot label="Discover Mid" />
      <Section title="Movies">{movies.loading && <div className="text-sm text-neutral-400">Loading...</div>}{movies.error && <div className="text-sm text-red-400">{String(movies.error.message||movies.error)}</div>}{movies.data && (<><HScroll>{movies.data.Page.media.map(m=> <AnimeCard key={m.id} m={m} />)}</HScroll></>)}</Section>
    </div>
  );
}
