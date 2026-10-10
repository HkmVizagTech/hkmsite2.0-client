import DonationsClient from "./DonationsClient";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Donate Annadanam & Gau Seva",
  description: "Support ISKCON Gambheeram Visakhapatnam with Annadanam and Gau Seva donations. Sponsor meals and cow care online — 80G tax exemption.",
  path: "/donations",
  image: "/assets/donations-annadana-real.jpg"
});

// Revalidated once a minute rather than on every request: the banner and copy
// change a few times a year, so a cached page is the right default, and an
// admin edit still appears within a minute without a deploy.
export const revalidate = 60;

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

// Fetched here, on the server, so the hero banner and headings are already in
// the HTML the donor receives. Doing it only in the browser meant the page
// painted the built-in default poster first and swapped to the real one a
// second or two later.
//
// Any failure returns null and the client falls back to its built-in defaults,
// exactly as it behaved before — the API being down must never take the
// donation page with it.
async function getDonationPage() {
  try {
    const res = await fetch(`${apiBase()}/donation-page`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.page ?? null;
  } catch {
    return null;
  }
}

export default async function DonationsPage() {
  const initialPage = await getDonationPage();
  return <DonationsClient initialPage={initialPage} />;
}
