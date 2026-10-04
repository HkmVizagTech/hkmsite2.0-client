"use client";

import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import EventCard from "@/components/EventCard";
import { getFallbackEvents, type FallbackEvent } from "@/lib/eventsFallback";

import { useEffect, useState } from "react";

type PreviewEvent = {
  _id?: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  image?: string;
  href?: string;
};

// When the admin hasn't published any events, fall back to the temple's own
// Vaishnava calendar rather than to invented placeholder dates.
const calendarEvents = (): PreviewEvent[] =>
  getFallbackEvents(4).map((e: FallbackEvent) => ({
    _id: e._id,
    title: e.title,
    date: e.date,
    description: e.description,
    image: e.image,
    location: e.location,
    href: e.href,
  }));

const EventsPreview = () => {
  const [events, setEvents] = useState<PreviewEvent[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchEvents() {
      const fallback = calendarEvents();
      try {
        const base =
          (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") ||
          "http://localhost:3003";
        const res = await fetch(`${base}/events?limit=8`, { credentials: "include" });
        if (!res.ok) {
          if (!cancelled) setEvents(fallback);
          return;
        }
        const data = await res.json();
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const upcoming = (Array.isArray(data.events) ? data.events : [])
          .filter((e: any) => e.date && new Date(e.date) >= startOfToday)
          .sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 4)
          .map((e: any) => ({
            ...e,
            image: (e.images && e.images[0]) || e.image || undefined,
          }));

        if (!cancelled) setEvents(upcoming.length > 0 ? upcoming : fallback);
      } catch {
        if (!cancelled) setEvents(fallback);
      }
    }

    fetchEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="vk-section">
      <div className="vk-container">
        <SectionHeading
          eyebrow="Events"
          title="Upcoming Celebrations"
          subtitle="Join us for festivals, kirtans, and special spiritual programs throughout the year."
          action={{ href: "/events", label: "View All Events" }}
        />

        <div className="space-y-5">
          {events.map((event, index) => (
            <Reveal key={(event._id || event.title) + index} delay={Math.min(index, 4) * 0.06}>
              <EventCard
                event={event as any}
                href={event.href || `/events/${event._id || event.title}`}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;
