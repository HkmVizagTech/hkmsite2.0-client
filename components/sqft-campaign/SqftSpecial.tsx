"use client";

// Square Foot Seva only: its own intro, "mark your floor" picker, journey and closing call to
// action. Like Brick Seva's, these are presentation only - the buttons just scroll, or hand a
// quantity and a name to the donation form below, which stays the one place a payment is made.
//
// The idea: the temple floor is made of square feet. Choose how many to sponsor and the plan
// lights them up in gold, with the area they cover in everyday terms.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Hammer, Landmark, Minus, Plus, ScrollText, Share2, ShieldCheck, FileCheck2, Gift, Sparkles, HandHeart, Users } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";
import type { CampaignConfig } from "@/lib/campaignConfig";

type Stats = {
  totalAmount: number;
  donorCount: number;
  percent?: number;
  goalSqft?: number;
  latest?: { name: string; amount: number; time: string }[];
} | null;

const GOLD = "linear-gradient(135deg, #FFD66B, #E8A317)";
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const COLS = 10;
const ROWS = 8;
const PLAN_TOTAL = COLS * ROWS;
const PICK_MAX = 108;
const PRESETS = [1, 5, 11, 21, 51, 108];

/** What an area looks like in everyday terms, so "11 sq ft" means something. */
function areaWords(n: number): string {
  if (n === 1) return "a single floor tile, one foot by one foot";
  if (n < 6) return "about the space of a small prayer mat";
  if (n < 12) return "about the space where one devotee sits to chant";
  if (n < 25) return "about the space of a small family sitting together";
  if (n < 60) return "a patch of floor wide enough for a whole family to bow";
  if (n < 108) return "a good stretch of the temple hall floor";
  return "a wide section of the temple floor";
}

/* ------------------------------------------------------------------ intro */

