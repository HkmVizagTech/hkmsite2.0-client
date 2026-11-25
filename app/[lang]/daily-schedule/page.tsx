"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen, Camera, Clock, DoorOpen, Flame, Flower2, Hourglass, Leaf, MapPin,
  Moon, Phone, Shirt, Sparkles, Store, Sun, Sunrise, Sunset, Utensils,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { DAILY_SCHEDULE, DARSHAN_HOURS, MAPS_URL, TEMPLE } from "@/lib/templeInfo";

// Times and text come from lib/templeInfo.ts (shared with the visit guide
// and the temple JSON-LD); only the icons and the day-parts live here.
const EVENT_ICON: Record<string, LucideIcon> = {
  "Mangala Aarti": Sunrise,
  "Tulsi Puja & Japa": Leaf,
  "Shringar Darshan": Sparkles,
  "Guru Puja": Flower2,
  "Srimad Bhagavatam Class": BookOpen,
  "Raj Bhog Aarti": Flame,
  "Temple Reopens": DoorOpen,
  "Sandhya Aarti": Sunset,
  "Bhagavad Gita Class": BookOpen,
  "Shayan Aarti": Moon,
};

/** "4:30 AM" -> minutes since midnight. */
const toMinutes = (t: string) => {
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + parseInt(m[2], 10);
};
const hhmm = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

const schedule = DAILY_SCHEDULE.map((s) => ({ ...s, icon: EVENT_ICON[s.event] ?? Clock, mins: toMinutes(s.time) }));

const DAY_PARTS = [
  { key: "morning", label: "Morning", sub: "Before noon", icon: Sunrise, test: (m: number) => m < 12 * 60 },
  { key: "afternoon", label: "Afternoon", sub: "Noon to 4 PM", icon: Sun, test: (m: number) => m >= 12 * 60 && m < 16 * 60 },
  { key: "evening", label: "Evening", sub: "From 4 PM", icon: Moon, test: (m: number) => m >= 16 * 60 },
].map((p) => ({ ...p, items: schedule.filter((s) => p.test(s.mins)) })).filter((p) => p.items.length > 0);

type Row =
  | { kind: "label"; part: (typeof DAY_PARTS)[number]; firstIdx: number }
  | { kind: "item"; item: (typeof schedule)[number]; idx: number };
const ROWS: Row[] = DAY_PARTS.flatMap((part) => [
  { kind: "label", part, firstIdx: schedule.indexOf(part.items[0]) } as Row,
  ...part.items.map((item) => ({ kind: "item", item, idx: schedule.indexOf(item) }) as Row),
]);

const R2 = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/";
const BANNER_DESKTOP = `${R2}1795608007880-1795608006993-DailyScheduleDesktopFull1920x700.png`;
const BANNER_MOBILE = `${R2}1795608007247-1795608006498-DailyScheduleMobile1080x1350.png`;

const specialPrograms = [
  {
    title: "Sunday Love Feast",
    day: "Every Sunday",
    time: "5:00 PM - 8:30 PM",
    desc: "A grand weekly celebration with kirtan, discourse, and sumptuous prasadam feast open to all.",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677824913-1783677824553-Screenshot2026-07-10153331.png",
  },
  {
    title: "Ekadashi Program",
    day: "Twice a Month",
    time: "6:00 AM - 8:00 PM",
    desc: "Special fasting day programs with extended kirtan, readings from scriptures, and spiritual discussions.",
    image: "/assets/gallery-aarti.jpg",
  },
  {
    title: "Saturday Satsang",
    day: "Every Saturday",
    time: "6:00 PM - 8:00 PM",
    desc: "Community satsang with bhajans, Q&A on spiritual topics, and light prasadam.",
    image: "/assets/gallery-class.jpg",
  },
];

const visitCards = [
  { icon: Clock, title: "Temple Hours", text: "Mangala Darshan 4:30 – 5:00 AM, Morning 7:15 AM – 12:20 PM and Evening 4:15 – 8:15 PM." },
  { icon: Hourglass, title: "Rest Period", text: "The temple is closed for darshan between 5:00 and 7:15 AM, and again between 12:20 and 4:15 PM, while the Lord rests." },
  { icon: Shirt, title: "Dress Code", text: "Modest, traditional attire is encouraged. Please remove footwear before entering the temple hall." },
  { icon: Camera, title: "Photography", text: "Photography is allowed during darshan. Flash photography and video recording may be restricted during special events." },
  { icon: Utensils, title: "Prasadam", text: "Free prasadam is served after the morning Bhagavatam class and after the Sunday Love Feast program." },
  { icon: Store, title: "Book Store", text: "Sacred literature by Srila Prabhupada, devotional items, and spiritual accessories are available at the temple bookstore." },
];

