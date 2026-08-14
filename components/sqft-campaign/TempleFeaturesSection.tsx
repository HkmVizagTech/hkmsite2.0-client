"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";
import Ornament from "@/components/Ornament";
import useInViewVideo from "@/hooks/useInViewVideo";

const INTRO_VIDEO_ID = "IJTMCgGBriw";

const TEMPLE_IMAGES_BASE =
  "https://pub-f62a54aab54448388c9e16334109aea9.r2.dev/Temple%2520Images";

// Sacred spaces planned inside the Hare Krishna Vaikuntham Cultural Centre,
// mirroring the "Inside Hare Krishna Vaikuntam" section on the campaigner pages.
const TEMPLE_HALLS = [
  {
    title: "Divine Altar",
    desc: "A beautifully carved altar where Their Lordships Sri Srinivasa Govinda will eternally reside.",
    image: `${TEMPLE_IMAGES_BASE}/govinda.jpg`,
    tag: "The Heart of the Temple",
    featured: true,
  },
  {
    title: "Vedic Planetarium",
    desc: "To awaken timeless wisdom through the light of modern technology.",
    image: `${TEMPLE_IMAGES_BASE}/vedic.jpg`,
  },
  {
    title: "Prasadam Hall",
    desc: "A sacred hall serving Krishna-prasadam to all who come.",
    image: `${TEMPLE_IMAGES_BASE}/annadanam_hall.jpg`,
  },
  {
    title: "Festival Hall",
    desc: "A grand space for kirtans, festivals & cultural celebrations.",
    image: `${TEMPLE_IMAGES_BASE}/festival_hall.jpg`,
  },
  {
    title: "Harinam Mandap",
    desc: "A serene space for chanting & meditation.",
    image: `${TEMPLE_IMAGES_BASE}/harinaam_mandap.jpg`,
  },
  {
    title: "Bala Samskriti Program",
    desc: "Value-based cultural learning for children.",
    image: `${TEMPLE_IMAGES_BASE}/icvk.jpg`,
  },
  {
    title: "Gita Life Program",
    desc: "Transforming youth & families with Gita wisdom.",
    image: `${TEMPLE_IMAGES_BASE}/gita_life.jpg`,
  },
];

const [FEATURED_HALL, ...OTHER_HALLS] = TEMPLE_HALLS;

export default function TempleFeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useInViewVideo(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.08),_transparent_50%)] bg-white py-12 dark:bg-background md:py-16"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <Ornament className="mb-6" />
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Inside the temple
          </p>
          <h2 className="mb-3 font-heading text-3xl font-bold text-primary md:text-5xl">
            Inside Hare Krishna{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Vaikuntam
            </span>
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Each contribution helps build sacred spaces that uplift hearts.
          </p>
        </div>

        {/* Featured hall — the Divine Altar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 overflow-hidden rounded-3xl border border-border shadow-xl md:grid md:grid-cols-2"
        >
          {/* Portrait image in a square frame — no more heavy cropping */}
          <div className="group relative aspect-[4/5] w-full md:aspect-auto md:min-h-[460px]">
            <Image
              src={FEATURED_HALL.image}
              alt={FEATURED_HALL.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/25 to-transparent md:bg-gradient-to-r md:from-transparent md:to-primary/10" />
          </div>

          {/* Themed text panel */}
          <div className="relative flex flex-col justify-center bg-primary p-8 text-primary-foreground md:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-gold/5 blur-3xl" />

            <span className="relative mb-5 inline-flex w-fit items-center rounded-full border border-gold/40 bg-gold/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              {FEATURED_HALL.tag}
            </span>
            <h3 className="relative bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text font-heading text-3xl font-bold text-transparent md:text-4xl">
              {FEATURED_HALL.title}
            </h3>

            <div className="relative my-5 flex items-center gap-3" aria-hidden>
              <span className="h-px w-10 bg-gold/50" />
              <svg viewBox="0 0 80 16" className="h-3.5 w-8 text-gold/70" fill="none">
                <path d="M8 8 Q20 0 40 8 Q60 16 72 8" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="40" cy="8" r="3" fill="currentColor" />
              </svg>
              <span className="h-px w-10 bg-gold/50" />
            </div>

            <p className="relative max-w-md text-sm leading-relaxed text-primary-foreground/85 md:text-base">
              {FEATURED_HALL.desc}
            </p>
            <p className="relative mt-5 max-w-md text-sm leading-relaxed text-primary-foreground/60 md:text-base">
              Every offering brings this sacred altar closer to life.
            </p>
          </div>
        </motion.div>

        {/* Remaining halls — responsive grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {OTHER_HALLS.map((hall, i) => (
            <div
              key={hall.title}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-sm transition-shadow duration-300 hover:shadow-[0_16px_40px_hsl(220,90%,20%,0.18)]"
            >
              <Image
                src={hall.image}
                alt={hall.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Editorial index number */}
              <span className="absolute right-4 top-3 font-heading text-4xl font-bold text-white/25 transition-colors duration-300 group-hover:text-gold/60">
                {String(i + 2).padStart(2, "0")}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text font-heading text-lg font-bold text-transparent md:text-xl">
                  {hall.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/80">{hall.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Large intro video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto mt-14 max-w-4xl"
        >
          <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
            <Play className="h-4 w-4 fill-current text-gold" />
            A cinematic glimpse of the vision
          </div>
          <div className="absolute -inset-4 rounded-[32px] bg-primary/20 blur-3xl opacity-30" />
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl ring-1 ring-white/10 sm:rounded-3xl">
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${INTRO_VIDEO_ID}?enablejsapi=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playsinline=1&logo=0`}
                title="Hare Krishna Vaikuntham Temple — Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
