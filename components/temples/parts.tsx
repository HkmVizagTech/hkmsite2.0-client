"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";

/* Shared pieces for the temple guide: white pages, brand blue + gold accents. */

export const BLUE = "#1E3A8A";
export const INK = "#0F1E4A";
export const TINT = "#F4F7FF"; // very light blue panels
export const LINE = "#E3E9F7";

export type Photo = { src: string; alt?: string; credit?: string; license?: string; source?: string };

/** Section heading with a short gold underline, like a printed guide. */
export function Heading({ children, sub, center = false, as: Tag = "h2" }: { children: React.ReactNode; sub?: React.ReactNode; center?: boolean; as?: "h2" | "h3" }) {
  return (
    <div className={center ? "text-center" : ""}>
      <Tag className="font-heading text-[1.65rem] font-bold leading-tight tracking-tight text-[#0F1E4A] md:text-[2.1rem]">{children}</Tag>
      <span aria-hidden className={`mt-3 block h-[3px] w-12 rounded-full bg-gradient-to-r from-[#C9962B] to-[#F6C752] ${center ? "mx-auto" : ""}`} />
      {sub && <p className={`mt-3 text-[14.5px] leading-7 text-[#0F1E4A]/60 ${center ? "mx-auto max-w-2xl" : ""}`}>{sub}</p>}
    </div>
  );
}

/** Google star rating, e.g. ★★★★★ 4.7 (12,340). */
export function Stars({ rating, count, size = "sm" }: { rating?: number; count?: number; size?: "sm" | "lg" }) {
  if (!rating) return null;
  const s = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F1E4A]">
      <span className="flex" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`${s} ${i < Math.round(rating) ? "fill-[#F6B93B] text-[#F6B93B]" : "text-[#0F1E4A]/15"}`} />
        ))}
      </span>
      {size === "sm" && <>{rating.toFixed(1)}{count ? <span className="font-medium text-[#0F1E4A]/50">({count.toLocaleString("en-IN")})</span> : null}</>}
      <span className="sr-only">{rating.toFixed(1)} out of 5 on Google</span>
    </span>
  );
}

/** The word "Google" in its colours, used for attribution. */
export function GoogleWord({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold ${className}`} aria-label="Google">
      <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
    </span>
  );
}

/** Fallback when a temple has no photo: its Telugu name on a soft gopuram silhouette. */
export function TempleArt({ telugu, form }: { telugu: string; form: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(160deg,#EEF2FF,#DCE4FF)]">
      <svg aria-hidden viewBox="0 0 200 160" className="absolute inset-x-0 bottom-0 h-[78%] w-full text-[#1E3A8A]/[.08]" preserveAspectRatio="xMidYMax meet">
        <path fill="currentColor" d="M70 160V70h60v90zM78 70l8-14h28l8 14zM84 56l6-12h20l6 12zM90 44l5-10h10l5 10zM96 34l4-9 4 9zM40 160v-40h30v40zM130 160v-40h30v40z" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className="font-heading text-xl font-bold text-[#1E3A8A] md:text-2xl">{telugu}</span>
        {form && <span className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#A87A1E]">{form}</span>}
      </div>
    </div>
  );
}

/** Full-screen photo viewer with arrows, keyboard and credit line. */
export function Lightbox({ photos, index, onClose, onIndex }: { photos: Photo[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const go = useCallback((d: number) => index !== null && onIndex((index + d + photos.length) % photos.length), [index, onIndex, photos.length]);
  useEffect(() => {
    if (index === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", k);
    const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = o; };
  }, [index, go, onClose]);
  const p = index !== null ? photos[index] : null;
  return (
    <AnimatePresence>
      {p && (
        <motion.div role="dialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] flex flex-col bg-[#0A1233]/95 backdrop-blur-sm" onClick={onClose}>
          <div className="flex items-center justify-between px-4 py-3 text-white/80">
            <span className="text-[13px] font-semibold">{(index ?? 0) + 1} / {photos.length}</span>
            <button type="button" aria-label="Close" onClick={onClose} className="rounded-full bg-white/10 p-2 hover:bg-white/20"><X className="h-5 w-5" /></button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-3 z-10 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 md:left-6"><ChevronLeft className="h-6 w-6" /></button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={p.src} src={p.src} alt={p.alt ?? ""} className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-2xl" />
            <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-3 z-10 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 md:right-6"><ChevronRight className="h-6 w-6" /></button>
          </div>
          {p.credit && (
            <p className="px-4 pb-5 text-center text-[12px] text-white/55" onClick={(e) => e.stopPropagation()}>
              {p.source ? <a href={p.source} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">{p.credit}</a> : p.credit}
              {p.license ? ` · ${p.license}` : ""}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Horizontal scroller with arrow buttons (photos, reviews). */
export function Scroller({ children, label }: { children: React.ReactNode; label: string }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const by = (d: number) => el?.scrollBy({ left: d * el.clientWidth * 0.85, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={setEl} aria-label={label} className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" aria-label="Scroll left" onClick={() => by(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0F1E4A] ring-1 ring-[#E3E9F7] transition hover:bg-[#1E3A8A] hover:text-white"><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" aria-label="Scroll right" onClick={() => by(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0F1E4A] ring-1 ring-[#E3E9F7] transition hover:bg-[#1E3A8A] hover:text-white"><ChevronRight className="h-5 w-5" /></button>
      </div>
    </div>
  );
}

/** Soft decorative band at the top of white pages: faint temple skyline line-art. */
export function SkylineBand({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-[340px] overflow-hidden bg-[linear-gradient(180deg,#EEF2FF_0%,#F7F9FF_55%,#FFFFFF_100%)] ${className}`}>
      <svg viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-10 h-[240px] w-full text-[#1E3A8A]/[.07]">
        <g fill="currentColor">
          <path d="M60 260V150h70v110zM70 150l10-22h50l10 22zM80 128l8-18h34l8 18zM90 110l7-16h20l7 16zM100 94l5-14 5 14z" />
          <path d="M220 260V170h50v90zM230 170l8-16h18l8 16zM240 154l5-14 5 14z" />
          <path d="M1180 260V140h80v120zM1190 140l12-24h56l12 24zM1202 116l10-20h36l10 20zM1214 96l8-18h20l8 18zM1226 78l4-14 4 14z" />
          <path d="M1320 260V180h60v80zM1330 180l9-18h22l9 18zM1342 162l5-14 5 14z" />
        </g>
      </svg>
    </div>
  );
}
