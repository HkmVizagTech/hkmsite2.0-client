"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Ornament from "@/components/Ornament";
import useInViewVideo from "@/hooks/useInViewVideo";

const CLOUDINARY_BASE = "https://res.cloudinary.com/ddmzeqpkc/video/upload";

// Short scriptural glorifications (no Sanskrit) shown as text over the video,
// mirroring the "Power of Giving" section on the campaigns site.
const SCRIPTURES = [
  {
    citation: "Garuda Purana",
    text: "One who contributes to building a temple attains heaven and is honored by all.",
    video: `${CLOUDINARY_BASE}/garuda_purana.mp4`,
  },
  {
    citation: "Vishnu Purana (3.8.27)",
    text: "One who donates towards the construction of a temple is liberated from all sins and attains the heavenly realms.",
    video: `${CLOUDINARY_BASE}/vishnu_purana.mp4`,
  },
  {
    citation: "Vamana Purana",
    text: "One can attain the spiritual world (Vaikuntha) by helping construct or renovate a temple.",
    video: `${CLOUDINARY_BASE}/vamana_purana.mp4`,
  },
];

export default function ImportanceSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useInViewVideo(sectionRef);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="bg-card py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <Ornament className="mb-6" />
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Sacred scriptures glorify those who support spiritual causes
            </p>
            <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
              The Power of{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Giving
              </span>
            </h2>
          </div>
          <div className="flex gap-2 md:hidden">
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
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SCRIPTURES.map((s) => (
            <div
              key={s.citation}
              className="group relative aspect-[6/5] w-80 shrink-0 snap-start overflow-hidden rounded-2xl border border-border shadow-sm sm:w-96 md:w-auto"
            >
              <video
                src={s.video}
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full scale-150 object-cover transition-transform duration-700 group-hover:scale-[1.6]"
              />
              {/* Dark gradient so the overlaid text stays readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="mb-3 inline-block rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[hsl(220,90%,12%)]">
                  {s.citation}
                </span>
                <p className="text-sm leading-relaxed text-white md:text-base">{s.text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
