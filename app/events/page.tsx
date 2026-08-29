"use client";

import { useState, useEffect } from "react";
import { Bell, CalendarDays } from "lucide-react";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import PageLayout from "@/components/PageLayout";
import WhatsAppCommunityCTA from "@/components/WhatsAppCommunityCTA";
import PageHero from "@/components/PageHero";
import {
  getFallbackEvents,
  getFallbackImportantDates,
} from "@/lib/eventsFallback";

type ImportantDate = {
  _id: string;
  title: string;
  date: string;
  description?: string;
  type: "Ekadashi" | "Festival" | "Other";
};

type DisplayEvent = {
  _id?: string;
  title: string;
  date: string;
  description?: string;
  image?: string;
  location?: string;
  href?: string;
  isFallback?: boolean;
};

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") ||
  "http://localhost:3003";

const getEvents = async (): Promise<DisplayEvent[]> => {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.events || []).map((e: any) => ({
      ...e,
      image: (e.images && e.images[0]) || e.image || undefined,
    }));
  } catch {
    return [];
  }
};

const getImportantDates = async (): Promise<ImportantDate[]> => {
  try {
    const res = await fetch(`${API_BASE}/important-dates`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.dates || [];
  } catch {
    return [];
  }
};

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-3">
      {[
        { val: timeLeft.days, label: "Days" },
        { val: timeLeft.hours, label: "Hrs" },
        { val: timeLeft.mins, label: "Min" },
        { val: timeLeft.secs, label: "Sec" },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
            <span className="text-xl font-bold text-primary font-heading">
              {String(item.val).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function EventsPage() {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getEvents(), getImportantDates()]).then(([apiEvents, apiDates]) => {
      if (cancelled) return;

      // Admin-created events always win. Only when there are none do we fall
      // back to the temple's own Vaishnava calendar, so the page never shows
      // an empty "No events found" to a visitor.
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const upcomingFromApi = apiEvents
        .filter((e) => e.date && new Date(e.date) >= startOfToday)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEvents(upcomingFromApi.length > 0 ? upcomingFromApi : getFallbackEvents());
      setImportantDates(apiDates.length > 0 ? apiDates : getFallbackImportantDates());
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const nextEvent = events[0];
  const showingCalendar = events.some((e) => e.isFallback);

  const hrefFor = (event: DisplayEvent) =>
    event.href || `/events/${event._id || event.title}`;

  const datesByMonth = Object.entries(
    importantDates.reduce((acc, date) => {
      const d = new Date(date.date);
      const key = d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear();
      if (!acc[key]) acc[key] = [];
      acc[key].push(date);
      return acc;
    }, {} as Record<string, ImportantDate[]>)
  );

  return (
    <PageLayout>
      <PageHero
        title="Upcoming Events"
        subtitle="Join us in celebrating the divine festivals and spiritual gatherings"
        breadcrumb="Events"
        backgroundImage="/assets/gallery-festival-2.jpg"
      />

      {/* Next celebration + countdown */}
      {!loading && nextEvent && (
        <section className="py-12 md:py-16 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <EventCard event={nextEvent as any} href={hrefFor(nextEvent)} />
              <div className="flex justify-center mt-6">
                <Countdown targetDate={nextEvent.date} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All upcoming events */}
      <section className="py-12 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-2 font-medium">
                Upcoming Events
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                All Temple Events &amp; Festivals
              </h2>
            </div>
            {showingCalendar && (
              <Link
                href="/vaishnav-calendar"
                className="inline-flex items-center gap-2 self-start rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 sm:self-auto"
              >
                <CalendarDays className="h-4 w-4" />
                View Full Vaishnava Calendar
              </Link>
            )}
          </div>

          <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading && (
              <div className="text-center text-muted-foreground py-10 col-span-full">
                Loading events...
              </div>
            )}
            {!loading &&
              events.map((event) => (
                <EventCard
                  key={event._id || event.title}
                  event={event as any}
                  href={hrefFor(event)}
                  smallCard
                />
              ))}
            {!loading && events.length === 0 && (
              <div className="text-center text-muted-foreground py-10 col-span-full">
                No events scheduled right now — please check back soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Important dates */}
      {datesByMonth.length > 0 && (
        <section className="py-12 md:py-16 bg-white dark:bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">
                Vaishnava Calendar
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Important Dates &amp; Ekadashis
              </h2>
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
              {datesByMonth.map(([month, items]) => (
                <div key={month} className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4 pb-3 border-b border-border">
                    {month}
                  </h3>
                  <div className="space-y-3">
                    {items
                      .slice()
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((date) => (
                        <div key={date._id} className="flex items-start gap-3">
                          <div className="w-14 text-xs font-semibold text-primary bg-primary/5 rounded-lg px-2 py-1.5 text-center shrink-0">
                            {new Date(date.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground leading-snug pt-1 font-semibold">
                              {date.title}
                              <span
                                className={`ml-2 text-xs font-bold ${
                                  date.type === "Festival"
                                    ? "text-yellow-700"
                                    : date.type === "Ekadashi"
                                      ? "text-blue-700"
                                      : "text-gray-500"
                                }`}
                              >
                                {date.type}
                              </span>
                            </p>
                            {date.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {date.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/vaishnav-calendar"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <CalendarDays className="h-4 w-4" />
                See the Full Year Calendar
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stay updated */}
      <section className="py-12 md:py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Bell className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
            Never Miss a Festival
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Follow our social channels to stay updated on festivals, special darshan timings,
            and spiritual events at Hare Krishna Movement Vizag.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.youtube.com/@harekrishnavizag"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Subscribe on YouTube
            </a>
            <a
              href="https://www.facebook.com/harekrishnavizag"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              Follow on Facebook
            </a>
          </div>
        </div>
      </section>
      <WhatsAppCommunityCTA />
    </PageLayout>
  );
}
