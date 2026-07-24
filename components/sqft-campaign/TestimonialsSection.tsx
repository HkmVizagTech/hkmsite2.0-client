"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Ornament from "@/components/Ornament";

const TESTIMONIALS = [
  {
    quote:
      "Building this temple is like building a bridge between the material and the spiritual. Every square foot we sponsor here is an investment in our eternal future. I feel blessed to have contributed to this divine project.",
    name: "Amit Sharma",
    role: "Devotee, Visakhapatnam",
  },
  {
    quote:
      "Hare Krishna! When I first heard about the Square Foot Seva, I knew I had to participate. The temple will be a beacon of spiritual light for generations to come. My entire family feels connected to the Lord through this service.",
    name: "Priya Patel",
    role: "Regular Donor, Hyderabad",
  },
  {
    quote:
      "I sponsored a square foot in my mother's name. She always wanted to see a grand Krishna temple in Vizag. This seva gives me immense peace — knowing that her name will forever be part of the Lord's home.",
    name: "Ravi Kumar",
    role: "Well-wisher, Bengaluru",
  },
  {
    quote:
      "The transparency and devotion with which HKM Vizag is building this temple is remarkable. My small contribution feels like a drop in the ocean of this divine work. Jai Srila Prabhupada!",
    name: "Sneha Reddy",
    role: "Anna Daan Sponsor, Vizag",
  },
  {
    quote:
      "I have been associated with Hare Krishna Movement for over a decade. Contributing to the temple construction through Square Foot Seva was the most meaningful thing I have done. It feels like I am serving the Lord directly.",
    name: "Venkatesh Rao",
    role: "Devotee, Vijayawada",
  },
  {
    quote:
      "When our family visited the temple construction site, we were moved to see the progress. We immediately decided to sponsor multiple square feet. This is the greatest seva one can do in this lifetime.",
    name: "Meera Iyer",
    role: "Donor, Chennai",
  },
  {
    quote:
      "As a young professional, I wanted to do something meaningful with my earnings. Sponsoring a square foot felt like the right step — a small offering that will stand for eternity in the Lord's abode.",
    name: "Arjun Nair",
    role: "IT Professional, Pune",
  },
  {
    quote:
      "Our family pooled together and sponsored 11 square feet. It was a collective offering of love and devotion. We are grateful to HKM Vizag for giving us this opportunity to serve Sri Krishna.",
    name: "Lakshmi Devi",
    role: "Family Group Donation, Delhi",
  },
  {
    quote:
      "I have always believed that seva is the highest form of worship. This temple will serve generations of devotees. It is a privilege to be a part of its construction through Square Foot Seva.",
    name: "Suresh Babu",
    role: "Lifetime Donor, Visakhapatnam",
  },
];

export default function TestimonialsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <Ornament className="mb-6" />
        <div className="mb-10 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              What Our Devotees Say
            </p>
            <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
              Voices of Devotion
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="w-80 shrink-0 snap-start rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:w-96"
            >
              <Quote className="mb-4 h-7 w-7 text-gold/40" />
              <p className="mb-6 text-sm leading-relaxed text-foreground/85 md:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
