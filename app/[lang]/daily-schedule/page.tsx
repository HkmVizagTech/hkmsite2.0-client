"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock, Sun, Sunrise, Sunset, Moon, Music, BookOpen, Heart, Camera, Shirt, Utensils, Hourglass, Store } from "lucide-react";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { DAILY_SCHEDULE } from "@/lib/templeInfo";

// Times and text come from lib/templeInfo.ts (shared with the visit guide
// and the temple JSON-LD); only the icons live here.
const SCHEDULE_ICONS = [Moon, Heart, Sunrise, Music, BookOpen, Sun, Heart, Sunset, Sunset, BookOpen, Moon];
const schedule = DAILY_SCHEDULE.map((s, i) => ({ ...s, icon: SCHEDULE_ICONS[i] ?? Clock }));

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
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677824913-1783677824553-Screenshot2026-07-10153331.png",
  },
];

const visitInfo = [
  {
    icon: Clock,
    title: "Temple Hours",
    lines: ["Mangala Darshan: 4:30 AM – 5:00 AM", "Morning: 7:15 AM – 12:20 PM", "Evening: 4:15 PM – 8:15 PM"],
  },
  {
    icon: Hourglass,
    title: "Rest Period",
    lines: ["The temple is closed for darshan between 5:00 AM and 7:15 AM, and again between 12:20 PM and 4:15 PM, while the Lord rests."],
  },
  {
    icon: Shirt,
    title: "Dress Code",
    lines: ["Modest, traditional attire is encouraged. Please remove footwear before entering the temple hall."],
  },
];

const guidelines = [
  {
    icon: Camera,
    title: "Photography",
    lines: ["Photography is allowed during darshan. Flash photography and video recording may be restricted during special events."],
  },
  {
    icon: Utensils,
    title: "Prasadam",
    lines: ["Free prasadam is served after the morning Bhagavatam class and after the Sunday Love Feast program."],
  },
  {
    icon: Store,
    title: "Book Store",
    lines: ["Sacred literature by Srila Prabhupada, devotional items, and spiritual accessories are available at the temple bookstore."],
  },
];

// The sun's arc across the top of the schedule card: first aarti to last aarti.
const ARC_FROM = 4 * 60 + 30;
const ARC_TO = 21 * 60;
/** A point on the arc (a quadratic curve) at fraction f, 0 to 1. */
const arcPoint = (f: number) => ({
  x: (1 - f) ** 2 * 24 + 2 * (1 - f) * f * 200 + f ** 2 * 376,
  y: (1 - f) ** 2 * 108 + 2 * (1 - f) * f * -44 + f ** 2 * 108,
});

/** "4:30 AM" -> minutes since midnight. */
const toMinutes = (t: string) => {
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return h * 60 + parseInt(m[2], 10);
};

