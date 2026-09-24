"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight, Sparkles } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
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

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-10 text-center md:mb-12">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <Ornament className="mb-4" />
      <h2 className="font-heading text-[27px] font-extrabold tracking-tight text-foreground md:text-[34px]">
        {title}
      </h2>
      {sub && (
        <p className="mx-auto mt-2.5 max-w-xl text-sm text-muted-foreground md:text-[15px]">
          {sub}
        </p>
      )}
    </div>
  );
}

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
      <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gold shadow-md">
        Upcoming
      </span>
    );
  }
  if (featured) {
    return (
      <span className="rounded-full bg-accent/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary shadow-md">
        Grand Celebration
      </span>
    );
  }
  return (
    <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary shadow-md">
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
      {/* ── Hero — full-bleed banner like every other page (title baked in) ── */}
      {/* Tapping it glides down to the festivals below. */}
      <section
        className="relative w-full cursor-pointer overflow-hidden rounded-b-3xl pt-[88px] md:pt-[104px]"
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
      </section>

      {/* ── Featured festivals ─────────────────────────────────────── */}
      {!loading && spotlights.length > 0 && (
        <section
          id="festival-spotlight"
          ref={spotlightRef}
          className="scroll-mt-[88px] bg-white py-14 dark:bg-background md:scroll-mt-[104px] md:py-16"
        >
          <div className="container mx-auto px-4">
            <SectionHead
              eyebrow="Spotlight"
              title={spotlights.length > 1 ? "Featured Festivals" : "Featured Festival"}
            />

            <div className="mx-auto max-w-6xl space-y-8">
              {spotlights.map((featured) => {
                const featuredUpcoming =
                  featured.status === "upcoming" &&
                  !!featured.eventDate &&
                  asDate(featured.eventDate)! > new Date();
                return (
                  <div
                    key={elementId(featured)}
                    className="relative mx-auto grid overflow-hidden rounded-3xl bg-gradient-navy shadow-elevated md:grid-cols-12"
                  >
                    <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

                    <div className="relative min-h-[220px] md:col-span-5 md:min-h-[380px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageOf(featured)}
                        alt={featured.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,90%,18%)] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[hsl(220,90%,18%)]" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-center gap-3.5 p-7 text-white md:col-span-7 md:p-11">
                      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
                        {featured.subtitle || (featured.featured ? "Featured Festival" : "Festival")}
                      </span>
                      <h3 className="font-heading text-2xl font-extrabold leading-tight tracking-tight md:text-[34px]">
                        {featured.title}
                      </h3>
                      <div className="flex flex-col gap-2 text-[13.5px] text-white/85 sm:flex-row sm:flex-wrap sm:gap-5">
                        {asDate(featured.eventDate) && (
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {fmtLong(featured.eventDate)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {featured.location || DEFAULT_FESTIVAL_LOCATION}
                        </span>
                      </div>
                      {featured.description && (
                        <p className="line-clamp-3 text-sm leading-relaxed text-white/80">
                          {featured.description}
                        </p>
                      )}
                      {featuredUpcoming && (
                        <div className="mt-1 space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                            Celebrating in
                          </span>
                          <Countdown targetDate={featured.eventDate!} />
                        </div>
                      )}
                      <div className="mt-1 flex flex-wrap gap-2">
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
                      <div className="mt-2 flex flex-wrap gap-3">
                        <CTALink
                          href={hrefOf(featured)}
                          className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5"
                        >
                          Explore Festival
                          <ArrowRight className="h-4 w-4" />
                        </CTALink>
                        {donateOn(featured) && (
                          <a
                            href={featured.ctaHref}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-transform hover:-translate-y-0.5 hover:bg-white/20"
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
        className="scroll-mt-[88px] bg-white pb-14 pt-4 dark:bg-background md:scroll-mt-[104px] md:pb-16"
      >
        <div className="container mx-auto px-4">
          <SectionHead
            eyebrow="Festival Archive"
            title="All Festivals"
            sub="What's coming up next, and every grand celebration we've had so far."
          />

          {loading && (
            <p className="py-10 text-center text-muted-foreground">Loading festivals…</p>
          )}

          {!loading && festivals.length === 0 && (
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center">
              <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Festivals coming soon
              </h3>
              <p className="text-sm text-muted-foreground">
                Our team is adding the upcoming festival line-up. Please check back shortly.
              </p>
            </div>
          )}

          {!loading && upcomingGrid.length > 0 && (
            <div className="mx-auto max-w-6xl">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-4 w-4" /> Upcoming Festivals
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {upcomingGrid.map((f, i) => festivalCard(f, i))}
              </div>
            </div>
          )}

          {!loading && pastGrid.length > 0 && (
            <div className={`mx-auto max-w-6xl ${upcomingGrid.length > 0 ? "mt-12" : ""}`}>
              <h3 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <CalendarDays className="h-4 w-4" /> Completed Festivals
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {pastGrid.map((f, i) => festivalCard(f, i))}
              </div>
            </div>
          )}
        </div>
      </section>

      <WhatsAppCommunityCTA />
    </PageLayout>
  );
}

/* eslint-disable @next/next/no-img-element */
function festivalCard(f: FestivalCardItem, i: number) {
  const d = asDate(f.eventDate);
  return (
    <motion.div
      key={f._id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(i, 5) * 0.06, duration: 0.45 }}
    >
      <div className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-elevated">
                      <CTALink href={hrefOf(f)} className="relative block aspect-[16/10] overflow-hidden bg-primary/5">
                        <img
                          src={imageOf(f)}
                          alt={f.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                        <div className="absolute left-3 top-3">
                          <StatusChip status={f.status} featured={f.featured} />
                        </div>
                        {d && (
                          <div className="absolute right-3 top-3 rounded-2xl bg-white/95 px-2.5 py-1.5 text-center leading-none shadow-md">
                            <span className="block text-[10px] font-extrabold uppercase tracking-[0.1em] text-gold">
                              {d.toLocaleDateString("en-IN", { month: "short" })}
                            </span>
                            <span className="mt-0.5 block text-lg font-extrabold text-primary">
                              {d.getDate()}
                            </span>
                          </div>
                        )}
                      </CTALink>

                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <CTALink href={hrefOf(f)}>
                          <h3 className="line-clamp-2 min-h-[43px] font-heading text-[16.5px] font-bold leading-snug text-foreground hover:text-primary transition-colors">
                            {f.title}
                          </h3>
                        </CTALink>
                        {f.subtitle && (
                          <p className="text-[11.5px] font-semibold uppercase tracking-wider text-primary/70">
                            {f.subtitle}
                          </p>
                        )}
                        {f.description && (
                          <p className="line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
                            {f.description}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between border-t border-border pt-3.5">
                          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            {f.location || DEFAULT_FESTIVAL_LOCATION}
                          </span>
                          <div className="flex items-center gap-2">
                            {donateOn(f) && (
                              <a
                                href={f.ctaHref}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-gradient-gold px-3 py-1 text-[11px] font-bold text-[hsl(220,60%,12%)] shadow-sm transition-transform hover:-translate-y-0.5"
                              >
                                {f.ctaLabel || "Donate"}
                              </a>
                            )}
                            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </div>
  </motion.div>
  );
}