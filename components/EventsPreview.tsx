"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Ornament from "@/components/Ornament";
import { ArrowRight } from "lucide-react";
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
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
    <section className="py-12 md:py-16 bg-white dark:bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">Events</p>
          <Ornament className="mb-5" />
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
            Upcoming Celebrations
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join us for festivals, kirtans, and special spiritual programs throughout the year.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {events.map((event, index) => (
            <EventCard
              key={(event._id || event.title) + index}
              event={event as any}
              href={event.href || `/events/${event._id || event.title}`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            View All Events <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsPreview;