/** Minutes since midnight in India, ticking once a minute. Null until the browser has it. */
function useIstMinutes() {
  const [mins, setMins] = useState<number | null>(null);
  useEffect(() => {
    const read = () => {
      const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
      const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      setMins(h * 60 + m);
    };
    read();
    const id = setInterval(read, 60000);
    return () => clearInterval(id);
  }, []);
  return mins;
}

export default function DailySchedulePage() {
  const now = useIstMinutes();

  // The programme that is on now (the latest one that has started) and the one after it.
  let currentIdx = -1;
  if (now !== null) schedule.forEach((s, i) => { if (s.mins <= now) currentIdx = i; });
  const nextIdx = now === null ? -1 : currentIdx + 1 < schedule.length ? currentIdx + 1 : 0;
  const current = currentIdx >= 0 ? schedule[currentIdx] : null;
  const next = nextIdx >= 0 ? schedule[nextIdx] : null;

  const openWindow = now === null ? null : DARSHAN_HOURS.find((w) => now >= hhmm(w.opens) && now < hhmm(w.closes)) ?? null;
  const nextOpening = now === null ? null : DARSHAN_HOURS.find((w) => hhmm(w.opens) > now) ?? DARSHAN_HOURS[0];
  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        {/* ───────── Banner ───────── */}
        <section className="bg-white">
          <h1 className="sr-only">Daily Darshan &amp; Aarti Schedule at ISKCON Gambheeram, Visakhapatnam</h1>
          <Image
            src={BANNER_DESKTOP}
            alt="Daily Schedule: a day of devotion at Sri Sri Radha Madan Mohan Temple, Hare Krishna Vaikuntham"
            width={1920}
            height={700}
            sizes="100vw"
            className="hidden h-auto w-full md:block"
          />
          <Image
            src={BANNER_MOBILE}
            alt="Daily Schedule: a day of devotion at Sri Sri Radha Madan Mohan Temple, Hare Krishna Vaikuntham"
            width={1080}
            height={1350}
            sizes="100vw"
            className="block h-auto w-full md:hidden"
          />
        </section>

        {/* ───────── Live status + darshan windows ───────── */}
        <section className="bg-white py-10 md:py-14">
          <div className="vk-container">
            <Reveal>
              <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
                {now !== null ? (
                  <div
                    className={`inline-flex items-center justify-center gap-2.5 self-center rounded-full border px-4 py-2 text-sm font-semibold md:self-auto ${
                      openWindow ? "border-green-200 bg-green-50 text-green-800" : "border-vk-200 bg-vk-50 text-vk-800"
                    }`}
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      {openWindow && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />}
                      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${openWindow ? "bg-green-500" : "bg-vk-400"}`} />
                    </span>
                    {openWindow ? `Darshan is open now · until ${openWindow.display.split("–")[1].trim()}` : `Temple is resting · opens at ${nextOpening?.display.split("–")[0].trim()}`}
                  </div>
                ) : <span />}

                {now !== null && (current || next) && (
                  <div className="grid grid-cols-2 gap-3 md:min-w-[26rem]">
                    {current && (
                      <div className="rounded-2xl border border-[#E8A317] bg-gradient-to-br from-[#FFF4D6] to-white p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B7791F]">Happening now</p>
                        <p className="mt-1 text-[15px] font-bold leading-snug text-foreground">{current.event}</p>
                        <p className="text-xs text-muted-foreground">Since {current.time}</p>
                      </div>
                    )}
                    {next && (
                      <div className="rounded-2xl border border-vk-100 bg-vk-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-vk-700">Up next</p>
                        <p className="mt-1 text-[15px] font-bold leading-snug text-foreground">{next.event}</p>
                        <p className="text-xs text-muted-foreground">{next.time}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {DARSHAN_HOURS.map((w) => {
                  const open = now !== null && now >= hhmm(w.opens) && now < hhmm(w.closes);
                  const [from, to] = w.display.split("–").map((x) => x.trim());
                  return (
                    <div
                      key={w.label}
                      className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_24px_50px_-34px_rgba(30,58,138,0.55)] ${open ? "ring-2 ring-green-500" : "ring-1 ring-vk-100"}`}
                    >
                      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F6C752] to-[#E8A317]" />
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-vk-700">{w.label}</p>
                        {open && <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-800">Open now</span>}
                      </div>
                      <p className="mt-3 font-serif-display text-3xl font-semibold leading-none text-foreground md:text-[2rem]">{from}</p>
                      <p className="mt-2 text-sm font-medium text-muted-foreground">to {to}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mx-auto mt-4 flex max-w-2xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Hourglass className="h-4 w-4 shrink-0 text-vk-400" />
                The temple is closed for darshan from 5:00 to 7:15 AM and 12:20 to 4:15 PM while the Lord rests.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────── Daily program schedule: a journey through the day ───────── */}
        <section className="relative isolate overflow-hidden bg-white py-16 md:py-24">
          <div className="vk-container">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-vk-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-vk-700">
                  Temple Timings
                </span>
                <h2 className="mt-4 text-3xl font-extrabold text-foreground md:text-5xl">Daily Program Schedule</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                  The temple follows a sacred daily routine established by Srila Prabhupada for all ISKCON temples worldwide, from the first aarti before dawn to the last aarti at night.
                </p>
              </div>
            </Reveal>

            <ol className="relative mx-auto mt-14 max-w-5xl">
              {ROWS.map((row, ri) => {
                if (row.kind === "label") {
                  const passed = now !== null && currentIdx >= row.firstIdx;
                  return (
                    <li key={`l-${row.part.key}`} className="relative grid grid-cols-[2.5rem_1fr] gap-x-4 pb-6 pt-2 md:grid-cols-[1fr_3rem_1fr] md:gap-x-8">
                      <span aria-hidden className={`absolute bottom-0 left-5 top-0 w-0.5 -translate-x-1/2 md:left-1/2 ${passed ? "bg-[#F6C752]" : "bg-vk-100"}`} />
                      <span className="relative z-[1] col-start-1 row-start-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F6C752] to-[#E8A317] text-vk-900 shadow-[0_0_0_6px_rgba(246,199,82,0.18)] md:col-start-2">
                        <row.part.icon className="h-5 w-5" />
                      </span>
                      <div className="col-start-2 row-start-1 self-center md:col-start-3">
                        <p className="font-serif-display text-2xl font-semibold leading-none text-foreground">{row.part.label}</p>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">{row.part.sub}</p>
                      </div>
                    </li>
                  );
                }
                const { item, idx } = row;
                const isNow = idx === currentIdx;
                const isNext = idx === nextIdx && now !== null;
                const done = now !== null && currentIdx >= 0 && idx < currentIdx;
                const lit = now !== null && currentIdx >= idx;
                const left = ri % 2 === 0;
                const [clock, ampm] = item.time.split(" ");
                return (
                  <li key={item.time} className="relative grid grid-cols-[2.5rem_1fr] gap-x-4 pb-6 md:grid-cols-[1fr_3rem_1fr] md:gap-x-8">
                    <span aria-hidden className={`absolute bottom-0 left-5 top-0 w-0.5 -translate-x-1/2 md:left-1/2 ${lit ? "bg-[#F6C752]" : "bg-vk-100"}`} />
                    <span
                      className={`relative z-[1] col-start-1 row-start-1 mt-4 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white md:col-start-2 ${
                        isNow ? "bg-[#F6C752] text-vk-900 shadow-[0_0_28px_rgba(246,199,82,0.7)]" : lit ? "bg-[#E8A317] text-vk-900" : "border-2 border-vk-200 bg-white text-vk-500"
                      }`}
                    >
                      {isNow && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#F6C752] opacity-40" />}
                      <item.icon className="relative h-4 w-4" />
                    </span>

                    {/* the time, on the opposite side of the spine (desktop) */}
                    <div className={`hidden items-center md:row-start-1 md:flex ${left ? "md:col-start-3 md:justify-start" : "md:col-start-1 md:justify-end"}`}>
                      <div className={left ? "text-left" : "text-right"}>
                        <span className={`font-serif-display text-5xl font-semibold leading-none ${isNow ? "text-vk-700" : done ? "text-ink/30" : "text-foreground"}`}>{clock}</span>
                        <span className="ml-2 text-xs font-bold uppercase tracking-[0.2em] text-ink/45">{ampm}</span>
                      </div>
                    </div>

                    {/* the programme card */}
                    <div
                      className={`col-start-2 row-start-1 rounded-2xl border p-5 transition ${left ? "md:col-start-1" : "md:col-start-3"} ${
                        isNow
                          ? "border-[#E8A317] bg-gradient-to-br from-[#FFF4D6] to-white shadow-[0_24px_50px_-24px_rgba(232,163,23,0.6)]"
                          : "border-vk-100 bg-white shadow-[0_14px_30px_-26px_rgba(30,58,138,0.5)] hover:-translate-y-0.5 hover:shadow-[0_22px_40px_-26px_rgba(30,58,138,0.6)]"
                      } ${done ? "opacity-60" : ""}`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-vk-50 px-2 py-0.5 text-xs font-bold tracking-wide text-vk-700 md:hidden">{item.time}</span>
                        <h3 className="text-base font-bold text-foreground md:text-lg">{item.event}</h3>
                        {isNow && <span className="rounded-full bg-[#F6C752] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vk-900">Now</span>}
                        {isNext && !isNow && <span className="rounded-full bg-vk-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vk-700">Up next</span>}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                );
              })}
              {/* end of the day */}
              <li className="relative grid grid-cols-[2.5rem_1fr] gap-x-4 md:grid-cols-[1fr_3rem_1fr] md:gap-x-8">
                <span className="relative z-[1] col-start-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-vk-200 bg-white text-vk-500 md:col-start-2">
                  <Moon className="h-4 w-4" />
                </span>
                <p className="col-start-2 self-center text-sm font-medium text-ink/55 md:col-start-3">Jaya! The Lord rests until Mangala Aarti.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ───────── Special programs ───────── */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Weekly Programs" title="Special Programs" />
            <div className="grid gap-5 md:grid-cols-3">
              {specialPrograms.map((prog, i) => (
                <Reveal key={prog.title} delay={i * 0.08}>
                  <article className="vk-card vk-card-hover group flex h-full flex-col overflow-hidden">
                    <div className="relative h-48 overflow-hidden bg-vk-100">
                      <Image
                        src={prog.image}
                        alt={prog.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-vk-900/50 to-transparent" />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-vk-800 shadow">
                        <Clock className="h-3.5 w-3.5" />
                        {prog.day}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <h3 className="text-xl font-bold text-foreground">{prog.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-vk-700">{prog.time}</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{prog.desc}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Plan your visit ───────── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Visit Us" title="Plan Your Visit" subtitle="A few things that make your darshan smooth and peaceful." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visitCards.map((c, i) => (
                <Reveal key={c.title} delay={(i % 3) * 0.06}>
                  <div className="h-full rounded-2xl border border-vk-100 bg-white p-6 shadow-[0_14px_30px_-26px_rgba(30,58,138,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_-26px_rgba(30,58,138,0.6)]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-vk-50 text-vk-700">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-foreground">{c.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Maha mantra + directions ───────── */}
        <section className="pb-10 md:pb-16">
          <div className="vk-container">
            <Reveal>
              <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-vk-600 via-vk-700 to-vk-900 px-6 py-12 text-center md:px-12 md:py-16">
                <div aria-hidden className="absolute -right-16 -top-16 -z-10 h-60 w-60 rounded-full bg-white/10" />
                <div aria-hidden className="absolute -bottom-20 -left-12 -z-10 h-52 w-52 rounded-full bg-vk-500/25" />
                <span className="vk-pill-light mb-6">The Maha Mantra</span>
                <h2 className="vk-h2 mx-auto max-w-3xl !leading-snug !text-white md:!text-5xl">
                  Hare Krishna Hare Krishna<br />
                  Krishna Krishna Hare Hare<br />
                  Hare Rama Hare Rama<br />
                  Rama Rama Hare Hare
                </h2>
                <p className="mx-auto mt-6 max-w-2xl font-serif-display text-lg italic leading-relaxed text-white/85">
                  &quot;Simply by chanting the Holy Name of the Lord, one can attain the highest perfection of life.&quot;
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/65">— Srila Prabhupada</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="vk-btn-gold px-7 py-3.5 text-base">
                    <MapPin className="h-4 w-4" /> Get Directions
                  </a>
                  <a href={TEMPLE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10">
                    <Phone className="h-4 w-4" /> {TEMPLE.phone}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
