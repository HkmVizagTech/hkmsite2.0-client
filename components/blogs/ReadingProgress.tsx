"use client";

import { useEffect, useState } from "react";

/** A thin gold line under the site header that fills as the article is read. */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const done = Math.min(Math.max(-r.top + window.innerHeight * 0.2, 0), Math.max(total, 1));
      setPct(Math.round((done / Math.max(total, 1)) * 100));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-[var(--header-h)] z-30 h-[3px] bg-transparent">
      <div className="h-full bg-gradient-to-r from-gold to-[#B8860B] transition-[width] duration-150" style={{ width: `${pct}%` }} />
    </div>
  );
}
