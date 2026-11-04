"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import FadeImage from "@/components/gallery/FadeImage";
import Lightbox from "@/components/gallery/Lightbox";
import { Eyebrow, LINE, SERIF } from "@/components/blogs/parts";

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
    <section id="darshan" className="scroll-mt-[calc(var(--header-h)+8px)] py-12 md:py-20">
      <div className="vk-container">
        <div className="mb-8 text-center md:mb-10">
          <div className="flex justify-center">
            <Eyebrow>Daily Darshan</Eyebrow>
          </div>
          <h2 className={`${SERIF} mt-3 text-[1.8rem] font-semibold leading-tight text-ink md:text-[2.4rem]`}>Darshan of the day</h2>
          <p className="mx-auto mt-2 max-w-xl text-[15px] text-ink/60">Choose a date to see how Their Lordships were dressed and worshipped that day.</p>
        </div>

        {/* Date strip — scrolls horizontally on small screens */}
        <div className="mb-9 flex items-center justify-center gap-2 md:mb-12 md:gap-3">
          <button
            type="button"
            aria-label="Previous dates"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D5DDF5] bg-white text-vk-700 shadow-sm transition-colors hover:border-vk-700 hover:bg-vk-50 disabled:cursor-not-allowed disabled:opacity-30"
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
                  className={`relative flex min-w-[64px] shrink-0 flex-col items-center rounded-2xl px-3 py-2.5 transition-all duration-300 md:min-w-[74px] md:px-4 md:py-3 ${
                    isActive
                      ? "bg-gradient-to-b from-[#1F2A5C] to-[#141B3F] text-white shadow-[0_14px_28px_-14px_rgba(20,27,63,0.8)]"
                      : `border ${LINE} bg-white/80 text-ink/60 hover:-translate-y-0.5 hover:border-vk-400 hover:text-ink`
                  }`}
                >
                  <span className={`text-[11px] font-medium uppercase tracking-wide ${isActive ? "text-[#BFD0FF]" : ""}`}>{d.weekday}</span>
                  <span className={`${SERIF} text-2xl font-semibold leading-tight`}>{d.day}</span>
                  <span className={`text-xs ${isActive ? "text-white/75" : ""}`}>{d.month}</span>
                  {hasFestival && (
                    <span className={`absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full ring-2 ${isActive ? "bg-[#2F5BD3] ring-[#1F2A5C]" : "bg-vk-500 ring-white"}`} />
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D5DDF5] bg-white text-vk-700 shadow-sm transition-colors hover:border-vk-700 hover:bg-vk-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {selectedDate && (
              <div className="mb-7 flex flex-wrap items-center justify-center gap-3 text-center md:mb-9">
                <Calendar className="h-5 w-5 text-vk-600" />
                <h3 className={`${SERIF} text-xl font-semibold text-ink md:text-[1.7rem]`}>{formatted.full}</h3>
                {currentData?.festival && (
                  <span className="rounded-full border border-vk-200 bg-vk-50 px-3 py-1 text-xs font-semibold text-vk-600">{currentData.festival}</span>
                )}
              </div>
            )}

            {!currentData || currentData.images.length === 0 ? (
              <p className="py-10 text-center text-ink/50">No darshan photos for this day yet.</p>
            ) : (
              <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
                {currentData.images.map((img, i) => (
                  <motion.button
                    type="button"
                    key={img.src + i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}
                    className={`group relative mb-3 block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-2xl bg-[#EEF2FF] text-left align-top shadow-[0_18px_36px_-26px_rgba(30,58,138,0.6)] md:mb-4`}
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Open ${img.title || "photo"}`}
                  >
                    <FadeImage src={img.src} alt={img.title || formatted.full} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="group-hover:scale-[1.04]" />
                    {img.title && (
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1230]/80 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-4">
                        <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-white md:text-sm">{img.title}</span>
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {lightboxIndex !== null && currentData && (
            <Lightbox
              items={currentData.images}
              index={lightboxIndex}
              onIndex={setLightboxIndex}
              onClose={() => setLightboxIndex(null)}
              subtitle={formatted.full}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DailyDarshanGallery;
