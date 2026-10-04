"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import DailyDarshanGallery from "@/components/DailyDarshanGallery";
import { getGalleryImages, GALLERY_CATEGORIES } from "@/lib/galleryApi";
import { getRecentDarshan, type DarshanPhoto } from "@/lib/darshanApi";

// Album dates are stored as midnight UTC ("2026-08-18T00:00:00.000Z"); show
// just the calendar day, e.g. "18 Aug 2026".
const formatGalleryDate = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

type GalleryImage = {
  title: string;
  date: string;
  category: string;
  images: string[];
  description?: string;
};

type GroupModalState = { group: GalleryImage } | null;
type LightboxState = { images: string[]; index: number; group: GalleryImage } | null;

const categories = ["All", ...GALLERY_CATEGORIES];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeDate, setActiveDate] = useState<string>("All Dates");
  const [groupModal, setGroupModal] = useState<GroupModalState>(null);
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Daily darshan from the community app — merged into the date strip so the
  // gallery shows the same darshan days devotees see in the app.
  const [appDarshan, setAppDarshan] = useState<DarshanPhoto[]>([]);

  function groupImages(images: GalleryImage[]): GalleryImage[] {
    const map = new Map<string, GalleryImage>();
    for (const img of images) {
      const key = `${img.title}|${img.date}|${img.category}`;
      if (!map.has(key)) {
        map.set(key, {
          title: img.title,
          date: img.date,
          category: img.category,
          images: [...img.images],
          description: img.description,
        });
      } else {
        map.get(key)!.images.push(...img.images);
      }
    }
    return Array.from(map.values());
  }

  useEffect(() => {
    Promise.all([getGalleryImages({ status: "active" }), getRecentDarshan(14)]).then(([items, darshan]) => {
      setGalleryImages(items);
      setAppDarshan(darshan);

      if ((items && items.length > 0) || darshan.length > 0) {
        const raw = [...(items || []).map((it: GalleryImage) => ((it.date || "").slice(0, 10)) as string), ...darshan.map((d) => d.date || "")];
        const datesSet = new Set<string>(raw.filter(Boolean));
        const dates: string[] = Array.from(datesSet).sort((a, b) => b.localeCompare(a));
        if (dates.length > 0) setActiveDate(dates[0]);
      }
      setLoading(false);
    });
  }, []);


  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(null);
        else if (groupModal) setGroupModal(null);
      }
      if (!lightbox) return;
      if (e.key === "ArrowLeft") {
        setLightbox((lb) => {
          if (!lb) return lb;
          const prev = (lb.index - 1 + lb.images.length) % lb.images.length;
          return { ...lb, index: prev };
        });
      }
      if (e.key === "ArrowRight") {
        setLightbox((lb) => {
          if (!lb) return lb;
          const next = (lb.index + 1) % lb.images.length;
          return { ...lb, index: next };
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [groupModal, lightbox]);

  const dateData: Record<string, { images: { src: string; title: string }[]; festival?: string }> = {};
  for (const item of galleryImages) {
    const dateKey = (item.date || "").slice(0, 10);
    if (!dateKey) continue;
    if (!dateData[dateKey]) dateData[dateKey] = { images: [], festival: undefined };
    for (const src of item.images || []) {
      dateData[dateKey].images.push({ src, title: item.title || "" });
    }
  }
  for (const d of appDarshan) {
    const dateKey = d.date || "";
    if (!dateKey) continue;
    if (!dateData[dateKey]) dateData[dateKey] = { images: [], festival: undefined };
    if (!dateData[dateKey].images.some((im) => im.src === d.imageUrl)) {
      dateData[dateKey].images.push({ src: d.imageUrl, title: "Daily Darshan" });
    }
  }


  const grouped = groupImages(
    activeCategory === "All" ? galleryImages : galleryImages.filter((img) => img.category === activeCategory)
  );

  // Don't block rendering of the full page while images load.
  // Previously we returned early which made the whole page show a single
  // "Loading gallery..." message until the client fetch completed. Keep the
  // PageHero and surrounding UI visible and show skeleton cards in the grid
  // while the gallery data is being fetched.


  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <PageHero
          title="Gallery"
          subtitle="Divine moments captured — Darshan, Festivals, Seva & Community"
          breadcrumb="Gallery"
          backgroundImage="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg"
        />

        <DailyDarshanGallery
          selectedDate={activeDate === "All Dates" ? undefined : activeDate}
          onDateChange={(d) => setActiveDate(d)}
          dateData={dateData}
        />

        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Albums" title="Browse by Category" />

            {/* Category chips — scroll sideways on phones, wrap on larger screens */}
            <div
              role="tablist"
              aria-label="Gallery categories"
              className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:mb-10 md:flex-wrap md:justify-center md:overflow-visible md:px-0"
            >
              {categories.map((cat) => {
                const on = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActiveCategory(cat)}
                    className={`min-h-[40px] shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                      on
                        ? "bg-vk-700 text-white shadow-[0_6px_16px_-6px_rgba(30,58,138,0.55)]"
                        : "border border-vk-200 bg-white text-ink/70 hover:border-vk-700 hover:text-vk-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <motion.div layout className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {loading
                  ? // Render 8 skeleton cards while loading so layout doesn't jump
                    Array.from({ length: 8 }).map((_, i) => (
                      <div key={`skeleton-${i}`} className="aspect-square animate-pulse rounded-2xl bg-vk-100" />
                    ))
                  : grouped.map((group, i) => (
                      <motion.button
                        type="button"
                        key={group.title + group.date + group.category}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}
                        className="vk-tile group aspect-square w-full cursor-pointer text-left"
                        onClick={() => setGroupModal({ group })}
                        aria-label={`Open album ${group.title}`}
                      >
                        <Image
                          src={group.images[0]}
                          alt={group.title}
                          fill
                          loading="lazy"
                          sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover"
                        />
                        <span className="vk-tile-caption block">
                          <span className="line-clamp-2 block text-[13px] font-semibold leading-snug text-white md:text-[15px]">
                            {group.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-white/70">{formatGalleryDate(group.date)}</span>
                        </span>
                        <span className="absolute right-3 top-3 z-[2] flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <ZoomIn className="h-4 w-4" />
                        </span>
                        {group.images.length > 1 && (
                          <span className="absolute left-3 top-3 z-[2] rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-vk-800 shadow-sm">
                            +{group.images.length}
                          </span>
                        )}
                      </motion.button>
                    ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {groupModal && groupModal.group && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-vk-900/90 p-3 backdrop-blur-sm md:p-4"
            onClick={() => setGroupModal(null)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative max-h-[90vh] w-[95vw] max-w-[1200px] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close album"
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-vk-100 text-vk-700 transition-colors hover:bg-vk-700 hover:text-white md:right-5 md:top-5"
                onClick={() => setGroupModal(null)}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mb-6 px-10 text-center">
                <span className="vk-pill-soft mb-2">{groupModal.group.category}</span>
                <h2 className="vk-h3">{groupModal.group.title}</h2>
                {groupModal.group.description && (
                  <p className="mx-auto mt-2 max-w-2xl text-[15px] text-muted-foreground">{groupModal.group.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                {groupModal.group.images.map((src, idx) => (
                  <button
                    type="button"
                    key={src}
                    className="vk-tile group relative aspect-[4/5] w-full cursor-pointer md:aspect-square"
                    onClick={() =>
                      setLightbox({
                        images: groupModal.group.images,
                        index: idx,
                        group: groupModal.group,
                      })
                    }
                    aria-label={`View image ${idx + 1} of ${groupModal.group.title}`}
                  >
                    <Image
                      src={src}
                      alt={groupModal.group.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 45vw, 30vw"
                      className="object-cover"
                    />
                    <span className="absolute inset-0 z-[2] flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm">
                        <ZoomIn className="h-5 w-5" />
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {lightbox && lightbox.images && typeof lightbox.index === "number" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-vk-900/95 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6 md:top-6"
              onClick={() => setLightbox(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative flex h-[90vh] w-[94vw] items-center justify-center md:w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <GallerySingleImage images={lightbox.images} startIndex={lightbox.index} />
            </motion.div>
            <div className="pointer-events-none absolute inset-x-4 bottom-6 text-center md:bottom-8">
              <p className="text-lg font-semibold text-white md:text-2xl">
                {lightbox.group ? lightbox.group.title : ""}
              </p>
              <p className="mt-1 text-sm text-white/60 md:text-base">
                {lightbox.group ? formatGalleryDate(lightbox.group.date) : ""}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

type GallerySingleImageProps = { images: string[]; startIndex?: number };

function GallerySingleImage({ images, startIndex = 0 }: GallerySingleImageProps) {
  const [index, setIndex] = useState<number>(startIndex);
  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);
  if (!images || images.length === 0) return null;
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <button
        type="button"
        aria-label="Previous image"
        className="absolute left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-vk-800 shadow-lg transition-colors hover:bg-white disabled:opacity-40 md:left-6 md:h-12 md:w-12"
        onClick={(e) => {
          e.stopPropagation();
          setIndex((i) => (i - 1 + images.length) % images.length);
        }}
        disabled={images.length <= 1}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <div className="relative flex h-full max-h-[80vh] w-full max-w-[1200px] items-center justify-center">
        <Image
          src={images[index]}
          alt="Gallery Image"
          fill
          loading="lazy"
          sizes="90vw"
          className="rounded-2xl object-contain"
        />
      </div>
      <button
        type="button"
        aria-label="Next image"
        className="absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-vk-800 shadow-lg transition-colors hover:bg-white disabled:opacity-40 md:right-6 md:h-12 md:w-12"
        onClick={(e) => {
          e.stopPropagation();
          setIndex((i) => (i + 1) % images.length);
        }}
        disabled={images.length <= 1}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <div className="absolute bottom-20 left-1/2 flex max-w-[90%] -translate-x-1/2 flex-wrap justify-center gap-2.5 md:bottom-24">
        {images.map((img, i) => (
          <button
            type="button"
            key={img + i}
            className={`h-2.5 cursor-pointer rounded-full transition-all focus:outline-none ${
              i === index ? "w-6 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
