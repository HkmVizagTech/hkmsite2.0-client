"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight, Sparkles } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import WhatsAppCommunityCTA from "@/components/WhatsAppCommunityCTA";
import {
  fetchFestivalShowcases,
  festivalStatusLabel,
  DEFAULT_FESTIVAL_LOCATION,
  FESTIVAL_PAGE_BANNER,
  type FestivalShowcase,
} from "@/lib/festivalShowcase";
import {
  getFallbackFestivals,
  mergeFestivalCards,
  type FestivalCardItem,
} from "@/lib/festivalFallback";

const FALLBACK_IMAGE = "/assets/gallery-festival-1.jpg";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const asDate = (s?: string) => {
  if (!s) return null;
  const d = new Date(s.length === 10 ? `${s}T00:00:00` : s);
  return Number.isNaN(d.getTime()) ? null : d;
};

const fmtLong = (s?: string) => {
  const d = asDate(s);
  return d
    ? d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
};

const imageOf = (f: FestivalShowcase) =>
  f.cardImage || f.heroImage || FALLBACK_IMAGE;

// Where a festival card points. Priority:
//   1. customLink from the admin (root-relative "/govardhan" or a full URL)
//   2. href carried by calendar fallback items (a real festival page)
//   3. the admin showcase's own /festivals/<slug> page
const hrefOf = (f: FestivalCardItem) => f.customLink?.trim() || f.href || `/festivals/${f.slug}`;

// Admin donate CTA is opt-in: shown only when the flagship switch is on AND a
// link exists. Old records without the field stay enabled (backward compatible).
const donateOn = (f: FestivalCardItem) => f.donateEnabled !== false && !!f.ctaHref?.trim();

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

