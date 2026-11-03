"use client";

// Brick Seva only: the two sections that make this page feel like laying a
// brick rather than filling a form.
//
//   BrickWallBuilder   pick a number and watch your part of the temple wall
//                      fill in, brick by brick, with the amount beside it.
//                      It only chooses a quantity - the real donation form
//                      stays the single place a payment is made.
//   BrickJourney       what happens to the brick after the donation.
//
// Both are additive and read only what the page already knows (price, the
// campaign's own stats), so nothing about checkout changes.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileCheck2, Gift, HandHeart, Landmark, Minus, PenLine, Plus, Share2, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";

// Few, large bricks so the engraved name stays readable on each one. The picker still
// goes to 108 (an auspicious number to build with); the wall shows the first 30.
const WALL_COLUMNS = 6;
const WALL_ROWS = 5;
const WALL_TOTAL = WALL_COLUMNS * WALL_ROWS;
const PICK_MAX = 108;
const PRESETS = [1, 5, 11, 21, 51, 108];

interface WallProps {
  price: number;
  stats: { totalAmount: number; donorCount: number; latest?: { name: string; amount: number; time: string }[] } | null;
  /** Hand the chosen quantity (and the name to engrave) to the donation form and scroll to it. */
  onSponsor: (bricks: number, name: string) => void;
}

/** The size the engraved name is set at, so a long name still fits on one brick. */
const nameSize = (len: number) => (len <= 12 ? "text-3xl md:text-4xl" : len <= 20 ? "text-2xl md:text-3xl" : len <= 30 ? "text-xl md:text-2xl" : "text-base md:text-xl");

/** Rotates through the latest real donors, one at a time. */
function LiveDonors({ latest, price }: { latest: { name: string; amount: number; time: string }[]; price: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (latest.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % latest.length), 4000);
    return () => clearInterval(id);
  }, [latest.length]);
  const d = latest[i % latest.length];
  const units = Math.floor(d.amount / price);
  return (
    <div className="mx-auto mb-8 flex w-fit max-w-full items-center gap-2.5 rounded-full border border-vk-100 bg-white px-4 py-2 text-sm shadow-sm" aria-live="polite">
      <span className="relative flex h-2.5 w-2.5 flex-none">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      <motion.span key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="truncate text-ink">
        <strong>{d.name}</strong> offered {units >= 1 ? `${units} ${units === 1 ? "brick" : "bricks"}` : `₹${d.amount.toLocaleString("en-IN")}`}
        {d.time ? <span className="text-muted-foreground"> · {d.time}</span> : null}
      </motion.span>
    </div>
  );
}

const TRUST = [
  { icon: ShieldCheck, text: "Secure Razorpay payment" },
  { icon: PenLine, text: "Name laser-engraved" },
  { icon: Gift, text: "Prasadam to your home" },
  { icon: FileCheck2, text: "80G tax exemption" },
];

