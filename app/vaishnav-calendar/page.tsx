"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Moon, Sparkles, Star, ChevronLeft, ChevronRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";

type ImportantDate = {
  _id: string;
  title: string;
  date: string;
  description?: string;
  type: "Ekadashi" | "Festival" | "Other";
};

const typeConfig: Record<string, { badge: string; icon: typeof Moon; color: string }> = {
  Ekadashi: { badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", icon: Moon, color: "border-l-blue-500" },
  Festival: { badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", icon: Sparkles, color: "border-l-amber-500" },
  Other: { badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", icon: Star, color: "border-l-gray-400" },
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TODAY = new Date();
const CURRENT_MONTH = TODAY.getMonth(); // 0-indexed

export default function VaishnavCalendarPage() {
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [typeFilter, setTypeFilter] = useState<"all" | "Ekadashi" | "Festival">("all");

  useEffect(() => {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
    fetch(`${apiUrl}/important-dates`)
      .then((res) => res.json())
      .then((data) => setDates(Array.isArray(data) ? data : data.dates || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter and sort dates
  const filteredDates = useMemo(() => {
    return dates
      .filter((d) => {
        const dDate = new Date(d.date);
        const monthMatch = dDate.getMonth() === selectedMonth;
        const typeMatch = typeFilter === "all" || d.type === typeFilter;
        return monthMatch && typeMatch;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [dates, selectedMonth, typeFilter]);

  // Count events per month for badges
  const monthCounts = useMemo(() => {
    const counts: Record<number, { total: number; ekadashi: number; festival: number }> = {};
    for (let m = 0; m < 12; m++) counts[m] = { total: 0, ekadashi: 0, festival: 0 };
    dates.forEach((d) => {
      const m = new Date(d.date).getMonth();
      counts[m].total++;
      if (d.type === "Ekadashi") counts[m].ekadashi++;
      else if (d.type === "Festival") counts[m].festival++;
    });
    return counts;
  }, [dates]);

  // Check if a date is today
  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getDate() === TODAY.getDate() && d.getMonth() === TODAY.getMonth() && d.getFullYear() === TODAY.getFullYear();
  };

  // Next upcoming event (any type)
  const nextEvent = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return dates
      .filter((d) => new Date(d.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [dates]);

  return (
    <PageLayout>
      <PageHero
        title="Vaishnava Calendar 2026"
        subtitle="Festivals, Ekadashis, and sacred occasions observed at Hare Krishna Vaikuntham"
        breadcrumb="Vaishnav Calendar"
      />

      <section className="py-12 md:py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Next event banner */}
          {nextEvent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-xl border border-border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4 md:p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Next Upcoming</p>
                  <p className="text-lg font-semibold text-foreground">
                    {nextEvent.title}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      — {new Date(nextEvent.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Month tabs */}
          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5 min-w-max pb-2">
              {MONTHS.map((month, i) => {
                const count = monthCounts[i]?.total || 0;
                const isSelected = i === selectedMonth;
                const isCurrent = i === CURRENT_MONTH;
                return (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(i)}
                    className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {month.slice(0, 3)}
                    {count > 0 && (
                      <span className={`ml-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                        isSelected ? "bg-white/25 text-white" : "bg-primary/10 text-primary"
                      }`}>
                        {count}
                      </span>
                    )}
                    {isCurrent && !isSelected && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type filter tabs */}
          <div className="mb-6 flex gap-2">
            {(["all", "Ekadashi", "Festival"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  typeFilter === type
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {type === "all" ? "All" : type === "Ekadashi" ? "🌙 Ekadashis" : "✨ Festivals"}
              </button>
            ))}
          </div>

          {/* Events list */}
          {loading ? (
            <div className="py-20 text-center">
              <Calendar className="mx-auto h-10 w-10 animate-pulse text-muted-foreground/40" />
              <p className="mt-3 text-muted-foreground">Loading calendar…</p>
            </div>
          ) : filteredDates.length === 0 ? (
            <div className="py-20 text-center">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">
                No {typeFilter === "all" ? "" : typeFilter + " "}events in {MONTHS[selectedMonth]}.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedMonth}-${typeFilter}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {filteredDates.map((d) => {
                  const config = typeConfig[d.type] || typeConfig.Other;
                  const Icon = config.icon;
                  const today = isToday(d.date);
                  const dateObj = new Date(d.date);
                  const dayNum = dateObj.getDate();
                  const weekday = dateObj.toLocaleDateString("en-IN", { weekday: "short" });

                  return (
                    <div
                      key={d._id}
                      className={`group relative rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20 border-l-4 ${config.color} ${
                        today ? "ring-2 ring-primary/40 bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Date block */}
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-muted/50 text-center">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{weekday}</span>
                          <span className="text-xl font-bold leading-none text-foreground">{dayNum}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                              {d.title}
                              {today && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                                  TODAY
                                </span>
                              )}
                            </h3>
                            <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badge}`}>
                              <Icon className="h-3 w-3" />
                              {d.type}
                            </span>
                          </div>
                          {d.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                              {d.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
