"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { WholeImage } from "@/components/home/HomeMagic";
import Link from "next/link";
import { ArrowRight, Bell, CalendarDays, ChevronLeft, ChevronRight, Clock, Moon, Sparkles, X } from "lucide-react";
import { DARSHAN_HOURS, DAILY_SCHEDULE } from "@/lib/templeInfo";
import { getDarshanPhotos } from "@/lib/darshanApi";
import { vaishnavaCalendar2026, type VaishnavaDate } from "@/lib/vaishnavaCalendarData";
import Reveal from "@/components/site/Reveal";
import { useT } from "@/components/i18n/LocaleProvider";

const FALLBACK_DARSHAN = "/assets/donor-priv-daily-darshan.webp";

// Today's date in IST as YYYY-MM-DD — calendar entries are IST dates.
function istToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

// The first entry of these types strictly AFTER today (today's own entries are shown separately, see todayOf).
function nextOf(types: VaishnavaDate["type"][], today: string): VaishnavaDate | null {
  return vaishnavaCalendar2026.find((d) => d.date > today && types.includes(d.type)) ?? null;
}

// Everything of these types that falls on today's date.
function todayOf(types: VaishnavaDate["type"][], today: string): VaishnavaDate[] {
  return vaishnavaCalendar2026.filter((d) => d.date === today && types.includes(d.type));
}

function useCountdown(targetIso: string | null) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!targetIso || now === null) return null;
  // Festivals begin at sunrise-ish; count down to 05:00 IST on the day.
  const target = new Date(`${targetIso}T05:00:00+05:30`).getTime();
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isToday: diff === 0,
  };
}

