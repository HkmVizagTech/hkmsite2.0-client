"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <section ref={sectionRef} className="vk-section bg-white">
      <div className="vk-container">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <div className="max-w-3xl">
            <span className="vk-pill mb-3 max-w-full leading-snug">
              Sacred scriptures glorify those who support spiritual causes
            </span>
            <h2 className="vk-h2">
              The Power of <span className="text-vk-600">Giving</span>
            </h2>
          </div>
          <div className="flex shrink-0 gap-2 md:hidden">
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
          className="vk-scroller md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0"
        >
          {SCRIPTURES.map((s) => (
            <div
              key={s.citation}
              className="group relative aspect-[6/5] w-[85%] max-w-[22rem] shrink-0 overflow-hidden rounded-2xl bg-vk-900 shadow-card md:w-auto md:max-w-none"
            >
              <video
                src={s.video}
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full scale-150 object-cover transition-transform duration-700 group-hover:scale-[1.6]"
              />
              {/* Navy gradient so the overlaid text stays readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-vk-900/90 via-vk-900/45 to-vk-900/5" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <span className="vk-pill-light mb-3">{s.citation}</span>
                <p className="font-serif-display text-[15px] italic leading-relaxed text-white md:text-base">{s.text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
