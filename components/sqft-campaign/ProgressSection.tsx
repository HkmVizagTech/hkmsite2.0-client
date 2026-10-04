"use client";

import { Building2, Users } from "lucide-react";
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
  // Goal ring geometry (GVD goal card). Always show a sliver of progress so
  // the ring never reads as "broken".
  const R = 52;
  const C = 2 * Math.PI * R;
  const dash = Math.max(C * 0.015, (C * Math.min(100, Math.max(0, percent))) / 100);

  return (
    <section className="vk-section bg-white">
      <div className="vk-container">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 p-6 text-white shadow-[0_24px_50px_-24px_rgba(30,58,138,0.7)] md:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <div
              className="relative mx-auto h-40 w-40"
              role="img"
              aria-label={`${percent}% of the campaign goal raised`}
            >
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
                <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke="#F2B41F"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${C}`}
                  className="transition-[stroke-dasharray] duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-heading text-3xl font-extrabold">{percent}%</p>
                <p className="text-[11px] text-white/75">raised</p>
              </div>
            </div>

            <div className="text-center md:text-left">
              <span className="vk-pill-light mb-3">Our heartfelt gratitude for your kind support</span>
              <h2 className="vk-h2 !text-white">
                <CountUp value={sqftRaised} />{" "}
                <span className="text-[hsl(var(--gold))]">{config.unitNamePlural}</span> offered so far
              </h2>
              <div className="mt-5 space-y-2.5 text-sm">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-left">
                  <Building2 className="h-4 w-4 shrink-0 text-[hsl(var(--gold))]" />
                  <span className="text-white/85">
                    {sqftRaised.toLocaleString("en-IN")} {config.unitNamePlural} raised of a goal of{" "}
                    {goalSqft.toLocaleString("en-IN")} {config.unitNamePlural}
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 text-left">
                  <Users className="h-4 w-4 shrink-0 text-[hsl(var(--gold))]" />
                  <span className="text-white/85">
                    {donorCount.toLocaleString("en-IN")} devotees have contributed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
