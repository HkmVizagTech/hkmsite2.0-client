"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, Heart } from "lucide-react";

const SCRIPTURES = [
  {
    icon: BookOpen,
    citation: "Srimad Bhagavatam (10.3.28)",
    text: "On the auspicious day of Janmashtami, acts of devotion and charity are amplified a thousandfold. offerings made to the Lord on His appearance day purify one's family for generations.",
  },
  {
    icon: Sparkles,
    citation: "Padma Purana",
    text: "One who donates food, clothes or gold on the birthday of Lord Krishna destroys all sinful reactions and attains the supreme abode of Lord Vishnu.",
  },
  {
    icon: Heart,
    citation: "Skanda Purana",
    text: "Charity given during Janmashtami with devotion is imperishable. It nourishes the giver's soul and brings prosperity and protection to their loved ones.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function JanmashtamiImportanceSection() {
  return (
    <section className="relative overflow-hidden bg-[#130922] py-14 md:py-20">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-[#ffd96f]/[0.04] blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#ffd96f]">
            Sacred scriptures glorify devotion during the Lord&apos;s appearance
          </p>
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
            Significance of{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Giving on Janmashtami
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
            The scriptures reveal that acts of charity performed on the auspicious
            day of Sri Krishna Janmashtami carry immeasurable spiritual merit.
          </p>
        </motion.div>

        {/* Scripture cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {SCRIPTURES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.citation}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="group relative rounded-2xl border border-amber-900/20 bg-gradient-to-b from-[#1a0e30] to-[#0f0620] p-6 shadow-lg transition hover:border-amber-700/40 hover:shadow-amber-900/10"
              >
                {/* Icon badge */}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-[#130922] shadow-md">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Citation tag */}
                <span className="mb-3 inline-block rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#ffd96f]">
                  {s.citation}
                </span>

                <p className="text-sm leading-relaxed text-gray-300 md:text-base">
                  {s.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
