// src/components/BackButton.jsx
"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ fallback = "/" }) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1)
          router.back();
        else router.push(fallback);
      }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-sm"
    >
      ← Back
    </button>
  );
}
