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

const RELIEF_TIERS_FOOD = [
  { label: "Rs. 500", amount: 500 },
  { label: "Rs. 1,000", amount: 1000 },
  { label: "Rs. 2,500", amount: 2500 },
  { label: "Rs. 5,000", amount: 5000 },
  { label: "Rs. 10,000", amount: 10000 },
  { label: "Rs. 25,000", amount: 25000 },
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
    category: "Emergency Relief",
    account: "default",
    icon: "🍛",
  },
];

export const EMERGENCY_IMPACTS: Record<string, Record<number, string>> = {
  "relief-food-packets": {
    500: "20 meals",
    1000: "40 meals",
    2500: "100 meals",
    5000: "200 meals",
    10000: "400 meals",
    25000: "1,000 meals",
  },
};
