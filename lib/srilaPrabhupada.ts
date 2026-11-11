import type { Seva } from "@/lib/sevaConfig";

/**
 * Srila Prabhupada Disappearance Day (Tirobhava) page content. The date follows the temple's Vaishnava calendar
 * (lib/vaishnavaCalendarData.ts). Update the date each year. The two sevas map to the DCC codes for
 * "Srila Prabhupada Disappearance Day" (SPDD, category 3 / sub-category 74): Annadana 68, Abhisheka 69
 * (see the server's dcc.service.js, festivalSlug "srila-prabhupada").
 */
export const SP_SLUG = "srila-prabhupada";
export const SP_DATE_LABEL = "13 November 2026";
export const PRABHUPADA_PORTRAIT =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/srila-prabhupada/prabhupada-portrait.webp";

const tiers = (amounts: number[]) => amounts.map((amount) => ({ label: `Rs. ${amount.toLocaleString("en-IN")}`, amount }));
const base = { category: "Srila Prabhupada Disappearance Day", account: "default" as const };

export const SEVAS: Seva[] = [
  {
    slug: "abhisheka-seva",
    title: "Abhisheka Seva",
    shortTitle: "Abhisheka",
    // The full portrait (head to grass) over a soft blurred backdrop, so the wide card never crops his face.
    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/srila-prabhupada/abhisheka-card.webp",
    tagline: "Pañcāmṛta abhiṣekam for the Founder-Ācārya",
    description:
      "As the Hari-bhakti-vilāsa prescribes, the murti is bathed in pañcāmṛta (milk, yogurt, ghee, honey and sugar), then fragrant water and flowers. Sponsor this abhishekam of Srila Prabhupada on his disappearance day.",
    tiers: tiers([3000, 5100, 7100, 11000, 21000, 51000]),
    icon: "🥛",
    ...base,
  },
  {
    slug: "annadana-seva",
    title: "Annadana Seva",
    shortTitle: "Annadana",
    image: "/assets/donations-annadana-real.jpg",
    tagline: "Feed the devotees in his honour",
    description:
      "Srila Prabhupada wanted that no one within ten miles of a temple should go hungry. Sponsor prasadam for the devotees and guests on this day.",
    tiers: tiers([5000, 9000, 11000, 21000, 31000, 51000]),
    icon: "🍚",
    ...base,
  },
];

// No meal counts under the amounts on this page.
export const IMPACTS: Record<string, Record<number, string>> = {};

/** Milestones of Srila Prabhupada's life (from his biography, Srila Prabhupada-lilamrta). */
export const LIFE = [
  { year: "1896", title: "Appearance in Calcutta", text: "Born Abhay Charan De on 1 September 1896, the day after Janmashtami, in a devout Vaishnava family." },
  { year: "1922", title: "Meets his spiritual master", text: "Meets Srila Bhaktisiddhanta Sarasvati Thakura, who asks him at their first meeting to preach Lord Chaitanya's message in English." },
  { year: "1944", title: "Back to Godhead", text: "Alone and with almost no money, he begins publishing Back to Godhead magazine, writing, editing and distributing it himself." },
  { year: "1959", title: "Sannyasa", text: "Accepts the renounced order of life and settles in Vrindavan, where he begins translating the Srimad-Bhagavatam." },
  { year: "1965", title: "The journey to America", text: "At 69, he sails on the cargo ship Jaladuta with a few rupees and a trunk of books, reaching Boston on 17 September 1965." },
  { year: "1966", title: "Founds ISKCON", text: "In a small storefront at 26 Second Avenue, New York, he founds the International Society for Krishna Consciousness." },
  { year: "1966–77", title: "A worldwide movement", text: "In just eleven years he circles the globe fourteen times, opens over a hundred temples and gives the world his translations of the Vedic scriptures." },
  { year: "1977", title: "Departure in Vrindavan", text: "On 14 November 1977, surrounded by his disciples chanting the holy names, he leaves this world in Sri Vrindavan Dham." },
];

export const STATS = [
  { value: 108, suffix: "+", label: "Temples founded" },
  { value: 70, suffix: "+", label: "Volumes of books" },
  { value: 14, suffix: "", label: "Times around the world" },
  { value: 11, suffix: "", label: "Years to build ISKCON" },
];

export const QUOTES = [
  { text: "I will never die. I will live forever in my books.", by: "Srila Prabhupada" },
  { text: "He reasons ill who tells that Vaishnavas die, when thou art living still in sound. The Vaishnavas die to live, and living try to spread the holy name around.", by: "Srila Bhaktivinoda Thakura" },
  { text: "Chant Hare Krishna and be happy.", by: "Srila Prabhupada" },
];

export const BANK_DETAILS = [
  { label: "Beneficiary Name", value: "HARE KRISHNA MOVEMENT INDIA" },
  { label: "Bank Name", value: "IDFC FIRST BANK LTD" },
  { label: "A/c No", value: "10091415313" },
  { label: "IFSC Code", value: "IDFB0080412" },
];

export const FAQS = [
  { q: "When is Srila Prabhupada's disappearance day in 2026?", a: `As per the temple's Vaishnava calendar, it falls on ${SP_DATE_LABEL}. Srila Prabhupada left this world in Vrindavan on 14 November 1977.` },
  { q: "Why is a disappearance day celebrated?", a: "In the Vaishnava tradition the departure of a pure devotee is remembered with as much love as his appearance. Devotees glorify his life and teachings, offer worship and distribute prasadam in his honour." },
  { q: "What is Abhisheka Seva?", a: "Abhishekam is the ceremonial bathing of Srila Prabhupada's murti with milk, curd, honey, fruit juices and flower water, followed by arati. Your seva sponsors these items." },
  { q: "Is my donation eligible for 80G?", a: "Annadana Seva is eligible for 80G tax exemption. Abhisheka Seva is a worship offering and is not eligible for 80G." },
  { q: "How will I receive my receipt?", a: "Your receipt is sent to your WhatsApp number as soon as the payment is confirmed, usually within a minute." },
  { q: "Is there a minimum donation?", a: "The smallest donation we can accept is Rs. 100." },
];

/** The festival banner: full width on tablets and computers, and a crop around Srila Prabhupada for phones. */
export const SP_BANNER_WIDE = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/srila-prabhupada/banner-wide.webp";
export const SP_BANNER_MOBILE = "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/srila-prabhupada/banner-mobile.webp";
