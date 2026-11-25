"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Home, Images, LayoutGrid, MapPin, Maximize2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import FadeImage from "@/components/gallery/FadeImage";
import Lightbox from "@/components/gallery/Lightbox";
import { CREAM, Eyebrow, LINE, SERIF } from "@/components/blogs/parts";
import DailyDarshanGallery from "@/components/DailyDarshanGallery";
import { getGalleryImages, GALLERY_CATEGORIES } from "@/lib/galleryApi";
import { getRecentDarshan, type DarshanPhoto } from "@/lib/darshanApi";
import { MAPS_URL } from "@/lib/templeInfo";

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

// Some albums were saved with a throw-away title ("1", "121"). Show something readable instead.
const albumTitle = (g: { title: string; category: string }) => {
  const t = (g.title || "").replace(/[-_]+/g, " ").trim();
  if (t.length < 3 || /^[\d\s.]+$/.test(t)) return `${g.category} photos`;
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeDate, setActiveDate] = useState<string>("All Dates");
  // "photos": every picture on one masonry wall; "albums": one card per album.
  const [view, setView] = useState<"photos" | "albums">("photos");
  const [visible, setVisible] = useState(24);
  const [photoLightbox, setPhotoLightbox] = useState<number | null>(null);
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
    // Escape closes the album, unless the photo viewer is open (it closes itself first).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lightbox && groupModal) setGroupModal(null);
    };
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
  const allGrouped = groupImages(galleryImages);
  const photos = grouped
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .flatMap((g) => g.images.map((src) => ({ src, title: albumTitle(g), subtitle: `${g.category} · ${formatGalleryDate(g.date)}`, group: g })));
  const totalPhotos = allGrouped.reduce((n, g) => n + g.images.length, 0);
  const dayCount = Object.keys(dateData).length;

  // Hero collage: the latest darshan photo first, then the newest albums.
  const latestDarshanDay = Object.keys(dateData).sort((a, b) => b.localeCompare(a))[0];
  const heroPics: { src: string; title: string }[] = [];
  const pushPic = (src?: string, title?: string) => {
    if (src && !heroPics.some((p) => p.src === src)) heroPics.push({ src, title: title || "Darshan" });
  };
  if (latestDarshanDay) pushPic(dateData[latestDarshanDay].images[0]?.src, "Darshan of the day");
  allGrouped
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .forEach((g) => pushPic(g.images[0], albumTitle(g)));
  const heroPic = (i: number, shape: string) =>
    heroPics[i] ? (
      <div className={`relative overflow-hidden bg-vk-100 shadow-[0_28px_50px_-28px_rgba(30,58,138,0.7)] ring-4 ring-white ${shape}`}>
        <Image src={heroPics[i].src} alt={heroPics[i].title} fill priority={i < 2} sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover object-top" />
      </div>
    ) : (
      <div className={`animate-pulse bg-vk-100 ring-4 ring-white ${shape}`} />
    );

  return (
    <PageLayout>
      <div className={`${CREAM} pt-[var(--header-h)]`}>
        {/* ─── Hero: text + arch photo collage ─── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F7FF] via-white to-white">
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-vk-100/70 blur-3xl" />
          <div className="vk-container relative grid items-center gap-10 pb-12 pt-10 md:pb-20 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="text-center lg:text-left">
              <nav aria-label="Breadcrumb" className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-ink/55 md:text-[13px]">
                <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-vk-700">
                  <Home className="h-3.5 w-3.5" /> Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                <span className="font-semibold text-vk-700" aria-current="page">
                  Gallery
                </span>
              </nav>
              <div className="flex justify-center lg:justify-start">
                <Eyebrow>Darshan · Festivals · Seva · Community</Eyebrow>
              </div>
              <h1 className={`${SERIF} mt-4 text-[2.4rem] font-semibold leading-[1.1] text-ink sm:text-5xl lg:text-[3.6rem]`}>
                Darshan &amp; <span className="bg-gradient-to-r from-[#E8A317] to-[#C77700] bg-clip-text text-transparent">Temple Gallery</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink/65 md:text-lg lg:mx-0">
                Divine moments from the temple: the daily darshan of Their Lordships, festivals, seva and the life of the community.
              </p>

              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a href="#darshan" className="vk-btn-gold px-7 py-3.5 text-base">
                  Today&apos;s Darshan <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#albums" className={`inline-flex items-center justify-center gap-2 rounded-xl border ${LINE} bg-white px-7 py-3.5 text-base font-semibold text-vk-800 shadow-sm transition hover:border-vk-400 hover:bg-vk-50`}>
                  Browse Albums
                </a>
              </div>

              {!loading && totalPhotos > 0 && (
                <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3 lg:mx-0">
                  {[
                    { v: allGrouped.length, l: "albums" },
                    { v: totalPhotos, l: "photos" },
                    { v: dayCount, l: "darshan days" },
                  ].map((x) => (
                    <div key={x.l} className={`rounded-2xl border ${LINE} bg-white px-2 py-3 text-center shadow-[0_14px_28px_-22px_rgba(30,58,138,0.5)]`}>
                      <div className={`${SERIF} text-2xl font-semibold text-vk-700`}>{x.v}</div>
                      <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/55">{x.l}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* arch collage */}
            <div className="relative mx-auto w-full max-w-sm md:max-w-md">
              <div aria-hidden className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-br from-[#FFF1CC] via-white to-vk-100/60" />
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-3 pt-10 md:space-y-4 md:pt-14">
                  {heroPic(0, "aspect-[3/4] rounded-t-[999px] rounded-b-3xl")}
                  {heroPic(2, "aspect-square rounded-3xl")}
                </div>
                <div className="space-y-3 md:space-y-4">
                  {heroPic(1, "aspect-square rounded-3xl")}
                  {heroPic(3, "aspect-[3/4] rounded-t-[999px] rounded-b-3xl")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <DailyDarshanGallery
          selectedDate={activeDate === "All Dates" ? undefined : activeDate}
          onDateChange={(d) => setActiveDate(d)}
          dateData={dateData}
        />

        {/* ─── Albums ─── */}
        <section id="albums" className="scroll-mt-[calc(var(--header-h)+8px)] border-t border-[#E4E9F7] bg-gradient-to-b from-[#F4F7FF] to-white py-12 md:py-20">
          <div className="vk-container">
            <div className="mb-8 text-center md:mb-10">
              <div className="flex justify-center">
                <Eyebrow>Albums</Eyebrow>
              </div>
              <h2 className={`${SERIF} mt-3 text-[1.8rem] font-semibold leading-tight text-ink md:text-[2.4rem]`}>Browse by category</h2>
            </div>

            {/* Category chips — scroll sideways on phones, wrap on larger screens */}
            <div
              role="tablist"
              aria-label="Gallery categories"
              className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:mb-12 md:flex-wrap md:justify-center md:overflow-visible md:px-0"
            >
              {categories.map((cat) => {
                const on = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setActiveCategory(cat);
                      setVisible(24);
                    }}
                    className={`min-h-[40px] shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                      on
                        ? "bg-gradient-to-b from-[#F6C752] to-[#E8A317] text-vk-900 shadow-[0_10px_22px_-10px_rgba(232,163,23,0.8)]"
                        : `border ${LINE} bg-white/80 text-ink/70 hover:border-vk-400 hover:text-ink`
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="mb-8 flex justify-center md:mb-10">
              <div className={`inline-flex rounded-full border ${LINE} bg-white/80 p-1`}>
                {([
                  ["photos", "All photos", LayoutGrid],
                  ["albums", "Albums", Images],
                ] as const).map(([key, label, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={view === key}
                    onClick={() => setView(key)}
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                      view === key ? "bg-vk-700 text-white shadow" : "text-ink/65 hover:text-vk-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="mb-6 w-full animate-pulse break-inside-avoid rounded-2xl bg-[#EEF2FF]" style={{ height: [260, 340, 300, 380][i % 4] }} />
                ))}
              </div>
            ) : grouped.length === 0 ? (
              <p className="py-12 text-center text-ink/50">No photos in this category yet.</p>
            ) : view === "photos" ? (
              <>
                <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
                  {photos.slice(0, visible).map((ph, i) => (
                    <button
                      type="button"
                      key={ph.src + i}
                      onClick={() => setPhotoLightbox(i)}
                      aria-label={`View ${ph.title}`}
                      className="group relative mb-3 block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-3xl bg-[#EEF2FF] text-left align-top shadow-[0_18px_36px_-26px_rgba(30,58,138,0.6)] ring-1 ring-white transition-shadow hover:shadow-[0_28px_50px_-26px_rgba(30,58,138,0.75)] md:mb-4"
                    >
                      <span className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-vk-800 opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100"><Maximize2 className="h-3.5 w-3.5" /></span>
                      <FadeImage src={ph.src} alt={ph.title} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="group-hover:scale-[1.04]" />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1230]/85 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-4">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#BFD0FF]">{ph.group.category}</span>
                        <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-white md:text-sm">{ph.title}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {visible < photos.length && (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={() => setVisible((v) => v + 24)}
                      className="vk-btn min-h-[46px] border border-vk-700/30 bg-white px-7 text-vk-800 hover:bg-vk-50"
                    >
                      Show more photos ({photos.length - visible} left)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                {grouped.map((group, i) => (
                  <div key={group.title + group.date + group.category} className="group relative pb-3">
                  {group.images.length > 1 && (
                    <>
                      <span aria-hidden className={`absolute inset-x-3 top-0 bottom-1 -rotate-[3deg] rounded-2xl border ${LINE} bg-white shadow-sm transition-transform duration-500 group-hover:-rotate-[6deg]`} />
                      <span aria-hidden className={`absolute inset-x-3 top-0 bottom-1 rotate-[2.5deg] rounded-2xl border ${LINE} bg-vk-50 shadow-sm transition-transform duration-500 group-hover:rotate-[5deg]`} />
                    </>
                  )}
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}
                    className="group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-2xl bg-[#EEF2FF] text-left shadow-[0_20px_40px_-28px_rgba(30,58,138,0.65)]"
                    onClick={() => setGroupModal({ group })}
                    aria-label={`Open album ${albumTitle(group)}`}
                  >
                    <Image
                      src={group.images[0]}
                      alt={albumTitle(group)}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#0b1230]/85 via-[#0b1230]/15 to-transparent" />
                    {group.images.length > 1 && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                        <Images className="h-3 w-3" /> {group.images.length}
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 block p-4 md:p-5">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#BFD0FF]">{group.category}</span>
                      <span className={`${SERIF} mt-1 line-clamp-2 block text-[1.05rem] font-semibold leading-snug text-white md:text-[1.2rem]`}>
                        {albumTitle(group)}
                      </span>
                      <span className="mt-1 block text-xs text-white/70">{formatGalleryDate(group.date)}</span>
                    </span>
                  </motion.button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── Visit the temple ─── */}
        <section className="pb-14 pt-4 md:pb-20">
          <div className="vk-container">
            <div className="relative overflow-hidden rounded-3xl border border-[#F3D88A] bg-gradient-to-br from-[#FFF4D6] via-white to-[#F4F7FF] px-6 py-10 text-center shadow-[0_30px_60px_-44px_rgba(232,163,23,0.7)] md:px-12 md:py-14">
              <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F6C752]/25 blur-2xl" />
              <div className="flex justify-center">
                <Eyebrow>Come for darshan</Eyebrow>
              </div>
              <h2 className={`${SERIF} mx-auto mt-3 max-w-2xl text-[1.8rem] font-semibold leading-tight text-ink md:text-[2.4rem]`}>
                Photos capture the moment. Darshan in person touches the heart.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink/65">
                See the aarti timings and plan your visit to ISKCON Gambheeram, Visakhapatnam.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/daily-schedule" className="vk-btn-gold px-7 py-3.5 text-base">
                  Daily Schedule <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center gap-2 rounded-xl border ${LINE} bg-white px-7 py-3.5 text-base font-semibold text-vk-800 shadow-sm transition hover:border-vk-400 hover:bg-vk-50`}>
                  <MapPin className="h-4 w-4" /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Album: opens as a warm sheet ─── */}
      <AnimatePresence>
        {groupModal && groupModal.group && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1230]/85 p-3 backdrop-blur-sm md:p-6"
            onClick={() => setGroupModal(null)}
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className={`relative max-h-[92vh] w-[96vw] max-w-[1200px] overflow-y-auto rounded-[1.75rem] ${CREAM} p-5 shadow-2xl md:p-10`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close album"
                className="sticky top-0 z-10 float-right -mr-1 -mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-[#D5DDF5] bg-white text-vk-700 shadow-sm transition-colors hover:bg-vk-700 hover:text-white"
                onClick={() => setGroupModal(null)}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mb-8 px-2 text-center md:px-12">
                <div className="flex justify-center">
                  <Eyebrow>{groupModal.group.category}</Eyebrow>
                </div>
                <h2 className={`${SERIF} mt-3 text-[1.6rem] font-semibold leading-tight text-ink md:text-[2.2rem]`}>{albumTitle(groupModal.group)}</h2>
                <p className="mt-2 text-sm text-ink/55">
                  {formatGalleryDate(groupModal.group.date)} · {groupModal.group.images.length} {groupModal.group.images.length === 1 ? "photo" : "photos"}
                </p>
                {groupModal.group.description && (
                  <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/65">{groupModal.group.description}</p>
                )}
              </div>
              <div className="columns-2 gap-3 md:columns-3 md:gap-4">
                {groupModal.group.images.map((src, idx) => (
                  <button
                    type="button"
                    key={src}
                    className={`group relative mb-3 block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-2xl bg-[#EEF2FF] shadow-[0_16px_32px_-24px_rgba(30,58,138,0.6)] md:mb-4`}
                    onClick={() => setLightbox({ images: groupModal.group.images, index: idx, group: groupModal.group })}
                    aria-label={`View photo ${idx + 1} of ${groupModal.group.title}`}
                  >
                    <FadeImage src={src} alt={albumTitle(groupModal.group)} sizes="(max-width: 768px) 45vw, 30vw" className="group-hover:scale-[1.04]" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {photoLightbox !== null && photos[photoLightbox] && (
          <Lightbox
            items={photos.map((p) => ({ src: p.src, title: p.title, subtitle: p.subtitle }))}
            index={photoLightbox}
            onIndex={setPhotoLightbox}
            onClose={() => setPhotoLightbox(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            items={lightbox.images.map((src) => ({ src, title: albumTitle(lightbox.group) }))}
            index={lightbox.index}
            onIndex={(i) => setLightbox((lb) => (lb ? { ...lb, index: i } : lb))}
            onClose={() => setLightbox(null)}
            subtitle={formatGalleryDate(lightbox.group.date)}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
