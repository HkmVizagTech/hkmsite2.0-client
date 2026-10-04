"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, ExternalLink, MapPin } from "lucide-react";
import PageHero from "@/components/PageHero";
import EventRegistrationLoader from "./EventRegistrationLoader";

const fmtEventDate = (s?: string) => {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
};

/**
 * GVD-style event detail: inset photo hero, reading column with the
 * description + registration, and a sticky summary card on desktop.
 * Shared by the server page (app/events/[id]) and the client fallback below.
 */
export function EventDetailView({ event, id }: { event: any; id: string }) {
  const heroImage = event.bannerImage || (event.images && event.images[0]) || "/assets/gallery-festival-2.jpg";
  const externalLink: string = (event.registrationLink || "").trim();
  const hasForm = !!event.registrationForm?.enabled;
  const d = event.date ? new Date(event.date) : null;
  const validDate = d && !Number.isNaN(d.getTime()) ? d : null;

  return (
    <div className="overflow-x-hidden bg-white pt-[var(--header-h)]">
      <PageHero
        title={event.title}
        subtitle={event.description}
        breadcrumb={event.title}
        backgroundImage={heroImage}
        eyebrow="Event"
      />

      <section className="vk-section !pt-6 md:!pt-10">
        <div className="vk-container">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
            {/* ── Main column ── */}
            <div className="min-w-0">
              <div className="vk-card p-5 md:p-8">
                <span className="vk-pill-soft mb-3">About this event</span>
                <h2 className="vk-h3 mb-2">{event.title}</h2>
                <p className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 text-vk-500" />
                  {fmtEventDate(event.date)}
                </p>
                {event.images && event.images[0] && (
                  <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-vk-100 md:aspect-[16/9]">
                    <Image src={event.images[0]} alt={event.title} fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
                  </div>
                )}
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink/85 md:text-base">{event.description}</p>
              </div>

              <div id="register" className="mt-6 scroll-mt-[calc(var(--header-h)+1rem)]">
                <EventRegistrationLoader eventId={event._id || id} initialFormSchema={event.registrationForm} initialEvent={event} />
              </div>
            </div>

            {/* ── Sticky summary / registration card ── */}
            <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)] lg:self-start">
              <div className="vk-card overflow-hidden">
                <div className="relative h-40 bg-vk-900">
                  <Image src={heroImage} alt="" fill sizes="360px" className="object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-vk-900/80 via-vk-900/10 to-transparent" />
                  {validDate && (
                    <div className="absolute left-4 top-4 min-w-[56px] rounded-2xl bg-white/95 px-3 py-2 text-center leading-none shadow-md">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-vk-500">
                        {validDate.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })}
                      </span>
                      <span className="mt-0.5 block text-xl font-extrabold text-vk-800">
                        {validDate.toLocaleDateString("en-IN", { day: "numeric", timeZone: "Asia/Kolkata" })}
                      </span>
                    </div>
                  )}
                  <p className="absolute inset-x-4 bottom-3 line-clamp-2 text-base font-bold leading-snug text-white">
                    {event.title}
                  </p>
                </div>

                <ul className="space-y-3 p-5 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="vk-icon-chip h-9 w-9 rounded-lg">
                      <CalendarDays className="h-4 w-4" />
                    </span>
                    <span className="pt-2 text-ink/85">{fmtEventDate(event.date)}</span>
                  </li>
                  {event.time && (
                    <li className="flex items-start gap-3">
                      <span className="vk-icon-chip h-9 w-9 rounded-lg">
                        <Clock className="h-4 w-4" />
                      </span>
                      <span className="pt-2 text-ink/85">{event.time}</span>
                    </li>
                  )}
                  <li className="flex items-start gap-3">
                    <span className="vk-icon-chip h-9 w-9 rounded-lg">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="pt-2 text-ink/85">{event.location || "Temple Premises"}</span>
                  </li>
                </ul>

                <div className="flex flex-col gap-2 border-t border-vk-100 p-5">
                  {externalLink ? (
                    <a href={externalLink} target="_blank" rel="noreferrer" className="vk-btn-primary min-h-[44px] w-full">
                      Register on the event page <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : hasForm ? (
                    <a href="#register" className="vk-btn-primary min-h-[44px] w-full">
                      Register Now <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : null}
                  <Link href="/events" className="vk-btn-outline min-h-[44px] w-full">
                    <ArrowLeft className="h-4 w-4" /> All Events
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function EventDetailClient({ id }: { id: string }) {
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
        const res = await fetch(`${apiUrl}/events/${id}`, { credentials: 'include' });
        if (!mounted) return;
        if (!res.ok) {
          setEvent(null);
          return;
        }
        const json = await res.json();
        setEvent(json.event || null);
      } catch (e) {
        setEvent(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchEvent();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return null;
  if (!event)
    return (
      <div className="bg-white pt-[var(--header-h)]">
        <div className="vk-container py-16 md:py-24">
          <div className="vk-card mx-auto max-w-md p-8 text-center">
            <p className="text-lg font-bold text-ink">Event not found</p>
            <Link href="/events" className="vk-btn-outline mt-5">
              <ArrowLeft className="h-4 w-4" /> All Events
            </Link>
          </div>
        </div>
      </div>
    );

  return <EventDetailView event={event} id={id} />;
}
