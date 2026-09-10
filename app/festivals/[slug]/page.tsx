import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Clock, MapPin, Quote, Star } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
import FestivalGallery from "@/components/festival/FestivalGallery";
import {
  fetchFestivalShowcase,
  festivalStatusLabel,
  type FestivalShowcase,
} from "@/lib/festivalShowcase";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = await fetchFestivalShowcase(slug);
  if (!f) return { title: "Festival not found" };
  return {
    title: f.title,
    description: f.subtitle || f.description,
    openGraph: {
      title: f.title,
      description: f.subtitle || f.description,
      images: f.heroImage
        ? [{ url: f.heroImage }]
        : undefined,
    },
  };
}

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

const fmtLong = (s?: string) => {
  const d = s ? new Date(s) : null;
  return d && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
};

const ctaOf = (f: FestivalShowcase) => ({
  label: f.ctaLabel || "Donate / Offer Seva",
  href: f.ctaHref || "/donate",
});

function Stars({ rating }: { rating?: number }) {
  const r = Math.max(1, Math.min(5, Number(rating) || 5));
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= r ? "fill-gold text-gold" : "text-border"
          }`}
        />
      ))}
    </div>
  );
}

const initialsOf = (name?: string) =>
  (name || "D")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default async function FestivalShowcasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const f = await fetchFestivalShowcase(slug);
  if (!f) notFound();

  const cta = ctaOf(f);
  const hero = f.heroImage || f.cardImage;
  const hasSchedule = !!f.schedule?.length;
  const hasDetails = !!f.details?.length;
  const hasGallery = !!f.gallery?.length;
  const hasTestimonials = !!f.testimonials?.length;

  return (
    <PageLayout>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[62vh] items-center justify-center overflow-hidden pt-[88px] md:pt-[104px]">
        {hero && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero}
            alt={f.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,90%,16%)/85] via-[hsl(220,90%,20%)/70] to-[hsl(220,90%,16%)/92]" />

        <div className="relative z-10 container mx-auto px-4 py-16 text-center text-white md:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            {f.subtitle || `Festival • ${festivalStatusLabel[f.status || ""] || ""}`}
          </p>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight drop-shadow-lg md:text-6xl">
            {f.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[13.5px] text-white/85">
            {f.eventDate && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <CalendarDays className="h-4 w-4 text-gold" />
                {fmtLong(f.eventDate)}
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-gold" />
              {f.location || "Temple Premises"}
            </span>
            {f.status && (
              <span className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                {festivalStatusLabel[f.status] || f.status}
              </span>
            )}
          </div>
          {f.description && (
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/80">
              {f.description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/festival"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              All Festivals
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recap details (used once the festival has happened) ──── */}
      {hasDetails && (
        <section className="bg-white py-16 dark:bg-background md:py-20">
          <div className="container mx-auto px-4">
            <SectionHead
              eyebrow="Festival Recap"
              title="A Divine Celebration"
              sub="Photos and memories from this year's festival at Hare Krishna Movement Vizag."
            />
            <div className="mx-auto max-w-5xl space-y-12">
              {f.details?.map((section, i) => (
                <div
                  key={i}
                  className={`grid items-center gap-7 md:grid-cols-12 ${
                    i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {section.image && (
                    <div className="md:col-span-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={section.image}
                        alt={section.heading || `Recap photo ${i + 1}`}
                        loading="lazy"
                        className="aspect-[16/10] w-full rounded-3xl border border-border object-cover shadow-warm"
                      />
                    </div>
                  )}
                  <div className={`${section.image ? "md:col-span-6" : "md:col-span-12 text-center"}`}>
                    <h3 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
                      {section.heading}
                    </h3>
                    <div className="mt-3 h-1 w-14 rounded-full bg-gradient-gold" />
                    <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">
                      {section.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Schedule ─────────────────────────────────────────────── */}
      {hasSchedule && (
        <section className="bg-[hsl(220,30%,97%)] py-16 dark:bg-background md:py-20">
          <div className="container mx-auto px-4">
            <SectionHead
              eyebrow="Program Timings"
              title="Event Schedule"
              sub="The order of programs through the festival day."
            />
            <div className="mx-auto max-w-3xl">
              <ol className="relative space-y-6 border-l-2 border-primary/20 pl-8">
                {f.schedule?.map((item, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                      <Clock className="h-3.5 w-3.5" />
                    </span>
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-warm transition-shadow hover:shadow-elevated">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {item.start && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                            <Clock className="h-3.5 w-3.5" />
                            {item.start}
                          </span>
                        )}
                      </div>
                      {item.title && (
                        <h4 className="mt-2.5 font-heading text-[17px] font-bold text-foreground">
                          {item.title}
                        </h4>
                      )}
                      {item.description && (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ──────────────────────────────────────────────── */}
      {hasGallery && (
        <section className="bg-white py-16 dark:bg-background md:py-20">
          <div className="container mx-auto px-4">
            <SectionHead
              eyebrow="Photo Gallery"
              title="Moments from the Festival"
              sub="Glimpses of the devotion, decoration and celebrations."
            />
            <div className="mx-auto max-w-5xl">
              <FestivalGallery images={f.gallery || []} />
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────────────────── */}
      {hasTestimonials && (
        <section className="bg-[hsl(220,30%,97%)] py-16 dark:bg-background md:py-20">
          <div className="container mx-auto px-4">
            <SectionHead
              eyebrow="Devotee Word"
              title="Reviews & Testimonials"
              sub="What devotees and visitors say about the festival."
            />
            <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {f.testimonials?.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col rounded-[22px] border border-border bg-card p-6 shadow-warm"
                >
                  <Quote className="mb-3 h-6 w-6 text-primary/40" />
                  <p className="flex-1 text-sm italic leading-relaxed text-muted-foreground">
                    “{t.message}”
                  </p>
                  {t.rating ? (
                    <div className="mt-4">
                      <Stars rating={t.rating} />
                    </div>
                  ) : null}
                  <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                    {t.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.avatar}
                        alt={t.name || "Devotee"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">
                        {initialsOf(t.name)}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-bold leading-tight text-foreground">{t.name}</p>
                      {t.role && (
                        <p className="text-[11.5px] text-muted-foreground">{t.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-navy py-16 text-white md:py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <Ornament className="mb-5" />
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
            Join the Celebration of {f.title}
          </h2>
          <p className="mt-3 leading-relaxed text-white/75">
            Your seva makes the festival grand. Offer your contribution today and be part of the
            divine pastimes.
          </p>
          <a
            href={cta.href}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5"
          >
            {cta.label}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </PageLayout>
  );
}