// src/lib/hooks.js
"use client";

import { useEffect, useState } from "react";

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
          const parsed = JSON.parse(raw);
          if (Date.now() - parsed.time < ttl) {
            setData(parsed.data);
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
