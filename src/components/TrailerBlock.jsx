"use client";
export default function TrailerBlock({ links }) {
  const yt = (links || []).find(
    (l) =>
      l.site === "YouTube" &&
      (l.url?.includes("watch") || l.url?.includes("youtu.be"))
  );
  if (!yt) return null;
  let id = "";
  try {
    const u = new URL(yt.url);
    id = u.searchParams.get("v") || "";
  } catch {}
  if (!id && yt.url?.includes("youtu.be/"))
    id = yt.url.split("youtu.be/")[1]?.split(/[?&]/)[0] || "";
  if (!id) return null;
  return (
    <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