/** Minutes since midnight in IST. */
function istMinutes(ms: number): number {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date(ms));
  return Number(p.find((x) => x.type === "hour")?.value ?? 0) * 60 + Number(p.find((x) => x.type === "minute")?.value ?? 0);
}
const hm = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
/** "6:30 PM" -> minutes since midnight. */
function ampm(s: string): number {
  const m = s.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  return ((Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0)) * 60 + Number(m[2]);
}
const clock = (min: number) => {
  const h = Math.floor(min / 60) % 24, mm = min % 60;
  return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

/** Is darshan open right now, and the next aarti (wrapping to tomorrow's Mangala Aarti). */
function templeNow(ms: number) {
  const now = istMinutes(ms);
  const open = DARSHAN_HOURS.find((w) => now >= hm(w.opens) && now < hm(w.closes));
  const nextOpen = DARSHAN_HOURS.find((w) => hm(w.opens) > now) ?? DARSHAN_HOURS[0];
  const aartis = DAILY_SCHEDULE.filter((x) => /aarti/i.test(x.event));
  const next = aartis.find((x) => ampm(x.time) > now) ?? aartis[0];
  const inMin = (ampm(next.time) - now + 1440) % 1440;
  return { open: Boolean(open), closes: open ? clock(hm(open.closes)) : "", reopens: clock(hm(nextOpen.opens)), aarti: next.event, aartiTime: next.time, inMin };
}

function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

type Fmt = (iso: string, opts: Intl.DateTimeFormatOptions) => string;

/** Calendar-page style date: month on top, big day, weekday below. `tone` flips it for the dark "today" panel. */
function DateChip({ iso, fmt, tone = "light" }: { iso: string; fmt: Fmt; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div
      className={`w-[68px] shrink-0 overflow-hidden rounded-2xl text-center shadow-sm ${
        dark ? "bg-white/10 ring-1 ring-white/25" : "border border-vk-100 bg-white"
      }`}
    >
      <div className={`py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${dark ? "bg-white/20 text-white" : "bg-vk-700 text-white"}`}>
        {fmt(iso, { month: "short" })}
      </div>
      <div className={`pt-1.5 text-[1.75rem] font-extrabold leading-none ${dark ? "text-white" : "text-ink"}`} style={{ fontFamily: "var(--font-heading)" }}>
        {fmt(iso, { day: "numeric" })}
      </div>
      <div className={`pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wide ${dark ? "text-white/70" : "text-ink/50"}`}>
        {fmt(iso, { weekday: "short" })}
      </div>
    </div>
  );
}

/**
 * GVD's "Grand Opening Countdown" card, re-purposed: today's live darshan
 * on the left, the next major Vaishnava festival with a ticking countdown,
 * and the next Ekadashi — the three things a devotee checks most.
 */
export default function DarshanCountdown() {
  const t = useT();
  const [photos, setPhotos] = useState<string[]>([]);
  const [syncLabel, setSyncLabel] = useState("");
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(istToday());
    getDarshanPhotos().then((items) => {
      if (!items?.length) return;
      const sorted = [...items].sort((a, b) => a.position - b.position);
      setPhotos(sorted.map((i) => i.imageUrl));
      const latest = sorted.reduce((t, i) => Math.max(t, i.syncedAt ? new Date(i.syncedAt).getTime() : 0), 0);
      if (latest) {
        setSyncLabel(
          new Date(latest).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" })
        );
      }
    });
  }, []);

  const festivalToday = useMemo(() => (today ? todayOf(["Festival", "Appearance"], today) : []), [today]);
  const festival = useMemo(() => (today ? nextOf(["Festival", "Appearance"], today) : null), [today]);
  const ekadashiToday = useMemo(() => (today ? todayOf(["Ekadashi"], today)[0] ?? null : null), [today]);
  const ekadashi = useMemo(() => (today ? nextOf(["Ekadashi"], today) : null), [today]);
  const cd = useCountdown(festival?.date ?? null);
  const nowMs = useNow();
  const live = nowMs ? templeNow(nowMs) : null;

  const shown = photos.length ? photos : [FALLBACK_DARSHAN];
  const main = shown[Math.min(active, shown.length - 1)];

  const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(`${iso}T12:00:00+05:30`).toLocaleDateString("en-IN", { ...opts, timeZone: "Asia/Kolkata" });

  return (
    <section className="relative z-10 pb-6 pt-6 md:pb-10 md:pt-10">
      <div className="vk-container">
        <Reveal>
          <div className="grid gap-4 overflow-hidden rounded-[2rem] border border-vk-100 bg-white p-3 shadow-[0_30px_60px_-36px_rgba(10,18,51,0.45)] md:p-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-5">
            {/* ── Today's darshan: the photo shown whole ── */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => photos.length && setLightbox(active)}
                className="group relative mx-auto block w-fit max-w-full overflow-hidden rounded-[1.5rem] bg-vk-900 ring-1 ring-[#F6C752]/40"
                aria-label={t("Open today's darshan photo")}
              >
                <WholeImage src={main} alt={t("Today's darshan of Sri Sri Radha Madan Mohan")} sizes="(min-width: 1024px) 480px, 100vw" className="!w-auto max-h-[520px] max-w-full" />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-vk-900/80 to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-vk-800 shadow">
                  <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold-deep))]" /> {t("Today's Darshan")}
                </span>
                {syncLabel && <p className="absolute bottom-3 left-4 text-left text-sm font-semibold text-white">{syncLabel}</p>}
              </button>
              {photos.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide md:justify-center">
                  {photos.slice(0, 6).map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={t("Show darshan photo {n}", { n: i + 1 })}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-2 transition ${i === active ? "ring-[#F6C752]" : "ring-transparent opacity-70 hover:opacity-100"}`}
                    >
                      <Image src={src} alt="" fill sizes="56px" className="object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: live status, festival countdown, Ekadashi and timings ── */}
            <div className="flex flex-col gap-3 md:gap-4">
              {/* live temple status */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-vk-100 bg-vk-50/60 px-4 py-3">
                {live ? (
                  <>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-ink">
                      <span className={`relative flex h-2.5 w-2.5`}>
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${live.open ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${live.open ? "bg-emerald-500" : "bg-amber-500"}`} />
                      </span>
                      {live.open ? t("Darshan open now") : t("Darshan closed")}
                      <span className="font-medium text-ink/60">· {live.open ? t("closes {time}", { time: live.closes }) : t("reopens {time}", { time: live.reopens })}</span>
                    </span>
                    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/75">
                      <Bell className="h-4 w-4 text-[hsl(var(--gold-deep))]" />
                      {t("Next: {aarti} at {time}", { aarti: t(live.aarti), time: live.aartiTime })}
                      <span className="whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-vk-700 ring-1 ring-vk-100">
                        {live.inMin >= 60 ? t("in {h}h {m}m", { h: Math.floor(live.inMin / 60), m: live.inMin % 60 }) : t("in {m} min", { m: live.inMin })}
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="h-5" />
                )}
              </div>

              {/* today's festival(s) */}
              {festivalToday.map((f) => (
                <div key={f.title} className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#FFF9EC_0%,#FFFFFF_45%,#EEF3FF_100%)] ring-1 ring-[#F6C752]/45 shadow-[0_18px_40px_-26px_rgba(30,58,138,.45)] p-5 text-ink">
                  <div className="relative flex items-start gap-4">
                    <DateChip iso={f.date} fmt={fmt} />
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6C752] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#1A1240]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1A1240]" /> {t("Today's Festival")}
                      </span>
                      <p className="mt-2 font-serif-display text-xl font-bold leading-snug text-vk-800 md:text-2xl">{t(f.title)}</p>
                      {f.description && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink/70">{t(f.description)}</p>}
                    </div>
                  </div>
                </div>
              ))}

              {/* upcoming festival with a gold countdown */}
              <div className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#FFF9EC_0%,#FFFFFF_45%,#EEF3FF_100%)] ring-1 ring-[#F6C752]/45 shadow-[0_18px_40px_-26px_rgba(30,58,138,.45)] p-5 text-ink md:p-6">
                <div aria-hidden className="sp-rays absolute -right-24 -top-24 h-72 w-72 opacity-40" />
                <div className="relative flex items-center justify-between gap-3">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--gold-deep))]">✦ {t("Upcoming Festival")}</h2>
                  <Link href="/vaishnav-calendar" className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-vk-600 hover:text-vk-800">
                    <CalendarDays className="h-4 w-4" /> <span className="hidden sm:inline">{t("Vaishnava Calendar")}</span><span className="sm:hidden">{t("Calendar")}</span>
                  </Link>
                </div>
                {festival ? (
                  <>
                    <div className="relative mt-4 flex items-start gap-4">
                      <DateChip iso={festival.date} fmt={fmt} />
                      <div className="min-w-0">
                        <p className="font-serif-display text-xl font-bold leading-snug text-vk-800 md:text-[1.7rem]">{t(festival.title)}</p>
                        {festival.description && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/70">{t(festival.description)}</p>}
                      </div>
                    </div>
                    <p className="relative mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wider text-ink/50">{t("Starts in")}</p>
                    <div className="relative grid grid-cols-4 gap-2 md:gap-3">
                      {[
                        { v: cd?.days, l: t("Days") },
                        { v: cd?.hours, l: t("Hours") },
                        { v: cd?.minutes, l: t("Minutes") },
                        { v: cd?.seconds, l: t("Seconds") },
                      ].map((u) => (
                        <div key={u.l} className="rounded-xl bg-white px-2 py-2.5 text-center shadow-sm ring-1 ring-[#F6C752]/50">
                          <p className="text-2xl font-extrabold tabular-nums leading-none text-vk-700 md:text-3xl" style={{ fontFamily: "var(--font-heading)" }} suppressHydrationWarning>
                            {u.v === undefined ? "–" : String(u.v).padStart(2, "0")}
                          </p>
                          <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-ink/55">{u.l}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="relative mt-3 text-sm text-ink/70">{t("See the Vaishnava calendar for upcoming celebrations.")}</p>
                )}
              </div>

              {/* Ekadashi + today's darshan timings */}
              <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
                <div className="flex flex-col rounded-2xl border border-vk-100 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <span className="vk-icon-chip !h-10 !w-10 !bg-vk-50"><Moon className="h-4 w-4" /></span>
                    <div className="min-w-0 text-sm">
                      <p className="font-bold text-ink">{ekadashiToday ? t("Ekadashi today") : ekadashi ? t("Next Ekadashi · {date}", { date: fmt(ekadashi.date, { day: "numeric", month: "short" }) }) : t("Ekadashi")}</p>
                      <p className="truncate text-muted-foreground">{t((ekadashiToday ?? ekadashi)?.title ?? "")}</p>
                    </div>
                  </div>
                  <Link href="/ekadashi" className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#F6C752] px-4 py-2 text-sm font-bold text-[#1A1240] hover:brightness-105">
                    {t("Offer Ekadashi seva")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="rounded-2xl border border-vk-100 bg-white p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-ink"><Clock className="h-4 w-4 text-vk-600" /> {t("Darshan timings")}</p>
                  <ul className="mt-2 space-y-1.5 text-[13px]">
                    {DARSHAN_HOURS.map((w) => (
                      <li key={w.label} className="flex items-center justify-between gap-2">
                        <span className="text-ink/70">{t(w.label)}</span>
                        <span className="font-semibold tabular-nums text-vk-800">{w.display}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Lightbox */}
      {lightbox !== null && photos.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("Darshan photo")}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-vk-900/95 p-4"
          onClick={() => setLightbox(null)}
        >
          <button type="button" aria-label={t("Close")} className="absolute right-5 top-5 text-white/80 hover:text-white" onClick={() => setLightbox(null)}>
            <X className="h-8 w-8" />
          </button>
          {lightbox > 0 && (
            <button
              type="button"
              aria-label={t("Previous photo")}
              className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:left-8"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}
          {lightbox < photos.length - 1 && (
            <button
              type="button"
              aria-label={t("Next photo")}
              className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:right-8"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
          <div className="relative h-[82vh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[lightbox]} alt={t("Darshan")} fill sizes="92vw" className="object-contain" />
          </div>
          <Link
            href="/gallery"
            className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-vk-800"
            onClick={(e) => e.stopPropagation()}
          >
            {t("Full gallery")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