export function SqftIntro({ config, stats }: { config: CampaignConfig; stats: Stats }) {
  const sqft = stats ? Math.floor(stats.totalAmount / config.pricePerUnit) : 0;
  const tiles: { label: string; value: string }[] = [
    { label: "Per sq ft", value: `₹${config.pricePerUnit.toLocaleString("en-IN")}` },
    ...(sqft > 0 && stats
      ? [
          { label: "Sq ft offered", value: sqft.toLocaleString("en-IN") },
          { label: "Devotees", value: stats.donorCount.toLocaleString("en-IN") },
        ]
      : [
          { label: "Prasadam", value: "To you" },
          { label: "Tax", value: "80G" },
        ]),
  ];
  return (
    <section className="relative z-[1] pb-8 pt-10 md:pb-12 md:pt-14">
      <div className="vk-container grid items-center gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12">
        <div>
          <span className="vk-pill mb-4">Temple construction seva</span>
          <h1 className="vk-h1">
            Square Foot Seva
            <span aria-hidden className="mt-3 block h-1 w-20 rounded-full bg-gradient-to-r from-[#F5A623] to-[#FFD66B]" />
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Sponsor a piece of the ground the Hare Krishna Vaikuntham Temple stands on. Every square foot you offer becomes a permanent part of the Lord&apos;s abode.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => go("sqft-builder")} className="vk-btn-gold h-12 gap-2 px-7 text-[15px]">
              Mark my square feet <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go("brick-benefits")} className="inline-flex h-12 items-center rounded-xl border border-vk-200 px-6 text-sm font-semibold text-vk-700 transition hover:bg-vk-50">
              What you receive
            </button>
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-3">
          {tiles.map((t) => (
            <div key={t.label} className="brick-elev-sm relative overflow-hidden rounded-2xl border border-vk-100 bg-white px-3 py-5 text-center">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F5A623] to-[#FFD66B]" />
              <dd className="font-heading text-2xl font-extrabold text-vk-800 md:text-3xl">{t.value}</dd>
              <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground md:text-[11px]">{t.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- floor builder */

interface BuilderProps {
  price: number;
  stats: Stats;
  /** Hand the chosen quantity (and the name for the sankalpa) to the donation form. */
  onSponsor: (units: number, name: string) => void;
}

export function SqftFloorBuilder({ price, stats, onSponsor }: BuilderProps) {
  const [count, setCount] = useState(11);
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  const clamp = (n: number) => Math.max(1, Math.min(1000, Math.round(n) || 1));
  const amount = count * price;
  const lit = Math.min(count, PLAN_TOTAL);
  const who = name.trim();
  const offered = stats ? Math.floor(stats.totalAmount / price) : 0;

  const shareText = `I am sponsoring ${count} square ${count === 1 ? "foot" : "feet"} of the Hare Krishna Vaikuntham Temple, Visakhapatnam${who ? ` in the name of ${who}` : ""}. Join me in building the Lord's abode:`;
  const shareHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${origin ? `${origin}/sqft-seva-campaign` : ""}`)}`;

  return (
    <section id="sqft-builder" className="vk-section relative z-[1] scroll-mt-20 bg-gradient-to-b from-white via-vk-50 to-white" aria-labelledby="sqft-builder-heading">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow="Mark your part of the floor"
          title={<span id="sqft-builder-heading">Every square foot, <span className="text-vk-600">offered in your name</span></span>}
          subtitle="Choose how many square feet to sponsor and see them lit on the temple floor plan."
        />

        <Reveal>
          <div className="brick-elev mx-auto grid max-w-5xl items-start gap-8 overflow-hidden rounded-[2rem] border border-vk-100 bg-white p-5 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-9">
            {/* The floor plan */}
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-vk-500">
                <Landmark className="h-3.5 w-3.5" /> Temple floor plan
              </p>
              <div
                role="img"
                aria-label={`A floor plan of ${PLAN_TOTAL} square feet with ${lit} lit in gold`}
                className="rounded-2xl bg-gradient-to-b from-vk-900 to-vk-800 p-3 md:p-4"
              >
                <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
                  {Array.from({ length: PLAN_TOTAL }, (_, i) => {
                    const on = i < lit;
                    return (
                      <motion.span
                        key={i}
                        initial={false}
                        animate={{ scale: on ? 1 : 0.96 }}
                        transition={{ duration: 0.25, delay: on ? Math.min(i * 0.01, 0.5) : 0 }}
                        className={`aspect-square rounded-[3px] ${on ? "shadow-[0_0_10px_rgba(245,166,35,0.5),inset_0_1px_0_rgba(255,255,255,0.45)]" : "border border-white/15"}`}
                        style={on ? { backgroundImage: GOLD } : { backgroundColor: "rgba(255,255,255,0.05)" }}
                      />
                    );
                  })}
                </div>
                <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  {count > PLAN_TOTAL ? `${count.toLocaleString("en-IN")} sq ft — the plan shows the first ${PLAN_TOTAL}` : `${count} sq ft lit in gold`}
                </p>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-vk-50 p-4">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl text-vk-900" style={{ backgroundImage: GOLD }}>
                  <Sparkles className="h-5 w-5" />
                </span>
                <p className="text-sm leading-snug text-ink">
                  <strong>{count.toLocaleString("en-IN")} sq ft</strong> is {areaWords(count)}.
                  {who && <> The sankalpa is taken in the name of <strong>{who}</strong>.</>}
                </p>
              </div>
            </div>

            {/* The choice */}
            <div>
              <label htmlFor="sqft-name" className="text-xs font-bold uppercase tracking-[0.18em] text-vk-500">
                Name for the sankalpa
              </label>
              <input
                id="sqft-name"
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value.replace(/\s{2,}/g, " "))}
                placeholder="e.g. Sri Ramesh & Family"
                autoComplete="off"
                className="vk-input mt-1.5 !h-12 text-base"
              />
              <p className="mt-1 text-xs text-muted-foreground">Optional. Yours, your parents&apos;, or your whole family&apos;s.</p>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-vk-500">Your offering</p>
              <p className="mt-0.5 font-heading text-4xl font-extrabold tracking-tight text-ink md:text-5xl" aria-live="polite">
                ₹{amount.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {count.toLocaleString("en-IN")} sq ft × ₹{price.toLocaleString("en-IN")}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <button type="button" aria-label="One square foot fewer" onClick={() => setCount((c) => clamp(c - 1))} className="grid h-11 w-11 place-items-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-50">
                  <Minus className="h-4 w-4" />
                </button>
                <input type="range" min={1} max={PICK_MAX} value={Math.min(count, PICK_MAX)} onChange={(e) => setCount(clamp(Number(e.target.value)))} aria-label="Number of square feet" className="h-2 flex-1 cursor-pointer accent-[#D69E2E]" />
                <button type="button" aria-label="One square foot more" onClick={() => setCount((c) => clamp(c + 1))} className="grid h-11 w-11 place-items-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-50">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-x-2.5 gap-y-5" role="group" aria-label="Quick choices">
                {PRESETS.map((n) => {
                  const on = count === n;
                  const tag = n === 11 ? "Suggested" : n === 108 ? "Auspicious" : null;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCount(n)}
                      aria-pressed={on}
                      className={`relative flex min-h-[108px] flex-col items-center justify-center rounded-2xl border-2 px-2 py-4 text-center transition-colors duration-200 ${
                        on ? "border-[hsl(var(--gold))] bg-vk-700 text-white shadow-card" : "border-vk-100 bg-white text-ink hover:border-vk-400 hover:bg-vk-50"
                      }`}
                    >
                      {tag && (
                        <span className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${on ? "bg-[hsl(var(--gold))] text-vk-900" : "bg-vk-700 text-white"}`}>
                          {tag}
                        </span>
                      )}
                      <span className="font-heading text-[28px] font-extrabold leading-none">{n}</span>
                      <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${on ? "text-white/65" : "text-muted-foreground"}`}>sq ft</span>
                      <span className={`mt-2.5 text-sm font-bold tabular-nums ${on ? "text-[hsl(var(--gold))]" : "text-vk-700"}`}>₹{(n * price).toLocaleString("en-IN")}</span>
                    </button>
                  );
                })}
              </div>

              <button type="button" onClick={() => onSponsor(count, who)} className="vk-btn-gold mt-5 h-12 w-full gap-2 text-[15px]">
                Sponsor {count.toLocaleString("en-IN")} sq ft — ₹{amount.toLocaleString("en-IN")}
                <ArrowRight className="h-4 w-4" />
              </button>
              <a href={shareHref} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-vk-200 px-4 py-2.5 text-sm font-semibold text-vk-700 transition hover:bg-vk-50">
                <Share2 className="h-4 w-4" /> Invite family on WhatsApp
              </a>

              {offered > 0 && stats && (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 flex-none text-[hsl(var(--gold))]" />
                  <span>
                    <strong className="text-ink">{offered.toLocaleString("en-IN")}</strong> sq ft already offered by <strong className="text-ink">{stats.donorCount.toLocaleString("en-IN")}</strong> devotees
                  </span>
                </p>
              )}
            </div>
          </div>
        </Reveal>

        <ul className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: ShieldCheck, text: "Secure Razorpay payment" },
            { icon: ScrollText, text: "Sankalpa in your name" },
            { icon: Gift, text: "Prasadam to your home" },
            { icon: FileCheck2, text: "80G tax exemption" },
          ].map((t) => (
            <li key={t.text} className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-3 text-[13px] font-semibold text-ink shadow-sm ring-1 ring-vk-100">
              <t.icon className="h-4 w-4 flex-none text-vk-600" />
              {t.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- journey */

const STEPS = [
  { icon: HandHeart, title: "You sponsor", text: "Choose your square feet and offer them with devotion — from a single square foot upward." },
  { icon: ScrollText, title: "Sankalpa in your name", text: "Sankalp and aarti are performed on your name, so your seva is offered to the Lord by name." },
  { icon: Landmark, title: "It becomes the temple", text: "Your square feet become a permanent part of the Lord's abode, and you are invited to the pujas on the inauguration day." },
];

export function SqftJourney() {
  return (
    <section className="vk-section" aria-labelledby="sqft-journey-heading">
      <div className="vk-container">
        <SectionHeading align="center" eyebrow="The journey of your seva" title={<span id="sqft-journey-heading">From your hands to <span className="text-vk-600">the Lord&apos;s abode</span></span>} />
        <ol className="relative mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          <span aria-hidden className="pointer-events-none absolute left-[17%] right-[17%] top-8 hidden border-t-2 border-dashed border-[hsl(var(--gold))]/50 md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} as="li" delay={i * 0.08} className="relative">
              <div className="vk-card vk-card-hover h-full p-6 text-center">
                <span className="relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl text-vk-900 shadow-card ring-4 ring-white" style={{ backgroundImage: GOLD }}>
                  <s.icon className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-vk-700 text-xs font-bold text-white">{i + 1}</span>
                </span>
                <h3 className="font-heading text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- closing CTA */

export function SqftFinalCta({ config }: { config: CampaignConfig }) {
  return (
    <section className="vk-section relative z-[1]">
      <div className="vk-container">
        <Reveal>
          <div className="brick-elev relative isolate overflow-hidden rounded-[2rem] bg-gradient-navy px-6 py-14 text-center text-white md:px-12 md:py-20">
            <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,214,107,0.22),transparent_50%)]" />
            <Hammer aria-hidden className="mx-auto h-9 w-9 text-[#FFD66B]" />
            <h2 className="mx-auto mt-4 max-w-3xl font-serif-display text-3xl font-bold leading-snug md:text-5xl">
              A piece of the Lord&apos;s abode, offered in your name.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">Every {config.unitName} you offer becomes part of the temple — laid with devotion, remembered in the sankalpa.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={() => go("sqft-builder")} className="vk-btn-gold h-12 px-8 text-[15px]">Mark my square feet</button>
              <button type="button" onClick={() => go("donate")} className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/40 px-7 text-sm font-semibold text-white transition hover:bg-white/10">
                <Users className="h-4 w-4" /> Donate now
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
