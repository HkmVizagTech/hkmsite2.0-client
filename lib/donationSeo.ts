import type { Metadata } from "next";
import { SITE_URL, ORG_NAME } from "@/lib/seo";
import { ANNA_DAAN_CAMPAIGN, GAU_CAMPAIGN, GITA_DAAN_CAMPAIGN } from "@/lib/sevaCampaignConfig";
import { SQFT_CAMPAIGN, BRICK_CAMPAIGN } from "@/lib/campaignConfig";
import { DEFAULT_CAMPAIGN as EKADASHI_DEFAULT } from "@/lib/ekadashiCampaign";

/**
 * Search setup for the donation / seva pages, in one place:
 *  - `title` (≤60 chars, used absolute so the root template doesn't repeat
 *    the brand) and `description` (≤155 chars) written for what people
 *    actually search ("annadanam donation Visakhapatnam", "pitru paksha
 *    seva Vizag" …), with the price facts taken from each page's own tiers;
 *  - `sevas` / `intro` feed the server-rendered fallback, so crawlers and
 *    no-JS visitors get a real heading, text and the seva options before the
 *    interactive page hydrates;
 *  - `event` adds schema.org Event markup for dated festivals.
 * Keep amounts in sync with the page tiers when they change.
 */

export interface SeoSeva {
  name: string;
  /** Rupee amounts offered on the page (lowest first is fine). */
  amounts?: number[];
  note?: string;
}

export interface DonationSeoEntry {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  breadcrumb: string;
  h1: string;
  intro: string[];
  sevas: SeoSeva[];
  event?: { name: string; startDate: string; endDate?: string; description: string };
}

const LOCAL = ["ISKCON Vizag", "ISKCON Visakhapatnam", "Hare Krishna Movement Vizag", "Hare Krishna Vaikuntham"];
const BENEFIT = "All donations are eligible for 80G tax benefit; receipts are sent on WhatsApp.";

const tiers = (t: { amount: number }[]) => t.map((x) => x.amount);

