"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Moon, Sparkles, X } from "lucide-react";
import { getDarshanPhotos } from "@/lib/darshanApi";
import { vaishnavaCalendar2026, type VaishnavaDate } from "@/lib/vaishnavaCalendarData";
import Reveal from "@/components/site/Reveal";

const FALLBACK_DARSHAN = "/assets/donor-priv-daily-darshan.webp";

// Today's date in IST as YYYY-MM-DD — calendar entries are IST dates.
function istToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function nextOf(types: VaishnavaDate["type"][], today: string): VaishnavaDate | null {
  return vaishnavaCalendar2026.find((d) => d.date >= today && types.includes(d.type)) ?? null;
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

/**
 * GVD's "Grand Opening Countdown" card, re-purposed: today's live darshan
 * on the left, the next major Vaishnava festival with a ticking countdown,
 * and the next Ekadashi — the three things a devotee checks most.
 */
export default function DarshanCountdown() {
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

  const festival = useMemo(() => (today ? nextOf(["Festival", "Appearance"], today) : null), [today]);
  const ekadashi = useMemo(() => (today ? nextOf(["Ekadashi"], today) : null), [today]);
  const cd = useCountdown(festival?.date ?? null);

  const shown = photos.length ? photos : [FALLBACK_DARSHAN];
  const main = shown[Math.min(active, shown.length - 1)];

  const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(`${iso}T12:00:00+05:30`).toLocaleDateString("en-IN", { ...opts, timeZone: "Asia/Kolkata" });

  return (
    <section className="relative z-10 pb-6 md:pb-10">
      <div className="vk-container">
        <Reveal>
          <div className="grid overflow-hidden rounded-3xl border border-vk-100 bg-white shadow-[0_30px_60px_-36px_rgba(10,18,51,0.45)] lg:grid-cols-[1.05fr_1.25fr_0.9fr]">
            {/* ── Today's darshan ─────────────────────────────── */}
            <div className="relative p-3 md:p-4">
              <button
                type="button"
                onClick={() => photos.length && setLightbox(active)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-vk-100"
                aria-label="Open today's darshan photo"
              >
                <Image
                  src={main}
                  alt="Today's darshan of Sri Sri Radha Madan Mohan"
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vk-900/80 via-transparent to-transparent" />
                <div className="absolute left-3 top-3">
                  <span className="vk-pill !bg-white/95 !text-vk-800 shadow">
                    <Sparkles className="h-3.5 w-3.5" /> Today&apos;s Darshan
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
                      aria-label={`Show darshan photo ${i + 1}`}
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

            {/* ── Next festival ──────────────────────────────── */}
            <div className="flex flex-col justify-center gap-4 border-t border-vk-100 p-5 md:p-7 lg:border-l lg:border-t-0">
              <h2 className="vk-bar-title text-xl text-ink md:text-2xl">Upcoming Festival</h2>
              {festival ? (
                <div className="flex items-start gap-4">
                  <div className="w-[76px] shrink-0 overflow-hidden rounded-2xl border border-vk-100 text-center shadow-sm">
                    <div className="bg-vk-700 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      {fmt(festival.date, { month: "short" })}
                    </div>
                    <div className="py-1.5 text-3xl font-extrabold leading-none text-ink" style={{ fontFamily: "var(--font-heading)" }}>
                      {fmt(festival.date, { day: "numeric" })}
                    </div>
                    <div className="pb-1.5 text-[10px] font-semibold uppercase text-ink/50">
                      {fmt(festival.date, { weekday: "short" })}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold leading-snug text-ink" style={{ fontFamily: "var(--font-heading)" }}>
                      {festival.title}
                    </p>
                    {festival.description && (
                      <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{festival.description}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">See the Vaishnava calendar for upcoming celebrations.</p>
              )}

              {ekadashi && (
                <div className="flex items-center gap-3 rounded-2xl bg-vk-50 px-4 py-3">
                  <span className="vk-icon-chip !h-9 !w-9 !bg-white">
                    <Moon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold text-ink">Next Ekadashi · {fmt(ekadashi.date, { day: "numeric", month: "short" })}</p>
                    <p className="truncate text-muted-foreground">{ekadashi.title}</p>
                  </div>
                  <Link href="/ekadashi" className="ml-auto shrink-0 text-sm font-semibold text-vk-600 hover:text-vk-800">
                    Seva →
                  </Link>
                </div>
              )}

              <Link href="/vaishnav-calendar" className="vk-btn-outline self-start">
                <CalendarDays className="h-4 w-4" />
                Vaishnava Calendar
              </Link>
            </div>

            {/* ── Countdown tiles ────────────────────────────── */}
            <div className="grid grid-cols-4 gap-2.5 border-t border-vk-100 bg-gradient-to-br from-vk-50 to-white p-4 md:p-6 lg:grid-cols-2 lg:content-center lg:gap-3 lg:border-l lg:border-t-0">
              {[
                { v: cd?.days, l: "Days" },
                { v: cd?.hours, l: "Hours" },
                { v: cd?.minutes, l: "Minutes" },
                { v: cd?.seconds, l: "Seconds" },
              ].map((t) => (
                <div key={t.l} className="rounded-2xl border border-vk-100 bg-white px-2 py-3 text-center shadow-sm md:py-4">
                  <p
                    className="text-2xl font-extrabold tabular-nums text-vk-700 md:text-[2rem]"
                    style={{ fontFamily: "var(--font-heading)" }}
                    suppressHydrationWarning
                  >
                    {t.v === undefined ? "–" : String(t.v).padStart(2, "0")}
                  </p>
                  <p className="mt-1 border-t border-vk-100 pt-1 text-[11px] font-medium text-ink/60 md:text-xs">{t.l}</p>
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
          aria-label="Darshan photo"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-vk-900/95 p-4"
          onClick={() => setLightbox(null)}
        >
          <button type="button" aria-label="Close" className="absolute right-5 top-5 text-white/80 hover:text-white" onClick={() => setLightbox(null)}>
            <X className="h-8 w-8" />
          </button>
          {lightbox > 0 && (
            <button
              type="button"
              aria-label="Previous photo"
              className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:left-8"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}
          {lightbox < photos.length - 1 && (
            <button
              type="button"
              aria-label="Next photo"
              className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:right-8"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
          <div className="relative h-[82vh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[lightbox]} alt="Darshan" fill sizes="92vw" className="object-contain" />
          </div>
          <Link
            href="/gallery"
            className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-vk-800"
            onClick={(e) => e.stopPropagation()}
          >
            Full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
