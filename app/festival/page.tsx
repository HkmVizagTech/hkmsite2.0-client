"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight, Sparkles } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import Ornament from "@/components/Ornament";
import WhatsAppCommunityCTA from "@/components/WhatsAppCommunityCTA";
import {
  fetchFestivalShowcases,
  festivalStatusLabel,
  type FestivalShowcase,
} from "@/lib/festivalShowcase";

const FALLBACK_IMAGE = "/assets/gallery-festival-1.jpg";

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

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<FestivalShowcase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchFestivalShowcases().then((list) => {
      if (cancelled) return;
      setFestivals(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = festivals.find((f) => f.featured) || festivals[0];
  const grid = featured ? festivals.filter((f) => f._id !== featured._id) : [];

  return (
    <PageLayout>
      <PageHero
        title="Festivals & Celebrations"
        subtitle="The grand festivals of the year — their pastimes, schedules, galleries and memories"
        breadcrumb="Festivals"
        backgroundImage="/assets/gallery-festival-1.jpg"
      />

      {/* ── Featured festival ─────────────────────────────────────── */}
      {!loading && featured && (
        <section className="bg-white py-14 dark:bg-background md:py-16">
          <div className="container mx-auto px-4">
            <SectionHead eyebrow="Spotlight" title="Today's Grand Celebration" />

            <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-gradient-navy shadow-elevated md:grid-cols-12">
              <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

              <div className="relative min-h-[220px] md:col-span-5 md:min-h-[380px]">
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
                    {featured.location || "Temple Premises"}
                  </span>
                </div>
                {featured.description && (
                  <p className="line-clamp-3 text-sm leading-relaxed text-white/80">
                    {featured.description}
                  </p>
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
                <Link
                  href={`/festivals/${featured.slug}`}
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5"
                >
                  Explore Festival
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Festivals grid ────────────────────────────────────────── */}
      <section className="bg-white pb-14 pt-4 dark:bg-background md:pb-16">
        <div className="container mx-auto px-4">
          <SectionHead
            eyebrow="Festival Archive"
            title="All Festivals"
            sub="From Sri Krishna Janmashtami and Radhashtami to Laksha Deepotsav — relive every grand celebration."
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

          {!loading && grid.length > 0 && (
            <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {grid.map((f, i) => {
                const d = asDate(f.eventDate);
                return (
                  <motion.div
                    key={f._id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: Math.min(i, 5) * 0.06, duration: 0.45 }}
                  >
                    <Link
                      href={`/festivals/${f.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-elevated"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-primary/5">
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
                      </div>

                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <h3 className="line-clamp-2 min-h-[43px] font-heading text-[16.5px] font-bold leading-snug text-foreground">
                          {f.title}
                        </h3>
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
                            {f.location || "Temple Premises"}
                          </span>
                          <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <WhatsAppCommunityCTA />
    </PageLayout>
  );
}