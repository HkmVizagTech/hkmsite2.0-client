"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, Calendar } from "lucide-react";
import Image from "next/image";
import SectionHeading from "@/components/site/SectionHeading";

const dailyDarshanData: Record<string, { images: { src: string; title: string }[]; festival?: string }> = {
  "2026-03-06": {
    festival: "Gaura Purnima",
    images: [
      { src: "/assets/gallery-darshan-1.jpg", title: "Sri Sri Radha Krishna — Morning Shringar" },
      { src: "/assets/gallery-aarti.jpg", title: "Mangala Aarti Darshan" },
      { src: "/assets/gallery-festival-1.jpg", title: "Special Festival Decoration" },
      { src: "/assets/hero-temple.jpg", title: "Temple Hall Overview" },
    ],
  },
  "2026-03-05": {
    images: [
      { src: "/assets/gallery-aarti.jpg", title: "Morning Mangala Aarti" },
      { src: "/assets/gallery-darshan-1.jpg", title: "Shringar Darshan" },
      { src: "/assets/temple-seva.jpg", title: "Deity Abhishekam" },
    ],
  },
  "2026-03-04": {
    festival: "Ekadashi",
    images: [
      { src: "/assets/gallery-darshan-1.jpg", title: "Ekadashi Special Darshan" },
      { src: "/assets/gallery-festival-2.jpg", title: "Flower Decoration" },
      { src: "/assets/gallery-annadaan-1.jpg", title: "Prasadam Distribution" },
      { src: "/assets/about-community.jpg", title: "Evening Kirtan" },
    ],
  },
  "2026-03-03": {
    images: [
      { src: "/assets/gallery-aarti.jpg", title: "Sandhya Aarti" },
      { src: "/assets/gallery-darshan-1.jpg", title: "Evening Darshan" },
      { src: "/assets/gallery-class.jpg", title: "Bhagavad Gita Class" },
    ],
  },
  "2026-03-02": {
    festival: "Sunday Feast",
    images: [
      { src: "/assets/gallery-festival-1.jpg", title: "Sunday Feast Kirtan" },
      { src: "/assets/gallery-annadaan-1.jpg", title: "Feast Prasadam" },
      { src: "/assets/subhojanam.jpg", title: "Community Gathering" },
      { src: "/assets/anna-daan.jpg", title: "Food Distribution" },
      { src: "/assets/gallery-darshan-1.jpg", title: "Special Darshan" },
    ],
  },
  "2026-03-01": {
    images: [
      { src: "/assets/gallery-darshan-1.jpg", title: "Sri Krishna Morning Darshan" },
      { src: "/assets/gallery-aarti.jpg", title: "Aarti Ceremony" },
    ],
  },
  "2026-02-28": {
    images: [
      { src: "/assets/gallery-festival-2.jpg", title: "Temple Decoration" },
      { src: "/assets/gallery-darshan-1.jpg", title: "Darshan" },
      { src: "/assets/gallery-class.jpg", title: "Discourse Session" },
    ],
  },
};

const sortedDates = Object.keys(dailyDarshanData).sort((a, b) => b.localeCompare(a));

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00");
  return {
    day: date.getDate(),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    month: date.toLocaleDateString("en-US", { month: "short" }),
    year: date.getFullYear(),
    full: date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
  };
};

type DailyDarshanGalleryProps = {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  dateData?: Record<string, { images: { src: string; title: string }[]; festival?: string }>; 
};

