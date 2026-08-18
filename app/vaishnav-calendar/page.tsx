"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Moon,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import {
  vaishnavaCalendar2026,
  getDatesForMonth,
  getNextUpcomingEvent,
  getEventsForDate,
  type VaishnavaDate,
  type VaishnavaDateType,
} from "@/lib/vaishnavaCalendarData";

const typeConfig: Record<
  VaishnavaDateType,
  { badge: string; icon: typeof Moon; color: string; dot: string }
> = {
  Ekadashi: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    icon: Moon,
    color: "border-l-blue-500",
    dot: "bg-blue-500",
  },
  Festival: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    icon: Sparkles,
    color: "border-l-amber-500",
    dot: "bg-amber-500",
  },
  Appearance: {
    badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    icon: Star,
    color: "border-l-green-500",
    dot: "bg-green-500",
  },
  Disappearance: {
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    icon: Star,
    color: "border-l-purple-500",
    dot: "bg-purple-500",
  },
  Observance: {
    badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    icon: Star,
    color: "border-l-gray-400",
    dot: "bg-gray-400",
  },
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TODAY = new Date();
const CURRENT_MONTH = TODAY.getMonth();

export default function VaishnavCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<
    "all" | "Ekadashi" | "Festival" | "Appearance" | "Disappearance"
  >("all");

  // Get events for the selected month
  const monthEvents = useMemo(
    () => getDatesForMonth(selectedMonth),
    [selectedMonth]
  );

  // Filter by type
  const filteredEvents = useMemo(() => {
    if (typeFilter === "all") return monthEvents;
    return monthEvents.filter((d) => d.type === typeFilter);
  }, [monthEvents, typeFilter]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  }, [selectedDate]);

  // Next upcoming event
  const nextEvent = useMemo(() => getNextUpcomingEvent(), []);

  // Build calendar grid for the month
  const calendarDays = useMemo(() => {
    const year = 2026;
    const firstDay = new Date(year, selectedMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();
    const days: (number | null)[] = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) days.push(null);
    // Day cells
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
  }, [selectedMonth]);

  // Count events per type for the selected month
  const monthCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: monthEvents.length,
      Ekadashi: 0,
      Festival: 0,
      Appearance: 0,
      Disappearance: 0,
    };
    monthEvents.forEach((e) => {
      if (counts[e.type] !== undefined) counts[e.type]++;
    });
    return counts;
  }, [monthEvents]);

  // Check if a date is today
  const isToday = (day: number) => {
    return (
      day === TODAY.getDate() &&
      selectedMonth === TODAY.getMonth() &&
      2026 === TODAY.getFullYear()
    );
  };

  // Get events for a specific day number
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

      <section className="py-12 md:py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Description */}
          <div className="mb-10 max-w-3xl">
            <p className="text-muted-foreground leading-relaxed">
              Stay updated on the upcoming festivals and important occasions for
              devotees with the Gaudiya Vaishnava festival calendar, featuring
              all major celebrations in 2026. This calendar helps you plan your
              month according to Vaishnava fasting dates and spiritually
              significant tithis, ensuring you never miss special observance
              days like Ekadashi or appearance days of the Lord.
            </p>
          </div>

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
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Next Upcoming
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {nextEvent.title}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      —{" "}
                      {new Date(nextEvent.date).toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left: Calendar Grid */}
            <div>
              {/* Month Navigation */}
              <div className="mb-6 flex items-center justify-between">
                <button
                  onClick={() =>
                    setSelectedMonth((prev) => (prev - 1 + 12) % 12)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold text-foreground">
                  {MONTHS[selectedMonth]} 2026
                </h2>
                <button
                  onClick={() => setSelectedMonth((prev) => (prev + 1) % 12)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Month Quick Select */}
              <div className="mb-6 overflow-x-auto scrollbar-hide">
                <div className="flex gap-1.5 min-w-max pb-2">
                  {MONTHS.map((month, i) => {
                    const count = getDatesForMonth(i).length;
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
                          <span
                            className={`ml-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                              isSelected
                                ? "bg-white/25 text-white"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
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

              {/* Calendar Grid */}
              <div className="rounded-xl border border-border bg-card p-4 md:p-6">
                {/* Weekday headers */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className="h-16 md:h-20" />;
                    }

                    const events = getEventsForDay(day);
                    const today = isToday(day);
                    const dateStr = `2026-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSelected = selectedDate === dateStr;
                    const hasEvents = events.length > 0;

                    // Get unique event types for dots
                    const eventTypes = [
                      ...new Set(events.map((e) => e.type)),
                    ];

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        className={`group relative flex h-16 md:h-20 flex-col items-center rounded-lg border p-1.5 transition-all ${
                          today
                            ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                            : isSelected
                              ? "border-primary/50 bg-primary/10"
                              : hasEvents
                                ? "border-border hover:border-primary/30 hover:bg-muted/50"
                                : "border-transparent hover:bg-muted/30"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            today
                              ? "text-primary font-bold"
                              : hasEvents
                                ? "text-foreground"
                                : "text-muted-foreground"
                          }`}
                        >
                          {day}
                        </span>

                        {/* Event dots */}
                        {hasEvents && (
                          <div className="mt-auto flex flex-wrap justify-center gap-0.5">
                            {eventTypes.slice(0, 3).map((type) => (
                              <span
                                key={type}
                                className={`h-1.5 w-1.5 rounded-full ${typeConfig[type]?.dot || "bg-gray-400"}`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Today label */}
                        {today && (
                          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-1.5 text-[8px] font-bold text-primary-foreground">
                            TODAY
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Type Filter */}
              <div className="mt-6 flex flex-wrap gap-2">
                {(
                  ["all", "Ekadashi", "Festival", "Appearance", "Disappearance"] as const
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                      typeFilter === type
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {type === "all"
                      ? `All (${monthCounts.all})`
                      : type === "Ekadashi"
                        ? `🌙 Ekadashis (${monthCounts.Ekadashi})`
                        : type === "Festival"
                          ? `✨ Festivals (${monthCounts.Festival})`
                          : type === "Appearance"
                            ? `⭐ Appearances (${monthCounts.Appearance})`
                            : `💫 Disappearances (${monthCounts.Disappearance})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Events Sidebar */}
            <div>
              {/* Selected Date Events */}
              <AnimatePresence mode="wait">
                {selectedDate && selectedDateEvents.length > 0 && (
                  <motion.div
                    key={selectedDate}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4"
                  >
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        }
                      )}
                    </h3>
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => {
                        const config = typeConfig[event.type];
                        const Icon = config.icon;
                        return (
                          <div
                            key={event.date + event.title}
                            className={`rounded-lg border-l-4 ${config.color} bg-card p-3`}
                          >
                            <div className="flex items-start gap-2">
                              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {event.title}
                                </p>
                                {event.description && (
                                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    {event.description}
                                  </p>
                                )}
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badge}`}
                                  >
                                    {event.type}
                                  </span>
                                  {event.fastUntilNoon && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                      <Clock className="h-2.5 w-2.5" />
                                      Fast until noon
                                    </span>
                                  )}
                                  {event.completeFast && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                      <Clock className="h-2.5 w-2.5" />
                                      Complete fast
                                    </span>
                                  )}
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

              {/* Events List for Month */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {MONTHS[selectedMonth]} Events ({filteredEvents.length})
                </h3>

                {filteredEvents.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <Calendar className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No{" "}
                      {typeFilter === "all"
                        ? ""
                        : typeFilter.toLowerCase() + " "}
                      events in {MONTHS[selectedMonth]}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredEvents.map((event) => {
                      const config = typeConfig[event.type];
                      const Icon = config.icon;
                      const eventDate = new Date(event.date);
                      const dayNum = eventDate.getDate();
                      const weekday = eventDate.toLocaleDateString("en-IN", {
                        weekday: "short",
                      });
                      const isTodayEvent =
                        eventDate.getDate() === TODAY.getDate() &&
                        eventDate.getMonth() === TODAY.getMonth();

                      return (
                        <motion.div
                          key={event.date + event.title}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`group relative rounded-xl border border-border bg-card p-3 transition-all hover:shadow-md hover:border-primary/20 border-l-4 ${config.color} ${
                            isTodayEvent
                              ? "ring-2 ring-primary/30 bg-primary/5"
                              : ""
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Date block */}
                            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-muted/50 text-center">
                              <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                                {weekday}
                              </span>
                              <span className="text-lg font-bold leading-none text-foreground">
                                {dayNum}
                              </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                                  {event.title}
                                  {isTodayEvent && (
                                    <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                                      TODAY
                                    </span>
                                  )}
                                </h4>
                                <span
                                  className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badge}`}
                                >
                                  <Icon className="h-2.5 w-2.5" />
                                  {event.type}
                                </span>
                              </div>
                              {event.description && (
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                              {(event.fastUntilNoon || event.completeFast) && (
                                <div className="mt-1.5 flex gap-1.5">
                                  {event.fastUntilNoon && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                      <Clock className="h-2.5 w-2.5" />
                                      Fast until noon
                                    </span>
                                  )}
                                  {event.completeFast && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                      <Clock className="h-2.5 w-2.5" />
                                      Complete fast
                                    </span>
                                  )}
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
