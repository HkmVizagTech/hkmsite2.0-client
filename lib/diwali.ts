import type { Seva } from "@/lib/sevaConfig";
import type { CampaignConfig } from "@/lib/campaignConfig";

/**
 * Diwali 2026 page content. Dates follow the temple's Vaishnava calendar (lib/vaishnavaCalendarData.ts): Dhanteras 8 November,
 * Diwali (Dipavali) 9 November, Govardhan Puja 10 November, Bhratri Dvitiya 11 November. Naraka Chaturdashi is the day before
 * Diwali. Update the dates here each year.
 */
export const DIWALI_DATE_ISO = "2026-11-09";
export const DIWALI_DATE_LABEL = "9 November 2026";
export const OG_IMAGE = "/assets/gallery-aarti.jpg";

const RADHA_MADAN_MOHAN =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg";
const tiers = (amounts: number[]) => amounts.map((amount) => ({ label: `Rs. ${amount.toLocaleString("en-IN")}`, amount }));
const base = { category: "Diwali", account: "default" as const };

// The same four seva cards as the Kartik Maas and Vaikuntha Ekadashi pages (same sevas, photos and amounts), plus Brick Seva and
// Square Foot Seva with the photos and amounts of the Pitru Paksha page.
export const SEVAS: Seva[] = [
  {
    slug: "annadana-seva",
    title: "Annadana Seva",
    shortTitle: "Annadana",
    image: "/assets/donations-annadana-real.jpg",
    tagline: "Feed every devotee and visitor",
    description: "Sponsor sanctified prasadam for the devotees, guests and the needy who come to the temple during Diwali.",
    tiers: tiers([1100, 2100, 3100, 5555, 9000, 11000]),
    icon: "🍚",
    ...base,
  },
  {
    slug: "gau-seva",
    title: "Gau Seva",
    shortTitle: "Gau Seva",
    image: "/assets/donations-gau-seva-real.jpeg",
    tagline: "Serve the cows Lord Krishna loves",
    description: "Offer Gau Poshana Seva — fodder, green grass, medicines and daily care for the cows at the temple goshala.",
    tiers: tiers([1500, 2500, 3500, 5500, 9500, 11500]),
    icon: "🐄",
    ...base,
  },
  {
    slug: "pushpalankara-seva",
    title: "Pushpalankara Seva",
    shortTitle: "Pushpalankara",
    image: "/assets/janmashtami-sk2.webp",
    tagline: "Offer the flower decoration for Their Lordships",
    description: "Sponsor the fresh flower alankara for Sri Sri Radha Madan Mohan — garlands, floral canopy and the altar decoration.",
    tiers: tiers([1100, 2100, 3100, 5100, 9000, 11111]),
    icon: "🌺",
    ...base,
  },
  {
    slug: "vastrabharana-seva",
    title: "Vastrabharana Seva",
    shortTitle: "Vastrabharana",
    image: RADHA_MADAN_MOHAN,
    tagline: "Offer new garments and ornaments to the Deities",
    description: "Sponsor the silk vastra and abharana worn by Sri Sri Radha Madan Mohan.",
    tiers: tiers([1100, 3100, 5100, 9999, 15000, 21000]),
    icon: "👗",
    ...base,
  },
  {
    slug: "brick-seva",
    title: "Brick Seva",
    shortTitle: "Brick",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1790226869681-1790226868033-cardbrick.webp",
    tagline: "A sacred brick of the Lord's abode",
    description:
      "Sponsor a sacred brick of the Hare Krishna Vaikuntham Temple under construction — each brick laid in devotion becomes an eternal part of the Lord's abode.",
    tiers: tiers([1500, 3000, 4500, 6000, 7500, 15000]),
    category: "BRICK",
    account: "default",
    icon: "🧱",
  },
  {
    slug: "square-foot-seva",
    title: "Square Foot Seva",
    shortTitle: "Square Foot",
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1790226868531-1790226867774-cardsft.webp",
    tagline: "Leave an eternal footprint in the temple",
    description:
      "Be a part of the temple in the making — sponsor square feet of its sacred construction and leave an eternal footprint in the Lord's divine abode.",
    tiers: tiers([2100, 4200, 6300, 10500, 14700, 21000]),
    category: "SQFT",
    account: "default",
    icon: "🛕",
  },
];

export const IMPACTS: Record<string, Record<number, string>> = {
  "annadana-seva": { 1100: "44 meals", 2100: "84 meals", 3100: "124 meals", 5555: "222 meals", 9000: "360 meals", 11000: "440 meals" },
  "brick-seva": { 1500: "1 brick", 3000: "2 bricks", 4500: "3 bricks", 6000: "4 bricks", 7500: "5 bricks", 15000: "10 bricks" },
  "square-foot-seva": { 2100: "1 sq ft", 4200: "2 sq ft", 6300: "3 sq ft", 10500: "5 sq ft", 14700: "7 sq ft", 21000: "10 sq ft" },
  "gau-seva": { 1500: "10 cows · a day", 2500: "Medicines & care", 3500: "1 cow · a month", 5500: "Fodder & upkeep", 9500: "Green grass, all cows", 11500: "A month of full care" },
};