export function BrickWallBuilder({ price, stats, onSponsor }: WallProps) {
  const [count, setCount] = useState(11);
  const [name, setName] = useState("");
  const amount = count * price;
  const offered = stats ? Math.floor(stats.totalAmount / price) : null;
  const engraved = name.trim();

  const clamp = (n: number) => Math.max(1, Math.min(1000, Math.round(n) || 1));
  const filled = Math.min(count, WALL_TOTAL);

  // The page address is only known in the browser; reading it during render made the server
  // and client HTML differ (a hydration mismatch), so it is filled in after mount.
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  const shareText = `I am sponsoring ${count} ${count === 1 ? "brick" : "bricks"}${engraved ? ` engraved "${engraved}"` : ""} for the Hare Krishna Vaikuntham Temple, Visakhapatnam. Join me in building the Lord's abode:`;
  const shareHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${origin ? `${origin}/brick-seva-campaign` : ""}`)}`;

  return (
    <section id="brick-builder" className="vk-section relative z-[1] scroll-mt-20 bg-gradient-to-b from-white via-vk-50 to-white" aria-labelledby="brick-wall-heading">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow="Build your part of the wall"
          title={<span id="brick-wall-heading">Every brick, <span className="text-vk-600">laid with your name</span></span>}
          subtitle="Type your name, choose your bricks, and see how it will look in the temple."
        />

        {stats?.latest && stats.latest.length > 0 && <LiveDonors latest={stats.latest.slice(0, 8)} price={price} />}

        <Reveal>
          <div className="mx-auto grid max-w-5xl items-start gap-8 overflow-hidden rounded-[2rem] border border-vk-100 bg-white p-5 brick-elev md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-9">
            {/* Left: the engraved brick, and the wall it joins */}
            <div className="space-y-4">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-vk-500">
                  <PenLine className="h-3.5 w-3.5" /> Your brick
                </p>
                {/* The brick: clay colour, a faint grain, and the name cut into it. */}
                <div
                  className="relative grid aspect-[2.6/1] place-items-center overflow-hidden rounded-xl px-6 shadow-[0_10px_18px_-8px_rgba(80,30,10,0.5),inset_0_2px_0_rgba(255,255,255,0.25),inset_0_-6px_12px_rgba(60,20,5,0.35)]"
                  style={{
                    backgroundColor: "#B5532F",
                    backgroundImage:
                      "radial-gradient(circle at 20% 15%, rgba(255,200,150,0.35), transparent 45%), repeating-linear-gradient(115deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 7px), linear-gradient(135deg, #C4623A, #9C3F1E)",
                  }}
                >
                  <motion.p
                    key={engraved}
                    initial={{ opacity: 0.5, filter: "brightness(2.2)" }}
                    animate={{ opacity: 1, filter: "brightness(1)" }}
                    transition={{ duration: 0.45 }}
                    className={`max-w-full break-words text-center font-serif-display font-bold leading-tight tracking-wide ${nameSize(engraved.length)} ${engraved ? "text-[#5A210C]" : "text-[#5A210C]/45"}`}
                    style={{ textShadow: "0 1.5px 0 rgba(255,225,190,0.55), 0 -1px 1px rgba(40,10,0,0.55)" }}
                  >
                    {engraved || "Your Name Here"}
                  </motion.p>
                  <span aria-hidden className="absolute bottom-2 right-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#5A210C]/55">Hare Krishna Vaikuntham</span>
                </div>
              </div>

              <div
                role="img"
                aria-label={`A wall of ${filled} red bricks, each engraved ${engraved || "with your name"}`}
                className="rounded-2xl bg-gradient-to-b from-[#2B1710] to-[#1B0E09] p-3 md:p-4"
              >
                <div className="space-y-[3px]">
                  {Array.from({ length: WALL_ROWS }, (_, r) => {
                    const rowFromBottom = WALL_ROWS - 1 - r;
                    const shifted = rowFromBottom % 2 === 1;
                    return (
                      <div key={r} className="flex gap-[3px]" style={{ paddingLeft: shifted ? "calc(100% / 12)" : 0, paddingRight: shifted ? 0 : "calc(100% / 12)" }}>
                        {Array.from({ length: WALL_COLUMNS }, (_, c) => {
                          const idx = rowFromBottom * WALL_COLUMNS + c;
                          const on = idx < filled;
                          return (
                            <motion.span
                              key={c}
                              initial={false}
                              animate={{ scale: on ? 1 : 0.97 }}
                              transition={{ duration: 0.25, delay: on ? Math.min(idx * 0.012, 0.5) : 0 }}
                              className={`relative grid h-10 flex-1 place-items-center overflow-hidden rounded-[4px] px-1 md:h-12 ${
                                on ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-3px_5px_rgba(60,20,5,0.4),0_1px_2px_rgba(0,0,0,0.5)]" : "border border-dashed border-white/15"
                              }`}
                              style={
                                on
                                  ? { backgroundImage: "repeating-linear-gradient(115deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 6px), linear-gradient(135deg, #C4623A, #9C3F1E)" }
                                  : { backgroundColor: "transparent" }
                              }
                            >
                              {on && (
                                <span
                                  className={`block w-full truncate text-center font-serif-display font-bold leading-none ${engraved ? "text-[#4A1A08]" : "text-[#4A1A08]/45"} ${engraved.length > 22 ? "text-[7px]" : engraved.length > 14 ? "text-[9px]" : "text-[11px]"}`}
                                  style={{ textShadow: "0 1px 0 rgba(255,225,190,0.5), 0 -0.5px 0.5px rgba(40,10,0,0.5)" }}
                                >
                                  {engraved || "Your Name"}
                                </span>
                              )}
                            </motion.span>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
                  {count > WALL_TOTAL
                    ? `${count.toLocaleString("en-IN")} bricks — the wall shows the first ${WALL_TOTAL}`
                    : `${count} ${count === 1 ? "brick" : "bricks"} laid with your name`}
                </p>
              </div>
            </div>

            {/* Right: the choices */}
            <div>
              <label htmlFor="brick-name" className="text-xs font-bold uppercase tracking-[0.18em] text-vk-500">
                Name to engrave
              </label>
              <input
                id="brick-name"
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value.replace(/\s{2,}/g, " "))}
                placeholder="e.g. Sri Ramesh & Family"
                autoComplete="off"
                className="vk-input mt-1.5 !h-12 text-base"
              />
              <p className="mt-1 text-xs text-muted-foreground">Your name, your parents&apos;, or your whole family&apos;s — up to 40 letters.</p>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-vk-500">Your offering</p>
              <p className="mt-0.5 font-heading text-4xl font-extrabold tracking-tight text-ink md:text-5xl" aria-live="polite">
                ₹{amount.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {count.toLocaleString("en-IN")} {count === 1 ? "brick" : "bricks"} × ₹{price.toLocaleString("en-IN")}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <button type="button" aria-label="One brick fewer" onClick={() => setCount((c) => clamp(c - 1))} className="grid h-11 w-11 place-items-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-50">
                  <Minus className="h-4 w-4" />
                </button>
                <input type="range" min={1} max={PICK_MAX} value={Math.min(count, PICK_MAX)} onChange={(e) => setCount(clamp(Number(e.target.value)))} aria-label="Number of bricks" className="h-2 flex-1 cursor-pointer accent-[#D69E2E]" />
                <button type="button" aria-label="One brick more" onClick={() => setCount((c) => clamp(c + 1))} className="grid h-11 w-11 place-items-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-50">
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
                        on
                          ? "border-[hsl(var(--gold))] bg-vk-700 text-white shadow-card"
                          : "border-vk-100 bg-white text-ink hover:border-vk-400 hover:bg-vk-50"
                      }`}
                    >
                      {tag && (
                        <span className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${on ? "bg-[hsl(var(--gold))] text-vk-900" : "bg-vk-700 text-white"}`}>
                          {tag}
                        </span>
                      )}
                      <span className="font-heading text-[28px] font-extrabold leading-none">{n}</span>
                      <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${on ? "text-white/65" : "text-muted-foreground"}`}>
                        {n === 1 ? "brick" : "bricks"}
                      </span>
                      <span className={`mt-2.5 text-sm font-bold tabular-nums ${on ? "text-[hsl(var(--gold))]" : "text-vk-700"}`}>
                        ₹{(n * price).toLocaleString("en-IN")}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button type="button" onClick={() => onSponsor(count, engraved)} className="vk-btn-gold mt-5 h-12 w-full gap-2 text-[15px]">
                Sponsor {count.toLocaleString("en-IN")} {count === 1 ? "brick" : "bricks"} — ₹{amount.toLocaleString("en-IN")}
                <ArrowRight className="h-4 w-4" />
              </button>

              <a href={shareHref} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-vk-200 px-4 py-2.5 text-sm font-semibold text-vk-700 transition hover:bg-vk-50">
                <Share2 className="h-4 w-4" /> Invite family on WhatsApp
              </a>



              {offered !== null && offered > 0 && stats && (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 flex-none text-[hsl(var(--gold))]" />
                  <span>
                    <strong className="text-ink">{offered.toLocaleString("en-IN")}</strong> bricks already offered by <strong className="text-ink">{stats.donorCount.toLocaleString("en-IN")}</strong> devotees
                  </span>
                </p>
              )}
            </div>
          </div>
        </Reveal>

        <ul className="mx-auto mt-6 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
          {TRUST.map((t) => (
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

const STEPS = [
  { icon: HandHeart, title: "You sponsor", text: "Choose your bricks and offer them with devotion — from a single brick upward." },
  { icon: PenLine, title: "Your name is engraved", text: "Each brick is laser-engraved with your name at the temple. No paint, nothing that fades." },
  { icon: Landmark, title: "It is laid in the temple", text: "Your brick becomes a permanent part of the Lord's abode, and you are invited to the pujas on the inauguration day." },
];

export function BrickJourney() {
  return (
    <section className="vk-section" aria-labelledby="brick-journey-heading">
      <div className="vk-container">
        <SectionHeading
          align="center"
          eyebrow="The journey of your brick"
          title={<span id="brick-journey-heading">From your hands to <span className="text-vk-600">the Lord&apos;s abode</span></span>}
        />
        <ol className="relative mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {/* A dashed gold thread joining the steps on wide screens. */}
          <span aria-hidden className="pointer-events-none absolute left-[17%] right-[17%] top-8 hidden border-t-2 border-dashed border-[hsl(var(--gold))]/50 md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} as="li" delay={i * 0.08} className="relative">
              <div className="vk-card vk-card-hover h-full p-6 text-center">
                <span className="relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#FFD66B] to-[#F5A623] text-vk-900 shadow-card ring-4 ring-white">
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
