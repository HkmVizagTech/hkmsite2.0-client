"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
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
    <section ref={sectionRef} className="vk-section vk-band">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow="Inside the temple"
          title="Inside Hare Krishna Vaikuntam"
          subtitle="Each contribution helps build sacred spaces that uplift hearts."
        />

        {/* Featured hall — the Divine Altar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="vk-card mb-6 overflow-hidden !rounded-3xl md:grid md:grid-cols-2"
        >
          {/* Portrait image in a square frame — no more heavy cropping */}
          <div className="group relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:min-h-[460px]">
            <Image
              src={FEATURED_HALL.image}
              alt={FEATURED_HALL.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Text panel */}
          <div className="relative flex flex-col justify-center bg-gradient-to-br from-vk-900 via-vk-800 to-vk-700 p-6 text-white md:p-12">
            <span className="vk-pill-light mb-4 w-fit">{FEATURED_HALL.tag}</span>
            <h3 className="vk-h2 !text-white">{FEATURED_HALL.title}</h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/85 md:text-base">
              {FEATURED_HALL.desc}
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65 md:text-base">
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
          className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
        >
          {OTHER_HALLS.map((hall, i) => (
            <div key={hall.title} className="vk-tile group aspect-[4/3]">
              <Image
                src={hall.image}
                alt={hall.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />

              {/* Editorial index number */}
              <span className="absolute right-4 top-3 z-[2] font-heading text-3xl font-extrabold text-white/30">
                {String(i + 2).padStart(2, "0")}
              </span>

              <div className="vk-tile-caption">
                <h3 className="font-heading text-lg font-bold text-white md:text-xl">{hall.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/80">{hall.desc}</p>
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
          className="relative mx-auto mt-12 max-w-4xl md:mt-14"
        >
          <div className="mb-4 flex justify-center">
            <span className="vk-pill-soft">
              <Play className="h-3.5 w-3.5 fill-current" />
              A cinematic glimpse of the vision
            </span>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]">
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
