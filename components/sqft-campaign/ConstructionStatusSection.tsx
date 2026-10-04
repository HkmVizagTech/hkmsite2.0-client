"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useInViewVideo from "@/hooks/useInViewVideo";

interface SitePhoto {
  url: string;
  caption?: string;
}

// Shown until the admin-managed gallery arrives, and kept if that request
// fails. Photos and captions are edited in Admin → Content → Construction.
const FALLBACK_PHOTOS: SitePhoto[] = [
  { url: "/assets/construction-update-1.jpg", caption: "Foundation & Ground Floor" },
  { url: "/assets/construction-update-2.jpg", caption: "Structural Framework" },
  { url: "/assets/construction-update-3.jpg", caption: "Column & Beam Work" },
  { url: "/assets/construction-update-4.jpg", caption: "Multi-Level Construction" },
  { url: "/assets/construction-update-5.jpg", caption: "Building Elevation" },
];

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

// Shown until the admin-managed value arrives, and kept as the fallback if
// that request fails — the section is never left with an empty frame.
// Changing the video is done in Admin → Content → Construction, not here.
const FALLBACK_VIDEO_ID = "mPAt0gb__Hw";

export default function ConstructionStatusSection({ scrollToDonate }: { scrollToDonate?: () => void }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useInViewVideo(sectionRef);

  // The monthly update video, set by an admin. Fetched rather than baked in
  // so swapping it each month doesn't need a code change and a deploy.
  const [videoId, setVideoId] = useState(FALLBACK_VIDEO_ID);
  const [photos, setPhotos] = useState<SitePhoto[]>(FALLBACK_PHOTOS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/site-content`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const id = data?.content?.construction?.videoId;
        if (id) setVideoId(id);
        const list = data?.content?.construction?.photos;
        // An empty array is a real choice (admin removed them all), but a
        // missing key means this site-content row predates the field — keep
        // the fallback rather than emptying the strip.
        if (Array.isArray(list)) setPhotos(list.filter((p: SitePhoto) => p?.url));
      } catch {
        // Keep the fallback — a campaign page must not lose its video
        // because one content request failed.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="vk-section vk-band relative overflow-hidden">
      <div className="vk-container">
        {/* Video + intro copy */}
        <div className="mb-12 grid items-center gap-8 md:mb-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-xs"
          >
            <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]">
              <iframe
                key={videoId}
                src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playsinline=1`}
                title="Hare Krishna Vaikuntham Temple — Monthly Construction Update"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="vk-pill mb-4">Monthly Construction Update</span>
            <h2 className="vk-h2 mb-4">
              Watch The Temple Rise, Brick by Brick
            </h2>
            <p className="vk-lead mb-6 max-w-xl">
              Every seva you offer becomes real progress on site. Watch our latest monthly update and
              see exactly how your contribution is shaping the Hare Krishna Vaikuntham Temple —
              foundation to framework, floor by floor.
            </p>
            {scrollToDonate && (
              <button
                onClick={scrollToDonate}
                className="vk-btn-gold h-12 px-8 text-base"
              >
                Donate Now
              </button>
            )}
          </motion.div>
        </div>

        {/* Photo gallery — hidden entirely when there are no photos, rather
            than leaving a heading over an empty rail. */}
        {photos.length > 0 && (
        <>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h3 className="vk-h3 vk-bar-title">
            Recent Site Photos
          </h3>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          ref={scrollerRef}
          className="vk-scroller"
        >
          {photos.map((p) => (
            <div
              key={p.url}
              className="vk-tile group aspect-[4/3] w-[85%] max-w-[24rem] shrink-0 sm:w-96"
            >
              <Image
                src={p.url}
                alt={p.caption || "Temple construction progress"}
                fill
                sizes="(max-width: 640px) 320px, 384px"
                className="object-cover"
              />
              {p.caption && (
                <div className="vk-tile-caption">
                  <p className="truncate text-sm font-semibold text-white">{p.caption}</p>
                </div>
              )}
            </div>
          ))}
        </motion.div>
        </>
        )}
      </div>
    </section>
  );
}
