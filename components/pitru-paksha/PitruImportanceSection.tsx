"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HandHeart, Home, Scale, Sparkles } from "lucide-react";
import Ornament from "@/components/Ornament";

const C = {
  deepGreen: "#3A211A",
  emerald: "#5B3A24",
  teal: "#A4713A",
  gold: "#D9A34A",
  softGold: "#EECC8B",
  magenta: "#B54B2E",
  lightMint: "#FBF5E4",
} as const;

const WHY_DONATE = [
  {
    icon: HandHeart,
    title: "Reaches Ancestors Directly",
    text: "Offerings made this fortnight — food, water or charity — are said by scripture to reach the pitrs directly, bringing them peace.",
  },
  {
    icon: Scale,
    title: "Fulfils Pitr-Rna",
    text: "The debt owed to our ancestors (pitr-rna) is counted among the five great debts; seva during this period repays it with gratitude.",
  },
  {
    icon: Sparkles,
    title: "The Highest Purification",
    text: "Annadana performed with devotion purifies giver and receiver alike, transforming grief into grace for the entire family.",
  },
  {
    icon: Home,
    title: "Blessings Upon the Family",
    text: "Pleased ancestors bless their descendants with prosperity, progeny and peace — grace that returns to your home.",
  },
];

export default function PitruImportanceSection() {
  const reduce = useReducedMotion();

  const fade = (delay = 0) =>
    reduce
      ? undefined
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6, delay, ease: "easeOut" as const },
        };

  return (
    <section
      className="relative overflow-hidden px-4 py-16 md:py-24"
      style={{
        background: `linear-gradient(135deg, ${C.emerald}, ${C.deepGreen} 55%, ${C.teal})`,
      }}
    >
      {/* Radially-placed golden glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 45% at 50% -8%, ${C.gold}33, transparent 65%)`,
        }}
      />
      {/* Soft sheen sweeping diagonally */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            background: `linear-gradient(115deg, transparent 35%, ${C.gold} 50%, transparent 65%)`,
            backgroundSize: "220% 220%",
          }}
          animate={{ backgroundPosition: ["100% 100%", "0% 0%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
      )}

      <div className="relative mx-auto max-w-6xl">
        {/* ── Header ── */}
        <motion.div
          {...fade(0)}
          className="mx-auto max-w-3xl text-center"
        >
          <Ornament className="mx-auto mb-6" />
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em] md:text-sm"
            style={{ color: C.softGold }}
          >
            Importance of Pitru Paksha &amp; Why We Donate
          </p>
          <h2
            className="mt-4 text-3xl font-bold leading-tight md:text-4xl"
            style={{
              color: C.lightMint,
              textShadow: `0 0 40px ${C.gold}40`,
            }}
          >
            The Sacred Fortnight of
            <span className="block" style={{ color: C.softGold }}>
              Remembering the Departed
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
            Pitru Paksha is the fortnight the scriptures set apart for one
            purpose alone — gratitude. Everything given with love in these
            sixteen days becomes an offering that reaches those who gave us
            life.
          </p>
        </motion.div>

        {/* ── Two-panel body ── */}
        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          {/* LEFT — Importance narrative */}
          <motion.div
            {...fade(0.05)}
            className="flex flex-col gap-6"
          >
            <div
              className="rounded-2xl border px-6 py-7 backdrop-blur md:p-8"
              style={{
                borderColor: `${C.gold}30`,
                background: "rgba(255,255,255,0.07)",
                boxShadow: `0 20px 50px -20px rgba(0,0,0,0.5)`,
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-[0.22em]"
                style={{ color: C.gold }}
              >
                The Importance
              </p>
              <h3
                className="mt-2 text-2xl font-bold leading-snug"
                style={{ color: C.lightMint }}
              >
                Honouring Those Who Came Before Us
              </h3>
              <div
                className="mt-4 space-y-4 text-sm leading-7 text-white/88 md:text-base"
              >
                <p>
                  During Pitru Paksha, the ancestors (pitrs) are said to descend
                  near the mortal world to receive the offerings of their
                  descendants. Through shraddha, tarpan and charity, the living
                  fulfil the love they owe to those who shaped their lives.
                </p>
                <p>
                  The scriptures praise giving during this period with singular
                  emphasis — a handful of food offered to a deserving soul is
                  said to carry more merit than grand gifts made at other
                  times. It is a season where even the smallest seva becomes an
                  act of deep reverence.
                </p>
              </div>
            </div>

            {/* Shloka card */}
            <div
              className="relative overflow-hidden rounded-2xl border-l-4 px-6 py-7 md:p-8"
              style={{
                borderColor: C.gold,
                background: `linear-gradient(135deg, ${C.gold}1a, transparent 60%)`,
                boxShadow: `inset 0 0 40px ${C.gold}0d`,
              }}
            >
              <p
                className="font-serif text-lg leading-relaxed text-white/95 md:text-xl"
                style={{ color: C.softGold }}
              >
                अन्नदानं महादानं जलदानं ततः परम्।
                <br />
                सर्वेषामेव दानानां प्राणदानं विशिष्यते॥
              </p>
              <p className="mt-4 text-sm italic leading-7 text-white/75">
                The gift of food is the greatest gift; the gift of water is
                greater still. Yet of all gifts, the gift of life is the
                supreme.
                <span className="mt-1 block not-italic font-semibold" style={{ color: C.gold }}>
                  — Garuḍa Purāṇa
                </span>
              </p>
            </div>
          </motion.div>

          {/* RIGHT — Why donate cards */}
          <motion.div
            {...fade(0.1)}
            className="flex flex-col gap-6"
          >
            <div className="px-1">
              <p
                className="text-sm font-semibold uppercase tracking-[0.22em]"
                style={{ color: C.gold }}
              >
                Why Donate
              </p>
              <h3
                className="mt-2 text-2xl font-bold leading-snug"
                style={{ color: C.lightMint }}
              >
                Four Reasons to Offer Seva
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {WHY_DONATE.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="group flex flex-col rounded-2xl border px-5 py-6 backdrop-blur transition-all duration-300"
                  style={{
                    borderColor: "rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.gold;
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-shadow duration-300 group-hover:shadow-lg"
                    style={{
                      background: `${C.gold}22`,
                      boxShadow: `inset 0 0 0 1px ${C.gold}66`,
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: C.gold }} />
                  </span>
                  <h4
                    className="mt-4 text-[15px] font-bold leading-snug"
                    style={{ color: C.lightMint }}
                  >
                    {title}
                  </h4>
                  <p className="mt-2 text-[13px] leading-6 text-white/78">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── CTA ── */}
        <motion.div {...fade(0.15)} className="mt-12 text-center lg:mt-16">
          <Link
            href="#offer-seva"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-[0.08em] shadow-lg transition-transform duration-300 hover:scale-[1.03]"
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.softGold})`,
              color: C.deepGreen,
              boxShadow: `0 10px 30px -10px ${C.gold}80`,
            }}
          >
            Offer Your Seva This Pitru Paksha
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}