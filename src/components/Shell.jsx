
"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Shell({ children }) {
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      <Link className="px-3 py-1.5 rounded hover:bg-neutral-800" href="/">
        Home
      </Link>
      <Link className="px-3 py-1.5 rounded hover:bg-neutral-800" href="/search">
        Search
      </Link>
      <Link className="px-3 py-1.5 rounded hover:bg-neutral-800" href="/calendar">
        Calendar
      </Link>
      <Link className="px-3 py-1.5 rounded hover:bg-neutral-800" href="/discover">
        Discover
      </Link>
      <Link className="px-3 py-1.5 rounded hover:bg-neutral-800" href="/ai">
        AI Recs
      </Link>
    </>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-30 backdrop-blur bg-neutral-950/70 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-xl font-black tracking-tight">
            Animerecs
          </Link>
          <button
            className="ml-auto p-2 rounded hover:bg-neutral-800 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <nav className="ml-auto hidden items-center gap-2 text-sm md:flex">
            {navLinks}
          </nav>
        </div>
        {open && (
          <nav className="md:hidden border-t border-neutral-800 bg-neutral-950/95">
            <div className="px-4 py-2 flex flex-col gap-2 text-sm">
              {navLinks}
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 py-10 text-xs text-neutral-400">
        Built with AniList + OpenRouter (GPT OSS). Official streaming links only. No login.
      </footer>
    </div>
  );
}
