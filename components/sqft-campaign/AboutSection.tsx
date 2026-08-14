"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Ornament from "@/components/Ornament";
import type { CampaignConfig } from "@/lib/campaignConfig";
import { SQFT_CAMPAIGN } from "@/lib/campaignConfig";

interface AboutSectionProps {
  aboutImage: string;
  scrollToDonate: () => void;
  config?: CampaignConfig;
}

export default function AboutSection({ aboutImage, scrollToDonate, config = SQFT_CAMPAIGN }: AboutSectionProps) {
  return (
    <section className="bg-white dark:bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <Ornament className="mb-6" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-10 md:grid-cols-2"
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={aboutImage}
              alt="Hare Krishna Vaikuntham Temple"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Inspiration &amp; Aspiration
            </p>
            <h2 className="mb-4 font-heading text-2xl font-bold text-primary md:text-3xl">
              Hare Krishna Vaikuntam — a sacred sanctuary in the making
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Nestled amidst the serene landscapes of Gambheeram in Visakhapatnam, the Hare Krishna
              Vaikuntham Cultural Centre (Chaitanya Bhavan) is envisioned as a magnificent sanctuary
              to preserve and propagate India&apos;s timeless spiritual and cultural heritage.
            </p>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Beautifully blending modern utility with traditional Vedic architectural grace, the
              multi-storey complex will feature divine altars, a vibrant kirtan hall, and dedicated
              spaces for youth empowerment and spiritual education — serving devotion, peace and
              heritage for generations to come.
            </p>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
              Inspired by the vision of Srila Prabhupada, Founder-Acharya of the worldwide Hare
              Krishna Movement, this temple is being built brick by brick, square foot by square foot,
              through the devotion of thousands of well-wishers like you.
            </p>
            <button
              onClick={scrollToDonate}
              className="rounded-full bg-gradient-gold px-8 py-3 text-sm font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-all hover:scale-105 hover:shadow-[0_12px_32px_hsl(42,92%,46%,0.4)]"
            >
              Sponsor a {config.unitName}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
