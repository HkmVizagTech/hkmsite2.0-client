import {
  UtensilsCrossed, Sparkles, FileCheck2, Landmark,
  ScrollText, Award, HeartHandshake, Building2,
} from "lucide-react";
import type { ComponentType } from "react";

export interface DonorEntry {
  name: string;
  amount: number;
  sqft: number;
  time: string;
}

export interface CampaignerData {
  name: string;
  slug: string;
  goalSqft: number;
  message: string;
  raisedAmount: number;
  sqftRaised: number;
  donorCount: number;
  donors: DonorEntry[];
}

export interface Privilege {
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
}

export interface CampaignConfig {
  type: "SQFT" | "BRICK";
  pageTitle: string;
  metaTitle: string;
  metaDesc: string;
  ogTitle: string;
  ogDesc: string;
  ogImage: string;
  pricePerUnit: number;
  unitName: string;
  unitNamePlural: string;
  unitShort: string;
  minCustomAmount: number;
  phone: string;
  phoneHref: string;
  email: string;
  heroImage: string;
  // Optional pre-designed banner (text baked in). When set, the hero renders
  // this full-bleed image instead of the background + overlaid HTML text.
  bannerImage?: string;
  bannerImageMobile?: string;
  aboutImage: string;
  heroTagline: string;
  heroHeading1: string;
  heroHeading2: string;
  heroDesc: string;
  formHeading: string;
  formSubheading: string;
  privileges: Privilege[];
  higherPrivileges: Privilege[];
  statsApiEndpoint: string;
  orderType: string;
}

export const SQFT_CAMPAIGN: CampaignConfig = {
  type: "SQFT",
  pageTitle: "Square Foot Seva",
  metaTitle: "Square Foot Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  metaDesc:
    "Be a part of the Hare Krishna Vaikuntham Temple in the making. Sponsor one or more square feet of construction at ₹2,100 per square foot and receive prasadam, a contribution certificate and 80G tax exemption.",
  ogTitle: "Square Foot Seva — Hare Krishna Vaikuntham Temple",
  ogDesc:
    "Sponsor the sacred ground of the rising temple. Every square foot becomes a permanent part of the Lord's abode.",
  ogImage: "/assets/home-temple-construction-banner.webp",
  pricePerUnit: 2100,
  unitName: "square foot",
  unitNamePlural: "square feet",
  unitShort: "sq ft",
  minCustomAmount: 1, // TEMP: ₹1 minimum for live payment testing — restore to 500 after.
  phone: "+91 89777 61187",
  phoneHref: "tel:+918977761187",
  email: "social@hkmvizag.org",
  heroImage:
    "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783672822355-1783672821116-ChatGPTImageJul92026043238PM.png",
  bannerImage: "/assets/sqft-banner-desktop.webp",
  bannerImageMobile: "/assets/sqft-banner-mobile.webp",
  aboutImage: "/assets/vizag-temple-1.jpeg",
  heroTagline: "A fundraising initiative of Hare Krishna Movement Visakhapatnam",
  heroHeading1: "Hare Krishna",
  heroHeading2: "Vaikuntham Temple",
  heroDesc:
    "Be a part of the temple in the making — sponsor one or more square feet of construction, and become a permanent part of the Lord's abode.",
  formHeading: "Sponsor Your Square Feet",
  formSubheading:
    "Every square foot becomes a permanent part of the Lord's abode. Choose a clear and meaningful donation path with confidence.",
  privileges: [
    { icon: UtensilsCrossed, title: "Sanctified Prasadam", text: "Receive the Lord's prasadam from the temple as a blessing for your seva (within India)." },
    { icon: Sparkles, title: "Puja Participation", text: "Participate in the pujas conducted on the auspicious inauguration day of the temple." },
    { icon: FileCheck2, title: "Contribution Certificate", text: "A digital certificate honouring your valued contribution to the temple construction." },
    { icon: Landmark, title: "80G Tax Exemption", text: "Donations qualify for tax exemption under Section 80G of the Income Tax Act." },
  ],
  higherPrivileges: [
    { icon: ScrollText, title: "Name Inscription", text: "Larger contributions are honoured with the donor's family name inscribed at the temple." },
    { icon: Award, title: "Maha Prasadam Box", text: "A special Maha prasadam box offered to Their Lordships, sent to your home." },
    { icon: HeartHandshake, title: "Special Family Pujas", text: "Pujas performed on special occasions of your family — birthdays and anniversaries." },
    { icon: Building2, title: "Inauguration Invitation", text: "A personal invitation to the grand Prana Pratistha ceremonies of Their Lordships." },
  ],
  statsApiEndpoint: "/seva-stats/sqft-campaign",
  orderType: "SQFT",
};

