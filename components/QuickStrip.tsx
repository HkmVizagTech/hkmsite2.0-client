"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, CalendarDays, UtensilsCrossed, BookOpen } from "lucide-react";

const items = [
  { icon: Flame, title: "Daily Darshan", sub: "7 aartis · 4:30 AM – 8:30 PM", href: "/daily-schedule", tint: "bg-[hsl(42,92%,56%,0.15)] text-[hsl(36,85%,40%)]" },
  { icon: CalendarDays, title: "Festivals & Events", sub: "Celebrations all year round", href: "/events", tint: "bg-secondary/15 text-secondary" },
  { icon: UtensilsCrossed, title: "Subhojanam", sub: "Mid-day meals for children", href: "/subhojanam", tint: "bg-[hsl(150,60%,45%,0.13)] text-[hsl(150,60%,32%)]" },
  { icon: BookOpen, title: "Spiritual Blog", sub: "Wisdom & stories", href: "/blogs", tint: "bg-[hsl(280,60%,55%,0.12)] text-[hsl(280,55%,45%)]" },
];

const QuickStrip = () => (
  <div className="relative z-10 -mt-10 px-4 md:-mt-12">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 }}
      className="container mx-auto"
    >
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl bg-card shadow-elevated lg:grid-cols-4">
        {items.map((it, i) => (
          <Link
            key={it.title}
            href={it.href}
            className={`group flex items-center gap-4 border-border p-5 transition-colors hover:bg-muted/50 md:p-6 ${
              i < items.length - 1 ? "lg:border-r" : ""
            } ${i % 2 === 0 ? "border-r lg:border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""}`}
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${it.tint}`}>
              <it.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <b className="block truncate text-sm font-semibold text-foreground md:text-[15px]">{it.title}</b>
              <span className="block truncate text-[11px] text-muted-foreground md:text-xs">{it.sub}</span>
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  </div>
);

export default QuickStrip;
