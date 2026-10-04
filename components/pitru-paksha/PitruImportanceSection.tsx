"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, HandHeart, Home, Scale, Sparkles } from "lucide-react";
import Reveal from "@/components/site/Reveal";

// Annadana at the hospitals — the section argues that giving food is the supreme
// offering, and showing it happening is more persuasive than another paragraph.
const ANNADANA_IMAGE =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1786100757954-1786100756855-annadan2.jpg";

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
  return (
    <section className="vk-section bg-white">
      <div className="vk-container">
        {/* ── Header ── */}
        <Reveal className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
          <span className="vk-pill mb-3">Importance of Pitru Paksha &amp; Why We Donate</span>
          <h2 className="vk-h2">
            The Sacred Fortnight of
            <span className="block text-vk-700">Remembering the Departed</span>
          </h2>
          <p className="vk-lead mx-auto mt-3 max-w-2xl">
            Pitru Paksha is the fortnight the scriptures set apart for one
            purpose alone — gratitude. Everything given with love in these
            sixteen days becomes an offering that reaches those who gave us life.
          </p>
        </Reveal>

        {/* ── Scripture band — the section's centrepiece ── */}
        <Reveal>
          <figure className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-navy px-6 py-10 text-center shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)] md:px-12 md:py-12">
            <blockquote className="font-serif text-xl leading-[2.1] text-white md:text-[1.75rem] md:leading-[2]">
              अन्नदानं महादानं जलदानं ततः परम्।
              <br />
              सर्वेषामेव दानानां प्राणदानं विशिष्यते॥
            </blockquote>

            <div className="mx-auto my-6 h-px w-24 bg-white/25" aria-hidden />

            <figcaption className="mx-auto max-w-2xl">
              <p className="font-serif-display text-[15px] italic leading-8 text-white/85 md:text-base">
                The gift of food is the greatest gift; the gift of water is greater
                still. Yet of all gifts, the gift of life is the supreme.
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                — Garuḍa Purāṇa
              </p>
            </figcaption>
          </figure>
        </Reveal>

        {/* ── Importance — image / text split ── */}
        <div className="mx-auto mt-12 grid max-w-6xl items-center gap-8 md:mt-16 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <figure className="vk-tile aspect-[4/3] w-full !rounded-3xl">
              <Image
                src={ANNADANA_IMAGE}
                alt="Annadana being served at Hare Krishna Vaikuntham Temple"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <figcaption className="vk-tile-caption">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                  Annadana at the Hospitals
                </p>
                <p className="mt-1.5 text-sm leading-6 text-white/90">
                  Through the fortnight, every offering is cooked, sanctified and
                  served in your ancestors&apos; name.
                </p>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.08}>
            <span className="vk-pill-soft mb-3">The Importance</span>
            <h3 className="vk-h2 !text-2xl md:!text-[2rem]">
              Honouring Those Who Came Before Us
            </h3>
            <div className="mt-4 space-y-4">
              <p className="vk-lead">
                During Pitru Paksha, the ancestors (pitrs) are said to descend
                near the mortal world to receive the offerings of their
                descendants. Through shraddha, tarpan and charity, the living
                fulfil the love they owe to those who shaped their lives.
              </p>
              <p className="vk-lead">
                The scriptures praise giving during this period with singular
                emphasis — a handful of food offered to a deserving soul is said
                to carry more merit than grand gifts made at other times. It is a
                season where even the smallest seva becomes an act of deep
                reverence.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── Why donate ── */}
        <div className="mx-auto mt-12 max-w-6xl md:mt-16">
          <Reveal className="mb-6 text-center md:mb-8">
            <span className="vk-pill-soft mb-3">Why Donate</span>
            <h3 className="vk-h2 !text-2xl md:!text-[2rem]">Four Reasons to Offer Seva</h3>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_DONATE.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="vk-card vk-card-hover flex h-full flex-col p-5">
                  <span className="vk-icon-chip">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h4 className="mt-4 text-base font-bold leading-snug text-ink">{title}</h4>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <Reveal className="mt-10 text-center md:mt-14">
          <Link href="#offer-seva" className="vk-btn-gold min-h-12 whitespace-normal px-7 py-3 text-[15px] font-bold">
            Offer Your Seva This Pitru Paksha
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
          <p className="mx-auto mt-4 max-w-md text-xs leading-6 text-muted-foreground">
            Every offering, however small, is received with the same devotion at
            the temple altar.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