export const BRICK_CAMPAIGN: CampaignConfig = {
  type: "BRICK",
  pageTitle: "Brick Seva",
  metaTitle: "Brick Seva | Hare Krishna Vaikuntham Temple, Visakhapatnam",
  metaDesc:
    "Sponsor bricks for the Hare Krishna Vaikuntham Temple at ₹1,500 per brick. Every brick becomes an eternal part of the Lord's abode — with prasadam, contribution certificate and 80G tax exemption.",
  ogTitle: "Brick Seva — Hare Krishna Vaikuntham Temple",
  ogDesc:
    "Sponsor bricks for the temple construction. Every brick laid with devotion becomes part of the Lord's eternal home.",
  ogImage: "/assets/vizag-temple-1.jpeg",
  pricePerUnit: 1500,
  unitName: "brick",
  unitNamePlural: "bricks",
  unitShort: "brick",
  minCustomAmount: 500,
  phone: "+91 89777 61187",
  phoneHref: "tel:+918977761187",
  email: "social@hkmvizag.org",
  heroImage:
    "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677097861-1783677097620-Screenshot2026-07-10152116.png",
  aboutImage: "/assets/vizag-temple-1.jpeg",
  heroTagline: "A fundraising initiative of Hare Krishna Movement Visakhapatnam",
  heroHeading1: "Hare Krishna",
  heroHeading2: "Vaikuntham Temple",
  heroDesc:
    "Be a part of the temple in the making — sponsor one or more bricks of construction, and become a permanent part of the Lord's abode.",
  formHeading: "Sponsor Your Bricks",
  formSubheading:
    "Every brick becomes a permanent part of the Lord's abode. Choose a clear and meaningful donation path with confidence.",
  privileges: [
    { icon: UtensilsCrossed, title: "Sanctified Prasadam", text: "Receive the Lord's prasadam from the temple as a blessing for your seva (within India)." },
    { icon: Sparkles, title: "Puja Participation", text: "Participate in the pujas conducted on the auspicious inauguration day of the temple." },
    { icon: FileCheck2, title: "Contribution Certificate", text: "A digital certificate honouring your valued contribution to the temple construction." },
    { icon: Landmark, title: "80G Tax Exemption", text: "Donations qualify for tax exemption under Section 80G of the Income Tax Act." },
  ],
  higherPrivileges: [
    { icon: ScrollText, title: "Name Inscription", text: "Larger contributions are honoured with the donor's family name inscribed at the temple." },
    { icon: Award, title: "Maha Prasadam Box", text: "A special Maha prasadam box offered to Their Lordships, sent to your home." },
    { icon: HeartHandshake, title: "Special Family Pujas", text: "Pujas performed on special occasions of your family — birthdays and anniversaries." },
    { icon: Building2, title: "Inauguration Invitation", text: "A personal invitation to the grand Prana Pratistha ceremonies of Their Lordships." },
  ],
  statsApiEndpoint: "/seva-stats/brick-campaign",
  orderType: "BRICK",
};

export const getCampaignConfig = (type: "SQFT" | "BRICK"): CampaignConfig =>
  type === "SQFT" ? SQFT_CAMPAIGN : BRICK_CAMPAIGN;
