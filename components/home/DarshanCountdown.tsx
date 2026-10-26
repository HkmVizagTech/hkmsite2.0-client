"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Moon, Sparkles, X } from "lucide-react";
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

  const shown = photos.length ? photos : [FALLBACK_DARSHAN];
  const main = shown[Math.min(active, shown.length - 1)];

  const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(`${iso}T12:00:00+05:30`).toLocaleDateString("en-IN", { ...opts, timeZone: "Asia/Kolkata" });

  return (
    <section className="relative z-10 pb-6 pt-6 md:pb-10 md:pt-10">
      <div className="vk-container">
        <Reveal>
          <div className="grid overflow-hidden rounded-3xl border border-vk-100 bg-white shadow-[0_30px_60px_-36px_rgba(10,18,51,0.45)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)]">
            {/* ── Today's darshan ─────────────────────────────── */}
            <div className="relative flex flex-col p-3 md:p-4">
              <button
                type="button"
                onClick={() => photos.length && setLightbox(active)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-vk-100 max-h-[380px] md:max-h-[460px] lg:aspect-auto lg:max-h-none lg:min-h-[300px] lg:flex-1"
                aria-label={t("Open today's darshan photo")}
              >
                <Image
                  src={main}
                  alt={t("Today's darshan of Sri Sri Radha Madan Mohan")}
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vk-900/80 via-transparent to-transparent" />
                <div className="absolute left-3 top-3">
                  <span className="vk-pill !bg-white/95 !text-vk-800 shadow">
                    <Sparkles className="h-3.5 w-3.5" /> {t("Today's Darshan")}
                  </span>
                </div>
                {syncLabel && (
                  <p className="absolute bottom-3 left-4 text-left text-sm font-semibold text-white">{syncLabel}</p>
                )}
              </button>
              {photos.length > 1 && (
                <div className="mt-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
                  {photos.slice(0, 6).map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={t("Show darshan photo {n}", { n: i + 1 })}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-2 transition ${
                        i === active ? "ring-vk-500" : "ring-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Festivals + countdown ─────────────────────── */}
            <div className="flex flex-col gap-4 border-t border-vk-100 p-5 md:p-7 lg:border-l lg:border-t-0">
              {/* Today's festival — the highlighted panel */}
              {festivalToday.map((f) => (
                <div
                  key={f.title}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-vk-700 via-vk-800 to-vk-900 p-5 text-white shadow-[0_18px_40px_-22px_rgba(10,18,51,0.7)] md:p-6"
                >
                  <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative flex items-start gap-4">
                    <DateChip iso={f.date} fmt={fmt} tone="dark" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-200">{t("Today's Festival")}</h2>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-vk-900">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vk-900" /> {t("Today")}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xl font-bold leading-snug md:text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
                        {t(f.title)}
                      </p>
                      {f.description && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/80">{t(f.description)}</p>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Upcoming festival with its countdown attached */}
              <div className="rounded-2xl border border-vk-100 bg-gradient-to-br from-vk-50/70 to-white p-4 md:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-vk-600">{t("Upcoming Festival")}</h2>
                  <Link href="/vaishnav-calendar" className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-vk-600 hover:text-vk-800 md:text-sm">
                    <CalendarDays className="h-4 w-4" /> {t("Vaishnava Calendar")}
                  </Link>
                </div>
                {festival ? (
                  <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <DateChip iso={festival.date} fmt={fmt} />
                      <div className="min-w-0">
                        <p className="text-lg font-bold leading-snug text-ink" style={{ fontFamily: "var(--font-heading)" }}>
                          {t(festival.title)}
                        </p>
                        {festival.description && (
                          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{t(festival.description)}</p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink/50">{t("Starts in")}</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { v: cd?.days, l: t("Days") },
                          { v: cd?.hours, l: t("Hours") },
                          { v: cd?.minutes, l: t("Minutes") },
                          { v: cd?.seconds, l: t("Seconds") },
                        ].map((u) => (
                          <div key={u.l} className="min-w-[58px] rounded-xl border border-vk-100 bg-white px-2 py-2 text-center shadow-sm">
                            <p
                              className="text-xl font-extrabold tabular-nums leading-none text-vk-700 md:text-2xl"
                              style={{ fontFamily: "var(--font-heading)" }}
                              suppressHydrationWarning
                            >
                              {u.v === undefined ? "–" : String(u.v).padStart(2, "0")}
                            </p>
                            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-ink/55">{u.l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">{t("See the Vaishnava calendar for upcoming celebrations.")}</p>
                )}
              </div>

              {/* Ekadashi */}
              {[
                ekadashiToday && { label: t("Ekadashi today"), title: ekadashiToday.title },
                ekadashi && { label: t("Next Ekadashi · {date}", { date: fmt(ekadashi.date, { day: "numeric", month: "short" }) }), title: ekadashi.title },
              ]
                .filter((x): x is { label: string; title: string } => Boolean(x))
                .map((x) => (
                  <div key={x.label} className="flex items-center gap-3 rounded-2xl border border-vk-100 bg-white px-4 py-3">
                    <span className="vk-icon-chip !h-9 !w-9 !bg-vk-50">
                      <Moon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold text-ink">{x.label}</p>
                      <p className="truncate text-muted-foreground">{t(x.title)}</p>
                    </div>
                    <Link href="/ekadashi" className="ml-auto shrink-0 rounded-full bg-vk-50 px-3 py-1.5 text-sm font-semibold text-vk-700 hover:bg-vk-100">
                      {t("Seva →")}
                    </Link>
                  </div>
                ))}
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
