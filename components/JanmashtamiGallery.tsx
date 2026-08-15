"use client";

import { useEffect, useState, useCallback } from "react";
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

const JanmashtamiGallery = () => {
  const [yearGroups, setYearGroups] = useState<YearGroup[] | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  if (!yearGroups || yearGroups.length === 0) return null;

  const showYearTabs = yearGroups.length > 1;

  return (
    <section className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#b48811]">
            Glimpses of Celebration
          </p>
          <div className="mx-auto mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4a843]/60" />
            <span className="text-[#d4a843]">&#10041;</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4a843]/60" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-[#331447] md:text-3xl">
            Previous Year Celebrations
          </h2>
          <p className="mx-auto max-w-xl text-sm text-slate-600 md:text-base">
            Relive the divine moments from past Sri Krishna Janmashtami celebrations at Hare Krishna Vaikuntham.
          </p>
        </div>

        {showYearTabs && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            {yearGroups.map(({ year }) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  selectedYear === year
                    ? "bg-[#331447] text-white shadow-lg"
                    : "border border-[#331447]/20 text-[#331447] hover:border-[#331447]/50 hover:bg-[#331447]/5"
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
          >
            {currentImages.map((img, i) => (
              <motion.div
                key={img.src + i}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative cursor-pointer overflow-hidden rounded-xl aspect-square"
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                  <p className="text-sm font-semibold text-white">{img.title}</p>
                </div>
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {lightboxIndex !== null && currentImages[lightboxIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                className="absolute right-6 top-6 text-white/80 hover:text-white"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="h-8 w-8" />
              </button>

              {lightboxIndex > 0 && (
                <button
                  className="absolute left-4 text-white/70 hover:text-white md:left-8"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                >
                  <ChevronLeft className="h-10 w-10" />
                </button>
              )}
              {lightboxIndex < currentImages.length - 1 && (
                <button
                  className="absolute right-4 text-white/70 hover:text-white md:right-8"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                >
                  <ChevronRight className="h-10 w-10" />
                </button>
              )}

              <motion.div
                key={lightboxIndex}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="relative h-[80vh] w-[90vw] max-w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={currentImages[lightboxIndex].src}
                  alt={currentImages[lightboxIndex].title}
                  fill
                  sizes="90vw"
                  className="rounded-xl object-contain"
                />
              </motion.div>
              <div className="absolute bottom-8 text-center">
                <p className="text-lg font-semibold text-white">
                  {currentImages[lightboxIndex].title}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  {lightboxIndex + 1} / {currentImages.length}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default JanmashtamiGallery;
