import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, ChevronRight, Clock, Home, MapPin, Quote, Star } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import FestivalGallery from "@/components/festival/FestivalGallery";
import {
  fetchFestivalShowcase,
  festivalStatusLabel,
  DEFAULT_FESTIVAL_LOCATION,
  type FestivalShowcase,
} from "@/lib/festivalShowcase";
import { pageSeo, stripBrand, clampDescription, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const f = await fetchFestivalShowcase(slug);
  if (!f) return { title: "Festival not found", robots: { index: false, follow: true } };
  return pageSeo({
    title: stripBrand(f.title),
    description: clampDescription(f.subtitle || f.description) || `${f.title} at ISKCON Gambheeram Visakhapatnam.`,
    path: `/festivals/${slug}`,
    image: f.heroImage || undefined,
  });
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
  // Admin toggle: button only renders when enabled AND a link is set.
  on: f.donateEnabled !== false && !!f.ctaHref?.trim(),
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
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Festivals", path: "/festival" },
          { name: f.title, path: `/festivals/${f.slug || ""}` },
        ])}
      />
      <div className="overflow-x-hidden bg-white pt-[var(--header-h)]">
      {/* ── Hero — rounded inset photo card ───────────────────────── */}
      <section className="bg-gradient-to-b from-vk-50 to-white pb-4 pt-4 md:pb-6 md:pt-6">
        <div className="vk-container">
          <div className="relative isolate overflow-hidden rounded-3xl bg-vk-900 shadow-[0_24px_60px_-28px_rgba(10,18,51,0.6)]">
            {hero && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero}
                alt={f.title}
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-vk-900/95 via-vk-900/65 to-vk-900/30" />

            <div className="flex min-h-[420px] flex-col items-center justify-end px-5 pb-10 pt-14 text-center text-white md:min-h-[520px] md:px-10 md:pb-14">
              <nav
                aria-label="Breadcrumb"
                className="mb-5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur md:text-[13px]"
              >
                <Link href="/" className="inline-flex shrink-0 items-center gap-1 transition-colors hover:text-white">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                <Link href="/festival" className="shrink-0 transition-colors hover:text-white">Festivals</Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                <span className="truncate text-white" aria-current="page">{f.title}</span>
              </nav>
              <span className="vk-pill-light mb-3 max-w-full">
                {f.subtitle || `Festival • ${festivalStatusLabel[f.status || ""] || ""}`}
              </span>
              <h1 className="vk-h1 max-w-4xl !text-white">
                {f.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[13.5px] text-white/90">
                {f.eventDate && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                    <CalendarDays className="h-4 w-4 text-vk-300" />
                    {fmtLong(f.eventDate)}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
                  <MapPin className="h-4 w-4 text-vk-300" />
                  {f.location || DEFAULT_FESTIVAL_LOCATION}
                </span>
                {f.status && (
                  <span className="rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    {festivalStatusLabel[f.status] || f.status}
                  </span>
                )}
              </div>
              {f.description && (
                <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/85 md:text-base">
                  {f.description}
                </p>
              )}
              <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
                {cta.on && (
                  <a href={cta.href} className="vk-btn-gold min-h-[44px] px-7">
                    {cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
                <Link href="/festival" className="vk-btn-ghost-light min-h-[44px]">
                  All Festivals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recap details (used once the festival has happened) ──── */}
      {hasDetails && (
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Festival Recap"
              title="A Divine Celebration"
              subtitle="Photos and memories from this year's festival at ISKCON Gambheeram Visakhapatnam."
            />
            <div className="mx-auto max-w-5xl space-y-10 md:space-y-14">
              {f.details?.map((section, i) => (
                <div
                  key={i}
                  className={`grid items-center gap-6 md:grid-cols-12 md:gap-10 ${
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
                        className="aspect-[16/10] w-full rounded-3xl object-cover shadow-card"
                      />
                    </div>
                  )}
                  <div className={`${section.image ? "md:col-span-6" : "md:col-span-12 text-center"}`}>
                    <h3 className={`vk-h3 ${section.image ? "vk-bar-title" : ""}`}>
                      {section.heading}
                    </h3>
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
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Program Timings"
              title="Event Schedule"
              subtitle="The order of programs through the festival day."
            />
            <div className="mx-auto max-w-3xl">
              <ol className="relative space-y-5 border-l-2 border-vk-200 pl-7 md:pl-8">
                {f.schedule?.map((item, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[43px] top-4 flex h-7 w-7 items-center justify-center rounded-full bg-vk-700 text-white shadow-md ring-4 ring-vk-50 md:-left-[47px]">
                      <Clock className="h-3.5 w-3.5" />
                    </span>
                    <div className="vk-card p-5">
                      {item.start && (
                        <span className="vk-pill-soft">
                          <Clock className="h-3.5 w-3.5" />
                          {item.start}
                        </span>
                      )}
                      {item.title && (
                        <h4 className="mt-2.5 text-[17px] font-bold text-ink">
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
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Photo Gallery"
              title="Moments from the Festival"
              subtitle="Glimpses of the devotion, decoration and celebrations."
            />
            <div className="mx-auto max-w-5xl">
              <FestivalGallery images={f.gallery || []} />
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ─────────────────────────────────────────── */}
      {hasTestimonials && (
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading
              align="center"
              eyebrow="Devotee Word"
              title="Reviews & Testimonials"
              subtitle="What devotees and visitors say about the festival."
            />
            <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {f.testimonials?.map((t, i) => (
                <div key={i} className="vk-card flex flex-col p-6">
                  <span className="vk-icon-chip mb-4 h-10 w-10">
                    <Quote className="h-5 w-5" />
                  </span>
                  <p className="flex-1 text-sm italic leading-relaxed text-ink/75">
                    “{t.message}”
                  </p>
                  {t.rating ? (
                    <div className="mt-4">
                      <Stars rating={t.rating} />
                    </div>
                  ) : null}
                  <div className="mt-4 flex items-center gap-3 border-t border-vk-100 pt-4">
                    {t.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.avatar}
                        alt={t.name || "Devotee"}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-vk-100 text-xs font-extrabold text-vk-700">
                        {initialsOf(t.name)}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-bold leading-tight text-ink">{t.name}</p>
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
      {cta.on && (
        <section className="py-10 md:py-16">
          <div className="vk-container">
            <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-vk-600 via-vk-700 to-vk-900 px-6 py-10 text-center text-white md:px-12 md:py-14">
              <div aria-hidden className="absolute -bottom-20 -right-16 -z-10 h-56 w-56 rounded-full bg-white/10" />
              <div aria-hidden className="absolute -left-10 -top-12 -z-10 h-32 w-32 rounded-full bg-white/5" />
              <span className="vk-pill-light mb-4">Offer Seva</span>
              <h2 className="vk-h2 mx-auto max-w-2xl !text-white">
                Join the Celebration of {f.title}
              </h2>
              <p className="mx-auto mt-3 max-w-xl leading-relaxed text-white/80">
                Your seva makes the festival grand. Offer your contribution today and be part of the
                divine pastimes.
              </p>
              <a href={cta.href} className="vk-btn-gold mt-7 min-h-[44px] px-8">
                {cta.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      )}
      </div>
    </PageLayout>
  );
}
