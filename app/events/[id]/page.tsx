import PageLayout from "@/components/PageLayout";
import EventDetailClient, { EventDetailView } from "@/components/EventDetailClient";
import type { Metadata } from "next";
import { pageSeo, stripBrand, clampDescription, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

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
  if (!event?.title) return { title: "Event", robots: { index: false, follow: true } };
  const image = event.bannerImage || (event.images && event.images[0]) || undefined;
  return pageSeo({
    title: stripBrand(event.title),
    description: clampDescription(event.description) || `${event.title} at ISKCON Gambheeram Visakhapatnam.`,
    path: `/events/${id}`,
    image,
  });
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
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Events", path: "/events" },
          { name: event.title, path: `/events/${id}` },
        ])}
      />
      <EventDetailView event={event} id={id} />
    </PageLayout>
  );
}
