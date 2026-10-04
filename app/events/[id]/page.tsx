import PageLayout from "@/components/PageLayout";
import EventDetailClient, { EventDetailView } from "@/components/EventDetailClient";
import type { Metadata } from "next";

async function fetchEvent(id: string): Promise<any> {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:3000";
  try {
    const res = await fetch(`${apiUrl}/events/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return json?.event || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEvent(id);
  if (!event?.title) return { title: "Event · ISKCON Vizag" };
  const image = event.bannerImage || (event.images && event.images[0]);
  return {
    title: `${event.title} — ISKCON Vizag`,
    description: (event.description || "").slice(0, 160),
    alternates: { canonical: `/events/${id}` },
    openGraph: {
      title: event.title,
      description: (event.description || "").slice(0, 200),
      type: "article",
      images: image ? [image] : [],
    },
  };
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await fetchEvent(id);

  if (!event) {
    // render a client boundary that will try to fetch the event and show registration form if it appears
    return (
      <PageLayout>
        <EventDetailClient id={id} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <EventDetailView event={event} id={id} />
    </PageLayout>
  );
}
