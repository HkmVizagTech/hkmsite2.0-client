"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { getGalleryImages } from "@/lib/galleryApi";

interface GalleryImage {
  src: string;
  title: string;
}

interface YearGroup {
  year: number;
  images: GalleryImage[];
}

const MASONRY_SPANS = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "",
  "md:col-span-2",
  "",
  "",
  "md:col-span-2",
  "",
  "",
  "md:col-span-2 md:row-span-2",
  "",
];

const JanmashtamiGallery = () => {
  const [yearGroups, setYearGroups] = useState<YearGroup[] | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getGalleryImages({ category: "Janmashtami", status: "active" })
      .then((items: any[]) => {
        if (cancelled || !items || items.length === 0) {
          if (!cancelled) setYearGroups([]);
          return;
        }

        const byYear = new Map<number, GalleryImage[]>();
        for (const item of items) {
          const year = item.date ? new Date(item.date).getFullYear() : new Date().getFullYear();
          const existing = byYear.get(year) || [];
          for (const src of item.images || []) {
            existing.push({ src, title: item.title || "Janmashtami Celebration" });
          }
          byYear.set(year, existing);
        }

        const groups = Array.from(byYear.entries())
          .map(([year, images]) => ({ year, images }))
          .sort((a, b) => b.year - a.year);

        if (!cancelled) {
          setYearGroups(groups);
          if (groups.length > 0) setSelectedYear(groups[0].year);
        }
      })
      .catch(() => {
        if (!cancelled) setYearGroups([]);
      });
    return () => { cancelled = true; };
  }, []);

  const currentImages = yearGroups?.find((g) => g.year === selectedYear)?.images || [];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowLeft" && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
      else if (e.key === "ArrowRight" && lightboxIndex < currentImages.length - 1) setLightboxIndex(lightboxIndex + 1);
    },
    [lightboxIndex, currentImages.length]
  );

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
  }, [lightboxIndex, handleKeyDown]);

  const scrollStrip = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!yearGroups || yearGroups.length === 0) return null;

  const showYearTabs = yearGroups.length > 1;

  return (
    <section className="relative px-4 py-14 md:py-20">
      {/* Subtle background to blend with the page */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fefaf0] via-[#fdf5e8] to-[#fefaf0]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-10 text-center md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-600/80"
          >
            Glimpses of Celebration
          </motion.p>
          <div className="mx-auto mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-500/40 sm:w-16" />
            <span className="text-amber-500/50">&#10041;</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-500/40 sm:w-16" />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-3 text-2xl font-bold text-[#331447] md:text-4xl"
          >
            Previous Year Celebrations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mx-auto max-w-lg text-sm text-slate-500 md:text-base"
          >
            Relive the divine moments from past Sri Krishna Janmashtami celebrations.
          </motion.p>
        </div>

        {/* Year tabs */}
        {showYearTabs && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2.5 md:mb-10">
            {yearGroups.map(({ year }) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  selectedYear === year
                    ? "bg-[#331447] text-[#ffdb68] shadow-md"
                    : "border border-[#331447]/15 text-[#331447]/70 hover:border-[#331447]/40 hover:text-[#331447]"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── Desktop: Masonry grid ── */}
            <div className="hidden md:grid md:auto-rows-[200px] md:grid-cols-4 md:gap-3 lg:auto-rows-[220px] lg:gap-4">
              {currentImages.map((img, i) => {
                const span = MASONRY_SPANS[i % MASONRY_SPANS.length];
                return (
                  <motion.div
                    key={img.src + i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(51,20,71,0.08)] ${span}`}
                    onClick={() => setLightboxIndex(i)}
                  >
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      loading="lazy"
                      sizes={span.includes("col-span-2") ? "50vw" : "25vw"}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#331447]/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <p className="text-sm font-semibold text-white drop-shadow">{img.title}</p>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <ZoomIn className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Mobile: Horizontal scroll strip ── */}
            <div className="relative md:hidden">
              {/* Scroll arrows */}
              <button
                onClick={() => scrollStrip("left")}
                className="absolute -left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#331447] shadow-md backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollStrip("right")}
                className="absolute -right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#331447] shadow-md backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div
                ref={scrollRef}
                className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-4"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {currentImages.map((img, i) => (
                  <motion.div
                    key={img.src + i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                    className="group relative w-[72vw] shrink-0 snap-center cursor-pointer overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(51,20,71,0.1)]"
                    style={{ aspectRatio: "3/4" }}
                    onClick={() => setLightboxIndex(i)}
                  >
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      loading="lazy"
                      sizes="72vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#331447]/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
                      <p className="text-sm font-semibold text-white drop-shadow">{img.title}</p>
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
                        <ZoomIn className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Scroll indicator dots */}
              <div className="mt-4 flex justify-center gap-1.5">
                {currentImages.slice(0, Math.min(currentImages.length, 8)).map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#331447]/20"
                  />
                ))}
                {currentImages.length > 8 && (
                  <span className="text-xs text-[#331447]/30">+{currentImages.length - 8}</span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && currentImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#130922]/95 p-4 backdrop-blur-sm"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white md:right-6 md:top-6"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="h-5 w-5" />
            </button>

            {lightboxIndex > 0 && (
              <button
                className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white md:left-6"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            )}
            {lightboxIndex < currentImages.length - 1 && (
              <button
                className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white md:right-6"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-[82vh] w-[92vw] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImages[lightboxIndex].src}
                alt={currentImages[lightboxIndex].title}
                fill
                sizes="92vw"
                className="rounded-xl object-contain"
              />
            </motion.div>
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-base font-semibold text-white md:text-lg">
                {currentImages[lightboxIndex].title}
              </p>
              <p className="mt-1 text-xs text-white/40">
                {lightboxIndex + 1} / {currentImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default JanmashtamiGallery;
