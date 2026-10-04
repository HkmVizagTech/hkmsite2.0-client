"use client";

// Golden Brick Seva — the limited tier inside Brick Seva.
//
// The whole section is built around one idea: there are only 10,008, and they go
// in the garbhagudi. Scarcity is the argument, so it is shown rather than
// stated — the offered-so-far count with the remaining number plainly called
// out. Everything else (price, engraving, placement) supports that.
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
    { icon: Crown, title: "Offer a golden brick", text: `${priceLabel} reserves one of the ${tier.total.toLocaleString("en-IN")}.` },
    { icon: ScrollText, title: "Your name is engraved", text: "Laser-inscribed onto the gilded brick." },
    { icon: Flame, title: "Laid in the garbhagudi", text: "Placed in the sanctum before Prana Pratistha." },
  ];

  return (
    <section
      aria-labelledby="golden-brick-heading"
      className="vk-section relative overflow-hidden bg-gradient-to-br from-vk-900 via-vk-800 to-vk-700"
    >
      {/* Soft gold glow — a subtle accent for the premium tier. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 0%, hsl(42 92% 56% / 0.12), transparent 45%)",
        }}
      />

      <div className="vk-container relative">
        {/* ── Heading ─────────────────────────────────────────────── */}
        <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
          <span className="vk-pill-light">
            <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
            Only {tier.total.toLocaleString("en-IN")} · {tier.placement}
          </span>

          <h2
            id="golden-brick-heading"
            className="vk-h2 mt-3 !text-white"
          >
            <span className="text-[hsl(var(--gold))]">Golden Brick</span> Seva
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-white/80 md:text-base">
            Ten thousand and eight gilded bricks will be laid in the garbhagudi — each carries a
            devotee&apos;s name, laser-engraved, sealed into the temple&apos;s foundation for as
            long as it stands.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-5 lg:gap-8">
          {/* ── Left: the offering ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:col-span-3"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                One golden brick
              </p>
              <p className="mt-2 font-heading text-4xl font-extrabold text-white md:text-5xl">
                {priceLabel}
              </p>

              <div aria-hidden className="mx-auto my-5 h-px w-24 bg-white/15" />

              <ul className="space-y-2.5 text-left">
                {tier.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Check className="h-3 w-3 text-[hsl(var(--gold))]" />
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
                    <span className="text-[hsl(var(--gold))]">{tier.taken.toLocaleString("en-IN")}</span>{" "}
                    <span className="text-white/50">/ {tier.total.toLocaleString("en-IN")}</span>
                  </span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-gold"
                  />
                </div>
                <p className="mt-2 text-[11px] text-white/55">
                  <span className="font-semibold text-[hsl(var(--gold))]">{remaining.toLocaleString("en-IN")}</span> still available ·
                  80G eligible
                </p>
              </div>

              <button
                type="button"
                onClick={onOffer}
                className="vk-btn-gold mt-6 h-12 w-full text-base"
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
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="relative h-56 shrink-0 overflow-hidden md:h-64">
                <Image
                  src={tier.goldenImage}
                  alt="A gilded golden brick being laser-engraved with a devotee's name for the garbhagudi"
                  fill
                  sizes="(min-width: 1024px) 33vw, 92vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vk-900/80 via-transparent to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <span className="vk-pill-light self-start">
                  Engraved by laser, not painted
                </span>
                <h3 className="vk-h3 mt-3 !text-white">
                  Your name, in the garbhagudi
                </h3>

                <ol className="mt-5 space-y-3.5">
                  {steps.map((s, i) => (
                    <li key={s.title} className="flex items-start gap-3.5">
                      <span className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <s.icon className="h-4 w-4 text-[hsl(var(--gold))]" />
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
