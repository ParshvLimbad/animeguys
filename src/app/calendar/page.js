
"use client";
import { useMemo, useState } from "react";
import { gql, Q } from "@/lib/anilist";
import { useLocalCache } from "@/lib/hooks";
import { fromUnix, fmtDate, titleEnFirst } from "@/lib/utils";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";

export default function CalendarPage(){
  const now=Math.floor(Date.now()/1000); const to=now+14*24*3600; const [page,setPage]=useState(1);
  const { data,loading,error } = useLocalCache(`calendar-${page}`, ()=>gql(Q.CALENDAR,{ from:now, to, page, perPage:50 }), [page]);
  const items=data?.Page?.airingSchedules||[];
  const groups = useMemo(()=>{ const g={}; for(const a of items){ const d=fromUnix(a.airingAt); const day=d.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"}); (g[day] ||= []).push(a);} return g; }, [items]);
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Airing Calendar (next 14 days)</h1>
      {loading && <div className="text-sm text-neutral-400">Loading...</div>} {error && <div className="text-sm text-red-400">{String(error.message||error)}</div>}
      <div className="space-y-6">{Object.entries(groups).map(([day,arr])=> (
        <div key={day}><h3 className="text-sm uppercase tracking-wide text-neutral-400 mb-2">{day}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{arr.map(a=> (
            <Link key={a.id} href={`/anime/${a.media.id}`} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex gap-3">
              <img src={a.media.coverImage?.large} alt={titleEnFirst(a.media.title)} className="w-16 h-24 object-cover rounded" />
              <div className="text-sm"><div className="font-medium line-clamp-2">{titleEnFirst(a.media.title)}</div><div className="text-neutral-400 mt-1">Ep {a.episode} · {fmtDate(fromUnix(a.airingAt))}</div></div>
            </Link>
          ))}</div>
        </div>
      ))}</div>
      <AdSlot label="Calendar Ad" />
    </div>
  );
}