export const DONATION_SEO = {
  "anna-daan-seva": {
    path: "/anna-daan-seva",
    title: "Annadanam Donation in Visakhapatnam | ISKCON Vizag",
    description:
      "Sponsor Annadanam at ISKCON Vizag (Hare Krishna Movement). Feed devotees and the needy with sanctified prasadam — every ₹25 feeds one person. 80G benefit.",
    keywords: ["annadanam donation Visakhapatnam", "anna daan seva Vizag", "food donation Vizag", "annadanam ISKCON Vizag", "donate meals Visakhapatnam", "prasadam distribution", ...LOCAL],
    ogImage: ANNA_DAAN_CAMPAIGN.ogImage,
    breadcrumb: "Anna Daan Seva",
    h1: "Anna Daan Seva — Annadanam in Visakhapatnam",
    intro: [ANNA_DAAN_CAMPAIGN.metaDesc, ...ANNA_DAAN_CAMPAIGN.about.paragraphs.slice(0, 2), BENEFIT],
    sevas: [{ name: "Anna Daan Seva", amounts: tiers(ANNA_DAAN_CAMPAIGN.tiers), note: "₹25 sponsors one plate of prasadam" }],
  },
  "gau-seva": {
    path: "/gau-seva",
    title: "Gau Seva Donation in Visakhapatnam | ISKCON Vizag Goshala",
    description:
      "Serve the sacred cows at ISKCON Vizag — sponsor fodder, green grass, medicines and shelter. ₹1,500 feeds 10 cows for a day. 80G tax benefit on every gift.",
    keywords: ["gau seva donation Visakhapatnam", "cow seva Vizag", "goshala donation Vizag", "gau seva ISKCON", "donate for cows Visakhapatnam", ...LOCAL],
    ogImage: GAU_CAMPAIGN.ogImage,
    breadcrumb: "Gau Seva",
    h1: "Gau Seva — Serve the Sacred Cows",
    intro: [GAU_CAMPAIGN.metaDesc, ...GAU_CAMPAIGN.about.paragraphs.slice(0, 2), BENEFIT],
    sevas: [{ name: "Gau Seva", amounts: tiers(GAU_CAMPAIGN.tiers), note: "₹1,500 feeds 10 cows for a day" }],
  },
  "gita-daan-seva": {
    path: "/gita-daan-seva",
    title: "Gita Daan Seva | Donate Bhagavad Gita in Visakhapatnam",
    description:
      "Sponsor Bhagavad-gita As It Is for students and seekers through ISKCON Vizag. ₹250 gifts one Gita and shares Lord Krishna's wisdom. 80G tax benefit.",
    keywords: ["gita daan", "donate Bhagavad Gita", "Bhagavad Gita distribution Vizag", "gita daan seva Visakhapatnam", "Bhagavad-gita As It Is", ...LOCAL],
    ogImage: GITA_DAAN_CAMPAIGN.ogImage,
    breadcrumb: "Gita Daan Seva",
    h1: "Gita Daan Seva — Gift the Bhagavad-gita",
    intro: [GITA_DAAN_CAMPAIGN.metaDesc, ...GITA_DAAN_CAMPAIGN.about.paragraphs.slice(0, 2), BENEFIT],
    sevas: [{ name: "Gita Daan Seva", amounts: tiers(GITA_DAAN_CAMPAIGN.tiers), note: "₹250 sponsors one Bhagavad-gita" }],
  },
  "pitru-paksha": {
    path: "/pitru-paksha",
    title: "Pitru Paksha 2026 Sevas for Ancestors | ISKCON Vizag",
    description:
      "Honour your ancestors this Pitru Paksha (26 Sep – 10 Oct 2026). Offer Annadana, Sadhu Bhojan, Gau Seva or temple seva online at ISKCON Visakhapatnam. 80G.",
    keywords: ["pitru paksha 2026", "pitru paksha seva", "pitru paksha donation", "mahalaya amavasya 2026", "shraddh seva Visakhapatnam", "pitru paksha annadanam", "ancestors seva Vizag", ...LOCAL],
    ogImage: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1790235076658-1790235074922-pitru-paksha-desk.webp",
    breadcrumb: "Pitru Paksha",
    h1: "Pitru Paksha 2026 — Sevas to Honour Your Ancestors",
    intro: [
      "Pitru Paksha is the sacred fortnight to honour our forefathers. Offering seva to Lord Krishna in their memory — feeding devotees and the needy, serving the cows and supporting the temple — is the most auspicious way to seek their blessings.",
      "Offer your Pitru Paksha seva online at Hare Krishna Vaikuntham Temple, Gambheeram, Visakhapatnam. Sankalpa is performed in the names you share.",
      BENEFIT,
    ],
    sevas: [
      { name: "Annadana Seva", amounts: [1100, 2000, 2500, 4000, 6000, 10000], note: "₹1,100 feeds 44 people" },
      { name: "Sadhu Bhojan Seva", amounts: [1100, 1500, 2500, 3500, 5000, 6000], note: "₹1,100 serves 11 plates to Vaishnavas" },
      { name: "Gau Seva", amounts: [1100, 1500, 2500, 3500, 7000, 9000] },
      { name: "Brick Seva", amounts: [1500, 3000, 4500, 6000, 7500, 15000], note: "₹1,500 per temple brick" },
      { name: "Square Foot Seva", amounts: [2100, 4200, 6300, 10500, 14700, 21000], note: "₹2,100 per square foot" },
    ],
    event: {
      name: "Pitru Paksha 2026 at Hare Krishna Vaikuntham",
      startDate: "2026-09-26",
      endDate: "2026-10-10",
      description: "Pitru Paksha sevas for ancestors — Annadana, Sadhu Bhojan, Gau Seva and temple seva.",
    },
  },
  "govardhan-puja": {
    path: "/govardhan-puja",
    title: "Govardhan Puja 2026 & Annakoot Seva | ISKCON Vizag",
    description:
      "Celebrate Govardhan Puja on 10 Nov 2026 at ISKCON Visakhapatnam. Sponsor Annakoot, Govardhan, Gau, Bhog, Alankar or Vaishnav Bhojan seva online. 80G benefit.",
    keywords: ["govardhan puja 2026", "govardhan puja Visakhapatnam", "annakoot seva", "govardhan puja donation", "annakut ISKCON Vizag", "govardhan puja date 2026", ...LOCAL],
    ogImage: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789476038584-1789476037499-govardhan-desk.webp",
    breadcrumb: "Govardhan Puja",
    h1: "Sri Govardhan Puja 2026 — Annakoot Sevas",
    intro: [
      "On Govardhan Puja Lord Krishna lifted Govardhan Hill to protect the residents of Vraja. Devotees celebrate with a grand Annakoot — a mountain of food offerings to the Lord — and worship of the cows.",
      "Join the celebration at Hare Krishna Vaikuntham Temple, Gambheeram, Visakhapatnam, and offer your seva online.",
      BENEFIT,
    ],
    sevas: [
      { name: "Annakoot Seva", amounts: [5555, 11111, 15555, 25555] },
      { name: "Govardhan Seva", amounts: [2100, 5555, 11111, 21111] },
      { name: "Bhog Seva", amounts: [2100, 5555, 7777, 11111] },
      { name: "Alankar Seva", amounts: [1100, 3100, 5555, 9999] },
      { name: "Gau Seva", amounts: [1100, 2100, 3100, 5555] },
      { name: "Vaishnav Bhojan", amounts: [1500, 3100, 5555, 7777] },
    ],
    event: {
      name: "Sri Govardhan Puja 2026 at Hare Krishna Vaikuntham",
      startDate: "2026-11-10",
      description: "Govardhan Puja and Annakoot celebration with seva opportunities for devotees.",
    },
  },
  radhashtami: {
    path: "/radhashtami",
    title: "Radhashtami Sevas | Sri Radha's Appearance | ISKCON Vizag",
    description:
      "Offer seva on Sri Radhashtami at Hare Krishna Vaikuntham, Visakhapatnam — Abhishekam, Pushpalankara, Naivedya, Annadana and Gau Seva online. 80G benefit.",
    keywords: ["radhashtami", "radhashtami seva", "radhashtami Visakhapatnam", "radha ashtami donation", "radhashtami ISKCON Vizag", ...LOCAL],
    ogImage: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1788946765218-1788946764659-Radhashtamidesk.webp",
    breadcrumb: "Radhashtami",
    h1: "Sri Radhashtami — Sevas for Srimati Radharani",
    intro: [
      "Radhashtami celebrates the appearance of Srimati Radharani, the eternal consort of Lord Krishna and the embodiment of pure devotion.",
      "Offer abhishekam, flower decoration, naivedya, annadana or gau seva at Hare Krishna Vaikuntham Temple, Visakhapatnam.",
      BENEFIT,
    ],
    sevas: [
      { name: "Annadana Seva", amounts: [1100, 2100, 5555, 15555] },
      { name: "Abhishekam Seva", amounts: [1100, 2100, 5555, 11111] },
      { name: "Pushpalankara Seva", amounts: [1100, 2100, 5555, 9999] },
      { name: "Naivedya Seva", amounts: [1100, 2100, 5555, 7777] },
      { name: "Gau Seva", amounts: [1100, 2100, 4000, 5555] },
    ],
  },
  ekadashi: {
    path: "/ekadashi",
    title: "Ekadashi Seva & Annadanam | ISKCON Vizag Temple",
    description:
      "Offer seva on every Ekadashi at Hare Krishna Vaikuntham Temple, Visakhapatnam — sponsor Annadanam, Gau Seva, Vastra and temple offerings online. 80G benefit.",
    keywords: ["ekadashi seva", "ekadashi donation", "ekadashi annadanam", "ekadashi Visakhapatnam", "ekadashi 2026", ...LOCAL],
    ogImage: EKADASHI_DEFAULT.ogImage,
    breadcrumb: "Ekadashi Seva",
    h1: "Ekadashi Seva at Hare Krishna Vaikuntham",
    intro: [
      "Ekadashi, the eleventh day of the moon, is especially dear to Lord Krishna. Devotees fast, chant and offer seva for spiritual purification.",
      "Sponsor Annadanam, Gau Seva, deity vastra or temple offerings on Ekadashi at Hare Krishna Vaikuntham Temple, Visakhapatnam.",
      BENEFIT,
    ],
    sevas: [
      { name: "Annadanam", amounts: [501, 1251, 2501, 3751] },
      { name: "Gau Seva", amounts: [1500, 2500, 3500, 9000] },
      { name: "Vastra Seva", amounts: [501, 2100, 5100, 11000] },
    ],
  },
  "alankara-vastra-seva": {
    path: "/alankara-vastra-seva",
    title: "Vastra & Alankara Seva | Deity Dress Seva in Vizag",
    description:
      "Offer new garments, ornaments and decorations for Sri Sri Radha Madan Mohan at Hare Krishna Vaikuntham, Visakhapatnam. Sponsor from ₹501. 80G tax benefit.",
    keywords: ["vastra seva", "alankara seva", "deity dress seva", "vastra daan", "Radha Madan Mohan seva", ...LOCAL],
    ogImage: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg",
    breadcrumb: "Vastra & Alankara Seva",
    h1: "Vastra & Alankara Seva — Adorn the Lordships",
    intro: [
      "Sponsor the daily garments, festival dresses and ornaments of Sri Sri Radha Madan Mohan at Hare Krishna Vaikuntham Temple, Visakhapatnam.",
      BENEFIT,
    ],
    sevas: [
      { name: "Daily Vastra", amounts: [501] },
      { name: "Festival Vastra", amounts: [2100] },
      { name: "Alankara Set", amounts: [5100] },
      { name: "Full Month", amounts: [11000] },
    ],
  },
  "sqft-seva-campaign": {
    path: "/sqft-seva-campaign",
    title: "Square Foot Seva | Build the Vaikuntham Temple, Vizag",
    description:
      "Sponsor square feet of the Hare Krishna Vaikuntham Temple rising in Visakhapatnam — ₹2,100 per sq ft. Be part of building the Lord's home. 80G tax benefit.",
    keywords: ["square foot seva", "temple construction donation Visakhapatnam", "Hare Krishna Vaikuntham temple", "donate to build temple Vizag", "mandir nirman seva", ...LOCAL],
    ogImage: "https://res.cloudinary.com/ddmzeqpkc/image/upload/f_auto,q_auto/phase_1",
    breadcrumb: "Square Foot Seva",
    h1: "Square Foot Seva — Build the Hare Krishna Vaikuntham Temple",
    intro: [SQFT_CAMPAIGN.metaDesc, BENEFIT],
    sevas: [{ name: "Square Foot Seva", amounts: [2100, 6300, 23100, 226800], note: `₹${SQFT_CAMPAIGN.pricePerUnit.toLocaleString("en-IN")} per square foot` }],
  },
  "brick-seva-campaign": {
    path: "/brick-seva-campaign",
    title: "Brick Seva | Sponsor a Temple Brick in Visakhapatnam",
    description:
      "Sponsor a sacred brick for the Hare Krishna Vaikuntham Temple in Visakhapatnam — ₹1,500 per brick. Be part of building the Lord's home. 80G tax benefit.",
    keywords: ["brick seva", "sponsor a brick temple", "temple brick donation Vizag", "Hare Krishna Vaikuntham temple construction", "mandir nirman", ...LOCAL],
    ogImage: BRICK_CAMPAIGN.ogImage,
    breadcrumb: "Brick Seva",
    h1: "Brick Seva — Sponsor a Sacred Temple Brick",
    intro: [BRICK_CAMPAIGN.metaDesc, BENEFIT],
    sevas: [{ name: "Brick Seva", amounts: [1500, 3000, 4500, 6000], note: `₹${BRICK_CAMPAIGN.pricePerUnit.toLocaleString("en-IN")} per brick` }],
  },
  subhojanam: {
    path: "/subhojanam",
    title: "Subhojanam | Free Hospital Meals in Visakhapatnam",
    description:
      "Subhojanam serves fresh, hygienic meals to patients and attendants at KGH Visakhapatnam, GGH Kakinada and Homi Bhabha Hospital, 365 days a year. ₹25 feeds one.",
    keywords: ["subhojanam", "hospital meals Visakhapatnam", "KGH free food", "feed patients Vizag", "food donation hospital", "Touchstone Charities", ...LOCAL],
    ogImage: "/assets/donations-annadana-real.jpg",
    breadcrumb: "Subhojanam",
    h1: "Subhojanam — Free Meals for Hospital Patients & Attendants",
    intro: [
      "Through Subhojanam, freshly cooked, hygienic meals are carried every day to KGH Visakhapatnam, GGH Kakinada and Homi Bhabha Cancer Hospital & Research Centre, Visakhapatnam.",
      "The service runs 365 days a year. Every ₹25 feeds one person — sponsor meals online.",
    ],
    sevas: [{ name: "Subhojanam meal sponsorship", note: "₹25 feeds one person" }],
  },
  chaturmas: {
    path: "/chaturmas",
    title: "Chaturmas 2026: Dates, Food Rules & Fasting | ISKCON Vizag",
    description:
      "Chaturmas 2026 runs from July 29 to November 24 (Utthana Ekadashi). Learn the four sacred months, month-wise food restrictions and fasting rules.",
    keywords: ["chaturmas 2026", "chaturmas dates 2026", "chaturmas food restrictions", "chaturmasya vrat", "chaturmas fasting rules", ...LOCAL],
    ogImage: "/assets/chaturmas-main-visual.jpg",
    breadcrumb: "Chaturmas",
    h1: "Chaturmas 2026 — Dates, Food Restrictions & Fasting Rules",
    intro: [
      "Chaturmas 2026 begins on July 29 and ends on November 24 (Utthana Ekadashi). These four sacred months are observed with vows of austerity, chanting and month-wise food restrictions.",
    ],
    sevas: [],
  },
  "special-occasion": {
    path: "/special-occasion",
    title: "Special Occasion Seva | Birthday & Anniversary Seva, Vizag",
    description:
      "Celebrate a birthday, anniversary or any special day with a seva at Hare Krishna Vaikuntham Temple, Visakhapatnam, and receive the Lord's blessings. 80G.",
    keywords: ["birthday seva temple", "anniversary seva", "special occasion puja Vizag", "birthday annadanam", ...LOCAL],
    ogImage: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1784005845291-1784005844212-ChatGPTImageJul142026104033AM.png",
    breadcrumb: "Special Occasion Seva",
    h1: "Special Occasion Seva — Celebrate with the Lord's Blessings",
    intro: [
      "Mark a birthday, wedding anniversary or any special day by sponsoring a seva at Hare Krishna Vaikuntham Temple, Visakhapatnam, and receive the blessings of Sri Sri Radha Madan Mohan.",
      BENEFIT,
    ],
    sevas: [],
  },
} satisfies Record<string, DonationSeoEntry>;

