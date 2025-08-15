"use client";
import { useEffect, useState } from "react";

export function titleEnFirst(t) {
  return t?.english || t?.romaji || t?.native || "";
}

export function getSeasonAndYear(d = new Date()) {
  const m = d.getMonth();
  const y = d.getFullYear();
  return {
    season: m <= 2 ? "WINTER" : m <= 5 ? "SPRING" : m <= 8 ? "SUMMER" : "FALL",
    year: y,
  };
}

export function fromUnix(sec) {
  return new Date(sec * 1000);
}

export function fmtDate(d) {
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Local cache hook (localStorage + TTL) */
export function useLocalCache(
  key,
  fetcher,
  deps = [],
  ttl = 1000 * 60 * 60 * 6
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const raw =
          typeof window !== "undefined" ? localStorage.getItem(key) : null;
        if (raw) {
          const p = JSON.parse(raw);
          if (Date.now() - p.time < ttl) {
            setData(p.data);
            setLoading(false);
            return;
          }
        }
        const fresh = await fetcher();
        if (!dead) {
          setData(fresh);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              key,
              JSON.stringify({ time: Date.now(), data: fresh })
            );
          }
          setLoading(false);
        }
      } catch (e) {
        if (!dead) {
          setError(e);
          setLoading(false);
        }
      }
    })();
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
    }
