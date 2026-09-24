"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (upcoming.length === 0) return null;

  return (
    <>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcoming.map((f) => (
            <div key={f._id} className="flex flex-col overflow-hidden rounded-lg border border-border">
              {f.cardImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.cardImage} alt={f.title} className="h-28 w-full object-cover" />
              )}
              <div className="flex flex-1 flex-col p-3">
                <p className="font-semibold">{f.title}</p>
                {f.eventDate && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(f.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
                {f.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{f.description}</p>}
                {f.ctaHref && (
                  <Link href={f.ctaHref} className="mt-auto">
                    <Button size="sm" className="mt-2 w-full">{f.ctaLabel || "Donate Now"}</Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
  </>
  );
}
