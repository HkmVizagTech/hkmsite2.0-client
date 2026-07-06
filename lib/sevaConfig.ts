export interface SevaTier {
  label: string;
  amount: number;
}

export interface Seva {
  slug: string;
  title: string;
  shortTitle: string; // used in "Sponsor X" button
  image: string;
  tagline: string;
  description: string;
  tiers: SevaTier[];
  category: string; // used for DCC / receipt categorization
  account: "default" | "donations";
  icon: string;
}

// Single source of truth for every seva shown on the homepage AND its
// dedicated donation page at /donate/[slug]. Add a new seva here and it
// automatically appears on the homepage grid and gets a working page.
export const sevas: Seva[] = [
  {
    slug: "square-foot-seva",
    title: "Square Foot Seva",
    shortTitle: "Square Foot",
    image: "/assets/home-temple-construction-banner.webp",
    tagline: "Sponsor the sacred ground of the rising temple",
    description:
      "Every square foot you sponsor becomes a permanent part of the Hare Krishna Vaikuntham Temple's foundation — an eternal offering inscribed into the ground Their Lordships will bless with Their presence.",
    tiers: [
      { label: "Rs. 6,000 / sq ft", amount: 6000 },
      { label: "Rs. 12,000 / 2 sq ft", amount: 12000 },
      { label: "Rs. 18,000 / 3 sq ft", amount: 18000 },
      { label: "Rs. 24,000 / 4 sq ft", amount: 24000 },
    ],
    category: "SQFT",
    account: "donations",
    icon: "🏛️",
  },
  {
    slug: "brick-seva",
    title: "Brick Seva",
    shortTitle: "Brick Seva",
    image: "/assets/home-gallery-annadana.webp",
    tagline: "Every brick becomes an eternal part of Krishna's home",
    description:
      "The temple rises one brick at a time. Sponsor bricks in memory of loved ones or in gratitude for blessings received — each one is laid with devotion into the walls of the Lord's abode.",
    tiers: [
      { label: "Rs. 1,500 / brick", amount: 1500 },
      { label: "Rs. 3,000 / 2 bricks", amount: 3000 },
      { label: "Rs. 4,500 / 3 bricks", amount: 4500 },
      { label: "Rs. 6,000 / 4 bricks", amount: 6000 },
    ],
    category: "BRICK",
    account: "donations",
    icon: "🧱",
  },
  {
    slug: "anna-daan-seva",
    title: "Anna Daan Seva",
    shortTitle: "Anna Daan",
    image: "/assets/home-gallery-annadana.webp",
    tagline: "Feed the hungry with sanctified prasadam",
    description:
      "The scriptures glorify Anna Daan as the highest of all charities. Your contribution provides freshly cooked, sanctified prasadam to devotees, students, and the underprivileged across Visakhapatnam.",
    tiers: [
      { label: "Rs. 550 / 10 plates", amount: 550 },
      { label: "Rs. 1,100 / 20 plates", amount: 1100 },
      { label: "Rs. 2,805 / 51 plates", amount: 2805 },
      { label: "Rs. 5,555 / 101 plates", amount: 5555 },
    ],
    category: "ANNADAAN",
    account: "donations",
    icon: "🍛",
  },
  {
    slug: "gau-seva",
    title: "Gau Seva",
    shortTitle: "Gau Seva",
    image: "/assets/home-gallery-srinivasa-govinda.webp",
    tagline: "Support daily care for our protected cows",
    description:
      "Cows hold a sacred place in Vedic culture. Your Gau Seva donation supports fodder, medical care, and shelter for the cows in our care — an act of compassion Lord Krishna Himself cherishes.",
    tiers: [
      { label: "Rs. 1,500 / 10 cows, 1 day", amount: 1500 },
      { label: "Rs. 2,500 / medicines", amount: 2500 },
      { label: "Rs. 3,500 / 1 cow, 1 month", amount: 3500 },
      { label: "Rs. 9,000 / green grass, 1 day", amount: 9000 },
    ],
    category: "GO SEVA",
    account: "donations",
    icon: "🐄",
  },
  {
    slug: "gita-daan-seva",
    title: "Gita Daan Seva",
    shortTitle: "Gita Daan",
    image: "/assets/home-banner-daily-darshan.webp",
    tagline: "Gift the wisdom of the Bhagavad Gita to a seeker",
    description:
      "There is no greater gift than transcendental knowledge. Sponsor copies of Bhagavad-Gita As It Is for distribution to students, prisoners, and spiritual seekers — planting a seed that can transform a life forever.",
    tiers: [
      { label: "Rs. 300 / 1 Gita", amount: 300 },
      { label: "Rs. 1,500 / 5 Gitas", amount: 1500 },
      { label: "Rs. 3,000 / 10 Gitas", amount: 3000 },
      { label: "Rs. 15,000 / 50 Gitas", amount: 15000 },
    ],
    category: "GITA DAAN",
    account: "donations",
    icon: "📖",
  },
  {
    slug: "vastra-seva",
    title: "Vastra & Alankara Seva",
    shortTitle: "Vastra Seva",
    image: "/assets/home-banner-radha-madan-mohan.webp",
    tagline: "Offer new garments and ornaments to Their Lordships",
    description:
      "Sri Sri Radha Madan Mohan are dressed and decorated fresh each day. Sponsor Vastra (garments) and Alankara (ornamentation) seva to support this daily loving service to the Deities.",
    tiers: [
      { label: "Rs. 501 / daily vastra", amount: 501 },
      { label: "Rs. 2,100 / festival vastra", amount: 2100 },
      { label: "Rs. 5,100 / alankara set", amount: 5100 },
      { label: "Rs. 11,000 / full month", amount: 11000 },
    ],
    category: "VASTRA",
    account: "donations",
    icon: "👘",
  },
];

export const getSevaBySlug = (slug: string) => sevas.find((s) => s.slug === slug);
