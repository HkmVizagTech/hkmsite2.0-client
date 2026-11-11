"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Heart, ShieldCheck } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import CountUp from "@/components/bhajans/CountUp";
import LifeJourney from "./LifeJourney";
import PhonePeUpiCard from "@/components/PhonePeUpiCard";
import { DiwaliFaq } from "@/components/festival/DiwaliSections";
import OtherDonationsCarousel from "@/components/pitru-paksha/OtherDonationsCarousel";
import FestivalSevaGrid, { type SevaSelection } from "@/components/festival/FestivalSevaGrid";
import FestivalCheckoutModal from "@/components/festival/FestivalCheckoutModal";
import { BANK_DETAILS, FAQS, IMPACTS, PRABHUPADA_PORTRAIT, QUOTES, SEVAS, SP_BANNER_MOBILE, SP_BANNER_WIDE, SP_DATE_LABEL, SP_SLUG, STATS } from "@/lib/srilaPrabhupada";

const ease = [0.22, 0.8, 0.3, 1] as const;
const GOLD_TEXT = "bg-[linear-gradient(180deg,#FFF1C9_0%,#F6C752_50%,#C98B1E_100%)] bg-clip-text text-transparent";

/** Rose and marigold petals drifting down, like a pushpanjali. Off for reduced motion. */
function Petals() {
  const reduce = useReducedMotion();
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; dur: number; size: number; hue: string }[]>([]);
  useEffect(() => {
    if (reduce) return;
    const hues = ["#F6C752", "#F59E0B", "#FB7185", "#FDBA74"];
    setPetals(Array.from({ length: 18 }, (_, i) => ({ id: i, left: Math.random() * 100, delay: Math.random() * 10, dur: 9 + Math.random() * 8, size: 8 + Math.random() * 9, hue: hues[i % hues.length] })));
  }, [reduce]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="sp-petal absolute -top-6 rounded-[60%_40%_60%_40%] opacity-70"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.7, background: p.hue, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }}
        />
      ))}
    </div>
  );
}