// Darshan windows, the same hours as the "Temple Hours" card below.
const OPEN_WINDOWS = [
  { from: 4 * 60 + 30, to: 5 * 60, label: "5:00 AM" },
  { from: 7 * 60 + 15, to: 12 * 60 + 20, label: "12:20 PM" },
  { from: 16 * 60 + 15, to: 20 * 60 + 15, label: "8:15 PM" },
];
const OPENINGS = [
  { at: 4 * 60 + 30, label: "4:30 AM" },
  { at: 7 * 60 + 15, label: "7:15 AM" },
  { at: 16 * 60 + 15, label: "4:15 PM" },
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

function InfoColumn({ title, items }: { title: string; items: typeof visitInfo }) {
  return (
    <Reveal>
      <h2 className="vk-bar-title mb-5 text-2xl text-foreground md:text-[1.75rem]">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.title} className="vk-card flex gap-4 p-5">
            <span className="vk-icon-chip">
              <item.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="mb-1 text-[15px] font-bold text-foreground md:text-base">{item.title}</h3>
              {item.lines.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export default function DailySchedulePage() {
  const now = useIstMinutes();
  const times = schedule.map((x) => toMinutes(x.time));
  // The programme that is on now (the latest one that has started) and the one after it.
  let currentIdx = -1;
  if (now !== null) times.forEach((t, i) => { if (t <= now) currentIdx = i; });
  const nextIdx = now === null ? -1 : currentIdx + 1 < schedule.length ? currentIdx + 1 : 0;

  const todayLabel =
    now === null
      ? ""
      : new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long" }).format(new Date());

  const openWindow = now === null ? null : OPEN_WINDOWS.find((w) => now >= w.from && now < w.to) ?? null;
  const nextOpening = now === null ? null : OPENINGS.find((o) => o.at > now) ?? OPENINGS[0];

  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <section className="relative overflow-hidden bg-gradient-to-b from-vk-50 to-white">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-vk-200/40 blur-3xl" />
          <div className="vk-container relative grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="text-center lg:text-left">
              <nav aria-label="Breadcrumb" className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-ink/55 md:text-[13px]">
                <Link href="/" className="transition-colors hover:text-vk-700">Home</Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                <span className="font-semibold text-vk-700" aria-current="page">Daily Schedule</span>
              </nav>
              <div>
                <span className="vk-pill">Temple Timings</span>
              </div>
              <h1 className="vk-h1 mt-4 !text-[2.1rem] md:!text-[3rem]">Daily Darshan &amp; Aarti Schedule</h1>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink/65 md:text-lg lg:mx-0">
                Temple timings, the aarti schedule and spiritual programs at ISKCON Gambheeram, Visakhapatnam.
              </p>

              {now !== null && (
                <div
                  className={`mt-6 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold ${
                    openWindow ? "border-green-200 bg-green-50 text-green-800" : "border-vk-200 bg-white text-vk-800"
                  }`}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    {openWindow && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />}
                    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${openWindow ? "bg-green-500" : "bg-vk-400"}`} />
                  </span>
                  {openWindow ? `Darshan is open now · until ${openWindow.label}` : `Temple is resting · opens at ${nextOpening?.label}`}
                </div>
              )}

              <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3 lg:mx-0">
                {[
                  { v: schedule.length, l: "daily programs" },
                  { v: schedule[0].time, l: "first aarti" },
                  { v: schedule[schedule.length - 1].time, l: "last aarti" },
                ].map((x) => (
                  <div key={x.l} className="rounded-2xl border border-vk-100 bg-white px-2 py-3 text-center shadow-[0_14px_28px_-22px_rgba(30,58,138,0.5)]">
                    <div className="font-heading text-lg font-extrabold text-vk-700 md:text-xl">{x.v}</div>
                    <div className="text-[11px] font-medium text-ink/60">{x.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
              <div aria-hidden className="absolute -inset-3 translate-x-3 translate-y-3 rounded-[2rem] border border-vk-200" />
              <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-vk-100 shadow-[0_34px_70px_-38px_rgba(30,58,138,0.7)]">
                <Image src="/assets/gallery-aarti.jpg" alt="Aarti at Hare Krishna Vaikuntham, Visakhapatnam" fill priority sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ── DAILY PROGRAM SCHEDULE: a clean day sheet ──────────── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Temple Timings"
              title="Daily Program Schedule"
              subtitle="The temple follows a sacred daily routine established by Srila Prabhupada for all ISKCON temples worldwide, from the first aarti before dawn to the last aarti at night."
            />

            <Reveal>
              <div className="mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-vk-100 bg-white shadow-[0_30px_60px_-44px_rgba(30,58,138,0.55)]">
                {/* The sun's path across the temple day */}
                <div className="relative overflow-hidden bg-gradient-to-b from-vk-100 via-vk-50 to-white px-6 pt-5 md:px-8">
                  <div className="relative z-[1] flex items-start justify-between gap-3">
                    <h3 className="font-serif-display text-lg font-semibold text-foreground md:text-xl">Today&apos;s schedule</h3>
                    {todayLabel && <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ink/60 shadow-sm">{todayLabel}</span>}
                  </div>
                  <svg viewBox="0 0 400 120" className="mt-1 w-full" role="img" aria-label="The day from first aarti to last aarti">
                    <path d="M 24 108 Q 200 -44 376 108" fill="none" stroke="#C9D5F7" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" />
                    {schedule.map((it, i) => {
                      const f = Math.min(1, Math.max(0, (times[i] - ARC_FROM) / (ARC_TO - ARC_FROM)));
                      const pt = arcPoint(f);
                      return <circle key={it.time} cx={pt.x} cy={pt.y} r={i === currentIdx ? 5 : 3.2} fill={i <= currentIdx && now !== null ? "#1E3A8A" : "#93A9EE"} />;
                    })}
                    {now !== null && (() => {
                      const f = Math.min(1, Math.max(0, (now - ARC_FROM) / (ARC_TO - ARC_FROM)));
                      const pt = arcPoint(f);
                      return (
                        <g>
                          <circle cx={pt.x} cy={pt.y} r="17" fill="#fff" opacity="0.75" />
                          <circle cx={pt.x} cy={pt.y} r="10" fill="#1E3A8A" />
                          <circle cx={pt.x} cy={pt.y} r="3.4" fill="#fff" />
                        </g>
                      );
                    })()}
                    <text x="24" y="119" textAnchor="middle" fontSize="9" fill="#6B7A99">4:30 AM</text>
                    <text x="376" y="119" textAnchor="middle" fontSize="9" fill="#6B7A99">9:00 PM</text>
                  </svg>
                </div>

                <ol className="relative">
                  {/* the spine, filled in up to the program that is on now */}
                  <span aria-hidden className="absolute bottom-8 left-[2.375rem] top-8 w-0.5 bg-vk-100 md:left-[2.875rem]" />
                  <span
                    aria-hidden
                    className="absolute left-[2.375rem] top-8 w-0.5 bg-vk-700 md:left-[2.875rem]"
                    style={{ height: now !== null && currentIdx >= 0 ? `calc(${(currentIdx / (schedule.length - 1)) * 100}% - 2rem)` : 0 }}
                  />
                  {schedule.map((item, i) => {
                    const isNow = i === currentIdx;
                    const isNext = i === nextIdx && now !== null;
                    const done = now !== null && currentIdx >= 0 && i < currentIdx;
                    const rest = item.time === "7:15 AM" ? "Darshan closed, the Lord rests (5:00 to 7:15 AM)" : item.time === "4:15 PM" ? "Darshan closed, the Lord rests (12:20 to 4:15 PM)" : null;
                    return (
                      <li key={item.time}>
                        {rest && (
                          <div className="relative z-[1] flex items-center gap-2.5 bg-vk-50 py-2 pl-[4.4rem] pr-6 text-xs font-medium text-ink/55 md:pl-[5.3rem] md:pr-8">
                            <Hourglass className="h-3.5 w-3.5 text-vk-400" />
                            {rest}
                          </div>
                        )}
                        <div className={`relative flex items-start gap-4 px-5 py-5 md:gap-5 md:px-7 ${isNow ? "bg-vk-50/70" : ""}`}>
                          {/* rail marker */}
                          <span
                            className={`relative z-[1] mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${
                              isNow
                                ? "bg-vk-700 text-white shadow-[0_10px_22px_-8px_rgba(30,58,138,0.85)]"
                                : done
                                  ? "bg-vk-700 text-white"
                                  : "border-2 border-vk-200 bg-white text-vk-500"
                            }`}
                          >
                            {isNow && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-vk-500 opacity-30" />}
                            <item.icon className="relative h-4 w-4" />
                          </span>
                          <div className="w-[4.6rem] shrink-0 md:w-24">
                            <span className={`block font-serif-display text-[1.5rem] font-semibold leading-none md:text-[1.8rem] ${isNow ? "text-vk-700" : done ? "text-ink/45" : "text-foreground"}`}>
                              {item.time.split(" ")[0]}
                            </span>
                            <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40">{item.time.split(" ")[1]}</span>
                          </div>
                          <div className={`min-w-0 flex-1 ${done ? "opacity-60" : ""}`}>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-bold text-foreground md:text-[1.05rem]">{item.event}</h4>
                              {isNow && <span className="rounded-full bg-vk-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Now</span>}
                              {isNext && !isNow && <span className="rounded-full bg-vk-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vk-700">Up next</span>}
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── SPECIAL PROGRAMS ──────────────────────────────────── */}
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
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <span className="vk-pill-soft mb-3 self-start !normal-case !tracking-normal">
                        <Clock className="h-3.5 w-3.5" />
                        {prog.day} · {prog.time}
                      </span>
                      <h3 className="text-xl font-bold text-foreground">{prog.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{prog.desc}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── VISIT INFO + GUIDELINES ───────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container grid gap-10 md:grid-cols-2 lg:gap-14">
            <InfoColumn title="Visit Us" items={visitInfo} />
            <InfoColumn title="Guidelines" items={guidelines} />
          </div>
        </section>

        {/* ── MAHA MANTRA ───────────────────────────────────────── */}
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
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
