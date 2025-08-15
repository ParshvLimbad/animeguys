
"use client";
import Link from "next/link";

export default function Shell({ children }){
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-30 backdrop-blur bg-neutral-950/70 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-xl font-black tracking-tight">Revuu Anime</Link>
          <nav className="ml-auto flex items-center gap-2 text-sm">
            <Link className="px-3 py-1.5 rounded hover:bg-neutral-800" href="/">Home</Link>
            <Link className="px-3 py-1.5 rounded hover:bg-neutral-800" href="/search">Search</Link>
            <Link className="px-3 py-1.5 rounded hover:bg-neutral-800" href="/calendar">Calendar</Link>
            <Link className="px-3 py-1.5 rounded hover:bg-neutral-800" href="/discover">Discover</Link>
            <Link className="px-3 py-1.5 rounded hover:bg-neutral-800" href="/ai">AI Recs</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 py-10 text-xs text-neutral-400">
        Built with AniList + OpenRouter (GPT OSS). Official streaming links only. No login.
      </footer>
    </div>
  );
}
