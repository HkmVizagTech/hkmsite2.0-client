import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import EventRegistrationLoader from "@/components/EventRegistrationLoader";
import EventDetailClient from "@/components/EventDetailClient";
import Image from "next/image";
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

  const heroImage = event.bannerImage || (event.images && event.images[0]) || "/assets/gallery-festival-2.jpg";

  return (
    <PageLayout>
      <PageHero title={event.title} subtitle={event.description} breadcrumb={event.title} backgroundImage={heroImage} />
      <section className="py-12 bg-white dark:bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card rounded-2xl p-6">
            <h1 className="font-heading text-2xl font-bold mb-2">{event.title}</h1>
            <p className="text-muted-foreground mb-4">{new Date(event.date).toLocaleString()}</p>
            {event.images && event.images[0] && <div className="w-full h-72 relative mb-4"><Image src={event.images[0]} alt={event.title} fill sizes="100vw" className="object-cover rounded-lg"/></div>}
            <p className="mb-6">{event.description}</p>

            {
}
            <EventRegistrationLoader eventId={event._id || id} initialFormSchema={event.registrationForm} initialEvent={event} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
