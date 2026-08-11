"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Loader2,
  Clock,
  Users,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import Ornament from "@/components/Ornament";
import { Button } from "@/components/ui/button";
import VolunteerRegistrationForm, {
  type VolunteerEvent,
} from "@/components/VolunteerRegistrationForm";

const VCC_API =
  (process.env.NEXT_PUBLIC_VCC_API_URL || "").replace(/\/+$/, "") ||
  "https://vcc-client.vercel.app";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function sameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export default function VolunteerEventPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;

  const [event, setEvent] = useState<VolunteerEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`${VCC_API}/api/events/public/${eventId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event || null);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const registrationOpen = event?.status === "registration_open";

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-[88px] md:pt-[104px]">
        <div className="relative min-h-[320px] bg-gradient-navy">
          {event?.bannerImage && (
            <img
              src={event.bannerImage}
              alt={event.name}
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,85%,12%,0.95)] via-[hsl(220,80%,20%,0.6)] to-transparent" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center md:py-20">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
              <Users className="h-3.5 w-3.5" />
              Volunteer Registration
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-heading text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl"
            >
              {event?.name || "Event Registration"}
            </motion.h1>
            {event?.description && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                {event.description}
              </p>
            )}
            {event && (
              <>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-white sm:gap-3 sm:text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <Calendar className="h-3.5 w-3.5 text-amber-300" />
                    {sameDay(event.eventStart, event.eventEnd)
                      ? formatDate(event.eventStart)
                      : `${formatDateShort(event.eventStart)} — ${formatDateShort(event.eventEnd)}`}
                  </span>
                  {!event.availabilitySlots?.length && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                      <Clock className="h-3.5 w-3.5 text-amber-300" />
                      {formatTime(event.eventStart)}
                      {event.eventEnd &&
                        formatTime(event.eventStart) !==
                          formatTime(event.eventEnd) &&
                        ` — ${formatTime(event.eventEnd)}`}
                    </span>
                  )}
                  {event.venue && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                      <MapPin className="h-3.5 w-3.5 text-amber-300" />
                      {event.venue}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1.5 ${
                      registrationOpen
                        ? "bg-green-500/90 text-white"
                        : "bg-white/15 text-white/80"
                    }`}
                  >
                    {registrationOpen
                      ? "Registrations Open"
                      : event?.status === "registration_closed"
                        ? "Registrations Closed"
                        : "Registration Not Open"}
                  </span>
                </div>
                {event.availabilitySlots &&
                  event.availabilitySlots.length > 0 && (
                    <div className="mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-1.5">
                      {event.availabilitySlots.map((slot) => (
                        <span
                          key={slot}
                          className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/10 px-2.5 py-1 text-[11px] font-medium text-amber-100"
                        >
                          <Clock className="h-3 w-3 text-amber-300" />
                          {slot}
                        </span>
                      ))}
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-12 md:py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <Link
            href="/volunteer"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all volunteer opportunities
          </Link>

          <div className="mx-auto max-w-2xl">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading event...
              </div>
            ) : notFound || !event ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-10 text-center shadow-warm"
              >
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <h2 className="mb-2 text-xl font-bold text-foreground">
                  Event Not Found
                </h2>
                <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
                  We couldn&apos;t find this volunteer event. It may have been
                  removed or the link may be incorrect.
                </p>
                <Link href="/volunteer">
                  <Button className="rounded-full">
                    Browse Volunteer Opportunities
                  </Button>
                </Link>
              </motion.div>
            ) : !registrationOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-10 text-center shadow-warm"
              >
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <h2 className="mb-2 text-xl font-bold text-foreground">
                  {event.name}
                </h2>
                <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
                  {event.status === "registration_closed"
                    ? "Registrations for this event have closed."
                    : "Registration for this event is not open right now."}
                </p>
                <Link href="/volunteer">
                  <Button variant="outline" className="rounded-full">
                    Back to volunteer opportunities
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3 font-medium">
                    Seva Registration
                  </p>
                  <Ornament className="mb-4" />
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Register for {event.name}
                  </h2>
                </div>
                <VolunteerRegistrationForm
                  event={event}
                  vccApi={VCC_API}
                  variant="page"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
