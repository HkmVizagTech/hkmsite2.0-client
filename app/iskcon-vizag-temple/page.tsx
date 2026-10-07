import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Phone, Mail, Navigation, Utensils, Music, BookOpen, PartyPopper, HeartHandshake, Shirt, Camera, Store, ArrowRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { pageSeo, siteKeywords, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { getT } from "@/lib/i18n/server";
import { TEMPLE, FULL_ADDRESS, MAPS_URL, MAPS_EMBED_URL, DARSHAN_HOURS, DAILY_SCHEDULE, WEEKLY_PROGRAMS } from "@/lib/templeInfo";

// Visitor guide for people searching "ISKCON temple Vizag / Visakhapatnam",
// "Hare Krishna Vaikuntham timings", "ISKCON Gambheeram address" etc. Every
// fact comes from lib/templeInfo.ts (shared with the daily schedule and the
// site-wide temple JSON-LD).

const PATH = "/iskcon-vizag-temple";

export const metadata: Metadata = pageSeo({
  title: "ISKCON Temple in Vizag: Timings, Address & Darshan",
  description:
    "Visit ISKCON Gambheeram, the Hare Krishna Vaikuntham temple in Vizag (Visakhapatnam), IIM Road: darshan & aarti timings, address, map, prasadam, festivals.",
  path: PATH,
  keywords: [
    "ISKCON temple Vizag",
    "ISKCON Vizag timings",
    "ISKCON Visakhapatnam timings",
    "ISKCON temple Visakhapatnam address",
    "Hare Krishna Vaikuntham temple timings",
    "ISKCON Gambheeram",
    "Hare Krishna temple Gambheeram",
    "Krishna temple Vizag",
    "temples in Visakhapatnam",
    ...siteKeywords,
  ],
  image: "/assets/vizag-temple-1.jpeg",
});

const FAQS: { q: string; a: string }[] = [
  {
    q: "Where is the ISKCON Gambheeram temple in Vizag?",
    a: `ISKCON Gambheeram — the Hare Krishna Vaikuntham temple — is on IIM Road at Gambheeram, opposite the Akshaya Patra Foundation, in Visakhapatnam (Vizag), Andhra Pradesh ${TEMPLE.postalCode}. Use the "Get directions" button on this page to open it in Google Maps.`,
  },
  {
    q: "What are the darshan timings?",
    a: "Mangala darshan is from 4:30 AM to 5:00 AM, morning darshan from 7:15 AM to 12:20 PM and evening darshan from 4:15 PM to 8:15 PM, every day. The temple is closed for darshan in between while the Lord rests.",
  },
  {
    q: "Can anyone visit the temple?",
    a: "Yes. Everyone is welcome for darshan, aarti, kirtan and the Bhagavad Gita and Srimad Bhagavatam classes. Modest, traditional attire is encouraged, and footwear is removed before entering the temple hall.",
  },
  {
    q: "Is prasadam served to visitors?",
    a: "Yes. Free prasadam is served after the morning Srimad Bhagavatam class and at the Sunday Love Feast (every Sunday, 5:00 PM – 8:30 PM).",
  },
  {
    q: "Which festivals are celebrated?",
    a: "Sri Krishna Janmashtami, Radhashtami, Govardhan Puja, Gaura Purnima, Ratha Yatra, Ekadashis and the other Vaishnava festivals are celebrated with abhishekam, kirtan and prasadam. See the Vaishnava calendar for dates.",
  },
  {
    q: "Can I take photographs?",
    a: "Photography is allowed during darshan. Flash photography and video recording may be restricted during special events.",
  },
  {
    q: "How can I offer seva or donate?",
    a: "You can offer Annadanam, Gau Seva, Gita Daan, temple-construction seva and festival sevas online on this website. Donations are eligible for 80G tax exemption, and the receipt is sent on WhatsApp and email.",
  },
];

export default async function IskconVizagTemplePage() {
  const t = await getT();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${PATH}#webpage`,
    url: `${SITE_URL}${PATH}`,
    name: "ISKCON Temple in Vizag: Timings, Address & Darshan",
    about: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "en-IN",
  };

  const doThings = [
    { icon: Clock, title: "Darshan", desc: `Darshan of ${TEMPLE.presidingDeities}, three times a day.`, href: "/daily-schedule" },
    { icon: Music, title: "Aarti & kirtan", desc: "Mangala, Raj Bhog, Sandhya and Shayan aartis with live kirtan.", href: "/daily-schedule" },
    { icon: Utensils, title: "Prasadam", desc: "Free prasadam after the morning class and at the Sunday Love Feast.", href: "/daily-schedule" },
    { icon: BookOpen, title: "Gita & Bhagavatam classes", desc: "Srimad Bhagavatam at 8:00 AM and Bhagavad Gita at 7:00 PM daily.", href: "/blogs" },
    { icon: PartyPopper, title: "Festivals", desc: "Janmashtami, Radhashtami, Govardhan Puja, Ratha Yatra and more.", href: "/vaishnav-calendar" },
    { icon: HeartHandshake, title: "Seva", desc: "Annadanam, Gau Seva, Gita Daan and the temple construction.", href: "/donate" },
  ];

  const tips = [
    { icon: Shirt, title: "Dress code", desc: "Modest, traditional attire is encouraged. Please remove footwear before entering the temple hall." },
    { icon: Camera, title: "Photography", desc: "Allowed during darshan; flash and video may be restricted during special events." },
    { icon: Store, title: "Book store", desc: "Srila Prabhupada's books, devotional items and spiritual accessories are available at the temple." },
  ];

  return (
    <PageLayout>
      <JsonLd data={breadcrumbJsonLd([{ name: "Visit the Temple", path: PATH }])} />
      <JsonLd data={pageJsonLd} />
      <JsonLd data={faqJsonLd} />
      <main className="bg-white pt-[var(--header-h)]">
        <PageHero
          title={t("ISKCON Temple in Vizag — Hare Krishna Vaikuntham, Gambheeram")}
          subtitle={t("Darshan timings, address, how to reach and what to expect at ISKCON Gambheeram Visakhapatnam.")}
          breadcrumb={t("Visit the Temple")}
          backgroundImage="/assets/vizag-temple-1.jpeg"
          eyebrow={t("Plan your visit")}
        />

        {/* Quick facts */}
        <section className="vk-section !pt-10">
          <div className="vk-container grid gap-4 md:grid-cols-3">
            <div className="vk-card p-5">
              <p className="flex items-center gap-2 font-heading font-bold text-ink"><Clock className="h-5 w-5 text-vk-600" /> {t("Darshan timings")}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink/80">
                {DARSHAN_HOURS.map((h) => (
                  <li key={h.label} className="flex justify-between gap-3">
                    <span>{t(h.label)}</span>
                    <span className="font-semibold text-ink">{h.display}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">{t("Open every day. Closed for darshan in between while the Lord rests.")}</p>
            </div>
            <div className="vk-card p-5">
              <p className="flex items-center gap-2 font-heading font-bold text-ink"><MapPin className="h-5 w-5 text-vk-600" /> {t("Address")}</p>
              <address className="mt-3 text-sm not-italic leading-6 text-ink/80">{FULL_ADDRESS}</address>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="vk-btn-primary mt-4 inline-flex h-10 items-center gap-2 px-4 text-sm">
                <Navigation className="h-4 w-4" /> {t("Get directions")}
              </a>
            </div>
            <div className="vk-card p-5">
              <p className="flex items-center gap-2 font-heading font-bold text-ink"><Phone className="h-5 w-5 text-vk-600" /> {t("Contact")}</p>
              <p className="mt-3 text-sm text-ink/80">
                <a href={TEMPLE.phoneHref} className="font-semibold text-vk-700 hover:underline">{TEMPLE.phone}</a>
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink/80">
                <Mail className="h-4 w-4 text-vk-600" />
                <a href={`mailto:${TEMPLE.email}`} className="hover:underline">{TEMPLE.email}</a>
              </p>
              <Link href="/contact" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-vk-700 hover:underline">
                {t("All contact details")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="vk-section !pt-0">
          <div className="vk-container grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="vk-h2">{t("About ISKCON Gambheeram, Visakhapatnam")}</h2>
              <p className="vk-lead mt-4">
                {t("ISKCON Gambheeram Visakhapatnam — also known as the Hare Krishna Vaikuntham temple and Hare Krishna Movement Vizag — has served devotees in Vizag since 2008. Following the teachings of Srila Prabhupada, the founder-acharya of ISKCON, the temple offers daily darshan of Sri Sri Radha Madan Mohan, kirtan, Bhagavad Gita classes, prasadam and festivals for everyone.")}
              </p>
              <p className="mt-4 text-ink/80">
                {t("The temple campus at Gambheeram, on IIM Road, is also home to the Hare Krishna Vaikuntham Cultural Centre now being built — a grand new temple where Sri Srinivasa Govinda will reside, with a prasadam hall, a festival hall and spaces for meditation, children and youth.")}{" "}
                <Link href="/vaikuntham" className="font-semibold text-vk-700 hover:underline">{t("Read about Vaikuntham")}</Link>
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-vk-900">
              <Image src="/assets/vizag-temple-4.jpeg" alt={t("ISKCON Gambheeram — Hare Krishna temple in Visakhapatnam")} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>
        </section>

        {/* What you can do */}
        <section className="vk-section vk-band">
          <div className="vk-container">
            <h2 className="vk-h2 text-center">{t("What to do at the temple")}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doThings.map((d) => (
                <Link key={d.title} href={d.href} className="vk-card group flex gap-4 p-5 transition-shadow hover:shadow-lift">
                  <span className="vk-icon-chip shrink-0"><d.icon className="h-5 w-5" /></span>
                  <span>
                    <span className="block font-heading font-bold text-ink group-hover:text-vk-700">{t(d.title)}</span>
                    <span className="mt-1 block text-sm leading-6 text-ink/75">{t(d.desc)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Daily schedule */}
        <section className="vk-section">
          <div className="vk-container grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="vk-h2">{t("Daily aarti & program timings")}</h2>
              <div className="mt-6 overflow-hidden rounded-2xl border border-vk-100">
                <table className="w-full text-sm">
                  <tbody>
                    {DAILY_SCHEDULE.map((s, i) => (
                      <tr key={s.time + s.event} className={i % 2 ? "bg-white" : "bg-vk-50/60"}>
                        <td className="w-28 px-4 py-2.5 font-semibold text-vk-700">{s.time}</td>
                        <td className="px-4 py-2.5 text-ink">{t(s.event)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link href="/daily-schedule" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-vk-700 hover:underline">
                {t("Full daily schedule")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div>
              <h2 className="vk-h2">{t("Weekly programs")}</h2>
              <div className="mt-6 space-y-3">
                {WEEKLY_PROGRAMS.map((p) => (
                  <div key={p.title} className="vk-card p-5">
                    <p className="font-heading font-bold text-ink">{t(p.title)}</p>
                    <p className="text-sm font-semibold text-vk-700">{t(p.when)}</p>
                    <p className="mt-1 text-sm text-ink/75">{t(p.desc)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How to reach */}
        <section className="vk-section vk-band">
          <div className="vk-container grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="vk-h2">{t("How to reach")}</h2>
              <p className="vk-lead mt-4">
                {t("The temple is on IIM Road at Gambheeram, Visakhapatnam, opposite the Akshaya Patra Foundation. Open the map for turn-by-turn directions from anywhere in Vizag.")}
              </p>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="vk-btn-primary mt-5 inline-flex h-11 items-center gap-2 px-5">
                <Navigation className="h-4 w-4" /> {t("Open in Google Maps")}
              </a>
              <div className="mt-8 space-y-3">
                {tips.map((tip) => (
                  <div key={tip.title} className="flex gap-3">
                    <span className="vk-icon-chip !h-9 !w-9 shrink-0"><tip.icon className="h-4 w-4" /></span>
                    <p className="text-sm leading-6 text-ink/80"><strong className="text-ink">{t(tip.title)}:</strong> {t(tip.desc)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-3xl border border-vk-100 bg-white">
              <iframe
                src={MAPS_EMBED_URL}
                title={t("Map — ISKCON Gambheeram, Hare Krishna Vaikuntham temple, Visakhapatnam")}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[360px] w-full md:h-full md:min-h-[420px]"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="vk-section">
          <div className="vk-container max-w-3xl">
            <h2 className="vk-h2 text-center">{t("Visiting the temple — common questions")}</h2>
            <div className="mt-8 space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="vk-card group p-5 open:shadow-lift">
                  <summary className="cursor-pointer list-none font-heading font-bold text-ink marker:hidden">{t(f.q)}</summary>
                  <p className="mt-3 text-sm leading-7 text-ink/80">{t(f.a)}</p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-ink/75">
              {t("Planning a first visit?")}{" "}
              <Link href="/blogs/visiting-hare-krishna-vaikuntham-a-pilgrims-guide-to-vizag" className="font-semibold text-vk-700 hover:underline">
                {t("Read our pilgrim's guide to Hare Krishna Vaikuntham")}
              </Link>
            </p>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
