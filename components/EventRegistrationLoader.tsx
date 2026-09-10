"use client";

import React, { useEffect, useState } from "react";
import EventRegistrationForm from "./EventRegistrationForm";

interface Props {
  eventId: string;
  initialFormSchema?: any;
  initialEvent?: any;
}

export default function EventRegistrationLoader({ eventId, initialFormSchema, initialEvent }: Props) {
  const [formSchema, setFormSchema] = useState<any | null>(initialFormSchema || null);
  const [event, setEvent] = useState<any | null>(initialEvent || null);
  const [externalLink, setExternalLink] = useState<string>(initialEvent?.registrationLink || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   
    if (!formSchema) {
      let mounted = true;
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
      const tryFetch = async (attempt: number) => {
        try {
          setLoading(true);
          const res = await fetch(`${apiUrl}/events/${eventId}`, { credentials: 'include' });
          if (!mounted) return false;
          if (!res.ok) return false;
          const json = await res.json();
          const ev = json.event || null;
          if (ev) {
            if (!mounted) return true;
            setEvent(ev);
            if (ev.registrationLink) setExternalLink(ev.registrationLink);
            if (ev.registrationForm && ev.registrationForm.enabled) setFormSchema(ev.registrationForm);
            return true;
          }
          return false;
        } catch (e) {
          return false;
        } finally {
          if (mounted) setLoading(false);
        }
      };

      (async () => {
        const maxAttempts = 6;
        for (let i = 0; i < maxAttempts && mounted && !formSchema; i++) {
          const ok = await tryFetch(i + 1);
          if (ok) break;
         
          await new Promise((r) => setTimeout(r, 250 * Math.pow(2, i)));
        }
      })();

      return () => { mounted = false; };
    }
  }, [eventId, formSchema]);

  // The event registers on its own landing page — link out instead of the
  // on-page registration form.
  if (externalLink) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          Registrations for this event are handled on its landing page.
        </p>
        <a
          href={externalLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5"
        >
          Register on the event page
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    );
  }

  if (!formSchema) {
   
    return null;
  }

  return <EventRegistrationForm eventId={eventId} formSchema={formSchema} event={event || undefined} />;
}
