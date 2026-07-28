import { notFound } from "next/navigation";
import JanmashtamiClient, { type JanmashtamiCampaigner } from "../../JanmashtamiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "");

async function fetchCampaigner(slug: string): Promise<JanmashtamiCampaigner | null> {
  try {
    const res = await fetch(`${apiBase()}/campaigners/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as JanmashtamiCampaigner;
  } catch {
    return null;
  }
}

// SSR metadata so shared WhatsApp links show the campaigner's name.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaigner = await fetchCampaigner(slug);
  if (!campaigner) return { title: "Sri Krishna Janmashtami | HKM Vizag" };
  return {
    title: `${campaigner.name}'s Janmashtami Seva Campaign | ISKCON Gambheeram Visakhapatnam`,
    description:
      campaigner.message ||
      `Join ${campaigner.name} in offering sevas to Sri Krishna on Janmashtami at ISKCON Gambheeram Visakhapatnam.`,
    openGraph: {
      title: `${campaigner.name}'s Janmashtami Seva Campaign`,
      description: `Join ${campaigner.name} in offering sevas to Sri Krishna on His divine appearance day.`,
    },
  };
}

export default async function JanmashtamiCampaignerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaigner = await fetchCampaigner(slug);
  if (!campaigner) notFound();
  return <JanmashtamiClient campaigner={campaigner} />;
}
