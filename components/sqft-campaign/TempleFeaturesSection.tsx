"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Ornament from "@/components/Ornament";

const TEMPLE_FEATURES = [
  "Grand prayer hall with capacity for 1000+ devotees",
  "Beautiful deity room with intricate carvings",
  "Cultural auditorium for spiritual programs",
  "Vedic library and study rooms",
  "Community kitchen (Annadana Hall)",
  "Meditation gardens with sacred Tulasi groves",
  "Guest house for visiting devotees",
  "Children's education center",
];

export default function TempleFeaturesSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <Ornament className="mb-6" />
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            What&apos;s Being Built
          </p>
          <h2 className="mb-2 font-heading text-2xl font-bold text-primary md:text-4xl">
            Temple Features
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Every square foot you sponsor becomes part of these halls and spaces.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-3 sm:grid-cols-2"
        >
          {TEMPLE_FEATURES.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-gold/30"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <span className="text-sm leading-relaxed text-foreground">{feature}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
