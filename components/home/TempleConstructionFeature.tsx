"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Gift, IndianRupee, Users } from "lucide-react";
import Reveal from "@/components/site/Reveal";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface SqftStats {
  pricePerSqft: number;
  goalSqft: number;
  sqftRaised: number;
  totalAmount: number;
  donorCount: number;
}

const inr = (n: number) => n.toLocaleString("en-IN");

/** GVD "Mandir Nirman Seva" card: story + image on the left, live goal ring on the right. */
export default function TempleConstructionFeature() {
  const [stats, setStats] = useState<SqftStats | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/seva-stats/sqft-campaign`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  const goal = stats?.goalSqft || 67000;
  const raised = stats?.sqftRaised ?? 0;
  const pct = goal ? Math.min(100, (raised / goal) * 100) : 0;
  // Ring geometry
  const R = 52;
  const C = 2 * Math.PI * R;
  // Always show a sliver of progress so the ring never reads as "broken".
  const dash = Math.max(C * 0.015, (C * pct) / 100);

  return (
    <section className="vk-section">
      <div className="vk-container">
        <Reveal>
          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            {/* Story card */}
            <div className="vk-card grid overflow-hidden md:grid-cols-[1.05fr_1fr]">
              <div className="flex flex-col justify-center p-6 md:p-8">
                <span className="vk-pill mb-4 self-start">Mandir Nirman Seva</span>
                <h2 className="vk-h2">Square Foot Seva</h2>
                <p className="vk-lead mt-3">
                  Be a part of building the Hare Krishna Vaikuntham Temple in Visakhapatnam. Every square foot you
                  offer brings Sri Sri Radha Madan Mohan&apos;s new home closer to completion — a seva that endures
                  for generations.
                </p>
                <p className="mt-3 font-serif-display text-[15px] italic text-vk-700">
                  A temple built for the Lord remains a place of devotion for generations.
                </p>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-vk-50 p-3.5">
                  <span className="vk-icon-chip !bg-white">
                    <Gift className="h-5 w-5" />
                  </span>
                  <p className="text-[13px] leading-snug text-ink/75">
                    <span className="font-semibold text-vk-700">80G tax benefit</span> on every contribution, with your
                    receipt sent on WhatsApp.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/sqft-seva-campaign" className="vk-btn-gold">
                    Offer a Square Foot <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/brick-seva-campaign" className="vk-btn-outline">
                    Brick Seva
                  </Link>
                </div>
              </div>
              <div className="relative min-h-[260px] md:min-h-full">
                <Image
                  src="/assets/home-temple-construction-banner.webp"
                  alt="Hare Krishna Vaikuntham Temple under construction, Visakhapatnam"
                  fill
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vk-900/40 to-transparent md:bg-gradient-to-r md:from-white/0" />
              </div>
            </div>

            {/* Live goal card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-vk-700 via-vk-600 to-vk-500 p-6 text-white shadow-[0_24px_50px_-24px_rgba(30,58,138,0.7)]">
              <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
              <p className="text-center text-sm font-semibold text-white/85">Temple Goal</p>
              <div className="relative mx-auto my-4 h-36 w-36">
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
                  <p className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-heading)" }}>
                    {inr(raised)}
                  </p>
                  <p className="text-[11px] text-white/75">sq.ft offered</p>
                </div>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5">
                  <Building2 className="h-4 w-4 text-[hsl(var(--gold))]" />
                  <span className="text-white/80">Goal</span>
                  <span className="ml-auto font-semibold">{inr(goal)} sq.ft</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5">
                  <IndianRupee className="h-4 w-4 text-[hsl(var(--gold))]" />
                  <span className="text-white/80">Raised</span>
                  <span className="ml-auto font-semibold">₹{inr(stats?.totalAmount ?? 0)}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5">
                  <Users className="h-4 w-4 text-[hsl(var(--gold))]" />
                  <span className="text-white/80">Devotees</span>
                  <span className="ml-auto font-semibold">{inr(stats?.donorCount ?? 0)}</span>
                </div>
              </div>
              <Link href="/sqft-seva-campaign" className="vk-btn mt-5 w-full bg-white text-vk-800 hover:bg-vk-50">
                Donate Now
              </Link>
              <p className="mt-2 text-center text-[11px] text-white/65">
                ₹{inr(stats?.pricePerSqft ?? 6000)} sponsors one square foot
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
