"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Ornament from "@/components/Ornament";

const TESTIMONIALS = [
  {
    quote: "Building this temple is like building a bridge between the material and the spiritual. Every square foot we sponsor here is an investment in our eternal future. I feel blessed to have contributed to this divine project.",
    name: "Amit Sharma",
    role: "Devotee, Visakhapatnam",
    avatar: null,
  },
  {
    quote: "Hare Krishna! When I first heard about the Square Foot Seva, I knew I had to participate. The temple will be a beacon of spiritual light for generations to come. My entire family feels connected to the Lord through this service.",
    name: "Priya Patel",
    role: "Regular Donor, Hyderabad",
    avatar: null,
  },
  {
    quote: "I sponsored a square foot in my mother's name. She always wanted to see a grand Krishna temple in Vizag. This seva gives me immense peace — knowing that her name will forever be part of the Lord's home.",
    name: "Ravi Kumar",
    role: "Well-wisher, Bengaluru",
    avatar: null,
  },
  {
    quote: "The transparency and devotion with which HKM Vizag is building this temple is remarkable. My small contribution feels like a drop in the ocean of this divine work. Jai Srila Prabhupada!",
    name: "Sneha Reddy",
    role: "Anna Daan Sponsor, Vizag",
    avatar: null,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > current ? 1 : -1);
      setCurrent(i);
    },
    [current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % TESTIMONIALS.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <Ornament className="mb-6" />
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            What Our Devotees Say
          </p>
          <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
            Voices of Devotion
          </h2>
        </div>

        <div className="relative mx-auto max-w-2xl">
          <div className="relative min-h-[220px] overflow-hidden rounded-[32px] border border-border bg-card p-8 shadow-sm md:p-12">
            <Quote className="absolute right-6 top-6 h-12 w-12 text-gold/10" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative z-10"
              >
                <p className="mb-6 text-base leading-relaxed text-foreground md:text-lg">
                  &ldquo;{TESTIMONIALS[current].quote}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-primary">{TESTIMONIALS[current].name}</p>
                  <p className="text-sm text-muted-foreground">{TESTIMONIALS[current].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-8 bg-gold" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
