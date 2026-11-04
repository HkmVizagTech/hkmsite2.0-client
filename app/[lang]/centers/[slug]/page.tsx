import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight, BedDouble, BookOpen, Beef, ChevronRight, Clock, Flower2, Globe, GraduationCap, Heart,
  Home, Landmark, MapPin, Music, Navigation, PartyPopper, Phone, Sparkles, Utensils, type LucideIcon,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { pageSeo, siteKeywords, breadcrumbJsonLd, clampDescription, SITE_URL } from "@/lib/seo";
import { CENTERS, getCenter, type Center } from "@/lib/centers";
import { LOCALES } from "@/lib/i18n/config";

import { localizedFn } from "@/lib/i18n/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => CENTERS.map((c) => ({ lang, slug: c.slug })));
}

export const generateMetadata = localizedFn(async ({ params }: Props): Promise<Metadata> => {
  const c = getCenter((await params).slug);
  if (!c) return {};
  return pageSeo({
    title: `${c.name}: Address, Timings & Deities`,
    description: clampDescription(
      `${c.name} in ${c.city}, ${c.state}. Deities, address, darshan timings and how to reach this Hare Krishna Movement centre.`
    ),
    path: `/centers/${c.slug}`,
    keywords: [`${c.name}`, `Hare Krishna temple ${c.city}`, `ISKCON ${c.city}`, ...siteKeywords],
    image: c.image,
  });
});

/** Exact coordinates when the centre has them, else a name + address search. */
const mapsQuery = (c: Center) => (c.lat != null && c.lng != null ? `${c.lat},${c.lng}` : [c.name, c.address || c.city].join(", "));
const directionsUrl = (c: Center, q: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}${c.placeId ? `&destination_place_id=${c.placeId}` : ""}`;
const mapsEmbed = (q: string) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
const websiteHref = (w: string) => (/^https?:\/\//.test(w) ? w : `https://${w}`);

