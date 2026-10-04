"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Calendar } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface Showcase {
  _id: string;
  title: string;
  slug: string;
  cardImage?: string;
  eventDate?: string;
  description?: string;
  status: "upcoming" | "completed" | "annual";
  ctaLabel?: string;
  ctaHref?: string;
}

export default function NextSevas() {
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<Showcase[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/festival-showcases/public`)
      .then((res) => res.json())
      .then((data: Showcase[]) => {
        // `status` is set by hand in the admin, so a festival that has come
        // and gone stays flagged "upcoming" until someone remembers to change
        // it — which is why finished festivals were still being shown here.
        // The event's own date is the fact that can't go stale, so it decides:
        // anything dated before today is dropped no matter what status says.
        // Entries with no date at all (a recurring "annual" seva) are kept,
        // since there is nothing to judge them by.
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const live = (data || [])
          .filter((f) => f.status === "upcoming")
          .filter((f) => !f.eventDate || new Date(f.eventDate).getTime() >= startOfToday.getTime())
          // Soonest first — the next festival is the one worth acting on.
          .sort((a, b) => {
            if (!a.eventDate) return 1;
            if (!b.eventDate) return -1;
            return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
          });

        setUpcoming(live);
      })
      .catch(() => setUpcoming([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-vk-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (upcoming.length === 0) return null;

  return (
    <>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {upcoming.map((f) => (
            <div key={f._id} className="flex flex-col overflow-hidden rounded-2xl border border-vk-100 bg-white">
              {f.cardImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.cardImage} alt={f.title} className="h-32 w-full bg-vk-50 object-cover" />
              )}
              <div className="flex flex-1 flex-col p-3.5">
                <p className="font-heading font-bold leading-snug text-ink">{f.title}</p>
                {f.eventDate && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-vk-700">
                    <Calendar className="h-3.5 w-3.5 text-vk-500" />
                    {new Date(f.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
                {f.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{f.description}</p>}
                {f.ctaHref && (
                  <div className="mt-auto pt-3">
                    <Link href={f.ctaHref} className="vk-btn-gold h-11 w-full text-[13px] font-bold">
                      {f.ctaLabel || "Donate Now"}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
  </>
  );
}