/** The five days, as in the Diwali calendar blog on guptvrindavandham.org, with the dates of the temple's calendar. */
export const DAYS = [
  {
    n: "1",
    title: "Dhanteras",
    date: "8 November",
    text: "The festival begins. Homes are cleaned and lit with lamps, and the day is associated with Lord Dhanvantari, health and auspicious beginnings.",
  },
  {
    n: "2",
    title: "Naraka Chaturdashi",
    date: "8 November",
    text: "Choti Diwali remembers Lord Krishna's victory over Narakasura, with early morning rituals and the lighting of lamps.",
  },
  {
    n: "3",
    title: "Diwali",
    date: "9 November",
    text: "The central celebration. Temples and homes shine with diyas, rangoli and flowers, and the lamps show the way from darkness toward light and knowledge.",
  },
  {
    n: "4",
    title: "Govardhan Puja",
    date: "10 November",
    text: "Krishna lifted Govardhan Hill to protect Vrindavan. Devotees offer Annakut, a mountain of food, and share prasadam.",
  },
  {
    n: "5",
    title: "Bhratri Dvitiya",
    date: "11 November",
    text: "Also called Bhai Dooj. Sisters apply tilak to their brothers, and brothers offer gifts and blessings.",
  },
];

export const STRIP = ["Dhanteras", "Naraka Chaturdashi", "Diwali", "Govardhan Puja", "Bhratri Dvitiya"];

export const PRIVILEGES = [
  { title: "Sankalpa in your name", text: "The seva is offered with sankalpa in your name and your family's gotra." },
  { title: "80G tax exemption", text: "Every donation is eligible for 80G. Add your PAN at checkout and the exemption receipt is issued against it." },
  { title: "Receipt on WhatsApp", text: "Your receipt reaches your WhatsApp as soon as the payment is confirmed, with no waiting and no follow-up call." },
  { title: "Maha Prasadam at home", text: "Ask for Maha Prasadam at checkout and sanctified prasadam is posted to the address you give us." },
];

export const BANK_DETAILS = [
  { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
  { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
  { label: "A/c No", value: "10091415313" },
  { label: "IFSC Code", value: "IDFB0080412" },
];

export const FAQS = [
  { q: "When is Diwali in 2026?", a: `As per the temple's Vaishnava calendar, Diwali (Dipavali) falls on ${DIWALI_DATE_LABEL}. The five days of the festival run from Dhanteras on 8 November to Bhratri Dvitiya on 11 November.` },
  { q: "What are the five days of Diwali?", a: "Dhanteras, Naraka Chaturdashi, Diwali, Govardhan Puja and Bhratri Dvitiya (Bhai Dooj). The dates follow the lunar tithis, so they do not always fall on five consecutive days." },
  { q: "Will the sankalpa be taken in my name?", a: "Yes. Enter the name the seva should be offered under in the 'Sevak name' field at checkout. It can be your own, a family member's, or someone you wish to offer it for. The gotra is taken along with it." },
  { q: "Do I get an 80G tax exemption receipt?", a: "Yes, all donations to Hare Krishna Movement India are eligible for 80G. Tick the 80G option at checkout and enter your PAN; the exemption receipt is issued against that PAN and sent with your donation receipt." },
  { q: "How will I receive my receipt?", a: "Your receipt is sent to your WhatsApp number as soon as the payment is confirmed, usually within a minute. If it has not arrived in ten minutes, message us on WhatsApp and we will resend it." },
  { q: "Can I offer more than one seva?", a: "Yes. Complete one seva, then pick the next from the list. Each is recorded and receipted separately." },
  { q: "Is there a minimum donation?", a: "The smallest donation we can accept is Rs. 100." },
];

/** Config for the shared <DonorPrivilegesSection>; it only reads `type`, `unitName` and `engravingImage`. */
export const PRIVILEGE_CONFIG: CampaignConfig = {
  type: "SQFT",
  pageTitle: "Diwali Seva",
  metaTitle: "Diwali Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  metaDesc: "Offer Annadana, Gau, Pushpalankara and Vastrabharana seva this Diwali at ISKCON Gambheeram.",
  ogTitle: "Diwali Seva",
  ogDesc: "Light a lamp this Diwali with a seva at Hare Krishna Vaikuntham.",
  ogImage: OG_IMAGE,
  pricePerUnit: 100,
  unitName: "seva",
  unitNamePlural: "sevas",
  unitShort: "seva",
  minCustomAmount: 100,
  phone: "+91 79950 97108",
  phoneHref: "tel:+917995097108",
  email: "social@hkmvizag.org",
  heroImage: OG_IMAGE,
  aboutImage: OG_IMAGE,
  heroTagline: "A seva initiative of Hare Krishna Movement Visakhapatnam",
  heroHeading1: "Diwali",
  heroHeading2: "Seva",
  heroDesc: "Light a lamp this Diwali with a seva.",
  formHeading: "Offer Your Seva",
  formSubheading: "Sankalpa is taken in your name.",
  privileges: PRIVILEGES.map((p) => ({ ...p })) as unknown as CampaignConfig["privileges"],
  higherPrivileges: [],
  statsApiEndpoint: "",
  orderType: "DIWALI",
};
