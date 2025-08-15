
"use client";
export default function Paginator({ pageInfo, onPage }){
  if(!pageInfo) return null;
  return (
    <div className="flex items-center gap-3 mt-4">
      <button onClick={()=>onPage(Math.max(1, pageInfo.currentPage-1))} disabled={pageInfo.currentPage<=1} className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 disabled:opacity-50">Prev</button>
      <div className="text-sm">Page {pageInfo.currentPage}</div>
      <button onClick={()=>onPage(pageInfo.currentPage+1)} disabled={!pageInfo.hasNextPage} className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 disabled:opacity-50">Next</button>
    </div>
  );
}