// Next <Link> for same-site paths (keeps SPA navigation) and a normal anchor
// (new tab) for administrator-supplied absolute URLs.
function CTALink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function StatusChip({ status, featured }: { status?: string; featured?: boolean }) {
  if (status === "upcoming") {
    return (
      <span className="rounded-full bg-vk-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
        Upcoming
      </span>
    );
  }
  if (featured) {
    return (
      <span className="rounded-full bg-vk-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
        Grand Celebration
      </span>
    );
  }
  return (
    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-vk-700 shadow-md">
      {festivalStatusLabel[status || ""] || "Annual"}
    </span>
  );
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [left, setLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = asDate(targetDate)!.getTime() - Date.now();
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
    <div className="flex items-center gap-2.5">
      {[
        [left.days, "Days"],
        [left.hours, "Hrs"],
        [left.mins, "Min"],
        [left.secs, "Sec"],
      ].map(([val, label]) => (
        <span
          key={label as string}
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-center backdrop-blur-sm"
        >
          <span className="block text-lg font-extrabold leading-none text-white tabular-nums">
            {String(val).padStart(2, "0")}
          </span>
          <span className="mt-1 block text-[9px] uppercase tracking-[0.12em] text-white/65">
            {label as string}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<FestivalCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState(FESTIVAL_PAGE_BANNER);
  const [hasAdminHighlight, setHasAdminHighlight] = useState(false);
  const spotlightRef = useRef<HTMLElement | null>(null);
  const autoScrolled = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetchFestivalShowcases().then((list) => {
      if (cancelled) return;
      setFestivals(
        mergeFestivalCards(
          list,
          getFallbackFestivals()
        )
      );
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Can only tell an admin-featured festival apart from the calendar fallback
  // auto-spotlight from the raw admin list, before it is merged.
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const isSpotlightEligible = (f: FestivalCardItem) =>
    f.featured &&
    f.status !== "completed" &&
    (!asDate(f.eventDate) || asDate(f.eventDate)! >= todayStart);

  useEffect(() => {
    let cancelled = false;
    fetchFestivalShowcases().then((list) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const adminHighlighted = list.some(
        (f) =>
          f.featured &&
          f.status !== "completed" &&
          (!asDate(f.eventDate) || asDate(f.eventDate)! >= today)
      );
      if (!cancelled) setHasAdminHighlight(adminHighlighted);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // If a festival is genuinely highlighted (admin-featured & still upcoming),
  // glide down to the spotlight once the cards are ready. No highlighted
  // festival → stay at the top and just let the banner speak.
  useEffect(() => {
    if (loading || autoScrolled.current) return;
    autoScrolled.current = true;
    if (!hasAdminHighlight) return;
    const t = setTimeout(() => {
      spotlightRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(t);
  }, [loading, hasAdminHighlight]);

  // Hero banners come from site-content (Admin → Content → Festivals) so they
  // can be swapped without a deploy; falls back to the bundled defaults.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/site-content`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const f = data?.content?.festival;
        if (!f) return;
        setBanners((prev) => ({
          desktop: f.bannerDesktop || prev.desktop,
          mobile: f.bannerMobile || prev.mobile,
        }));
      } catch {
        /* server offline — keep defaults */
      }
    })();
  }, []);

  const elementId = (f: FestivalCardItem) => f._id || f.slug;

  // Featured festivals keep their own admin-set order (featuredOrder asc, then
  // soonest first). A festival whose date has already passed never appears in
  // the spotlight, even if it is still marked as featured.
  const byDate = (a: FestivalCardItem, b: FestivalCardItem) =>
    (asDate(a.eventDate)?.getTime() || 0) - (asDate(b.eventDate)?.getTime() || 0);
  const featuredList = festivals
    .filter(isSpotlightEligible)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0) || byDate(a, b));

  // When the admin hasn't featured anything yet, spotlight the next upcoming
  // festival so the hero never renders an empty state.
  const fallbackSpotlight =
    festivals.find(
      (f) =>
        f.status !== "completed" &&
        !!asDate(f.eventDate) &&
        asDate(f.eventDate)! >= todayStart
    ) || festivals[0];
  const spotlights = featuredList.length
    ? featuredList
    : fallbackSpotlight
      ? [fallbackSpotlight]
      : [];

  // Everything except the spotlight cards, split into what's still ahead vs
  // what has already been celebrated. Upcoming festivals lead the page in
  // date order (soonest first); past ones sit beneath, most recent first,
  // as a browsable archive instead of last-year's dates appearing on top.
  const spotlightIds = new Set(spotlights.map(elementId));
  const rest = festivals.filter((f) => !spotlightIds.has(elementId(f)));
  const upcomingGrid = rest
    .filter((f) => asDate(f.eventDate) && asDate(f.eventDate)! >= todayStart)
    .sort(byDate);
  const pastGrid = rest
    .filter((f) => !asDate(f.eventDate) || asDate(f.eventDate)! < todayStart)
    .sort((a, b) => byDate(b, a));

  return (
    <PageLayout>
      <div className="overflow-x-hidden bg-white pt-[var(--header-h)]">
      {/* ── Hero — admin banner (title baked in) in a rounded inset card ── */}
      {/* Tapping it glides down to the festivals below. */}
      <section className="bg-gradient-to-b from-vk-50 to-white pb-4 pt-4 md:pb-6 md:pt-6">
        <div className="vk-container">
          <div
            className="relative w-full cursor-pointer overflow-hidden rounded-3xl bg-vk-100 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vk-500 focus-visible:ring-offset-2"
            onClick={() =>
              document
                .getElementById("festivals-sections")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document
                  .getElementById("festivals-sections")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            aria-label="Scroll to festivals below"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banners.mobile}
              alt="Festivals & Celebrations"
              className="block h-auto w-full md:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banners.desktop}
              alt="Festivals & Celebrations"
              className="hidden h-auto w-full md:block"
            />
          </div>
        </div>
      </section>

      <h1 className="sr-only">Festivals at ISKCON Gambheeram Visakhapatnam</h1>

      {/* ── Featured festivals ─────────────────────────────────────── */}
      {!loading && spotlights.length > 0 && (
        <section
          id="festival-spotlight"
          ref={spotlightRef}
          className="vk-section scroll-mt-[var(--header-h)]"
        >
          <div className="vk-container">
            <SectionHeading
              eyebrow="Spotlight"
              title={spotlights.length > 1 ? "Featured Festivals" : "Featured Festival"}
            />

            <div className="space-y-6 md:space-y-8">
              {spotlights.map((featured) => {
                const featuredUpcoming =
                  featured.status === "upcoming" &&
                  !!featured.eventDate &&
                  asDate(featured.eventDate)! > new Date();
                return (
                  <div
                    key={elementId(featured)}
                    className="relative grid overflow-hidden rounded-3xl bg-gradient-to-br from-vk-800 via-vk-700 to-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)] md:grid-cols-12"
                  >
                    <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-vk-500/30 blur-3xl" />

                    <div className="relative min-h-[220px] md:col-span-5 md:min-h-[380px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageOf(featured)}
                        alt={featured.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-vk-900/85 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-vk-800/90" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-center gap-4 p-6 text-white md:col-span-7 md:p-10">
                      <span className="vk-pill-light w-fit max-w-full">
                        {featured.subtitle || (featured.featured ? "Featured Festival" : "Festival")}
                      </span>
                      <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-white md:text-[2.1rem]">
                        {featured.title}
                      </h3>
                      <div className="flex flex-col gap-2 text-[14px] text-white/85 sm:flex-row sm:flex-wrap sm:gap-5">
                        {asDate(featured.eventDate) && (
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 shrink-0 text-vk-300" />
                            {fmtLong(featured.eventDate)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-vk-300" />
                          {featured.location || DEFAULT_FESTIVAL_LOCATION}
                        </span>
                      </div>
                      {featured.description && (
                        <p className="line-clamp-3 text-sm leading-relaxed text-white/80">
                          {featured.description}
                        </p>
                      )}
                      {featuredUpcoming && (
                        <div className="mt-1 space-y-2">
                          <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-vk-300">
                            Celebrating in
                          </span>
                          <Countdown targetDate={featured.eventDate!} />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {!!featured.gallery?.length && (
                          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/85">
                            {featured.gallery.length} photos
                          </span>
                        )}
                        {!!featured.schedule?.length && (
                          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/85">
                            Event schedule
                          </span>
                        )}
                        {!!featured.testimonials?.length && (
                          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/85">
                            Devotee reviews
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <CTALink
                          href={hrefOf(featured)}
                          className="vk-btn min-h-[44px] bg-white text-vk-800 shadow-lg hover:-translate-y-0.5 hover:bg-vk-50"
                        >
                          Explore Festival
                          <ArrowRight className="h-4 w-4" />
                        </CTALink>
                        {donateOn(featured) && (
                          <a
                            href={featured.ctaHref}
                            target="_blank"
                            rel="noreferrer"
                            className="vk-btn-gold min-h-[44px]"
                          >
                            {featured.ctaLabel || "Donate"}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Festivals grid ────────────────────────────────────────── */}
      <section
        id="festivals-sections"
        className="vk-section vk-band scroll-mt-[var(--header-h)]"
      >
        <div className="vk-container">
          <SectionHeading
            eyebrow="Festival Archive"
            title="All Festivals"
            subtitle="What's coming up next, and every grand celebration we've had so far."
          />

          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((k) => (
                <div key={k} className="vk-card h-[320px] animate-pulse bg-white/70" />
              ))}
              <span className="sr-only">Loading festivals…</span>
            </div>
          )}

          {!loading && festivals.length === 0 && (
            <div className="vk-card mx-auto max-w-md p-8 text-center md:p-10">
              <span className="vk-icon-chip mx-auto mb-4 h-14 w-14 rounded-2xl">
                <Sparkles className="h-7 w-7" />
              </span>
              <h3 className="mb-2 text-lg font-bold text-ink">
                Festivals coming soon
              </h3>
              <p className="text-sm text-muted-foreground">
                Our team is adding the upcoming festival line-up. Please check back shortly.
              </p>
            </div>
          )}

          {!loading && upcomingGrid.length > 0 && (
            <div>
              <h3 className="vk-bar-title mb-5 flex items-center gap-2 text-lg text-ink">
                <Sparkles className="h-4 w-4 text-vk-500" /> Upcoming Festivals
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {upcomingGrid.map((f, i) => festivalCard(f, i))}
              </div>
            </div>
          )}

          {!loading && pastGrid.length > 0 && (
            <div className={upcomingGrid.length > 0 ? "mt-12" : ""}>
              <h3 className="vk-bar-title mb-5 flex items-center gap-2 text-lg text-ink/70">
                <CalendarDays className="h-4 w-4 text-vk-500" /> Completed Festivals
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {pastGrid.map((f, i) => festivalCard(f, i))}
              </div>
            </div>
          )}
        </div>
      </section>

      <WhatsAppCommunityCTA />
      </div>
    </PageLayout>
  );
}

/* eslint-disable @next/next/no-img-element */
function festivalCard(f: FestivalCardItem, i: number) {
  const d = asDate(f.eventDate);
  return (
    <motion.div
      key={f._id}
      className="h-full"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(i, 5) * 0.06, duration: 0.45 }}
    >
      <div className="vk-card vk-card-hover group flex h-full flex-col overflow-hidden">
        <CTALink href={hrefOf(f)} className="relative m-2 mb-0 block aspect-[16/10] overflow-hidden rounded-xl bg-vk-100">
          <img
            src={imageOf(f)}
            alt={f.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vk-900/40 via-transparent to-transparent" />
          <div className="absolute left-3 top-3">
            <StatusChip status={f.status} featured={f.featured} />
          </div>
          {d && (
            <div className="absolute right-3 top-3 min-w-[52px] rounded-2xl bg-white/95 px-2.5 py-1.5 text-center leading-none shadow-md">
              <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-vk-500">
                {d.toLocaleDateString("en-IN", { month: "short" })}
              </span>
              <span className="mt-0.5 block text-lg font-extrabold text-vk-800">
                {d.getDate()}
              </span>
            </div>
          )}
        </CTALink>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <CTALink href={hrefOf(f)}>
            <h3 className="line-clamp-2 text-[17px] font-bold leading-snug text-ink transition-colors hover:text-vk-700 group-hover:text-vk-700">
              {f.title}
            </h3>
          </CTALink>
          {f.subtitle && (
            <p className="text-[11.5px] font-semibold uppercase tracking-wider text-vk-500">
              {f.subtitle}
            </p>
          )}
          {f.description && (
            <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
              {f.description}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-vk-100 pt-3.5">
            <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-vk-500" />
              <span className="truncate">{f.location || DEFAULT_FESTIVAL_LOCATION}</span>
            </span>
            <div className="flex shrink-0 items-center gap-2">
              {donateOn(f) && (
                <a
                  href={f.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="vk-btn-gold min-h-[36px] !px-3 !py-1.5 text-xs"
                >
                  {f.ctaLabel || "Donate"}
                </a>
              )}
              <CTALink
                href={hrefOf(f)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-vk-100 text-vk-700 transition-colors group-hover:bg-vk-700 group-hover:text-white"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">{f.title}</span>
              </CTALink>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
