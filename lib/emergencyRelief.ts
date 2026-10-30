import type { Seva } from "@/lib/sevaConfig";

/**
 * Emergency relief page (/emergency-relief): cyclones, floods and other disasters where the temple serves food.
 * Everything that changes between emergencies lives here, so the next one is a config edit, not a new page:
 * set `name`, `place`, `blurb` and `updatedOn`, adjust the cards below and, if there is a photo, `heroImage`.
 * Set `active: false` to show the "no active appeal" note while keeping the page and its link live.
 * The card title feeds the DCC seva mapping (see the note on EMERGENCY_SEVAS).
 */
export const EMERGENCY = {
  active: true,
  name: "Emergency Food Relief",
  place: "Visakhapatnam & coastal Andhra Pradesh",
  headline: "Cyclone Relief: Food for Families in Need",
  blurb:
    "When a cyclone or flood strikes, families lose homes, stoves and a day's wages. Hare Krishna Movement Visakhapatnam cooks fresh, sanctified prasadam and takes it to the affected areas. Your gift puts a hot meal in someone's hands today.",
  updatedOn: "",
  heroImage: "/assets/donations-annadana-real.jpg",
};

// Each tile reads "<meals> / <amount>" (the form prints the label above the rupee amount). Rs. 25 feeds one person.
const RELIEF_TIERS_FOOD = [
  { label: "20 meals", amount: 500 },
  { label: "40 meals", amount: 1000 },
  { label: "100 meals", amount: 2500 },
  { label: "200 meals", amount: 5000 },
  { label: "400 meals", amount: 10000 },
  { label: "1,000 meals", amount: 25000 },
];

// Food only. The title keeps the word "Annadana" on purpose: the server maps a seva name containing it to the
// Annadanam DCC code (category 1, ANGE), so no server change is needed per emergency.
export const EMERGENCY_SEVAS: Seva[] = [
  {
    slug: "relief-food-packets",
    title: "Annadana Seva: Emergency Food Relief",
    shortTitle: "Food Relief",
    image: "/assets/donations-annadana-real.jpg",
    tagline: "Hot prasadam, cooked fresh and delivered",
    description: "Sponsor freshly cooked meals packed and carried to families in the affected areas. Rs. 25 feeds one person.",
    tiers: RELIEF_TIERS_FOOD,
    unit: { price: 25, singular: "meal", plural: "meals" },
    category: "Emergency Relief",
    account: "default",
    icon: "🍛",
  },
];
