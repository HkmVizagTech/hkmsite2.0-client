"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { getGalleryImages } from "@/lib/galleryApi";
import useEmblaCarousel from "embla-carousel-react";

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
  const [activeIndex, setActiveIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
    containScroll: false,
  });

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

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      setActiveIndex(0);
    }
  }, [selectedYear, emblaApi]);

  const currentImages = yearGroups?.find((g) => g.year === selectedYear)?.images || [];

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
    <section className="relative py-14 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#fefaf0] via-[#fdf5e8] to-[#fefaf0]" />

      <div className="relative">
        {/* Section header */}
        <div className="mx-auto max-w-6xl px-4 mb-10 text-center md:mb-14">
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
          <div className="mx-auto max-w-6xl px-4 mb-8 flex flex-wrap items-center justify-center gap-2.5 md:mb-10">
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

        {/* Center-focused carousel with peek */}
        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#331447] shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl md:left-6 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#331447] shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl md:right-6 md:h-12 md:w-12"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* Embla carousel */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {currentImages.map((img, i) => {
                const isActive = i === activeIndex;
                return (
                  <div
                    key={img.src + i}
                    className="relative shrink-0 px-2 md:px-3"
                    style={{ flex: "0 0 80%", maxWidth: "80%" }}
                  >
                    <div
                      className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 md:rounded-3xl ${
                        isActive
                          ? "opacity-100 shadow-[0_8px_40px_rgba(51,20,71,0.15)]"
                          : "opacity-40 scale-[0.92]"
                      }`}
                      onClick={() => isActive && setLightboxIndex(i)}
                    >
                      <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                        <Image
                          src={img.src}
                          alt={img.title}
                          fill
                          loading={i < 3 ? "eager" : "lazy"}
                          sizes="80vw"
                          className="object-contain bg-[#f5ead4]/50"
                        />
                      </div>

                      {/* Hover overlay — only on active slide */}
                      {isActive && (
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#331447]/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="flex w-full items-end justify-between p-5 md:p-7">
                            <p className="text-sm font-semibold text-white drop-shadow-lg md:text-base">
                              {img.title}
                            </p>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Counter */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="text-xs font-medium text-[#331447]/40">
              {activeIndex + 1} / {currentImages.length}
            </span>
          </div>

          {/* Dot indicators */}
          {currentImages.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {currentImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "h-2 w-6 bg-[#331447]"
                      : "h-2 w-2 bg-[#331447]/15 hover:bg-[#331447]/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
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
