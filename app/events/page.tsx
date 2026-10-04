"use client";

/* eslint-disable @next/next/no-img-element -- event banners come from admin-supplied hosts. */

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, CalendarDays, Calendar, MapPin, ArrowRight, ExternalLink } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import WhatsAppCommunityCTA from "@/components/WhatsAppCommunityCTA";
import {
  getFallbackImportantDates,
} from "@/lib/eventsFallback";

type ImportantDate = {
  _id: string;
  title: string;
  date: string;
  description?: string;
  type: "Ekadashi" | "Festival" | "Other";
  /** Printed on the tag instead of "Other" (e.g. "Appearance"). */
  label?: string;
  fastNote?: string;
};

type DisplayEvent = {
  _id?: string;
  title: string;
  date: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  location?: string;
  href?: string;
  registrationLink?: string;
  isFallback?: boolean;
};

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") ||
  "http://localhost:3003";

const FALLBACK_IMAGE = "/assets/gallery-festival-2.jpg";

const getEvents = async (): Promise<DisplayEvent[]> => {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.events || []).map((e: any) => ({
      ...e,
      image: (e.images && e.images[0]) || e.image || undefined,
    }));
  } catch {
    return [];
  }
};

const getImportantDates = async (): Promise<ImportantDate[]> => {
  try {
    const res = await fetch(`${API_BASE}/important-dates`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.dates || [];
  } catch {
    return [];
  }
};

/* ─────────────────────────── helpers ─────────────────────────── */

const asDate = (s: string) => new Date(s.length === 10 ? `${s}T00:00:00` : s);

const fmtLong = (s: string) =>
  asDate(s).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** Colour family for a calendar entry — festivals gold, Ekadashis navy. */
const kindOf = (type: ImportantDate["type"]) =>
  type === "Ekadashi" ? "eka" : type === "Festival" ? "fest" : "obs";

const CHIP_STYLES: Record<string, string> = {
  eka: "bg-vk-100 text-vk-700 border-vk-200",
  fest: "bg-vk-700 text-white border-vk-700",
  obs: "bg-white text-ink/70 border-vk-200",
};

const PILL_STYLES: Record<string, string> = {
  eka: "bg-vk-100 text-vk-700",
  fest: "bg-vk-700 text-white",
  obs: "bg-muted text-muted-foreground",
};

/** White month/day badge laid over event imagery. */
function DateBadge({ date, className = "" }: { date: string; className?: string }) {
  const d = asDate(date);
  return (
    <div className={`z-[2] min-w-[52px] rounded-2xl bg-white/95 px-2.5 py-1.5 text-center leading-none shadow-md ${className}`}>
      <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-vk-500">
        {d.toLocaleDateString("en-IN", { month: "short" })}
      </span>
      <span className="mt-0.5 block text-lg font-extrabold text-vk-800">{d.getDate()}</span>
    </div>
  );
}

/* ─────────────────────────── countdown ─────────────────────────── */

function Countdown({ targetDate }: { targetDate: string }) {
  const [left, setLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = asDate(targetDate).getTime() - Date.now();
      if (diff <= 0) return setLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        mins: Math.floor((diff / 60000) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2.5">
      {[
        [left.days, "Days"],
        [left.hours, "Hrs"],
        [left.mins, "Min"],
        [left.secs, "Sec"],
      ].map(([val, label]) => (
        <div
          key={label as string}
          className="w-[62px] rounded-2xl border border-white/20 bg-white/10 py-2.5 text-center backdrop-blur-sm md:w-[66px]"
        >
          <span className="block text-xl font-extrabold leading-none text-white tabular-nums md:text-[22px]">
            {String(val).padStart(2, "0")}
          </span>
          <span className="mt-1.5 block text-[10px] uppercase tracking-[0.12em] text-white/65">
            {label as string}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function EventsPage() {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getEvents(), getImportantDates()]).then(([apiEvents, apiDates]) => {
      if (cancelled) return;

      // Admin-created events always win. Only when there are none do we fall
      // back to the temple's own Vaishnava calendar, so the page never shows
      // an empty "No events found" to a visitor.
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Events are admin-created only. Festivals moved to their own page
      // (/festival), so the events page shows just what the admin publishes —
      // Friendship Day, New Year, drives, etc. — and a friendly empty state
      // until then.
      const upcomingFromApi = apiEvents
        .filter((e) => e.date && asDate(e.date) >= today)
        .sort((a, b) => asDate(a.date).getTime() - asDate(b.date).getTime());

      setEvents(upcomingFromApi);
      setImportantDates(apiDates.length > 0 ? apiDates : getFallbackImportantDates());
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const featured = events[0];
  const rest = events.slice(1);
  const hrefFor = (e: DisplayEvent) => e.href || `/events/${e._id || e.title}`;
  // When the admin linked a separate landing page, clicking the event opens
  // that page (in a new tab) instead of the on-site event detail.
  const externalOf = (e: DisplayEvent) => e.registrationLink?.trim() || "";

  const months = useMemo(() => {
    const groups = new Map<string, ImportantDate[]>();
    for (const item of importantDates) {
      const key = asDate(item.date).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });
      groups.set(key, [...(groups.get(key) || []), item]);
    }
    return Array.from(groups, ([name, items]) => ({
      name,
      short: name.split(" ")[0],
      items: items
        .slice()
        .sort((a, b) => asDate(a.date).getTime() - asDate(b.date).getTime()),
    }));
  }, [importantDates]);

  const current = months[Math.min(activeMonth, Math.max(0, months.length - 1))];

  return (
    <PageLayout>
      <div className="overflow-x-hidden bg-white pt-[var(--header-h)]">
      <PageHero
        title="Upcoming Events"
        subtitle="Events, drives and spiritual gatherings organised by the temple"
        breadcrumb="Events"
        backgroundImage="/assets/gallery-festival-2.jpg"
      />

      {/* ── Next celebration ─────────────────────────────────────── */}
      {!loading && featured && (
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading eyebrow="Coming Up Next" title="The Next Celebration" />

            <div className="relative grid overflow-hidden rounded-3xl bg-gradient-to-br from-vk-800 via-vk-700 to-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)] md:grid-cols-12">
              <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-vk-500/30 blur-3xl" />

              <div className="relative min-h-[220px] md:col-span-5 md:min-h-[380px]">
                <img
                  src={featured.bannerImage || featured.image || FALLBACK_IMAGE}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vk-900/85 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-vk-800/90" />
                <DateBadge date={featured.date} className="absolute left-4 top-4" />
              </div>

              <div className="relative z-10 flex flex-col justify-center gap-4 p-6 text-white md:col-span-7 md:p-10">
                <span className="vk-pill-light w-fit">Next Celebration</span>
                <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-white md:text-[2.1rem]">
                  {featured.title}
                </h3>
                <div className="flex flex-col gap-2 text-[14px] text-white/85 sm:flex-row sm:flex-wrap sm:gap-5">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-vk-300" />
                    {fmtLong(featured.date)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-vk-300" />
                    {featured.location || "Temple Premises"}
                  </span>
                </div>
                {featured.description && (
                  <p className="line-clamp-3 text-sm leading-relaxed text-white/80">
                    {featured.description}
                  </p>
                )}
                <Countdown targetDate={featured.date} />
                {(() => {
                  const external = externalOf(featured);
                  const linkProps = external
                    ? { href: external, target: "_blank" as const, rel: "noreferrer" }
                    : { href: hrefFor(featured) };
                  return (
                    <Link
                      {...linkProps}
                      className="vk-btn mt-1 min-h-[44px] w-full bg-white text-vk-800 shadow-lg hover:-translate-y-0.5 hover:bg-vk-50 sm:w-fit"
                    >
                      {external ? "Register / Visit page" : "View Details"}
                      {external ? (
                        <ExternalLink className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Link>
                  );
                })()}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Upcoming events grid ──────────────────────────────── */}
      <section className={`vk-section ${!loading && featured ? "vk-band" : ""}`}>
        <div className="vk-container">
          <SectionHeading
            eyebrow="Upcoming Events"
            title="Temple Events & Drives"
            subtitle="Special events and drives added by the temple — festivals live on their own page."
            action={{ href: "/festival", label: "Festivals" }}
          />

          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading events...">
              {[0, 1, 2].map((k) => (
                <div key={k} className="vk-card h-[320px] animate-pulse bg-vk-50" />
              ))}
              <span className="sr-only">Loading events...</span>
            </div>
          )}

          {!loading && rest.length === 0 && !featured && (
            <div className="vk-card mx-auto max-w-md p-8 text-center md:p-10">
              <span className="vk-icon-chip mx-auto mb-4 h-14 w-14 rounded-2xl">
                <Calendar className="h-7 w-7" />
              </span>
              <h3 className="mb-2 text-lg font-bold text-ink">
                Nothing scheduled right now
              </h3>
              <p className="text-sm text-muted-foreground">
                New events and drives are added regularly.
              </p>
              <Link href="/festival" className="vk-btn-primary mt-6">
                See Festivals <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {!loading && rest.length === 0 && featured && (
            <p className="rounded-2xl border border-dashed border-vk-200 bg-white/70 px-5 py-8 text-center text-sm text-muted-foreground">
              New events and drives are added regularly.
            </p>
          )}

          {!loading && rest.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {rest.map((event, i) => {
                return (
                  <motion.div
                    key={event._id || event.title}
                    className="h-full"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: Math.min(i, 5) * 0.06, duration: 0.45 }}
                  >
                    {(() => {
                      const external = externalOf(event);
                      const cls = "vk-card vk-card-hover group flex h-full flex-col overflow-hidden";
                      const Tag = external ? "a" : (Link as any);
                      return (
                        <Tag
                          href={external || hrefFor(event)}
                          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                          className={cls}
                        >
                      <div className="relative m-2 mb-0 aspect-[16/10] overflow-hidden rounded-xl bg-vk-100">
                        <img
                          src={event.bannerImage || event.image || FALLBACK_IMAGE}
                          alt={event.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-vk-900/40 via-transparent to-transparent" />
                        {external && (
                          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-vk-700 shadow-md">
                            External page
                          </span>
                        )}
                        <DateBadge date={event.date} className="absolute left-3 top-3" />
                      </div>

                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <h3 className="line-clamp-2 text-[17px] font-bold leading-snug text-ink transition-colors group-hover:text-vk-700">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                            {event.description}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between gap-3 border-t border-vk-100 pt-3.5">
                          <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-vk-500" />
                            <span className="truncate">{event.location || "Temple Premises"}</span>
                          </span>
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vk-100 text-vk-700 transition-colors group-hover:bg-vk-700 group-hover:text-white">
                            {external ? (
                              <ExternalLink className="h-4 w-4" />
                            ) : (
                              <ArrowRight className="h-4 w-4" />
                            )}
                          </span>
                        </div>
                      </div>
                        </Tag>
                      );
                    })()}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Important dates ──────────────────────────────────────── */}
      {months.length > 0 && current && (
        <section className={`vk-section ${!loading && featured ? "" : "vk-band"}`}>
          <div className="vk-container">
            <SectionHeading
              eyebrow="Vaishnava Calendar"
              title="Important Dates & Ekadashis"
              subtitle="Ekadashis, festivals and observance days for the months ahead."
            />

            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
              {/* month tabs — scroller on mobile, stacked list on desktop */}
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
                {months.map((m, i) => {
                  const on = m.name === current.name;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setActiveMonth(i)}
                      className={`inline-flex min-h-[44px] shrink-0 items-center justify-between gap-3 rounded-full border px-5 text-sm font-semibold transition-colors lg:rounded-xl ${
                        on
                          ? "border-vk-700 bg-vk-700 text-white shadow-[0_6px_16px_-6px_rgba(30,58,138,0.55)]"
                          : "border-vk-200 bg-white text-ink/70 hover:border-vk-700 hover:text-vk-700"
                      }`}
                    >
                      <span>
                        <span className="lg:hidden">{m.short}</span>
                        <span className="hidden lg:inline">{m.name}</span>
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          on ? "bg-white/20 text-white" : "bg-vk-100 text-vk-700"
                        }`}
                      >
                        {m.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* rows */}
              <div className="vk-card overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-vk-100 bg-vk-50 px-4 py-3 md:px-6">
                  <h3 className="vk-bar-title text-base text-ink">{current.name}</h3>
                </div>
                <ul>
                  {current.items.map((item) => {
                    const d = asDate(item.date);
                    const kind = kindOf(item.type);
                    const tag = item.label || item.type;
                    // "Appearance of Srila Jiva Goswami" + an APPEARANCE tag is noise.
                    const showTag = !item.title.toLowerCase().startsWith(tag.toLowerCase());
                    return (
                      <li
                        key={item._id}
                        className="flex gap-4 border-b border-vk-100 p-4 transition-colors last:border-0 hover:bg-vk-50/60 md:gap-5 md:px-6 md:py-5"
                      >
                        <div
                          className={`w-14 shrink-0 rounded-2xl border py-2.5 text-center leading-none ${CHIP_STYLES[kind]}`}
                        >
                          <span className="block text-xl font-extrabold">{d.getDate()}</span>
                          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider opacity-80">
                            {d.toLocaleDateString("en-IN", { weekday: "short" })}
                          </span>
                        </div>

                        <div className="min-w-0 pt-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-[15px] font-semibold leading-snug text-ink">
                              {item.title}
                            </h4>
                            {showTag && (
                              <span
                                className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PILL_STYLES[kind]}`}
                              >
                                {tag}
                              </span>
                            )}
                            {item.fastNote && (
                              <span className="whitespace-nowrap rounded-full bg-vk-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vk-500 ring-1 ring-vk-200">
                                {item.fastNote}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="mt-7 text-center">
              <Link href="/vaishnav-calendar" className="vk-btn-outline min-h-[44px]">
                <CalendarDays className="h-4 w-4" />
                See the Full Year Calendar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Stay updated ─────────────────────────────────────────── */}
      <section className="vk-section">
        <div className="vk-container">
          <div className="vk-card mx-auto max-w-3xl px-6 py-10 text-center md:px-12">
            <span className="vk-icon-chip mx-auto mb-5 h-14 w-14 rounded-2xl">
              <Bell className="h-7 w-7" />
            </span>
            <h2 className="vk-h2 mb-3">Never Miss a Festival</h2>
            <p className="vk-lead mx-auto mb-7 max-w-xl">
              Follow our social channels to stay updated on festivals, special darshan timings,
              and spiritual events at Hare Krishna Movement Vizag.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="https://www.youtube.com/@harekrishnavizag"
                target="_blank"
                rel="noopener noreferrer"
                className="vk-btn-primary min-h-[44px]"
              >
                Subscribe on YouTube
              </a>
              <a
                href="https://www.facebook.com/harekrishnavizag"
                target="_blank"
                rel="noopener noreferrer"
                className="vk-btn-outline min-h-[44px]"
              >
                Follow on Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppCommunityCTA />
      </div>
    </PageLayout>
  );
}