export default function SrilaPrabhupadaClient() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<SevaSelection | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [q, setQ] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setQ((x) => (x + 1) % QUOTES.length), 7000);
    return () => clearInterval(id);
  }, [reduce]);

  const toSevas = () => document.getElementById("offer-seva")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <PageLayout background="#ffffff">
      <div className="overflow-x-clip bg-white pt-[var(--header-h)]">
        {/* ══ HERO ═══════════════════════════════════════════════════════ */}
        <section className="relative isolate overflow-hidden bg-[#0B1430] text-white">
          <h1 className="sr-only">Srila Prabhupada 49th Disappearance Day — Annadaan Seva and Abhisheka Seva, {SP_DATE_LABEL}</h1>

          {/* phones: Prabhupada under the light, the banner's words set as text below */}
          <div className="md:hidden">
            <motion.div initial={reduce ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease }} className="relative aspect-[665/724] w-full">
              <Image src={SP_BANNER_MOBILE} alt="Srila Prabhupada" fill priority sizes="100vw" className="object-cover object-top" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0B1430] via-[#0B1430]/70 to-transparent" />
              <div className="absolute left-4 top-4 rounded-2xl border border-[#F6C752]/40 bg-[#0B1430]/70 px-3 py-2 text-center backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F6C752]">November</p>
                <p className="font-serif-display text-3xl font-bold leading-none">13</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">Fri · 2026</p>
              </div>
            </motion.div>
            <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.2 }} className="relative -mt-20 px-4 pb-10 text-center">
              <span className="inline-block rounded-lg border border-[#F6C752]/70 bg-[linear-gradient(180deg,#9A4A12,#6B2E07)] px-4 py-1 font-serif-display text-sm font-bold tracking-[0.12em] text-[#FFE6A3] shadow-[0_0_20px_rgba(246,199,82,.35)]">VISHWAGURU</span>
              <p aria-hidden className={`mt-3 font-serif-display text-[2.6rem] font-bold uppercase leading-none tracking-wide ${GOLD_TEXT}`}>Srila Prabhupada</p>
              <p className="mt-2 text-lg font-medium tracking-wide text-white">49th Disappearance Day</p>
              <div aria-hidden className="mx-auto mt-4 flex items-center justify-center gap-2 text-[#F6C752]"><span className="h-px w-16 bg-gradient-to-r from-transparent to-[#F6C752]" />✦<span className="h-px w-16 bg-gradient-to-l from-transparent to-[#F6C752]" /></div>
              <div className="mx-auto mt-4 flex max-w-sm items-center justify-center gap-3 rounded-2xl border-2 border-[#F6C752]/80 bg-black/30 px-4 py-2.5 font-serif-display text-base font-semibold text-[#FFE6A3]">
                Annadaan Seva <span className="text-[#F6C752]">|</span> Abhisheka Seva
              </div>
              <button type="button" onClick={toSevas} className="vk-btn-gold mt-6 h-12 w-full max-w-sm px-8 text-[15px] font-bold">
                <Heart className="h-4 w-4" /> Offer your seva
              </button>
            </motion.div>
          </div>

          {/* tablets and computers: the full banner */}
          <div className="hidden md:block">
            <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease }} className="relative aspect-[2172/724] w-full">
              <Image src={SP_BANNER_WIDE} alt="Vishwaguru Srila Prabhupada, 49th Disappearance Day, Friday 13 November 2026 — Annadaan Seva and Abhisheka Seva" fill priority sizes="100vw" className="object-cover" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B1430] to-transparent" />
            </motion.div>
            <div className="vk-container flex items-center justify-between gap-8 py-7">
              <p className="max-w-2xl text-[15px] leading-7 text-white/80 lg:text-base">
                On his disappearance day we remember the pure devotee who carried Lord Chaitanya&apos;s message across the world. Offer a seva in his honour at Hare Krishna Vaikuntham, Gambheeram.
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <button type="button" onClick={toSevas} className="vk-btn-gold h-12 px-8 text-[15px] font-bold">
                  <Heart className="h-4 w-4" /> Offer your seva
                </button>
                <a href="#life" className="inline-flex h-12 items-center rounded-full border border-white/40 px-6 text-[15px] font-semibold text-white hover:bg-white/10">His life</a>
              </div>
            </div>
          </div>
          <Petals />
        </section>

        {/* ══ QUOTE ═════════════════════════════════════════════════════ */}
        <section className="border-b border-[#F6C752]/30 bg-[linear-gradient(180deg,#FFF8E6,#FFFFFF)]">
          <div className="vk-container py-10 text-center md:py-14">
            <div className="mx-auto min-h-[120px] max-w-3xl md:min-h-[100px]">
              <AnimatePresence mode="wait">
                <motion.figure key={q} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.5 }}>
                  <blockquote className="font-serif-display text-xl italic leading-snug text-vk-800 md:text-3xl">&ldquo;{QUOTES[q].text}&rdquo;</blockquote>
                  <figcaption className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--gold-deep))]">— {QUOTES[q].by}</figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ══ SEVAS ═════════════════════════════════════════════════════ */}
        <section id="offer-seva" className="vk-section scroll-mt-16">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="Offer Your Seva" title="Sevas for Srila Prabhupada" />
            </Reveal>
            <FestivalSevaGrid featuredStyle="midnight" featuredBadge={false} featuredSlugs={SEVAS.map((x) => x.slug)} sevas={SEVAS} impacts={IMPACTS} highlightedSlug={null} onSelect={setSelected} />
            <p className="mt-8 text-center text-xs text-muted-foreground">Minimum donation Rs. 100 · Annadana Seva is eligible for 80G · Secured by Razorpay · Donations go to Hare Krishna Movement India, Visakhapatnam</p>
          </div>
        </section>

        {/* ══ NUMBERS ═══════════════════════════════════════════════════ */}
        <section className="bg-[#0A1233] text-white">
          <ul className="vk-container grid grid-cols-2 gap-y-8 py-12 md:grid-cols-4 md:divide-x md:divide-white/10">
            {STATS.map((s) => (
              <li key={s.label} className="text-center">
                <p className={`font-serif-display text-5xl font-bold md:text-6xl ${GOLD_TEXT}`}><CountUp value={s.value} />{s.suffix}</p>
                <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70">{s.label}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ HIS LIFE ══ */}
        <LifeJourney />

        <PhonePeUpiCard campaign="Srila Prabhupada Disappearance Day" />

        {/* ══ FINALE + BANK ═════════════════════════════════════════════ */}
        <section id="finale" className="relative isolate overflow-hidden bg-[#0A1233] py-16 text-white md:py-24">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(246,199,82,.25),transparent_70%)]" />
          <Petals />
          <Reveal className="vk-container text-center">
            <p className="font-serif-display text-lg italic text-[#FFE6A3] md:text-2xl">Guru-dakshina for the one who gave us everything</p>
            <h2 className={`mx-auto mt-3 max-w-3xl font-serif-display text-4xl font-bold leading-tight md:text-6xl ${GOLD_TEXT}`}>Offer your seva to Srila Prabhupada</h2>
            <button type="button" onClick={toSevas} className="vk-btn-gold mt-8 h-[3.25rem] px-8 text-base font-bold">
              <Heart className="h-4 w-4" /> Offer your seva
            </button>
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white/70"><ShieldCheck className="h-4 w-4 text-[#F6C752]" /> Secure Razorpay checkout · Receipt on WhatsApp</p>
          </Reveal>
        </section>

        <section className="vk-section">
          <div className="vk-container">
            <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2 lg:items-start">
              <div className="rounded-2xl border border-vk-100 bg-vk-50 px-5 py-4 text-sm leading-7 text-ink/80 md:text-base">
                While making UPI or bank payments, please send a screenshot with your name, mobile, address and PAN details to our WhatsApp{" "}
                <a className="font-bold text-vk-700 hover:text-vk-500" href="https://wa.me/917995097108" target="_blank" rel="noreferrer">+91 79950 97108</a> or email{" "}
                <a className="break-all font-bold text-vk-700 hover:text-vk-500" href="mailto:social@hkmvizag.org">social@hkmvizag.org</a>, so your receipt is issued against the right donor.
              </div>
              <div className="vk-card p-5 md:p-7">
                <h2 className="vk-bar-title text-lg text-ink md:text-xl">Donation Through Bank (NEFT / RTGS)</h2>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {BANK_DETAILS.map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl bg-vk-50 p-4 text-sm text-ink">
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-medium text-muted-foreground">{label}:</span>
                        <span className="mt-0.5 block select-all break-words font-semibold">{value}</span>
                      </div>
                      <button type="button" onClick={() => copy(label, value)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-vk-500 hover:bg-white hover:text-vk-700" title={`Copy ${label}`}>
                        {copied === label ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <DiwaliFaq faqs={FAQS} />
        <OtherDonationsCarousel />
      </div>

      {selected && (
        <FestivalCheckoutModal
          selected={selected}
          onClose={() => setSelected(null)}
          sourcePage={SP_SLUG}
          festivalSlug={SP_SLUG}
          bannerImage={PRABHUPADA_PORTRAIT}
          thankYouSource="Srila Prabhupada's disappearance day"
          trackContentName="Srila Prabhupada Disappearance Day"
        />
      )}
    </PageLayout>
  );
}
