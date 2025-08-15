// src/lib/ssr-utils.js
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
