"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Moon, Sparkles, Star } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";

type ImportantDate = {
  _id: string;
  title: string;
  date: string;
  description?: string;
  type: "Ekadashi" | "Festival" | "Other";
};

const typeStyles: Record<string, { badge: string; icon: typeof Moon }> = {
  Ekadashi: { badge: "bg-secondary/15 text-secondary", icon: Moon },
  Festival: { badge: "bg-accent/20 text-primary", icon: Sparkles },
  Other: { badge: "bg-muted text-muted-foreground", icon: Star },
};

export default function ImportantDatesPage() {
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
    fetch(`${apiUrl}/important-dates`)
      .then((res) => res.json())
      .then((data) => setDates(Array.isArray(data) ? data : data.dates || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = dates
    .filter((d) => new Date(d.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const next = upcoming[0];

  const grouped = dates
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, d) => {
      const key = new Date(d.date).toLocaleString("en-IN", { month: "long", year: "numeric" });
      (acc[key] ||= []).push(d);
      return acc;
    }, {} as Record<string, ImportantDate[]>);

  return (
    <PageLayout>
      <PageHero
        title="Important Dates & Ekadashis"
        subtitle="Fasting days, festivals, and sacred occasions observed at Hare Krishna Vaikuntham"
        breadcrumb="Important Dates"
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          {next && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-14 rounded-2xl bg-gradient-ocean p-[1.5px] shadow-elevated"
            >
              <div className="rounded-2xl bg-card px-6 py-6 md:px-10 md:py-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-ocean text-primary-foreground">
                  <Calendar className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
                    Next Observance
                  </p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    {next.title}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {new Date(next.date).toLocaleDateString("en-IN", {
                      weekday: "long", day: "numeric", month: "long", year: "numeric",
                    })}
                    {next.description ? ` · ${next.description}` : ""}
                  </p>
                </div>
                <span className={`self-start md:self-center inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold ${typeStyles[next.type]?.badge || typeStyles.Other.badge}`}>
                  {next.type}
                </span>
              </div>
            </motion.div>
          )}

          {loading ? (
            <p className="text-center text-muted-foreground py-16">Loading calendar…</p>
          ) : dates.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-muted/50">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">The calendar is being updated. Please check back soon.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([month, items], mi) => (
              <motion.div
                key={month}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: Math.min(mi * 0.05, 0.3) }}
                className="mb-12"
              >
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">{month}</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((d) => {
                    const Icon = (typeStyles[d.type] || typeStyles.Other).icon;
                    const dt = new Date(d.date);
                    const past = dt < new Date(new Date().toDateString());
                    return (
                      <div
                        key={d._id}
                        className={`flex gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:shadow-elevated hover:-translate-y-0.5 ${past ? "opacity-55" : ""}`}
                      >
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-muted">
                          <span className="text-lg font-bold leading-none text-primary">{dt.getDate()}</span>
                          <span className="text-[10px] font-semibold uppercase text-muted-foreground mt-0.5">
                            {dt.toLocaleString("en-IN", { month: "short" })}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground leading-snug">{d.title}</h3>
                            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${(typeStyles[d.type] || typeStyles.Other).badge}`}>
                              <Icon className="h-3 w-3" /> {d.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {dt.toLocaleDateString("en-IN", { weekday: "long" })}
                          </p>
                          {d.description && (
                            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{d.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </PageLayout>
  );
}