const DailyDarshanGallery = ({ selectedDate: externalSelectedDate, onDateChange, dateData }: DailyDarshanGalleryProps) => {
  const sourceDates = dateData ? Object.keys(dateData) : Object.keys(dailyDarshanData);
  const sortedDatesLocal = sourceDates.sort((a, b) => b.localeCompare(a));
  const [internalSelectedDate, setInternalSelectedDate] = useState<string>(sortedDatesLocal[0]);
  const selectedDate = externalSelectedDate || internalSelectedDate;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const datesPerPage = 7;
  const totalPages = Math.ceil(sortedDatesLocal.length / datesPerPage);
  const visibleDates = sortedDatesLocal.slice(page * datesPerPage, (page + 1) * datesPerPage);

  const currentData = dateData ? dateData[selectedDate] : dailyDarshanData[selectedDate];
  const formatted = formatDate(selectedDate);

  return (
    <section id="darshan" className="vk-section scroll-mt-[calc(var(--header-h)+8px)]">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow="Daily Darshan"
          title="Select a Date for Darshan"
          subtitle="Click on a date to view the divine darshan gallery for that day."
        />

        {/* Date strip — scrolls horizontally on small screens */}
        <div className="mb-8 flex items-center justify-center gap-2 md:mb-10 md:gap-3">
          <button
            type="button"
            aria-label="Previous dates"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 shadow-sm transition-colors hover:border-vk-700 hover:bg-vk-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex min-w-0 gap-2 overflow-x-auto px-1 py-2 scrollbar-hide md:gap-3">
            {visibleDates.map((dateStr) => {
              const d = formatDate(dateStr);
              const isActive = dateStr === selectedDate;
              const hasFestival = !!(dateData ? dateData[dateStr]?.festival : dailyDarshanData[dateStr]?.festival);

              return (
                <motion.button
                  type="button"
                  key={dateStr}
                  aria-pressed={isActive}
                  onClick={() => {
                    if (onDateChange) onDateChange(dateStr);
                    else setInternalSelectedDate(dateStr);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex min-w-[64px] shrink-0 flex-col items-center rounded-2xl px-3 py-2.5 transition-all duration-300 md:min-w-[72px] md:px-4 md:py-3 ${
                    isActive
                      ? "bg-vk-700 text-white shadow-lift"
                      : "border border-vk-100 bg-white text-muted-foreground hover:-translate-y-0.5 hover:border-vk-300 hover:text-foreground"
                  }`}
                >
                  <span className={`text-xs font-medium ${isActive ? "text-white/75" : ""}`}>{d.weekday}</span>
                  <span className="font-heading text-2xl font-bold leading-tight">{d.day}</span>
                  <span className={`text-xs ${isActive ? "text-white/75" : ""}`}>{d.month}</span>
                  {hasFestival && (
                    <span
                      className={`absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full ring-2 ${
                        isActive ? "bg-white ring-vk-700" : "bg-vk-500 ring-white"
                      }`}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next dates"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 shadow-sm transition-colors hover:border-vk-700 hover:bg-vk-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedDate && (
              <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5 text-center md:mb-8">
                <span className="vk-icon-chip h-9 w-9 rounded-lg">
                  <Calendar className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-bold text-foreground md:text-2xl">{formatted.full}</h3>
                {currentData?.festival && <span className="vk-pill-soft">{currentData.festival}</span>}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {currentData?.images.map((img, i) => (
                <motion.button
                  type="button"
                  key={img.title + i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="vk-tile group aspect-square w-full cursor-pointer text-left"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Open ${img.title}`}
                >
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                  {img.title && (
                    <span className="vk-tile-caption">
                      <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-white md:text-sm">{img.title}</span>
                    </span>
                  )}
                  <span className="absolute right-3 top-3 z-[2] flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" />
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {lightboxIndex !== null && currentData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-vk-900/95 p-4 backdrop-blur-sm"
              onClick={() => setLightboxIndex(null)}
            >
              <button
                type="button"
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6 md:top-6"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="h-6 w-6" />
              </button>

              {lightboxIndex > 0 && (
                <button
                  type="button"
                  aria-label="Previous image"
                  className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-8"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              {lightboxIndex < currentData.images.length - 1 && (
                <button
                  type="button"
                  aria-label="Next image"
                  className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-8"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}

              <motion.div
                key={lightboxIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative h-[72vh] w-[90vw] max-w-full md:h-[80vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={currentData.images[lightboxIndex]?.src}
                  alt={currentData.images[lightboxIndex]?.title}
                  fill
                  loading="lazy"
                  sizes="90vw"
                  className="rounded-2xl object-contain"
                />
              </motion.div>
              <div className="absolute inset-x-4 bottom-6 text-center md:bottom-8">
                <p className="text-base font-semibold text-white md:text-lg">
                  {currentData.images[lightboxIndex]?.title}
                </p>
                <p className="mt-1 text-sm text-white/60">{formatted.full}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DailyDarshanGallery;
