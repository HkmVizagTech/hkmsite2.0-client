"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Sparkles } from "lucide-react";

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
        setUpcoming((data || []).filter((f) => f.status === "upcoming"));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (upcoming.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#772036]" />
          <h2 className="font-semibold">Upcoming Sevas & Festivals</h2>
        </div>
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
      </CardContent>
    </Card>
  );
}
