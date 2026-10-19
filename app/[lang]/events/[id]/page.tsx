import PageLayout from "@/components/PageLayout";
import EventDetailClient, { EventDetailView } from "@/components/EventDetailClient";
import type { Metadata } from "next";
import { pageSeo, stripBrand, clampDescription, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { notFound, permanentRedirect } from "next/navigation";
import { localeOf } from "@/lib/i18n/server";
import { localizedPath } from "@/lib/i18n/routing";

import { localizedFn } from "@/lib/i18n/seo";
// "missing" = the API says there is no such event (the page answers 404);
// null = the API couldn't be reached (the page retries in the browser).
async function fetchEvent(id: string): Promise<any> {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:3000";
  try {
    const res = await fetch(`${apiUrl}/events/${encodeURIComponent(id)}`, { next: { revalidate: 300 } });
    if (res.status === 404) return "missing";
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return json?.event || null;
  } catch {
    return null;
  }
}

// The page is addressed by the event's slug (/events/gita-jayanti-2026);
// the [id] segment also accepts the database id and earlier slugs, which
// redirect permanently to the current address.
const eventPath = (event: any, fallback: string) => `/events/${event?.slug || fallback}`;

async function baseGenerateMetadata({ params }: { params: Promise<{ id: string; lang: string }> }): Promise<Metadata> {
  const { id } = await params;
  const found = await fetchEvent(id);
  const event = found === "missing" ? null : found;
  if (!event?.title) return { title: "Event", robots: { index: false, follow: true } };
  const image = event.bannerImage || (event.images && event.images[0]) || undefined;
  return pageSeo({
    title: stripBrand(event.title),
    description: clampDescription(event.description) || `${event.title} at ISKCON Gambheeram Visakhapatnam.`,
    path: eventPath(event, id),
    image,
  });
}

export default async function EventDetail({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const { id, lang } = await params;
  const found = await fetchEvent(id);
  if (found === "missing") notFound();
  const event = found;

  // Old /events/<id> links (and edited slugs) move to the event's address.
  if (event?.slug && decodeURIComponent(id).toLowerCase() !== event.slug) {
    permanentRedirect(localizedPath(eventPath(event, id), localeOf(lang)));
  }

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
          { name: event.title, path: eventPath(event, id) },
        ])}
      />
      <EventDetailView event={event} id={id} />
    </PageLayout>
  );
}

export const generateMetadata = localizedFn(baseGenerateMetadata);

// Built on first visit, then served from cache and refreshed every 5
// minutes (ISR) instead of rendered per request. An empty list is what
// lets Next cache these paths at runtime.
export async function generateStaticParams() {
  return [];
}
