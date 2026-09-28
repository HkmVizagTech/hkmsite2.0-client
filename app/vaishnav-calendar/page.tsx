"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Moon,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  List,
  CalendarDays,
  CalendarCheck,
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  vaishnavaCalendar2026,
  getDatesForMonth,
  getNextUpcomingEvent,
  getEventsForDate,
  type VaishnavaDate,
  type VaishnavaDateType,
} from "@/lib/vaishnavaCalendarData";

/* ────────────────────────────────────────────────────────────
   Design tokens per event type
──────────────────────────────────────────────────────────── */
const typeConfig: Record<
  VaishnavaDateType,
  { badge: string; icon: typeof Moon; dot: string; text: string; softBg: string }
> = {
  Ekadashi: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    icon: Moon,
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    softBg: "bg-blue-500/10",
  },
  Festival: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    icon: Sparkles,
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-500/10",
  },
  Appearance: {
    badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    icon: Star,
    dot: "bg-green-500",
    text: "text-green-600 dark:text-green-400",
    softBg: "bg-green-500/10",
  },
  Disappearance: {
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    icon: Star,
    dot: "bg-purple-500",
    text: "text-purple-600 dark:text-purple-400",
    softBg: "bg-purple-500/10",
  },
  Observance: {
    badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    icon: Star,
    dot: "bg-gray-400",
    text: "text-gray-500 dark:text-gray-400",
    softBg: "bg-gray-500/10",
  },
};

/** Solid hex per type — used for tinted calendar cells & legend swatches. */
const TYPE_HEX: Record<VaishnavaDateType, string> = {
  Ekadashi: "#3b82f6", // blue-500
  Festival: "#f59e0b", // amber-500
  Appearance: "#22c55e", // green-500
  Disappearance: "#a855f7", // purple-500
  Observance: "#9ca3af", // gray-400
};

/** Tinted background (gradient when 2+ types) + matching border for a day cell. */
function eventCellStyle(types: VaishnavaDateType[]): CSSProperties {
  const first = TYPE_HEX[types[0]] ?? TYPE_HEX.Observance;
  if (types.length === 1) {
    return { background: `${first}1f`, borderColor: `${first}55` };
  }
  const second = TYPE_HEX[types[1]] ?? first;
  return {
    background: `linear-gradient(135deg, ${first}26 0%, ${second}26 100%)`,
    borderColor: `${first}55`,
  };
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const YEAR = 2026;
const TODAY = new Date();
const CURRENT_MONTH = TODAY.getMonth();

const discoverCards = [
  { title: "Daily Schedule", subtitle: "Aarti timings & programs", href: "/daily-schedule", cta: "View Schedule" },
  { title: "Volunteer", subtitle: "Serve with us at the temple", href: "/volunteer", cta: "Join Now" },
  { title: "Subhojanam", subtitle: "Hospital prasadam seva", href: "/subhojanam", cta: "Learn More" },
  { title: "Anna Daan Seva", subtitle: "Feed the hungry", href: "/anna-daan-seva", cta: "Sponsor Now" },
  { title: "Contact Us", subtitle: "Visit, call, or write", href: "/contact", cta: "Get in Touch" },
  { title: "Donate", subtitle: "Support temple activities", href: "/donate", cta: "Donate Now" },
];

/* ────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────── */
const pad = (n: number) => String(n).padStart(2, "0");
const dateStrOf = (month: number, day: number) => `${YEAR}-${pad(month + 1)}-${pad(day)}`;

/** Below lg the detail panel is hidden, so taps open a bottom sheet instead. */
function useIsCompactView() {
  const [isCompact, setIsCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isCompact;
}

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function Countdown({ targetDate }: { targetDate: string }) {
  const now = useNow(1000);
  const target = new Date(`${targetDate}T00:00:00`).getTime();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const units: { value: number; label: string }[] = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: mins, label: "Mins" },
    { value: secs, label: "Secs" },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center rounded-xl bg-white/10 px-2.5 py-1.5 backdrop-blur-sm ring-1 ring-white/15">
            <span className="font-heading text-lg font-bold leading-none text-white tabular-nums md:text-2xl">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-widest text-white/60 md:text-[9px]">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && <span className="font-heading text-base text-white/40 md:text-lg">:</span>}
        </div>
      ))}
    </div>
  );
}