/** Picks an icon from the wording of a facility ("Gaushala", "Annadana Hall", ...). */
function featureIcon(title: string): LucideIcon {
  const t = title.toLowerCase();
  if (/(chant|kirtan|bhajan|mantap|music)/.test(t)) return Music;
  if (/(anna|prasad|food|dining|restaurant|kitchen|taste)/.test(t)) return Utensils;
  if (/(book|literature|library)/.test(t)) return BookOpen;
  if (/(gau|cow|goshala)/.test(t)) return Beef;
  if (/(guest|stay|accommodation)/.test(t)) return BedDouble;
  if (/(discourse|class|education|learn|gita|youth|school)/.test(t)) return GraduationCap;
  if (/(festival|celebrat)/.test(t)) return PartyPopper;
  if (/(exhibit|museum|heritage|culture|architecture)/.test(t)) return Landmark;
  if (/(garden|flower)/.test(t)) return Flower2;
  if (/(seva|service|volunteer)/.test(t)) return Heart;
  return Sparkles;
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${light ? "text-gold" : "text-vk-600"}`}>
      <span className="h-px w-6 bg-current opacity-70" />
      {children}
    </span>
  );
}

export default async function CenterPage({ params }: Props) {
  const c = getCenter((await params).slug);
  if (!c) notFound();

  const path = `/centers/${c.slug}`;
  const related = CENTERS.filter((x) => x.region === c.region && x.slug !== c.slug).slice(0, 3);
  const q = mapsQuery(c);
  const directions = directionsUrl(c, q);
  const tel = c.phone ? `tel:${c.phone.replace(/[^+\d]/g, "")}` : null;

  const nav = [
    { id: "about", label: "About" },
    ...(c.deities.length ? [{ id: "deities", label: "Deities" }] : []),
    ...(c.features.length ? [{ id: "facilities", label: "Facilities" }] : []),
    { id: "visit", label: "Plan your visit" },
  ];

  const templeJsonLd = {
    "@context": "https://schema.org",
    "@type": "HinduTemple",
    "@id": `${SITE_URL}${path}#temple`,
    name: c.name,
    description: c.overview[0],
    url: `${SITE_URL}${path}`,
    image: `${SITE_URL}${c.image}`,
    ...(c.address ? { address: { "@type": "PostalAddress", streetAddress: c.address, addressLocality: c.city } } : {}),
    ...(c.lat != null && c.lng != null ? { geo: { "@type": "GeoCoordinates", latitude: c.lat, longitude: c.lng } } : {}),
    ...(c.phone ? { telephone: c.phone } : {}),
    ...(c.website ? { sameAs: [websiteHref(c.website)] } : {}),
  };

  return (
    <PageLayout>
      <JsonLd data={breadcrumbJsonLd([{ name: "Our Centers", path: "/centers" }, { name: c.name, path }])} />
      <JsonLd data={templeJsonLd} />
      <main className="bg-white pt-[var(--header-h)]">
        {/* Hero: illustrated banner (no overlay, the artwork carries the title) when the centre has one, else the photo with a gradient */}
        {c.headerImage ? (
          <section className="bg-gradient-to-b from-vk-50 to-white pb-8 pt-6">
            <div className="vk-container">
              <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs font-medium text-ink/55">
                <Link href="/" className="inline-flex items-center gap-1 hover:text-vk-700">
                  <Home className="h-3.5 w-3.5" /> Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                <Link href="/centers" className="hover:text-vk-700">
                  Our Centers
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                <span className="text-ink" aria-current="page">
                  {c.city}
                </span>
              </nav>
              <div style={{ aspectRatio: c.headerRatio ?? 3 }} className="relative w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-28px_rgba(10,18,51,0.5)] md:rounded-3xl">
                <Image src={c.headerImage} alt={`${c.name} illustration`} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
              </div>
              <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{c.name}</h1>
                  <p className="mt-1.5 flex items-center gap-2 text-ink/65">
                    <MapPin className="h-4 w-4 text-vk-600" /> {c.city}, {c.state}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="vk-btn-primary inline-flex h-11 items-center gap-2 px-5">
                    <Navigation className="h-4 w-4" /> Directions
                  </a>
                  {tel && (
                    <a href={tel} className="inline-flex h-11 items-center gap-2 rounded-full border border-vk-200 bg-white px-5 text-sm font-medium text-vk-700 transition-colors hover:border-vk-400">
                      <Phone className="h-4 w-4" /> Call
                    </a>
                  )}
                  {c.website && (
                    <a
                      href={websiteHref(c.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-vk-200 bg-white px-5 text-sm font-medium text-vk-700 transition-colors hover:border-vk-400"
                    >
                      <Globe className="h-4 w-4" /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
        <section className="bg-gradient-to-b from-vk-50 to-white">
          <div className="relative isolate overflow-hidden bg-vk-900">
            <Image src={c.image} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-vk-900 via-vk-900/55 to-vk-900/20" />
            <div className="vk-container flex min-h-[380px] flex-col justify-between py-8 md:min-h-[460px] md:py-10">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/80">
                <Link href="/" className="inline-flex items-center gap-1 hover:text-white">
                  <Home className="h-3.5 w-3.5" /> Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                <Link href="/centers" className="hover:text-white">
                  Our Centers
                </Link>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                <span className="text-white" aria-current="page">
                  {c.city}
                </span>
              </nav>

              <div className="mt-16 max-w-3xl">
                <Eyebrow light>{c.region}</Eyebrow>
                <h1 className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">{c.name}</h1>
                <p className="mt-3 flex items-center gap-2 text-white/80">
                  <MapPin className="h-4 w-4 text-gold" /> {c.city}, {c.state}
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <a
                    href={directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-vk-800 shadow-sm transition-colors hover:bg-vk-50"
                  >
                    <Navigation className="h-4 w-4" /> Directions
                  </a>
                  {tel && (
                    <a
                      href={tel}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
                    >
                      <Phone className="h-4 w-4" /> Call
                    </a>
                  )}
                  {c.website && (
                    <a
                      href={websiteHref(c.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
                    >
                      <Globe className="h-4 w-4" /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        )}

        {/* Section links: a plain in-flow strip under the hero (not sticky, so nothing floats over the content while scrolling) */}
        <div className="border-b border-vk-100 bg-white">
          <div className="vk-container">
            <ul className="-mx-2 flex gap-1 overflow-x-auto py-3 text-sm font-medium">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="block whitespace-nowrap rounded-full px-4 py-1.5 text-ink/70 transition-colors hover:bg-vk-50 hover:text-vk-700">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* About */}
        <section id="about" className="vk-section scroll-mt-24">
          <div className="vk-container">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-vk-100 shadow-[0_20px_50px_-24px_rgba(10,18,51,0.45)]">
                <Image src={c.image} alt={c.name} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
                <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5" />
              </div>
              <div>
                <Eyebrow>About</Eyebrow>
                <h2 className="vk-h2 mt-3">A Hare Krishna centre in {c.city}</h2>
                <div className="mt-6 space-y-5">
                  {c.overview.map((p, i) => (
                    <p key={i} className={i === 0 ? "text-lg leading-relaxed text-ink/85" : "leading-relaxed text-ink/70"}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {c.address && (
                <div className="rounded-2xl border border-vk-100 bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-vk-50 text-vk-700">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <dt className="mt-3 text-xs text-ink/45">Address</dt>
                  <dd className="mt-1 text-sm leading-snug text-ink/85">{c.address}</dd>
                </div>
              )}
              {c.hours.length > 0 && (
                <div className="rounded-2xl border border-vk-100 bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-vk-50 text-vk-700">
                    <Clock className="h-4 w-4" />
                  </span>
                  <dt className="mt-3 text-xs text-ink/45">Darshan timings</dt>
                  <dd className="mt-1 space-y-0.5 text-sm text-ink/85">
                    {c.hours.map((h) => (
                      <div key={h}>{h}</div>
                    ))}
                  </dd>
                </div>
              )}
              {c.phone && tel && (
                <div className="rounded-2xl border border-vk-100 bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-vk-50 text-vk-700">
                    <Phone className="h-4 w-4" />
                  </span>
                  <dt className="mt-3 text-xs text-ink/45">Phone</dt>
                  <dd className="mt-1 text-sm">
                    <a href={tel} className="text-ink/85 hover:text-vk-700">
                      {c.phone}
                    </a>
                  </dd>
                </div>
              )}
              {c.website && (
                <div className="rounded-2xl border border-vk-100 bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-vk-50 text-vk-700">
                    <Globe className="h-4 w-4" />
                  </span>
                  <dt className="mt-3 text-xs text-ink/45">Website</dt>
                  <dd className="mt-1 truncate text-sm">
                    <a href={websiteHref(c.website)} target="_blank" rel="noopener noreferrer" className="text-ink/85 hover:text-vk-700">
                      {c.website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </section>

        {/* Deities */}
        {c.deities.length > 0 && (
          <section id="deities" className="vk-section scroll-mt-24 bg-vk-900 text-white">
            <div className="vk-container">
              <div className="mx-auto max-w-2xl text-center">
                <Eyebrow light>Darshan</Eyebrow>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">The Deities</h2>
                <p className="mt-3 text-white/65">The sacred forms worshipped at {c.name}.</p>
              </div>
              <ul className="mt-12 flex flex-wrap justify-center gap-6">
                {c.deities.map((d) => (
                  <li key={d.name} className="w-full max-w-sm sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                    <div className="group h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={d.image}
                          alt={d.name}
                          fill
                          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-vk-900/90 via-transparent to-transparent" />
                        <h3 className="absolute inset-x-5 bottom-4 text-lg font-semibold leading-snug">{d.name}</h3>
                      </div>
                      <p className="p-5 text-sm leading-relaxed text-white/70">{d.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Facilities */}
        {c.features.length > 0 && (
          <section id="facilities" className="vk-section scroll-mt-24">
            <div className="vk-container">
              <Eyebrow>Experience</Eyebrow>
              <h2 className="vk-h2 mt-3">Facilities &amp; activities</h2>
              <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {c.features.map((f) => {
                  const Icon = featureIcon(f.title);
                  return (
                    <li key={f.title} className="rounded-2xl border border-vk-100 bg-vk-50/50 p-5 transition-colors hover:border-vk-200 hover:bg-white">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-vk-50 text-vk-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
                      {f.text && <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{f.text}</p>}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* Visit */}
        <section id="visit" className="vk-section scroll-mt-24 bg-vk-50/60">
          <div className="vk-container">
            <Eyebrow>Visit</Eyebrow>
            <h2 className="vk-h2 mt-3">How to reach</h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-vk-100 bg-vk-100 lg:aspect-auto lg:min-h-[360px]">
                <iframe
                  src={mapsEmbed(q)}
                  title={`Map of ${c.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="flex flex-col justify-between rounded-3xl border border-vk-100 bg-white p-6">
                <div>
                  <h3 className="font-semibold text-ink">{c.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{c.address || `${c.city}, ${c.state}`}</p>
                  {c.hours.length > 0 && (
                    <ul className="mt-4 space-y-1 text-sm text-ink/75">
                      {c.hours.map((h) => (
                        <li key={h} className="flex gap-2">
                          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-vk-700" /> {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-6 flex flex-col gap-2.5">
                  <a href={directions} target="_blank" rel="noopener noreferrer" className="vk-btn-primary inline-flex h-11 items-center justify-center gap-2 px-5">
                    <Navigation className="h-4 w-4" /> Get directions
                  </a>
                  {c.website && (
                    <a
                      href={websiteHref(c.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-vk-200 bg-white px-5 text-sm font-medium text-vk-700 transition-colors hover:border-vk-400"
                    >
                      Visit website <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <p className="mt-6 text-xs text-ink/45">Details are compiled from public listings. Please confirm timings with the centre before you travel.</p>
          </div>
        </section>

        {/* More centres */}
        {related.length > 0 && (
          <section className="vk-section">
            <div className="vk-container">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <Eyebrow>Explore</Eyebrow>
                  <h2 className="vk-h2 mt-3">More in {c.region}</h2>
                </div>
                <Link href="/centers" className="shrink-0 text-sm font-medium text-vk-700 hover:underline">
                  All centres
                </Link>
              </div>
              <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/centers/${r.slug}`}
                      className="group block overflow-hidden rounded-2xl border border-vk-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="relative aspect-[16/10] bg-vk-100">
                        <Image src={r.image} alt={r.name} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold leading-snug text-ink">{r.name}</h3>
                        <p className="mt-1 text-sm text-ink/60">
                          {r.city}, {r.state}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </PageLayout>
  );
}
