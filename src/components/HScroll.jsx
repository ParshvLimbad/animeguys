"use client";

import React, { useEffect, useRef } from "react";

/**
 * Generic horizontal scroller.
 * - autoAdvanceMs: set to 5000 (5s) for auto-advance; 0 disables it.
 * - Uses snap + smooth scrolling and custom scrollbar styling.
 */
export default function HScroll({
  children,
  autoAdvanceMs = 0,
  className = "",
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!autoAdvanceMs || autoAdvanceMs < 800) return;
    const el = ref.current;
    if (!el) return;

    const tick = () => {
      if (!el) return;
      const step = Math.floor(el.clientWidth * 0.85); // ~1 viewport at a time
      const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + step,
        behavior: "smooth",
      });
    };

    const id = setInterval(tick, autoAdvanceMs);
    return () => clearInterval(id);
  }, [autoAdvanceMs]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        className="revuu-hscroll overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
      >
        <div className="flex gap-3">{children}</div>
      </div>

      {/* Custom scrollbar styling (scoped globally to this class) */}
      <style jsx global>{`
        .revuu-hscroll::-webkit-scrollbar {
          height: 10px;
        }
        .revuu-hscroll::-webkit-scrollbar-track {
          background: #0a0a0a;
          border-radius: 8px;
        }
        .revuu-hscroll::-webkit-scrollbar-thumb {
          background: #262626;
          border: 2px solid #0a0a0a;
          border-radius: 8px;
        }
        .revuu-hscroll:hover::-webkit-scrollbar-thumb {
          background: #3a3a3a;
        }
      `}</style>
    </div>
  );
}
