"use client";

// Brick Seva only: the page's own hero, benefits, wall of names and closing
// call to action. The shared campaign sections (temple features, construction
// progress, gallery, founder, FAQ) are reused as they are; these four replace
// the Square Foot Seva versions so Brick Seva reads as its own page.
//
// Everything here is presentation. Nothing touches checkout: each button only
// scrolls to the donation form or the build-your-wall picker.

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { ArrowRight, Hammer, Sparkles, Users } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";
import type { CampaignConfig } from "@/lib/campaignConfig";

const CLAY = "linear-gradient(135deg, #C4623A, #9C3F1E)";
const GRAIN = "repeating-linear-gradient(115deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 7px)";
const ENGRAVED = { textShadow: "0 1.5px 0 rgba(255,225,190,0.55), 0 -1px 1px rgba(40,10,0,0.55)" } as const;

type Stats = { totalAmount: number; donorCount: number; latest?: { name: string; amount: number; time: string }[] } | null;

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!inView) return;
    setN(0);
    const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString("en-IN")}</span>;
}

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/* ------------------------------------------------------------------ intro */

// Sits directly under the banner, which stays as it is. It carries the page's
// real H1, says what the seva is in one sentence, and shows the three numbers a
// visitor looks for first.
export function BrickIntro({ config, stats }: { config: CampaignConfig; stats: Stats }) {
  const offered = stats ? Math.floor(stats.totalAmount / config.pricePerUnit) : 0;
  const tiles: { label: string; node: React.ReactNode }[] = [
    { label: "Per brick", node: <>₹{config.pricePerUnit.toLocaleString("en-IN")}</> },
    ...(offered > 0 && stats
      ? [
          { label: "Bricks offered", node: <CountUp to={offered} /> },
          { label: "Devotees", node: <CountUp to={stats.donorCount} /> },
        ]
      : [
          { label: "Name", node: <span className="text-xl md:text-2xl">Engraved</span> },
          { label: "Tax", node: <span className="text-xl md:text-2xl">80G</span> },
        ]),
  ];
  return (
    <section className="relative z-[1] pb-8 pt-10 md:pb-12 md:pt-14">
      <div className="vk-container grid items-center gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12">
        <div>
          <span className="vk-pill mb-4">Temple construction seva</span>
          <h1 className="vk-h1">
            Brick Seva
            <span aria-hidden className="mt-3 block h-1 w-20 rounded-full bg-gradient-to-r from-[#F5A623] to-[#FFD66B]" />
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Sponsor a brick of the Hare Krishna Vaikuntham Temple. Your name is laser-engraved on it, and it is laid in the Lord&apos;s abode for as long as the temple stands.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => go("brick-builder")} className="vk-btn-gold h-12 gap-2 px-7 text-[15px]">
              Engrave my name <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go("brick-benefits")} className="inline-flex h-12 items-center rounded-xl border border-vk-200 px-6 text-sm font-semibold text-vk-700 transition hover:bg-vk-50">
              What you receive
            </button>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3">
          {tiles.slice(0, 3).map((t) => (
            <div key={t.label} className="relative overflow-hidden rounded-2xl border border-vk-100 bg-white px-3 py-5 text-center brick-elev-sm">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F5A623] to-[#FFD66B]" />
              <dd className="font-heading text-2xl font-extrabold text-vk-800 md:text-3xl">{t.node}</dd>
              <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground md:text-[11px]">{t.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- benefits */

type Priv = { icon: React.ComponentType<{ className?: string }>; title: string; text: string };

export function BrickBenefits({ config }: { config: CampaignConfig }) {
  const base = (config.privileges ?? []) as Priv[];
  const higher = (config.higherPrivileges ?? []) as Priv[];
  return (
    <section id="brick-benefits" className="vk-section scroll-mt-20 bg-gradient-to-b from-vk-50 to-white">
      <div className="vk-container">
        <SectionHeading align="center" eyebrow="Your blessings" title={<>What you receive for <span className="text-vk-600">every brick</span></>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {base.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-vk-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <span aria-hidden className="absolute right-5 top-3 font-heading text-6xl font-extrabold leading-none text-vk-100 transition-colors group-hover:text-[#FFD66B]/60">{i + 1}</span>
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#FFD66B] to-[#F5A623] text-vk-900 shadow-card">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 font-heading text-lg font-bold text-ink">{p.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {higher.length > 0 && (
          <Reveal className="mt-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-navy p-7 text-white shadow-card md:p-10">
              <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
              <div className="relative mb-6 text-center">
                <span className="vk-pill-light mb-3"><Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> For larger offerings</span>
                <h3 className="font-heading text-2xl font-extrabold md:text-3xl">More blessings as your offering grows</h3>
              </div>
              <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {higher.map((p) => (
                  <div key={p.title} className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur">
                    <p.icon className="h-6 w-6 text-[hsl(var(--gold))]" />
                    <h4 className="mt-3 font-heading text-[15px] font-bold">{p.title}</h4>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/75">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- wall of names */

function NameBrick({ name, units }: { name: string; units: string }) {
  return (
    <div
      className="flex h-20 w-52 flex-none flex-col items-center justify-center rounded-lg px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-4px_8px_rgba(60,20,5,0.4),0_6px_12px_-6px_rgba(0,0,0,0.5)]"
      style={{ backgroundImage: `${GRAIN}, ${CLAY}` }}
    >
      <span className="block w-full truncate text-center font-serif-display text-lg font-bold text-[#4A1A08]" style={ENGRAVED}>{name}</span>
      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4A1A08]/70">{units}</span>
    </div>
  );
}

export function BrickWallOfNames({ stats, price, onDonate }: { stats: Stats; price: number; onDonate: () => void }) {
  const list = (stats?.latest ?? []).slice(0, 14).map((d) => {
    const u = Math.floor(d.amount / price);
    return { name: d.name, units: u >= 1 ? `${u} ${u === 1 ? "brick" : "bricks"}` : `₹${d.amount.toLocaleString("en-IN")}` };
  });
  const split = Math.ceil(list.length / 2);
  const rows = [list.slice(0, split), list.slice(split)].filter((r) => r.length);
  // Nobody to show yet: leave the section out rather than a bare dark band.
  if (rows.length === 0) return null;

  return (
    <section id="brick-names" className="vk-section scroll-mt-20 overflow-hidden bg-[#1B0E09] text-white">
      <div className="vk-container">
        <SectionHeading light align="center" eyebrow="Respected contributors" title={<>Names already <span className="text-gold">on the wall</span></>} subtitle="Devotees who have laid their bricks in the Lord's abode." />
      </div>
      {rows.length === 0 ? (
        <div className="vk-container">
          <p className="mx-auto max-w-md rounded-2xl border border-dashed border-white/20 px-5 py-8 text-center text-sm text-white/70">Be the first devotee to lay a brick of the temple.</p>
        </div>
      ) : (
        <div className="space-y-3" aria-label="Recent contributors">
          {rows.map((row, ri) => (
            <div key={ri} className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
              <div className={`flex flex-none gap-3 pr-3 ${ri % 2 ? "brick-marquee-rev" : "brick-marquee"}`}>
                {[...row, ...row, ...row, ...row].map((d, i) => <NameBrick key={i} {...d} />)}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="vk-container mt-9 text-center">
        <button type="button" onClick={onDonate} className="vk-btn-gold h-12 px-8 text-[15px]">Add your name to the wall</button>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- closing CTA */

export function BrickFinalCta({ config }: { config: CampaignConfig }) {
  return (
    <section id="brick-final" className="vk-section relative z-[1] scroll-mt-20">
      <div className="vk-container">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] px-6 py-14 text-center brick-elev md:px-12 md:py-20" style={{ backgroundImage: `${GRAIN}, ${CLAY}` }}>
            <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,210,150,0.35),transparent_50%)]" />
            <Hammer aria-hidden className="mx-auto h-9 w-9 text-[#FFE2B8]" />
            <h2 className="mx-auto mt-4 max-w-3xl font-serif-display text-3xl font-bold leading-snug text-white md:text-5xl" style={{ textShadow: "0 2px 12px rgba(60,20,5,0.5)" }}>
              Your name, in the Lord&apos;s abode, for as long as it stands.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/85">Every {config.unitName} you offer becomes part of the temple — laid with devotion, engraved with your name.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={() => go("brick-builder")} className="vk-btn-gold h-12 px-8 text-[15px]">Engrave my name</button>
              <button type="button" onClick={() => go("donate")} className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/50 px-7 text-sm font-semibold text-white transition hover:bg-white/10">
                <Users className="h-4 w-4" /> Donate now
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
