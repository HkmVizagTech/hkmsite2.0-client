import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Landmark, Telescope, Utensils, PartyPopper, Flower2, Baby, BookOpen, ArrowRight, MapPin, Clock } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { pageSeo, siteKeywords, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { getT } from "@/lib/i18n/server";
import { TEMPLE, DARSHAN_HOURS } from "@/lib/templeInfo";

// "Hare Krishna Vaikuntham" — the temple & cultural centre being built at
// Gambheeram, Visakhapatnam. Targets "Vaikuntham temple Vizag", "Hare Krishna
// Vaikuntham", "Vaikuntham Visakhapatnam". Facts mirror the construction
// campaign pages (components/sqft-campaign/TempleFeaturesSection.tsx).

const PATH = "/vaikuntham";
const INTRO_VIDEO_ID = "IJTMCgGBriw";

export const metadata: Metadata = pageSeo({
  title: "Hare Krishna Vaikuntham Temple, Visakhapatnam",
  description:
    "Hare Krishna Vaikuntham — the new Sri Srinivasa Govinda temple & cultural centre of ISKCON Gambheeram, IIM Road, Vizag. What's being built and darshan today.",
  path: PATH,
  keywords: [
    "Vaikuntham",
    "Hare Krishna Vaikuntham",
    "Vaikuntham temple Vizag",
    "Vaikuntham temple Visakhapatnam",
    "Hare Krishna Vaikuntham Cultural Centre",
    "Srinivasa Govinda temple Vizag",
    "new ISKCON temple Visakhapatnam",
    "temple construction Vizag",
    ...siteKeywords,
  ],
  image: "/assets/home-temple-construction-banner.webp",
});

const FEATURES = [
  { icon: Landmark, title: "Divine Altar", desc: "A beautifully carved altar where Their Lordships Sri Srinivasa Govinda will eternally reside." },
  { icon: Telescope, title: "Vedic Planetarium", desc: "To awaken timeless wisdom through the light of modern technology." },
  { icon: Utensils, title: "Prasadam Hall", desc: "A sacred hall serving Krishna-prasadam to all who come." },
  { icon: PartyPopper, title: "Festival Hall", desc: "A grand space for kirtans, festivals & cultural celebrations." },
  { icon: Flower2, title: "Harinam Mandap", desc: "A serene space for chanting & meditation." },
  { icon: Baby, title: "Bala Samskriti Program", desc: "Value-based cultural learning for children." },
  { icon: BookOpen, title: "Gita Life Program", desc: "Transforming youth & families with Gita wisdom." },
];

export default async function VaikunthamPage() {
  const t = await getT();

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": ["HinduTemple", "TouristAttraction"],
    "@id": `${SITE_URL}${PATH}#place`,
    name: "Hare Krishna Vaikuntham Temple",
    alternateName: ["Hare Krishna Vaikuntham Cultural Centre", "Vaikuntham Temple, Gambheeram"],
    description:
      "The new temple and cultural centre of ISKCON Gambheeram Visakhapatnam, where Sri Srinivasa Govinda will reside, with a prasadam hall, festival hall, Harinam mandap and programmes for children and youth.",
    url: `${SITE_URL}${PATH}`,
    image: `${SITE_URL}/assets/home-temple-construction-banner.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: TEMPLE.streetAddress,
      addressLocality: TEMPLE.locality,
      addressRegion: TEMPLE.region,
      postalCode: TEMPLE.postalCode,
      addressCountry: TEMPLE.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: TEMPLE.lat, longitude: TEMPLE.lng },
    containedInPlace: { "@type": "City", name: "Visakhapatnam" },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    publicAccess: true,
  };

  return (
    <PageLayout>
      <JsonLd data={breadcrumbJsonLd([{ name: "Vaikuntham", path: PATH }])} />
      <JsonLd data={placeJsonLd} />
      <main className="bg-white pt-[var(--header-h)]">
        <PageHero
          title={t("Hare Krishna Vaikuntham, Visakhapatnam")}
          subtitle={t("A grand new home for Sri Srinivasa Govinda at ISKCON Gambheeram — a temple and cultural centre for all of Vizag.")}
          breadcrumb={t("Vaikuntham")}
          backgroundImage="/assets/home-temple-construction-banner.webp"
          eyebrow={t("The temple being built")}
        />

        <section className="vk-section">
          <div className="vk-container grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="vk-h2">{t("What is Hare Krishna Vaikuntham?")}</h2>
              <p className="vk-lead mt-4">
                {t("Vaikuntha is the eternal spiritual abode of the Lord — literally, the place free from all anxiety. Hare Krishna Vaikuntham is ISKCON Gambheeram's effort to bring that spirit to Visakhapatnam: a grand temple and cultural centre on IIM Road, Gambheeram, where Their Lordships Sri Srinivasa Govinda will eternally reside.")}
              </p>
              <p className="mt-4 text-ink/80">
                {t("Until the new temple opens, daily darshan of Sri Sri Radha Madan Mohan, aartis, kirtan, prasadam and festivals continue on the same campus, as they have since 2008.")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/iskcon-vizag-temple" className="vk-btn-primary inline-flex h-11 items-center gap-2 px-5">
                  <MapPin className="h-4 w-4" /> {t("Plan your visit")}
                </Link>
                <Link href="/sqft-seva-campaign" className="vk-btn-gold inline-flex h-11 items-center gap-2 px-5">
                  {t("Join the construction seva")} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-vk-900">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${INTRO_VIDEO_ID}?rel=0&modestbranding=1`}
                title={t("Hare Krishna Vaikuntham Temple — Introduction")}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </section>

        <section className="vk-section vk-band">
          <div className="vk-container">
            <h2 className="vk-h2 text-center">{t("What's being built")}</h2>
            <p className="vk-lead mx-auto mt-3 max-w-2xl text-center">
              {t("Hare Krishna Vaikuntham is more than a temple — it's a place for worship, learning, prasadam and celebration for every family in Vizag.")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="vk-card flex gap-4 p-5">
                  <span className="vk-icon-chip shrink-0"><f.icon className="h-5 w-5" /></span>
                  <span>
                    <span className="block font-heading font-bold text-ink">{t(f.title)}</span>
                    <span className="mt-1 block text-sm leading-6 text-ink/75">{t(f.desc)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="vk-section">
          <div className="vk-container grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-vk-900">
              <Image src="/assets/vizag-temple-1.jpeg" alt={t("Hare Krishna Vaikuntham temple campus, Gambheeram, Visakhapatnam")} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 className="vk-h2">{t("Visit Vaikuntham today")}</h2>
              <p className="vk-lead mt-4">{t("The campus is open for darshan every day:")}</p>
              <ul className="mt-4 space-y-2">
                {DARSHAN_HOURS.map((h) => (
                  <li key={h.label} className="flex items-center gap-3 text-ink/85">
                    <Clock className="h-4 w-4 text-vk-600" />
                    <span>{t(h.label)}:</span> <strong className="text-ink">{h.display}</strong>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink/75">{t("IIM Road, Gambheeram, Visakhapatnam — opposite the Akshaya Patra Foundation.")}</p>
              <Link href="/iskcon-vizag-temple" className="mt-5 inline-flex items-center gap-1 font-semibold text-vk-700 hover:underline">
                {t("Timings, map and visitor guide")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="vk-section vk-band">
          <div className="vk-container max-w-3xl text-center">
            <h2 className="vk-h2">{t("Be part of building Vaikuntham")}</h2>
            <p className="vk-lead mt-4">
              {t("Every square foot and every brick offered becomes part of the Lord's home for generations. Contributions are eligible for 80G tax exemption.")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/sqft-seva-campaign" className="vk-btn-gold inline-flex h-11 items-center px-5">{t("Square Foot Seva")}</Link>
              <Link href="/brick-seva-campaign" className="vk-btn-primary inline-flex h-11 items-center px-5">{t("Brick Seva")}</Link>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
