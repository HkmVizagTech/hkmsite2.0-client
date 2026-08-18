"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Moon, Sparkles, Star, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import {
  getDatesForMonth,
  getNextUpcomingEvent,
  getEventsForDate,
  type VaishnavaDate,
  type VaishnavaDateType,
} from "@/lib/vaishnavaCalendarData";

const typeConfig: Record<VaishnavaDateType, { badge: string; icon: typeof Moon; color: string; dot: string }> = {
  Ekadashi: { badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", icon: Moon, color: "border-l-blue-500", dot: "bg-blue-500" },
  Festival: { badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", icon: Sparkles, color: "border-l-amber-500", dot: "bg-amber-500" },
  Appearance: { badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", icon: Star, color: "border-l-green-500", dot: "bg-green-500" },
  Disappearance: { badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", icon: Star, color: "border-l-purple-500", dot: "bg-purple-500" },
  Observance: { badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", icon: Star, color: "border-l-gray-400", dot: "bg-gray-400" },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["S","M","T","W","T","F","S"];
const TODAY = new Date();
const CURRENT_MONTH = TODAY.getMonth();

export default function VaishnavCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | VaishnavaDateType>("all");

  const monthEvents = useMemo(() => getDatesForMonth(selectedMonth), [selectedMonth]);
  const filteredEvents = useMemo(() => typeFilter === "all" ? monthEvents : monthEvents.filter((d) => d.type === typeFilter), [monthEvents, typeFilter]);
  const selectedDateEvents = useMemo(() => selectedDate ? getEventsForDate(selectedDate) : [], [selectedDate]);
  const nextEvent = useMemo(() => getNextUpcomingEvent(), []);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(2026, selectedMonth, 1).getDay();
    const daysInMonth = new Date(2026, selectedMonth + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [selectedMonth]);

  const monthCounts = useMemo(() => {
    const c: Record<string, number> = { all: monthEvents.length, Ekadashi: 0, Festival: 0, Appearance: 0, Disappearance: 0 };
    monthEvents.forEach((e) => { if (c[e.type] !== undefined) c[e.type]++; });
    return c;
  }, [monthEvents]);

  const isToday = (day: number) => day === TODAY.getDate() && selectedMonth === TODAY.getMonth() && 2026 === TODAY.getFullYear();

  const getEventsForDay = (day: number): VaishnavaDate[] => {
    const dateStr = `2026-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return getEventsForDate(dateStr);
  };

  return (
    <PageLayout>
      <PageHero
        title="Vaishnava Calendar 2026"
        subtitle="Complete Gaudiya Vaishnava calendar with Ekadashis, festivals, and sacred observances"
        breadcrumb="Vaishnav Calendar"
      />

      <section className="py-8 md:py-12 bg-white dark:bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Description */}
          <p className="mb-6 max-w-3xl text-sm text-muted-foreground leading-relaxed">
            Stay updated on upcoming festivals and important occasions for devotees with the Gaudiya Vaishnava festival calendar, featuring all major celebrations in 2026.
          </p>

          {/* Next event banner */}
          {nextEvent && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-xl border border-border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-3 md:p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Next Upcoming</p>
                  <p className="text-sm md:text-base font-semibold text-foreground">
                    {nextEvent.title}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      — {new Date(nextEvent.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Calendar */}
            <div className="lg:w-[420px] shrink-0">
              {/* Month Navigation */}
              <div className="mb-3 flex items-center justify-between">
                <button onClick={() => setSelectedMonth((p) => (p - 1 + 12) % 12)} className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="text-lg font-bold text-foreground">{MONTHS[selectedMonth]} 2026</h2>
                <button onClick={() => setSelectedMonth((p) => (p + 1) % 12)} className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Month Quick Select */}
              <div className="mb-3 overflow-x-auto scrollbar-hide">
                <div className="flex gap-1 min-w-max pb-1">
                  {MONTHS.map((month, i) => {
                    const count = getDatesForMonth(i).length;
                    const isSelected = i === selectedMonth;
                    const isCurrent = i === CURRENT_MONTH;
                    return (
                      <button key={month} onClick={() => setSelectedMonth(i)} className={`relative flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${isSelected ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                        {month.slice(0, 3)}
                        {count > 0 && (
                          <span className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold ${isSelected ? "bg-white/25 text-white" : "bg-primary/10 text-primary"}`}>
                            {count}
                          </span>
                        )}
                        {isCurrent && !isSelected && <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="rounded-xl border border-border bg-card p-3">
                {/* Weekday headers */}
                <div className="mb-1 grid grid-cols-7 gap-0.5">
                  {WEEKDAYS.map((day, i) => (
                    <div key={`wd-${i}`} className="py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-0.5">
                  {calendarDays.map((day, idx) => {
                    if (day === null) return <div key={`empty-${idx}`} className="h-10 md:h-11" />;

                    const events = getEventsForDay(day);
                    const today = isToday(day);
                    const dateStr = `2026-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSelected = selectedDate === dateStr;
                    const hasEvents = events.length > 0;
                    const eventTypes = [...new Set(events.map((e) => e.type))];

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        className={`group relative flex h-10 md:h-11 flex-col items-center justify-center rounded-md text-xs transition-all ${
                          today ? "bg-primary text-primary-foreground font-bold ring-1 ring-primary/40" :
                          isSelected ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/30" :
                          hasEvents ? "bg-muted/30 hover:bg-muted/60 text-foreground font-medium" :
                          "hover:bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        <span>{day}</span>
                        {hasEvents && (
                          <div className="absolute bottom-0.5 flex gap-px">
                            {eventTypes.slice(0, 3).map((type) => (
                              <span key={type} className={`h-1 w-1 rounded-full ${typeConfig[type]?.dot || "bg-gray-400"}`} />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {([["Ekadashi","blue"],["Festival","amber"],["Appearance","green"],["Disappearance","purple"]] as const).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full bg-${color}-500`} />
                    <span className="text-[10px] text-muted-foreground">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Events */}
            <div className="flex-1 min-w-0">
              {/* Type Filter */}
              <div className="mb-4 flex flex-wrap gap-1.5">
                {(["all","Ekadashi","Festival","Appearance","Disappearance"] as const).map((type) => (
                  <button key={type} onClick={() => setTypeFilter(type)} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${typeFilter === type ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                    {type === "all" ? `All (${monthCounts.all})` :
                     type === "Ekadashi" ? `🌙 Ekadashis (${monthCounts.Ekadashi})` :
                     type === "Festival" ? `✨ Festivals (${monthCounts.Festival})` :
                     type === "Appearance" ? `⭐ Appearances (${monthCounts.Appearance})` :
                     `💫 Disappearances (${monthCounts.Disappearance})`}
                  </button>
                ))}
              </div>

              {/* Selected Date Detail */}
              <AnimatePresence mode="wait">
                {selectedDate && selectedDateEvents.length > 0 && (
                  <motion.div key={selectedDate} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                    </h3>
                    <div className="space-y-2">
                      {selectedDateEvents.map((event) => {
                        const config = typeConfig[event.type];
                        const Icon = config.icon;
                        return (
                          <div key={event.date + event.title} className={`rounded-lg border-l-4 ${config.color} bg-card p-3`}>
                            <div className="flex items-start gap-2">
                              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground">{event.title}</p>
                                {event.description && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{event.description}</p>}
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badge}`}>{event.type}</span>
                                  {event.fastUntilNoon && <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"><Clock className="h-2.5 w-2.5" />Fast until noon</span>}
                                  {event.completeFast && <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300"><Clock className="h-2.5 w-2.5" />Complete fast</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Events List */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {MONTHS[selectedMonth]} Events ({filteredEvents.length})
                </h3>

                {filteredEvents.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <Calendar className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No {typeFilter === "all" ? "" : typeFilter.toLowerCase() + " "}events in {MONTHS[selectedMonth]}.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredEvents.map((event) => {
                      const config = typeConfig[event.type];
                      const Icon = config.icon;
                      const eventDate = new Date(event.date);
                      const dayNum = eventDate.getDate();
                      const weekday = eventDate.toLocaleDateString("en-IN", { weekday: "short" });
                      const isTodayEvent = eventDate.getDate() === TODAY.getDate() && eventDate.getMonth() === TODAY.getMonth();

                      return (
                        <motion.div
                          key={event.date + event.title}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setSelectedDate(event.date === selectedDate ? null : event.date)}
                          className={`group cursor-pointer rounded-lg border border-border bg-card p-3 transition-all hover:shadow-md hover:border-primary/20 border-l-4 ${config.color} ${isTodayEvent ? "ring-2 ring-primary/30 bg-primary/5" : ""}`}
                        >
                          <div className="flex gap-3">
                            {/* Date block */}
                            <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-muted/50 text-center">
                              <span className="text-[9px] font-medium uppercase text-muted-foreground">{weekday}</span>
                              <span className="text-base font-bold leading-none text-foreground">{dayNum}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                                  {event.title}
                                  {isTodayEvent && <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary">TODAY</span>}
                                </h4>
                                <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badge}`}>
                                  <Icon className="h-2.5 w-2.5" />{event.type}
                                </span>
                              </div>
                              {event.description && <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">{event.description}</p>}
                              {(event.fastUntilNoon || event.completeFast) && (
                                <div className="mt-1.5 flex gap-1.5">
                                  {event.fastUntilNoon && <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"><Clock className="h-2.5 w-2.5" />Fast until noon</span>}
                                  {event.completeFast && <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300"><Clock className="h-2.5 w-2.5" />Complete fast</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
