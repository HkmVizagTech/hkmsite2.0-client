"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxItem {
  src: string;
  title?: string;
  subtitle?: string;
}

/**
 * Full-screen photo viewer: arrow keys, swipe on phones, a counter and the caption.
 * Controlled by the parent through `index` / `onIndex`.
 */
export default function Lightbox({
  items,
  index,
  onIndex,
  onClose,
  subtitle,
}: {
  items: LightboxItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  subtitle?: string;
}) {
  const touchX = useRef<number | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const count = items.length;
  const go = (d: number) => onIndex((index + d + count) % count);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onIndex((index - 1 + count) % count);
      else if (e.key === "ArrowRight") onIndex((index + 1) % count);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, count, onIndex, onClose]);

  // Fetch the neighbouring photos ahead of time so stepping through feels instant.
  useEffect(() => {
    [index + 1, index - 1].forEach((i) => {
      const it = items[(i + count) % count];
      if (it && count > 1) {
        const im = new window.Image();
        im.src = `/_next/image?url=${encodeURIComponent(it.src)}&w=1920&q=75`;
      }
    });
  }, [index, items, count]);

  const item = items[index];
  if (!item) return null;
  const loading = loadedSrc !== item.src;

  const btn =
    "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 md:flex";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[110] flex flex-col bg-[#0b1230]/95 backdrop-blur-md"
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null || count < 2) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5" onClick={(e) => e.stopPropagation()}>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          aria-label="Close"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 px-2 md:px-20" onClick={(e) => e.stopPropagation()}>
        {count > 1 && (
          <button type="button" aria-label="Previous photo" className={`${btn} left-4 md:left-6`} onClick={() => go(-1)}>
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <motion.div key={item.src} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="relative h-full w-full">
          {loading && (
            <span className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3" role="status" aria-label="Loading photo">
              <span className="h-11 w-11 animate-spin rounded-full border-[3px] border-white/20 border-t-[#2F5BD3]" />
              <span className="text-xs tracking-wide text-white/60">Loading photo…</span>
            </span>
          )}
          <Image
            src={item.src}
            alt={item.title || "Gallery photo"}
            fill
            sizes="100vw"
            priority
            onLoad={() => setLoadedSrc(item.src)}
            onError={() => setLoadedSrc(item.src)}
            className={`object-contain transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
          />
        </motion.div>
        {count > 1 && (
          <button type="button" aria-label="Next photo" className={`${btn} right-4 md:right-6`} onClick={() => go(1)}>
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="px-6 pb-6 pt-4 text-center md:pb-8" onClick={(e) => e.stopPropagation()}>
        {item.title && <p className="font-serif-display text-lg font-semibold text-white md:text-2xl">{item.title}</p>}
        {(item.subtitle || subtitle) && <p className="mt-1 text-sm text-[#BFD0FF]/80">{item.subtitle || subtitle}</p>}
      </div>
    </motion.div>
  );
}
