import DonationsClient from "./DonationsClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Donate Annadanam & Gau Seva",
  description: "Support ISKCON Gambheeram Visakhapatnam with Annadanam and Gau Seva donations. Sponsor meals and cow care online — 80G tax exemption.",
  path: "/donations",
  image: "/assets/donations-annadana-real.jpg"
});

export default function DonationsPage() {
  return <DonationsClient />;
}
