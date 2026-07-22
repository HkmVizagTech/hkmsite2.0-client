"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Ornament from "@/components/Ornament";

const SCRIPTURES = [
  {
    citation: "Mahabharata, Anushasana Parva (13.40)",
    sanskrit:
      "य: पुजां च दानं च समर्पयेत् स्वयं देवालये। तस्य पुण्यं महत्त्वं च, स्वर्गगच्छंति हरं तदा॥",
    translation:
      "He who donates and offers worship for the construction of a temple attains great merit and is granted the highest spiritual rewards.",
  },
  {
    citation: "Garuda Purana",
    sanskrit:
      "मन्दिर निर्माणं य: कर्ता देवादिं तु समर्पयेत्। धर्मेण पूज्यतां सर्वे स्वर्गं गच्छंति नान्यथा॥",
    translation:
      "One who contributes to the construction of a temple and establishes the deities therein is honored by all and attains heaven.",
  },
  {
    citation: "The Vamana Purana",
    sanskrit: "अ॒ज्ये॒ष्ठासो॒ अ॑निष्ठास ए॒ते सं भ्रात॑रो वावृधु॒: सौभ॑गाय ।",
    translation: "One can attain the eternal spiritual world (Vaikuntha) by donating for temple construction.",
  },
  {
    citation: "Vishnu Purana (3.8.27)",
    sanskrit:
      "य: देवालयनिर्माणे य: च दानं समर्पयेत्। सर्वपापे विनिर्मुक्तो स्वर्गलोकं गमिष्यति॥",
    translation: "One who donates towards temple construction is liberated from all sins and attains heavenly realms.",
  },
  {
    citation: "The Skanda Purana",
    sanskrit:
      "आत्मनं देवालये समर्पयेत् य: सदा प्रार्थयेत्। शान्तं शान्ति प्राप्तं च पुण्यं लभेत् सदा महात्मनम्॥",
    translation:
      "Donating for temple construction wipes out sins from seven births and delivers forefathers from hellish planets.",
  },
  {
    citation: "Yajurveda (16.3)",
    sanskrit:
      "आत्मनं देवालये समर्पयेत् य: सदा प्रार्थयेत्। शान्तं शान्ति प्राप्तं च पुण्यं लभेत् सदा महात्मनम्॥",
    translation: "One dedicating themselves to the temple receives peace, blessings, and merit.",
  },
];

export default function ImportanceSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  };

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <Ornament className="mb-6" />
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Scriptural Significance
            </p>
            <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">Importance</h2>
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
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SCRIPTURES.map((s) => (
            <div
              key={s.citation}
              className="w-80 shrink-0 snap-start rounded-2xl border border-border bg-background p-6 shadow-sm sm:w-96"
            >
              <Quote className="mb-4 h-7 w-7 text-gold/70" />
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{s.citation}</h3>
              <p className="mb-4 font-heading text-base leading-relaxed text-foreground/90">{s.sanskrit}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{s.translation}&rdquo;</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
