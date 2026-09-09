"use client";

// Golden Brick Seva — the limited tier inside Brick Seva.
//
// The whole section is built around one idea: there are only 108, and they go
// in the garbhagudi. Scarcity is the argument, so it is shown rather than
// stated — a grid of 108 bricks with the offered ones lit in gold, and the
// remaining count called out plainly. Everything else (price, engraving,
// placement) supports that.
//
// Visually it deliberately breaks from the white sections around it: deep
// navy, gold hairlines and a warm glow, so a donor scrolling the brick page
// cannot miss that this is a different order of offering.

import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, Flame, ScrollText, Sparkles, Check, ArrowRight } from "lucide-react";
import type { GoldenTierConfig } from "@/lib/campaignConfig";

const NAVY = "hsl(220,90%,12%)";

interface GoldenBrickSectionProps {
  tier: GoldenTierConfig;
  /** Switches the donation form into golden mode and scrolls to it. */
  onOffer: () => void;
}

export default function GoldenBrickSection({ tier, onOffer }: GoldenBrickSectionProps) {
  const remaining = Math.max(0, tier.total - tier.taken);
  const percent = Math.min(100, Math.round((tier.taken / tier.total) * 100));
  const priceLabel = `₹${tier.price.toLocaleString("en-IN")}`;

  const steps = [
    { icon: Crown, title: "Offer a golden brick", text: `${priceLabel} reserves one of the 108.` },
    { icon: ScrollText, title: "Your name is engraved", text: "Laser-inscribed onto the gilded brick." },
    { icon: Flame, title: "Laid in the garbhagudi", text: "Placed in the sanctum before Prana Pratistha." },
  ];

  return (
    <section
      aria-labelledby="golden-brick-heading"
      className="relative overflow-hidden border-y border-gold/30 py-14 md:py-20"
      style={{ backgroundColor: NAVY }}
    >
      {/* Warm glow — kept as arbitrary values so it renders identically
          regardless of theme tokens. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 0%, hsl(42 92% 56% / 0.20), transparent 45%), radial-gradient(circle at 85% 100%, hsl(32 90% 50% / 0.16), transparent 40%)",
        }}
      />

      <div className="container relative mx-auto max-w-6xl px-4">
        {/* ── Heading ─────────────────────────────────────────────── */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Only 108 · {tier.placement}
          </span>

          <h2
            id="golden-brick-heading"
            className="mt-4 font-heading text-2xl font-extrabold leading-tight text-white md:text-4xl"
          >
            <span className="text-gradient-gold">Golden Brick</span> Seva
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">
            One hundred and eight gilded bricks will be laid in the garbhagudi — each carries a
            devotee&apos;s name, laser-engraved, sealed into the temple&apos;s foundation for as
            long as it stands.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          {/* ── Left: the offering ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:col-span-3"
          >
            <div className="rounded-[28px] border border-gold/40 bg-white/5 p-6 text-center shadow-gold md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                One golden brick
              </p>
              <p className="mt-2 font-heading text-4xl font-extrabold text-white md:text-5xl">
                {priceLabel}
              </p>

              <div className="my-5 flex items-center justify-center gap-3" aria-hidden>
                <span className="h-px w-10 bg-gold/40" />
                <span className="text-gold">✦</span>
                <span className="h-px w-10 bg-gold/40" />
              </div>

              <ul className="space-y-2.5 text-left">
                {tier.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20">
                      <Check className="h-3 w-3 text-gold" />
                    </span>
                    <span className="text-[13px] leading-relaxed text-white/85">{b}</span>
                  </li>
                ))}
              </ul>

              {/* Compact "offered so far" — one line, no 108-brick grid. */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-white/60">Offered so far</span>
                  <span className="font-semibold text-white">
                    <span className="text-gold">{tier.taken}</span>{" "}
                    <span className="text-white/50">/ {tier.total}</span>
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-gold"
                  />
                </div>
                <p className="mt-2 text-[11px] text-white/55">
                  <span className="font-semibold text-gold">{remaining}</span> still available ·
                  80G eligible
                </p>
              </div>

              <button
                type="button"
                onClick={onOffer}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-base font-bold shadow-gold transition-transform hover:scale-[1.03]"
                style={{ color: NAVY }}
              >
                Offer a Golden Brick
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* ── Right: engraved + placed ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-gold/25 bg-white/5 backdrop-blur-sm">
              <div className="relative h-56 shrink-0 overflow-hidden md:h-64">
                <Image
                  src={tier.goldenImage}
                  alt="A gilded golden brick being laser-engraved with a devotee's name for the garbhagudi"
                  fill
                  sizes="(min-width: 1024px) 33vw, 92vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,90%,12%)] via-transparent to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Engraved by laser, not painted
                </p>
                <h3 className="mt-1.5 font-heading text-xl font-bold text-white md:text-2xl">
                  Your name, in the garbhagudi
                </h3>

                <ol className="mt-5 space-y-3.5">
                  {steps.map((s, i) => (
                    <li key={s.title} className="flex items-start gap-3.5">
                      <span className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                        <s.icon className="h-4 w-4 text-gold" />
                        <span
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
                          style={{ backgroundColor: "hsl(42 92% 56%)", color: NAVY }}
                        >
                          {i + 1}
                        </span>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{s.title}</p>
                        <p className="text-[13px] leading-relaxed text-white/65">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
