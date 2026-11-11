"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Heart, ShieldCheck } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import CountUp from "@/components/bhajans/CountUp";
import PhonePeUpiCard from "@/components/PhonePeUpiCard";
import { DiwaliFaq } from "@/components/festival/DiwaliSections";
import OtherDonationsCarousel from "@/components/pitru-paksha/OtherDonationsCarousel";
import FestivalSevaGrid, { type SevaSelection } from "@/components/festival/FestivalSevaGrid";
import FestivalCheckoutModal from "@/components/festival/FestivalCheckoutModal";
import { BANK_DETAILS, FAQS, IMPACTS, LIFE, PRABHUPADA_PORTRAIT, QUOTES, SEVAS, SP_DATE_LABEL, SP_SLUG, STATS } from "@/lib/srilaPrabhupada";

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
        <section className="relative isolate overflow-hidden bg-[#0A1233] text-white">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_70%_45%,rgba(246,199,82,.28),transparent_65%),radial-gradient(50%_60%_at_10%_90%,rgba(47,91,211,.45),transparent_70%)]" />
          <div aria-hidden className="sp-rays absolute right-[-10%] top-1/2 -z-10 h-[140vmin] w-[140vmin] -translate-y-1/2 opacity-40 md:right-[2%]" />
          <Petals />
          <div className="vk-container grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.1fr_.9fr]">
            <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#F6C752]/50 bg-white/5 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F6C752]">
                Tirobhava Mahotsava · {SP_DATE_LABEL}
              </span>
              <p className="mt-5 font-serif-display text-lg italic text-[#FFE6A3] md:text-2xl">His Divine Grace A.C. Bhaktivedanta Swami</p>
              <h1 className={`mt-1 font-serif-display text-5xl font-bold leading-[1.02] md:text-7xl ${GOLD_TEXT}`}>Srila Prabhupada</h1>
              <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.22em] text-white/70">Founder-Acharya of ISKCON · 1896 – 1977</p>
              <p className="mx-auto mt-6 max-w-xl text-[15px] leading-7 text-white/85 md:text-lg md:leading-8 lg:mx-0">
                On his disappearance day we remember the pure devotee who carried Lord Chaitanya&apos;s message across the world. Offer a seva in his honour at Hare Krishna Vaikuntham, Gambheeram.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <button type="button" onClick={toSevas} className="vk-btn-gold h-12 px-8 text-[15px] font-bold">
                  <Heart className="h-4 w-4" /> Offer your seva
                </button>
                <a href="#life" className="inline-flex h-12 items-center rounded-full border border-white/40 px-6 text-[15px] font-semibold text-white hover:bg-white/10">His life</a>
              </div>
            </motion.div>

            <motion.div initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease, delay: 0.1 }} className="mx-auto w-full max-w-[340px] md:max-w-[400px]">
              <div className="relative">
                <div aria-hidden className="absolute -inset-5 rounded-t-[999px] rounded-b-[2rem] bg-[radial-gradient(circle,rgba(246,199,82,.35),transparent_70%)] blur-xl" />
                <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[2rem] border-[3px] border-[#F6C752]/80 bg-[#0A1233] p-2 shadow-[0_0_60px_-10px_rgba(246,199,82,.55)]">
                  <div className="relative aspect-[491/625] overflow-hidden rounded-t-[999px] rounded-b-[1.6rem]">
                    <Image src={PRABHUPADA_PORTRAIT} alt="His Divine Grace A.C. Bhaktivedanta Swami Srila Prabhupada" fill priority sizes="(min-width:768px) 400px, 340px" className="object-cover object-top" />
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A1233]/80 to-transparent" />
                  </div>
                </div>
                {/* garland of marigolds along the arch */}
                <div aria-hidden className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                  {Array.from({ length: 9 }).map((_, i) => <span key={i} className="h-3.5 w-3.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#FFD27A,#F59E0B_60%,#C2410C)]" />)}
                </div>
              </div>
            </motion.div>
          </div>
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
              <SectionHeading align="center" eyebrow="Offer Your Seva" title="Sevas for Srila Prabhupada" subtitle={`On ${SP_DATE_LABEL}. Tap an amount to offer the seva; your receipt reaches you on WhatsApp.`} />
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

        {/* ══ HIS LIFE ══════════════════════════════════════════════════ */}
        <section id="life" className="vk-section scroll-mt-16 bg-[linear-gradient(180deg,#FFFFFF,#F5F7FF)]">
          <div className="vk-container">
            <Reveal>
              <SectionHeading align="center" eyebrow="A Life of Pure Devotion" title="From Calcutta to the whole world" subtitle="How one devotee, at the age of seventy, gave Krishna consciousness to every continent." />
            </Reveal>
            <ol className="relative mx-auto max-w-4xl">
              <span aria-hidden className="absolute bottom-2 left-[22px] top-2 w-[3px] rounded-full bg-gradient-to-b from-[#F6C752] via-[#2F5BD3] to-[#0A1233] md:left-1/2 md:-translate-x-1/2" />
              {LIFE.map((m, i) => {
                const right = i % 2 === 1;
                return (
                  <motion.li
                    key={m.year}
                    initial={reduce ? false : { opacity: 0, x: right ? 26 : -26 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease }}
                    className={`relative flex pb-6 pl-14 md:pl-0 ${right ? "md:flex-row-reverse" : ""}`}
                  >
                    <span className="absolute left-0 top-1 flex h-[46px] w-[46px] items-center justify-center rounded-full border-4 border-white bg-[#0A1233] text-[11px] font-bold text-[#F6C752] ring-1 ring-[#F6C752]/50 md:left-1/2 md:-translate-x-1/2">
                      {m.year.slice(0, 4)}
                    </span>
                    <div className={`w-full rounded-2xl border border-vk-100 bg-white p-5 md:w-[calc(50%-44px)] ${right ? "md:text-left" : "md:text-right"}`}>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[hsl(var(--gold-deep))]">{m.year}</p>
                      <h3 className="mt-1 text-lg font-bold text-ink">{m.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </section>

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
