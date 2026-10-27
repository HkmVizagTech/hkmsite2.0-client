import type { Seva } from "@/lib/sevaConfig";
import type { CampaignConfig } from "@/lib/campaignConfig";

/**
 * Vaikuntha (Moksada) Ekadashi 2026 page content. Update the date and the amounts here each year.
 * Moksada Ekadashi is on 20 December 2026 (see lib/vaishnavaCalendarData.ts).
 */
export const EVENT_DATE_ISO = "2026-12-20";
export const EVENT_DATE_LABEL = "20 December 2026";

/**
 * The festival banner. Paste the banner URLs here when the artwork is ready (same sizes as the Kartik Maas banners:
 * about 1920x730 for desktop and 962x1635 for phones). While these are null the page shows a designed typographic hero.
 */
export const BANNER_DESKTOP: string | null = null;
export const BANNER_MOBILE: string | null = null;
export const OG_IMAGE = "/assets/gallery-aarti.jpg";

const RADHA_MADAN_MOHAN =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677419371-1783677418690-DietyPhotos.jpeg";

// `category` is sent to the API as the donation `type`, and `title` as `sevaName`, with festivalSlug "vaikuntha-ekadashi".
const tiers = (amounts: number[]) => amounts.map((amount) => ({ label: `Rs. ${amount.toLocaleString("en-IN")}`, amount }));
const base = { category: "Vaikuntha Ekadashi", account: "default" as const };

// The same four seva cards as the Kartik Maas page: same sevas, photos and amounts.
export const SEVAS: Seva[] = [
  {
    slug: "annadana-seva",
    title: "Annadana Seva",
    shortTitle: "Annadana",
    image: "/assets/donations-annadana-real.jpg",
    tagline: "Feed every devotee and visitor who comes for darshan",
    description: "Sponsor sanctified prasadam for the devotees, guests and the needy who come to the temple on Ekadashi.",
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
];

/** What a gift buys, shown under the amount (only where it can be stated plainly). */
export const IMPACTS: Record<string, Record<number, string>> = {
  "annadana-seva": { 1100: "44 meals", 2100: "84 meals", 3100: "124 meals", 5555: "222 meals", 9000: "360 meals", 11000: "440 meals" },
  "gau-seva": { 1500: "10 cows · a day", 2500: "Medicines & care", 3500: "1 cow · a month", 5500: "Fodder & upkeep", 9500: "Green grass, all cows", 11500: "A month of full care" },
};

export const FACTS = [
  { k: "Moksada Ekadashi", v: EVENT_DATE_LABEL },
  { k: "Hare Krishna Vaikuntham", v: "Gambheeram, Visakhapatnam" },
  { k: "80G tax exemption", v: "Receipt against your PAN" },
  { k: "Secure checkout", v: "Razorpay · receipt on WhatsApp" },
];

export const SHLOKA = {
  sanskrit: ["sarva-dharmān parityajya", "mām ekaṁ śaraṇaṁ vraja", "ahaṁ tvāṁ sarva-pāpebhyo", "mokṣayiṣyāmi mā śucaḥ"],
  meaning: "Abandon all varieties of dharma and simply surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
  source: "Bhagavad-gita 18.66",
};

export const OBSERVANCE = [
  { n: "01", title: "Fast and remember the Lord", text: "Devotees observe Ekadashi by abstaining from grains and beans, and fill the day with chanting the Hare Krishna maha-mantra." },
  { n: "02", title: "Take darshan and worship", text: "The day is spent in the Lord's presence: darshan, aarti and kirtan, and the hearing of Hari-katha." },
  { n: "03", title: "Hear the Gita", text: "Moksada Ekadashi is observed with Gita Jayanti, the day the Bhagavad-gita was spoken, so devotees read and hear its message." },
  { n: "04", title: "Give in the Lord's service", text: "Annadana, Gau Seva, flower alankara and vastra offerings let every devotee take part, whether or not they can be at the temple." },
];

export const WHY_GIVE = [
  { title: "Charity on Ekadashi", text: "The scriptures speak of giving on Ekadashi as especially meritorious, because the day is already set aside for the Lord." },
  { title: "Liberation is the aim", text: "Moksada means the giver of liberation. The day reminds us that the goal of life is to return to the Lord's abode." },
  { title: "For your family too", text: "Your sankalpa can be offered in your own name or on behalf of parents, children or ancestors." },
  { title: "Worship that continues", text: "Every offering sustains the daily worship, prasadam distribution and goshala care at Hare Krishna Vaikuntham." },
];

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
  { q: "When is Vaikuntha Ekadashi in 2026?", a: `Vaikuntha Ekadashi, also called Moksada Ekadashi, falls on ${EVENT_DATE_LABEL}. Your seva is offered on the day at Hare Krishna Vaikuntham, Gambheeram, with sankalpa in your name.` },
  { q: "What is Vaikuntha (Moksada) Ekadashi?", a: "It is the Ekadashi of the bright fortnight of Margashirsha. In Vaishnava tradition it is regarded as one of the most auspicious days to worship Lord Vishnu and remember the goal of liberation, and it is observed together with Gita Jayanti." },
  { q: "Do I have to fast to donate?", a: "No. Anyone can offer a seva. Devotees who fast keep to grains and beans on Ekadashi, but giving is open to everyone." },
  { q: "Will the sankalpa be taken in my name?", a: "Yes. Enter the name the seva should be offered under in the 'Sevak name' field at checkout. It can be your own, a family member's, or someone you wish to offer it for." },
  { q: "Do I get an 80G tax exemption receipt?", a: "Yes, all donations to Hare Krishna Movement India are eligible for 80G. Tick the 80G option at checkout and enter your PAN; the exemption receipt is issued against that PAN." },
  { q: "How will I receive my receipt?", a: "Your receipt is sent to your WhatsApp number as soon as the payment is confirmed, usually within a minute. If it has not arrived in ten minutes, message us on WhatsApp and we will resend it." },
  { q: "Can I offer more than one seva?", a: "Yes. Complete one seva, then pick the next from the list. Each is recorded and receipted separately." },
  { q: "Is there a minimum donation?", a: "The smallest donation we can accept is Rs. 100." },
];

/** Config for the shared <DonorPrivilegesSection>; it only reads `type`, `unitName` and `engravingImage`. */
export const PRIVILEGE_CONFIG: CampaignConfig = {
  type: "SQFT",
  pageTitle: "Vaikuntha Ekadashi Seva",
  metaTitle: "Vaikuntha Ekadashi Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  metaDesc: "Offer Annadana, Gau, Pushpalankara and Vastrabharana seva on Vaikuntha Ekadashi at ISKCON Gambheeram.",
  ogTitle: "Vaikuntha Ekadashi Seva",
  ogDesc: "Offer your seva on the sacred day of Vaikuntha Ekadashi.",
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
  heroHeading1: "Vaikuntha",
  heroHeading2: "Ekadashi Seva",
  heroDesc: "Offer a seva on the sacred day of Vaikuntha Ekadashi.",
  formHeading: "Offer Your Seva",
  formSubheading: "Sankalpa is taken in your name.",
  privileges: PRIVILEGES.map((p) => ({ ...p })) as unknown as CampaignConfig["privileges"],
  higherPrivileges: [],
  statsApiEndpoint: "",
  orderType: "VAIKUNTHA_EKADASHI",
};
