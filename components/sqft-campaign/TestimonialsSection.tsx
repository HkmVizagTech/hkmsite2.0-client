"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { CampaignConfig } from "@/lib/campaignConfig";
import { SQFT_CAMPAIGN } from "@/lib/campaignConfig";

const TESTIMONIALS = (config: CampaignConfig) => [
  {
    quote:
      `Building this temple is like building a bridge between the material and the spiritual. Every ${config.unitName} we sponsor here is an investment in our eternal future. I feel blessed to have contributed to this divine project.`,
    name: "Amit Sharma",
    role: "Devotee, Visakhapatnam",
  },
  {
    quote:
      `Hare Krishna! When I first heard about the ${config.pageTitle}, I knew I had to participate. The temple will be a beacon of spiritual light for generations to come. My entire family feels connected to the Lord through this service.`,
    name: "Priya Patel",
    role: "Regular Donor, Hyderabad",
  },
  {
    quote:
      `I sponsored a ${config.unitName} in my mother's name. She always wanted to see a grand Krishna temple in Vizag. This seva gives me immense peace — knowing that her name will forever be part of the Lord's home.`,
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
      `I have been associated with Hare Krishna Movement for over a decade. Contributing to the temple construction through ${config.pageTitle} was the most meaningful thing I have done. It feels like I am serving the Lord directly.`,
    name: "Venkatesh Rao",
    role: "Devotee, Vijayawada",
  },
  {
    quote:
      `When our family visited the temple construction site, we were moved to see the progress. We immediately decided to sponsor multiple ${config.unitNamePlural}. This is the greatest seva one can do in this lifetime.`,
    name: "Meera Iyer",
    role: "Donor, Chennai",
  },
  {
    quote:
      `As a young professional, I wanted to do something meaningful with my earnings. Sponsoring a ${config.unitName} felt like the right step — a small offering that will stand for eternity in the Lord's abode.`,
    name: "Arjun Nair",
    role: "IT Professional, Pune",
  },
  {
    quote:
      `Our family pooled together and sponsored 11 ${config.unitNamePlural}. It was a collective offering of love and devotion. We are grateful to HKM Vizag for giving us this opportunity to serve Sri Krishna.`,
    name: "Lakshmi Devi",
    role: "Family Group Donation, Delhi",
  },
  {
    quote:
      `I have always believed that seva is the highest form of worship. This temple will serve generations of devotees. It is a privilege to be a part of its construction through ${config.pageTitle}.`,
    name: "Suresh Babu",
    role: "Lifetime Donor, Visakhapatnam",
  },
];

export default function TestimonialsSection({ config = SQFT_CAMPAIGN }: { config?: CampaignConfig }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  };

  return (
    <section className="vk-section vk-band">
      <div className="vk-container">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <div className="max-w-3xl">
            <span className="vk-pill mb-3">What Our Devotees Say</span>
            <h2 className="vk-h2">Voices of Devotion</h2>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 transition hover:border-vk-700 hover:bg-vk-50"
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
          className="vk-scroller pb-4"
        >
          {TESTIMONIALS(config).map((t) => (
            <div
              key={t.name}
              className="vk-card flex w-[85%] max-w-[24rem] shrink-0 flex-col p-6 sm:w-96"
            >
              <span className="vk-icon-chip mb-4">
                <Quote className="h-5 w-5" />
              </span>
              <p className="mb-6 flex-1 font-serif-display text-[15px] italic leading-relaxed text-ink/85 md:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-vk-100 pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vk-700 text-sm font-bold text-white">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
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
