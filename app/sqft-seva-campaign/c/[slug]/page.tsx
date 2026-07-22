import { notFound } from "next/navigation";
import SqftCampaignClient from "../../SqftCampaignClient";
import type { CampaignerData } from "@/lib/campaignConfig";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

async function fetchCampaigner(slug: string): Promise<CampaignerData | null> {
  try {
    const res = await fetch(`${apiBase()}/campaigners/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as CampaignerData;
  } catch {
    return null;
  }
}

// SSR metadata so shared WhatsApp links show the campaigner's name.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaigner = await fetchCampaigner(slug);
  if (!campaigner) return { title: "Square Foot Seva Campaign" };
  return {
    title: `${campaigner.name}'s Square Foot Seva Campaign | Hare Krishna Vaikuntham Temple`,
    description:
      campaigner.message ||
      `Join ${campaigner.name} in building the Hare Krishna Vaikuntham Temple — sponsor one or more square feet of construction.`,
    openGraph: {
      title: `${campaigner.name}'s Square Foot Seva Campaign`,
      description: `Join ${campaigner.name} in building the Hare Krishna Vaikuntham Temple, Visakhapatnam.`,
      images: ["/assets/home-temple-construction-banner.webp"],
    },
  };
}

export default async function CampaignerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaigner = await fetchCampaigner(slug);
  if (!campaigner) notFound();
  return <SqftCampaignClient campaigner={campaigner} />;
}