function EventTooltip({ event }: { event: VaishnavaDate }) {
  const config = typeConfig[event.type];
  const Icon = config.icon;
  return (
    <div className="w-56 space-y-1.5 p-0.5 text-left">
      <div className="flex items-center gap-2">
        <span className={`flex h-5 w-5 items-center justify-center rounded-md ${config.badge}`}>
          <Icon className="h-3 w-3" />
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${config.text}`}>{event.type}</span>
        {event.completeFast && (
          <span className="ml-auto text-[9px] font-semibold text-red-500">Full fast</span>
        )}
        {!event.completeFast && event.fastUntilNoon && (
          <span className="ml-auto text-[9px] font-semibold text-orange-500">Fast till noon</span>
        )}
      </div>
      <p className="text-xs font-semibold leading-snug text-foreground">{event.title}</p>
      {event.description && (
        <p className="line-clamp-3 text-[10px] leading-relaxed text-muted-foreground">{event.description}</p>
      )}
    </div>
  );
}

function EventCard({ event, index = 0 }: { event: VaishnavaDate; index?: number }) {
  const config = typeConfig[event.type];
  const Icon = config.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border border-border/50 bg-card p-3.5 transition-all hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex items-start gap-2.5">
        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.badge}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-foreground">{event.title}</p>
          {event.description && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{event.description}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badge}`}>
              {event.type}
            </span>
            {event.fastUntilNoon && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                <Clock className="h-2.5 w-2.5" />Fast until noon
              </span>
            )}
            {event.completeFast && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                <Clock className="h-2.5 w-2.5" />Complete fast
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Day cell — tinted square, hover tooltip on desktop
──────────────────────────────────────────────────────────── */
interface DayCellProps {
  day: number;
  dateStr: string;
  allEvents: VaishnavaDate[];
  visibleEvents: VaishnavaDate[];
  dimmed: boolean;
  today: boolean;
  isSelected: boolean;
  showTooltip: boolean;
  onSelect: (dateStr: string) => void;
}

function DayCell({
  day,
  dateStr,
  allEvents,
  visibleEvents,
  dimmed,
  today,
  isSelected,
  showTooltip,
  onSelect,
}: DayCellProps) {
  const types = [...new Set(visibleEvents.map((e) => e.type))];
  const hasVisible = visibleEvents.length > 0;
  const hasAny = allEvents.length > 0;
  const hasCompleteFast = allEvents.some((e) => e.completeFast);

  const button = (
    <button
      onClick={() => onSelect(dateStr)}
      style={hasVisible ? eventCellStyle(types) : undefined}
      className={`relative flex aspect-square w-full flex-col items-center justify-center rounded-xl border text-sm transition-all duration-200 ${
        isSelected
          ? "scale-105 border-primary bg-primary font-bold text-primary-foreground shadow-md"
          : today
            ? "border-transparent bg-muted/60 font-bold text-foreground ring-2 ring-[hsl(var(--gold))] ring-offset-1 ring-offset-background"
            : hasVisible
              ? "border font-semibold text-foreground hover:scale-105 hover:shadow-md"
              : dimmed
                ? "border-transparent text-muted-foreground/35"
                : "border-transparent text-muted-foreground hover:bg-muted/50"
      } ${hasVisible && !isSelected && !today ? (dimmed ? "opacity-50" : "") : ""}`}
      aria-label={`${day} ${MONTHS[parseInt(dateStr.slice(5, 7), 10) - 1]} ${dateStr.slice(0, 4)}${hasAny ? ", has events" : ""}`}
    >
      <span className="leading-none">{day}</span>
      {hasCompleteFast && !isSelected && (
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500/90" aria-hidden />
      )}
      {isSelected && <span className="sr-only">selected</span>}
    </button>
  );

  if (!showTooltip || allEvents.length === 0) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top" className="p-2.5">
        <div className="space-y-2">
          {allEvents.map((e) => (
            <EventTooltip key={e.date + e.title} event={e} />
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

/* ────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────── */
export default function VaishnavCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sheetDate, setSheetDate] = useState<string | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [typeFilter, setTypeFilter] = useState<VaishnavaDateType | "All">("All");

  const isCompact = useIsCompactView();
  const now = useNow(60000);
  const nextEvent = useMemo(() => getNextUpcomingEvent(), [now]);

  const monthEvents = useMemo(() => getDatesForMonth(selectedMonth), [selectedMonth]);

  const filteredMonthEvents = useMemo(
    () => (typeFilter === "All" ? monthEvents : monthEvents.filter((e) => e.type === typeFilter)),
    [monthEvents, typeFilter]
  );

  const selectedDateEvents = useMemo(
    () => (selectedDate ? getEventsForDate(selectedDate) : []),
    [selectedDate]
  );

  const sheetEvents = useMemo(
    () => (sheetDate ? getEventsForDate(sheetDate) : []),
    [sheetDate]
  );

  const calendarDays = useMemo(() => {
    const firstDay = new Date(YEAR, selectedMonth, 1).getDay();
    const daysInMonth = new Date(YEAR, selectedMonth + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [selectedMonth]);

  const isToday = (day: number) =>
    day === TODAY.getDate() && selectedMonth === TODAY.getMonth() && YEAR === TODAY.getFullYear();

  const formatSelectedDate = () => {
    if (!selectedDate) {
      const todayStr = `${YEAR}-${pad(CURRENT_MONTH + 1)}-${pad(TODAY.getDate())}`;
      return new Date(todayStr + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
      });
    }
    return new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  };

  const currentDateEvents = selectedDate
    ? selectedDateEvents
    : (() => {
        if (selectedMonth !== CURRENT_MONTH || YEAR !== TODAY.getFullYear()) return [];
        return getEventsForDate(`${YEAR}-${pad(CURRENT_MONTH + 1)}-${pad(TODAY.getDate())}`);
      })();

  /** Desktop: toggle right-panel selection. Compact: open bottom sheet. */
  const handleDaySelect = (dateStr: string) => {
    if (isCompact) {
      setSheetDate(dateStr);
    } else {
      setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
    }
  };

  /* Upcoming list view */
  const upcomingEvents = useMemo(() => {
    const todayStr = `${YEAR}-${pad(TODAY.getMonth() + 1)}-${pad(TODAY.getDate())}`;
    return vaishnavaCalendar2026
      .filter((e) => e.date >= todayStr)
      .filter((e) => typeFilter === "All" || e.type === typeFilter)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [typeFilter]);

  return (
    <PageLayout>
      {/* ── Hero with countdown ─────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-hero pt-20">
        {/* decorative glows */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[hsl(var(--gold))]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--gold))] ring-1 ring-white/15">
              <CalendarDays className="h-3 w-3" /> Gaudiya Vaishnava Almanac
            </span>
            <h1 className="font-heading text-4xl font-bold text-white md:text-5xl">
              Vaishnava Calendar 2026
            </h1>
            <p className="mt-3 text-sm text-white/70 md:text-base">
              Ekadashis, festivals &amp; sacred observances — computed for Mayapur (IST)
            </p>
          </motion.div>

          {/* Countdown card */}
          {nextEvent && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md md:p-6"
            >
              <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--gold))]">
                    Next Upcoming
                  </p>
                  <p className="mt-1 font-heading text-lg font-bold text-white md:text-xl">
                    {nextEvent.title}
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">
                    {new Date(`${nextEvent.date}T00:00:00`).toLocaleDateString("en-IN", {
                      weekday: "long", day: "numeric", month: "long",
                    })}
                    {nextEvent.fastUntilNoon && !nextEvent.completeFast && " · Fast until noon"}
                    {nextEvent.completeFast && " · Complete fast"}
                  </p>
                </div>
                <Countdown targetDate={nextEvent.date} />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Main section ────────────────────────────────── */}
      <section className="bg-white py-8 dark:bg-background md:py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Toolbar: view switcher + type filter */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex self-start rounded-xl border border-border bg-muted/40 p-1">
              {([
                { key: "calendar" as const, label: "Calendar", icon: CalendarDays },
                { key: "list" as const, label: "Upcoming", icon: List },
              ]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    view === key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Type filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(["All", "Ekadashi", "Festival", "Appearance", "Disappearance"] as const).map((t) => {
                const active = typeFilter === t;
                const dotClass = t === "All" ? "bg-primary" : typeConfig[t].dot;
                return (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {view === "calendar" ? (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* ── 3-Panel Calendar Card ── */}
                <div className="overflow-hidden rounded-2xl border border-border bg-primary/[0.03] shadow-sm dark:bg-primary/[0.06]">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left: Month sidebar */}
                    <div className="hidden min-w-[200px] max-w-[200px] flex-col bg-primary p-4 text-primary-foreground lg:flex">
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest opacity-70">2026</h3>
                      <div className="flex flex-col gap-0.5">
                        {MONTHS.map((month, i) => {
                          const count = getDatesForMonth(i).length;
                          const isSelected = i === selectedMonth;
                          const isCurrent = i === CURRENT_MONTH;
                          return (
                            <button
                              key={month}
                              onClick={() => { setSelectedMonth(i); setSelectedDate(null); }}
                              className={`relative flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "text-white/70 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {month}
                                {isCurrent && !isSelected && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold))]" />
                                )}
                              </span>
                              {count > 0 && (
                                <span className={`text-[10px] font-bold ${isSelected ? "opacity-90" : "opacity-50"}`}>
                                  {count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mobile: month pills */}
                    <div className="bg-primary p-3 lg:hidden">
                      <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex min-w-max gap-1.5">
                          {MONTHS.map((month, i) => {
                            const isSelected = i === selectedMonth;
                            const isCurrent = i === CURRENT_MONTH;
                            return (
                              <button
                                key={month}
                                onClick={() => { setSelectedMonth(i); setSelectedDate(null); }}
                                className={`relative whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                  isSelected
                                    ? "bg-white/25 text-white"
                                    : "text-white/60 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {month.slice(0, 3)}
                                {isCurrent && !isSelected && (
                                  <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold))]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Center: grid */}
                    <div className="flex-1 p-4 md:p-6 lg:border-r lg:border-primary/10">
                      {/* Month nav */}
                      <div className="mb-4 flex items-center justify-between">
                        <button
                          onClick={() => { setSelectedMonth((p) => (p - 1 + 12) % 12); setSelectedDate(null); }}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label="Previous month"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <AnimatePresence mode="wait">
                          <motion.h2
                            key={selectedMonth}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18 }}
                            className="font-heading text-lg font-bold text-foreground"
                          >
                            {MONTHS[selectedMonth]} 2026
                          </motion.h2>
                        </AnimatePresence>
                        <button
                          onClick={() => { setSelectedMonth((p) => (p + 1) % 12); setSelectedDate(null); }}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label="Next month"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Weekday headers */}
                      <div className="mb-1.5 grid grid-cols-7 gap-1">
                        {WEEKDAYS_SHORT.map((day, i) => (
                          <div key={`wd-${i}`} className="py-1 text-center text-[11px] font-semibold text-muted-foreground">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Day cells */}
                      <TooltipProvider delayDuration={150} skipDelayDuration={50}>
                        <div className="grid grid-cols-7 gap-1">
                          {calendarDays.map((day, idx) => {
                            if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />;

                            const dateStr = dateStrOf(selectedMonth, day);
                            const visibleEvents = filteredMonthEvents.filter((e) => e.date === dateStr);
                            const allEvents = getEventsForDate(dateStr);
                            const dimmed = typeFilter !== "All" && visibleEvents.length === 0 && allEvents.length > 0;

                            return (
                              <DayCell
                                key={day}
                                day={day}
                                dateStr={dateStr}
                                allEvents={allEvents}
                                visibleEvents={visibleEvents}
                                dimmed={dimmed}
                                today={isToday(day)}
                                isSelected={selectedDate === dateStr}
                                showTooltip={!isCompact}
                                onSelect={handleDaySelect}
                              />
                            );
                          })}
                        </div>
                      </TooltipProvider>

                      {/* Legend */}
                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/50 pt-3">
                        {([
                          ["Ekadashi", "#3b82f6"],
                          ["Festival", "#f59e0b"],
                          ["Appearance", "#22c55e"],
                          ["Disappearance", "#a855f7"],
                        ] as const).map(([type, hex]) => (
                          <div key={type} className="flex items-center gap-1.5">
                            <span
                              className="h-3 w-3 rounded-[4px] border"
                              style={{ background: `${hex}1f`, borderColor: `${hex}55` }}
                            />
                            <span className="text-[11px] text-muted-foreground">{type}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-[4px] border-2 border-[hsl(var(--gold))] bg-muted/60" />
                          <span className="text-[11px] text-muted-foreground">Today</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          <span className="text-[11px] text-muted-foreground">Complete fast</span>
                        </div>
                      </div>

                      {/* Compact hint */}
                      <p className="mt-3 text-center text-[11px] text-muted-foreground/70 lg:hidden">
                        Tap a highlighted date to see its events
                      </p>
                    </div>

                    {/* Right: day detail panel (desktop only — mobile uses the bottom sheet) */}
                    <div className="hidden border-border/30 p-4 md:p-6 lg:block lg:min-w-[300px] lg:max-w-[340px] lg:border-l lg:border-t-0">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-heading text-sm font-bold text-foreground">{formatSelectedDate()}</h3>
                        {selectedDate && (
                          <button
                            onClick={() => setSelectedDate(null)}
                            className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground hover:text-primary"
                          >
                            Today
                          </button>
                        )}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedDate ?? "today"}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {currentDateEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                                <Calendar className="h-5 w-5 text-muted-foreground/50" />
                              </div>
                              <p className="text-sm font-medium text-muted-foreground">No Notable Events</p>
                              <p className="mt-1 text-xs text-muted-foreground/70">on This Day</p>
                            </div>
                          ) : (
                            <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 space-y-3 lg:max-h-[360px] lg:overflow-y-auto lg:pr-1">
                              {currentDateEvents.map((event, i) => (
                                <EventCard key={event.date + event.title} event={event} index={i} />
                              ))}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ── Upcoming list view ── */
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-border bg-card p-4 md:p-6"
              >
                {upcomingEvents.length === 0 ? (
                  <div className="py-12 text-center">
                    <CalendarCheck className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      The 2026 calendar is complete — all observances have passed.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/70">Hare Krishna! 🙏</p>
                  </div>
                ) : (
                  <div className="relative space-y-2">
                    {/* timeline spine */}
                    <div className="absolute bottom-3 left-[27px] top-3 hidden w-px bg-border sm:block" />
                    {upcomingEvents.map((event, i) => {
                      const config = typeConfig[event.type];
                      const Icon = config.icon;
                      const d = new Date(`${event.date}T00:00:00`);
                      const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
                      const monthName = d.toLocaleDateString("en-IN", { month: "short" });
                      const isNext = nextEvent?.date === event.date && nextEvent?.title === event.title;
                      return (
                        <motion.div
                          key={event.date + event.title}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(i * 0.03, 0.4) }}
                          className={`group relative flex items-start gap-3 rounded-xl border p-3 pl-3 transition-all sm:pl-11 hover:shadow-sm ${
                            isNext
                              ? "border-primary/40 bg-primary/[0.06]"
                              : "border-transparent hover:border-border hover:bg-muted/30"
                          }`}
                        >
                          {/* timeline node (desktop) */}
                          <div
                            className={`absolute left-[27px] top-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-card sm:block ${
                              isNext ? "bg-primary" : config.dot
                            }`}
                          />
                          {/* date chip */}
                          <div className={`flex w-12 shrink-0 flex-col items-center rounded-lg py-1.5 ${config.softBg}`}>
                            <span className="font-heading text-base font-bold leading-none text-foreground">{d.getDate()}</span>
                            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {monthName}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                                {event.title}
                              </p>
                              {isNext && (
                                <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                                  Next
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">{dayName}, 2026</p>
                            {event.description && (
                              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                {event.description}
                              </p>
                            )}
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badge}`}>
                                <Icon className="h-2.5 w-2.5" />{event.type}
                              </span>
                              {event.completeFast && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                  <Clock className="h-2.5 w-2.5" />Complete fast
                                </span>
                              )}
                              {event.fastUntilNoon && !event.completeFast && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                  <Clock className="h-2.5 w-2.5" />Fast until noon
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Discover Section ── */}
          <div className="mt-10">
            <h2 className="mb-2 font-heading text-xl font-bold text-foreground">Discover HKM Vizag</h2>
            <p className="mb-5 text-sm text-muted-foreground">Learn more about what you can do.</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {discoverCards.map((card, i) => (
                <motion.div
                  key={card.href}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={card.href}
                    className="group block rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                  >
                    <h4 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {card.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">{card.subtitle}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                      {card.cta}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile bottom sheet: day events ─────────────── */}
      <Sheet open={sheetDate !== null} onOpenChange={(open) => !open && setSheetDate(null)}>
        <SheetContent side="bottom" className="max-h-[75vh] overflow-y-auto rounded-t-2xl px-4 pb-8 pt-3">
          {/* drag handle */}
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-muted-foreground/25" />
          <SheetHeader className="mb-4 space-y-0 pb-3 text-left">
            <SheetTitle className="font-heading text-base font-bold text-foreground">
              {sheetDate
                ? new Date(sheetDate + "T00:00:00").toLocaleDateString("en-IN", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })
                : ""}
            </SheetTitle>
            <p className="text-xs text-muted-foreground">
              {sheetEvents.length > 0
                ? `${sheetEvents.length} observance${sheetEvents.length > 1 ? "s" : ""} on this day`
                : "No notable events on this day"}
            </p>
          </SheetHeader>
          {sheetEvents.length > 0 ? (
            <div className="space-y-3">
              {sheetEvents.map((event, i) => (
                <EventCard key={event.date + event.title} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                <Calendar className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No Notable Events</p>
              <p className="mt-1 text-xs text-muted-foreground/70">on This Day</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
