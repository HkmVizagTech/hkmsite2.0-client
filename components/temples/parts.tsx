"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Star, X } from "lucide-react";

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

/**
 * Full-screen photo viewer: the photo's own colours glow softly behind it, title and "Photo n of N" on top with
 * Download / Close, arrows + keyboard + swipe, a thumbnail strip that follows along. Credits live on /temples/photo-credits.
 */
export function Lightbox({ photos, index, onClose, onIndex, title, kicker }: { photos: Photo[]; index: number | null; onClose: () => void; onIndex: (i: number) => void; title?: string; kicker?: string }) {
  const [dir, setDir] = useState(1);
  const [strip, setStrip] = useState<HTMLDivElement | null>(null);
  const go = useCallback((d: number) => { if (index === null) return; setDir(d); onIndex((index + d + photos.length) % photos.length); }, [index, onIndex, photos.length]);
  useEffect(() => {
    if (index === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", k);
    const o = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = o; };
  }, [index, go, onClose]);
  useEffect(() => {
    // scroll only the strip (scrollIntoView would also shift the dialog itself)
    const el = strip?.querySelector<HTMLElement>(`[data-i="${index}"]`);
    if (strip && el) strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.offsetWidth / 2, behavior: "smooth" });
  }, [index, strip]);
  const p = index !== null ? photos[index] : null;
  const download = async () => {
    if (!p) return;
    try {
      const blob = await (await fetch(p.src)).blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${(title ?? "temple").replace(/\s+/g, "-").toLowerCase()}-${(index ?? 0) + 1}.${blob.type.split("/")[1] || "jpg"}`;
      a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } catch { window.open(p.src, "_blank", "noopener"); }
  };
  const btn = "inline-flex h-11 items-center gap-2 rounded-full bg-white/[.08] px-4 text-[13.5px] font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/[.16]";
  return (
    <AnimatePresence>
      {p && (
        <motion.div role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[130] flex flex-col overflow-clip bg-[#070C24] text-white">
          {/* ambient glow from the current photo */}
          <AnimatePresence>
            { }
            <motion.img key={`bg-${p.src}`} src={p.src} alt="" aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover blur-[80px] saturate-150" />
          </AnimatePresence>
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_45%,rgba(7,12,36,.35),rgba(7,12,36,.92))]" />

          {/* top bar */}
          <div className="relative z-10 flex items-start justify-between gap-4 px-4 pt-4 md:px-8 md:pt-6">
            <div className="min-w-0">
              {kicker && <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#F6C752]">{kicker}</p>}
              {title && <p className="mt-1 truncate font-heading text-lg font-bold md:text-2xl">{title}</p>}
              <p className="mt-0.5 text-[12.5px] text-white/60">Photo {(index ?? 0) + 1} of {photos.length}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={download} className={btn} aria-label="Download photo"><Download className="h-4 w-4" /><span className="hidden sm:inline">Download</span></button>
              <button type="button" onClick={onClose} className={`${btn} px-3.5`} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
          </div>
          {/* photo */}
          <div className="relative z-0 flex min-h-0 flex-1 items-center justify-center overflow-clip px-3 py-4 md:px-24">
            <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="absolute left-3 z-10 hidden h-14 w-14 items-center justify-center rounded-full bg-white/[.08] ring-1 ring-white/20 backdrop-blur transition hover:bg-white hover:text-[#0A1233] md:left-8 md:flex"><ChevronLeft className="h-6 w-6" /></button>
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.img key={p.src} src={p.src} alt={p.alt ?? title ?? ""} custom={dir}
                initial={{ opacity: 0, x: dir * 60, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: dir * -60, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 0.8, 0.3, 1] }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
                onDragEnd={(_, i) => { if (i.offset.x < -70) go(1); else if (i.offset.x > 70) go(-1); }}
                className="max-h-full max-w-full cursor-grab select-none rounded-2xl object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,.8)] ring-1 ring-white/10 active:cursor-grabbing" draggable={false} />
            </AnimatePresence>
            <button type="button" aria-label="Next photo" onClick={() => go(1)} className="absolute right-3 z-10 hidden h-14 w-14 items-center justify-center rounded-full bg-white/[.08] ring-1 ring-white/20 backdrop-blur transition hover:bg-white hover:text-[#0A1233] md:right-8 md:flex"><ChevronRight className="h-6 w-6" /></button>
          </div>

          {/* thumbnails */}
          <div ref={setStrip} className="relative z-10 flex justify-start gap-2.5 overflow-x-auto px-4 pb-5 pt-1 [scrollbar-width:none] md:justify-center md:pb-7 [&::-webkit-scrollbar]:hidden">
            {photos.map((ph, i) => (
              <button key={ph.src} data-i={i} type="button" onClick={() => { setDir(i > (index ?? 0) ? 1 : -1); onIndex(i); }} aria-label={`Photo ${i + 1}`}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl transition md:h-[72px] md:w-[72px] ${i === index ? "ring-2 ring-[#F6C752] ring-offset-2 ring-offset-[#070C24]" : "opacity-50 hover:opacity-100"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
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
