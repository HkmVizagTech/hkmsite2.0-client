"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import Ornament from "@/components/Ornament";
import type { CampaignConfig } from "@/lib/campaignConfig";

interface ProgressSectionProps {
  sqftRaised: number;
  percent: number;
  goalSqft: number;
  donorCount: number;
  config: CampaignConfig;
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <span>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function ProgressSection({
  sqftRaised,
  percent,
  goalSqft,
  donorCount,
  config,
}: ProgressSectionProps) {
  const gridSquares = 40;
  const filledSquares = Math.round((percent / 100) * gridSquares);

  return (
    <section className="bg-[hsl(220,90%,12%)] py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <Ornament className="mb-6" />
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Our heartfelt gratitude for your kind support
        </p>
        <h2 className="mb-8 font-heading text-2xl font-bold text-white md:text-4xl">
          <CountUp value={sqftRaised} />{" "}
            <span className="text-gold">{config.unitNamePlural}</span> offered so far
        </h2>

        {/* Foundation grid */}
        <div
          className="mx-auto mb-4 grid max-w-2xl gap-1 sm:gap-1.5"
          style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}
          role="img"
          aria-label={`${percent}% of the campaign goal raised`}
        >
          {Array.from({ length: gridSquares }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
              className={`aspect-square rounded-[3px] ${
                i < filledSquares
                  ? "bg-gradient-gold shadow-[0_0_6px_hsl(42,92%,56%,0.35)]"
                  : "border border-white/15 bg-white/5"
              }`}
            />
          ))}
        </div>

        <p className="mb-1 font-heading text-xl font-bold text-gold md:text-2xl">{percent}% raised</p>
        <p className="text-sm text-white/75">
          {sqftRaised.toLocaleString("en-IN")} {config.unitNamePlural} raised of a goal of{" "}
          {goalSqft.toLocaleString("en-IN")} {config.unitNamePlural}
        </p>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/60">
          <Users className="h-3.5 w-3.5" />
          {donorCount.toLocaleString("en-IN")} devotees have contributed
        </p>
      </div>
    </section>
  );
}