export type DonationSeoKey = keyof typeof DONATION_SEO;

const absUrl = (u: string) => (/^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);

/** Page metadata for a donation page (absolute title, canonical, OG, Twitter). */
export function donationMetadata(key: DonationSeoKey): Metadata {
  const e: DonationSeoEntry = DONATION_SEO[key];
  return {
    title: { absolute: e.title },
    description: e.description,
    keywords: e.keywords,
    alternates: { canonical: e.path },
    openGraph: {
      title: e.title,
      description: e.description,
      url: e.path,
      type: "website",
      siteName: ORG_NAME,
      locale: "en_IN",
      images: [{ url: absUrl(e.ogImage), alt: e.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: e.title,
      description: e.description,
      images: [absUrl(e.ogImage)],
    },
  };
}

/** schema.org graph for a donation page: WebPage + DonateAction + breadcrumbs (+ Event). */
export function donationJsonLd(key: DonationSeoKey) {
  const e: DonationSeoEntry = DONATION_SEO[key];
  const url = `${SITE_URL}${e.path}`;
  const orgRef = { "@id": `${SITE_URL}/#organization` };
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: e.title,
      description: e.description,
      inLanguage: "en-IN",
      primaryImageOfPage: { "@type": "ImageObject", url: absUrl(e.ogImage) },
      about: orgRef,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      ...(e.sevas.length
        ? {
            potentialAction: {
              "@type": "DonateAction",
              name: e.h1,
              recipient: orgRef,
              target: { "@type": "EntryPoint", urlTemplate: url },
            },
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        ...(e.sevas.length ? [{ "@type": "ListItem", position: 2, name: "Donate", item: `${SITE_URL}/donate` }] : []),
        { "@type": "ListItem", position: e.sevas.length ? 3 : 2, name: e.breadcrumb, item: url },
      ],
    },
  ];
  if (e.event) {
    graph.push({
      "@type": "Event",
      name: e.event.name,
      description: e.event.description,
      startDate: e.event.startDate,
      ...(e.event.endDate ? { endDate: e.event.endDate } : {}),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      image: [absUrl(e.ogImage)],
      url,
      organizer: { ...orgRef, "@type": "Organization", name: ORG_NAME, url: SITE_URL },
      location: {
        "@type": "Place",
        name: "Hare Krishna Vaikuntham Temple, Gambheeram",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Chaitanya Bhavan, IIM Road, opp. Akshaya Patra Foundation, Gambhiram",
          addressLocality: "Visakhapatnam",
          addressRegion: "Andhra Pradesh",
          postalCode: "531163",
          addressCountry: "IN",
        },
      },
      offers: {
        "@type": "Offer",
        url,
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        validFrom: "2026-09-01",
      },
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
