"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Ornament from "@/components/Ornament";

const CONSTRUCTION_PHOTOS = [
  { src: "/assets/construction-update-1.jpg", caption: "Foundation & Ground Floor" },
  { src: "/assets/construction-update-2.jpg", caption: "Structural Framework" },
  { src: "/assets/construction-update-3.jpg", caption: "Column & Beam Work" },
  { src: "/assets/construction-update-4.jpg", caption: "Multi-Level Construction" },
  { src: "/assets/construction-update-5.jpg", caption: "Building Elevation" },
];

const CONSTRUCTION_VIDEO_ID = "RRifRjrlc5s";

export default function ConstructionStatusSection({ scrollToDonate }: { scrollToDonate?: () => void }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,221,91,0.14),_transparent_45%)] bg-card py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <Ornament className="mb-10" />

        {/* Video + intro copy */}
        <div className="mb-16 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-xs"
          >
            <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] border border-border shadow-elevated">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${CONSTRUCTION_VIDEO_ID}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playsinline=1`}
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
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Monthly Construction Update
            </p>
            <h2 className="mb-4 font-heading text-2xl font-bold text-primary md:text-4xl">
              Watch The Temple Rise, Brick by Brick
            </h2>
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Every seva you offer becomes real progress on site. Watch our latest monthly update and
              see exactly how your contribution is shaping the Hare Krishna Vaikuntham Temple —
              foundation to framework, floor by floor.
            </p>
            {scrollToDonate && (
              <button
                onClick={scrollToDonate}
                className="rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-transform hover:scale-105 md:text-base"
              >
                Donate Now
              </button>
            )}
          </motion.div>
        </div>

        {/* Photo gallery */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <h3 className="font-heading text-xl font-bold text-primary md:text-2xl">
            Recent Site Photos
          </h3>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-gold hover:text-gold"
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
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CONSTRUCTION_PHOTOS.map((p) => (
            <div
              key={p.src}
              className="group relative aspect-[4/3] w-80 shrink-0 snap-start overflow-hidden rounded-2xl border border-border shadow-sm sm:w-96"
            >
              <Image
                src={p.src}
                alt={p.caption}
                fill
                sizes="(max-width: 640px) 320px, 384px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
                {p.caption}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
