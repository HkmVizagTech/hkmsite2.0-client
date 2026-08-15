"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { getGalleryImages } from "@/lib/galleryApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

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
    if (!carouselApi) return;
    const onSelect = () => setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    onSelect();
    return () => { carouselApi.off("select", onSelect); };
  }, [carouselApi]);

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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1a0a2e] via-[#130922] to-[#1a0a2e] px-4 py-14 md:py-20">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#ffd96f]/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full bg-purple-500/[0.04] blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-amber-500/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ffd96f]/80"
          >
            Glimpses of Celebration
          </motion.p>
          <div className="mx-auto mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#ffd96f]/40" />
            <span className="text-lg text-[#ffd96f]/60">&#10041;</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#ffd96f]/40" />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-3 text-2xl font-bold text-white md:text-4xl"
          >
            Previous Year Celebrations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-xl text-sm text-white/50 md:text-base"
          >
            Relive the divine moments from past Sri Krishna Janmashtami celebrations at Hare Krishna Vaikuntham.
          </motion.p>
        </div>

        {/* Year tabs */}
        {showYearTabs && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            {yearGroups.map(({ year }) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                  setCurrentSlide(0);
                  carouselApi?.scrollTo(0);
                }}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  selectedYear === year
                    ? "bg-gradient-to-r from-[#ffd96f] to-[#e8b830] text-[#1a0a2e] shadow-[0_0_20px_rgba(255,217,111,0.3)]"
                    : "border border-white/15 text-white/60 hover:border-[#ffd96f]/40 hover:text-white"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {/* Main carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Featured hero image */}
            <motion.div
              className="group relative mx-auto mb-6 cursor-pointer overflow-hidden rounded-2xl"
              style={{ aspectRatio: "16/9", maxHeight: "480px" }}
              onClick={() => setLightboxIndex(currentSlide)}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.4 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImages[currentSlide]?.src}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {currentImages[currentSlide] && (
                    <Image
                      src={currentImages[currentSlide].src}
                      alt={currentImages[currentSlide].title}
                      fill
                      sizes="(max-width: 768px) 100vw, 1152px"
                      className="object-cover"
                      priority
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-lg font-semibold text-white drop-shadow-lg">
                  {currentImages[currentSlide]?.title}
                </p>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <ZoomIn className="h-5 w-5 text-white" />
                </div>
              </div>
              {/* Image counter */}
              <div className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                {currentSlide + 1} / {currentImages.length}
              </div>
            </motion.div>

            {/* Thumbnail carousel strip */}
            {currentImages.length > 1 && (
              <div className="relative px-10">
                <Carousel
                  setApi={setCarouselApi}
                  opts={{
                    align: "start",
                    loop: false,
                    slidesToScroll: 1,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-3">
                    {currentImages.map((img, i) => (
                      <CarouselItem
                        key={img.src + i}
                        className="basis-1/4 pl-2 sm:basis-1/5 md:basis-1/6 md:pl-3 lg:basis-[14.28%]"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.3 }}
                          className={`group/thumb relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 aspect-square ${
                            currentSlide === i
                              ? "ring-2 ring-[#ffd96f] ring-offset-2 ring-offset-[#130922]"
                              : "opacity-50 hover:opacity-80"
                          }`}
                          onClick={() => {
                            setCurrentSlide(i);
                            carouselApi?.scrollTo(Math.max(0, i - 2));
                          }}
                        >
                          <Image
                            src={img.src}
                            alt={img.title}
                            fill
                            loading="lazy"
                            sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 14vw"
                            className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                          />
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-2 h-9 w-9 border-white/20 bg-[#1a0a2e]/80 text-white/70 backdrop-blur-sm hover:bg-[#ffd96f]/20 hover:text-white md:-left-4" />
                  <CarouselNext className="-right-2 h-9 w-9 border-white/20 bg-[#1a0a2e]/80 text-white/70 backdrop-blur-sm hover:bg-[#ffd96f]/20 hover:text-white md:-right-4" />
                </Carousel>
              </div>
            )}
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white md:right-6 md:top-6"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="h-5 w-5" />
            </button>

            {lightboxIndex > 0 && (
              <button
                className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white md:left-6"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            )}
            {lightboxIndex < currentImages.length - 1 && (
              <button
                className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white md:right-6"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
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
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-base font-semibold text-white md:text-lg">
                {currentImages[lightboxIndex].title}
              </p>
              <p className="mt-1 text-sm text-white/40">
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
