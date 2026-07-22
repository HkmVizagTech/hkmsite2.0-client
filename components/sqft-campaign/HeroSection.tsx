"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { CampaignConfig } from "@/lib/campaignConfig";

interface HeroSectionProps {
  campaigner?: { name: string };
  price: number;
  scrollToDonate: () => void;
  config: CampaignConfig;
}

export default function HeroSection({
  campaigner,
  price,
  scrollToDonate,
  config,
}: HeroSectionProps) {
  // Banner mode: a pre-designed banner (text baked in) replaces the hero.
  if (config.bannerImage) {
    const altText = `${config.pageTitle} — ${config.heroHeading1} ${config.heroHeading2}`;
    return (
      <section className="bg-[#faf3df] pt-[72px] md:pt-[92px]">
        {/* Whole banner is clickable — glides to the donation form */}
        <button
          type="button"
          onClick={scrollToDonate}
          aria-label="Donate — go to the donation form"
          className="block w-full cursor-pointer"
        >
          {/* Mobile banner (portrait) */}
          <Image
            src={config.bannerImageMobile || config.bannerImage}
            alt={altText}
            width={941}
            height={1672}
            priority
            sizes="100vw"
            className="block h-auto w-full md:hidden"
          />
          {/* Desktop banner (landscape) */}
          <Image
            src={config.bannerImage}
            alt={altText}
            width={1672}
            height={941}
            priority
            sizes="100vw"
            className="hidden h-auto w-full md:block"
          />
        </button>
      </section>
    );
  }

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-[hsl(220,90%,12%)]">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${config.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,90%,12%)]/95 via-[hsl(220,90%,12%)]/80 to-[hsl(220,90%,12%)]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,90%,12%)] via-transparent to-transparent" />
      </div>

      {/* Decorative gold flares */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-gold/5 blur-[100px]" />

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-6xl items-center px-4 pt-28 pb-16 md:pt-32">
        <div className="w-full">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold md:text-sm">
              {campaigner
                ? `${campaigner.name}'s Fundraising Campaign for`
                : "A Fundraising Initiative of Hare Krishna Movement Visakhapatnam"}
            </p>
            <h1 className="mb-4 font-heading text-4xl font-bold leading-tight text-white md:text-6xl">
              Hare Krishna
              <br />
              <span className="text-gold">Vaikuntham Temple</span>
            </h1>
            <p className="mb-8 text-base leading-relaxed text-white/75 md:text-lg">
              {config.heroDesc}
            </p>

            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button
                onClick={scrollToDonate}
                className="rounded-full bg-gradient-gold px-10 py-4 text-base font-bold text-[hsl(220,90%,12%)] shadow-[var(--shadow-gold)] transition-all hover:scale-105 hover:shadow-[0_12px_32px_hsl(42,92%,46%,0.45)] md:text-lg"
              >
                Donate Now
              </button>
              <p className="font-heading text-xl font-bold text-gold">
                ₹{price.toLocaleString("en-IN")}{" "}
                <span className="text-sm font-normal text-white/60">per {config.unitName}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> Prasadam from the temple
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> Puja on inauguration day
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> 80G tax exemption
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
