"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Ornament from "@/components/Ornament";

const CLOUDINARY_BASE = "https://res.cloudinary.com/ddmzeqpkc/video/upload";

const SCRIPTURES = [
  {
    citation: "Garuda Purana",
    sanskrit:
      "मन्दिर निर्माणं य: कर्ता देवादिं तु समर्पयेत्।\nधर्मेण पूज्यतां सर्वे स्वर्गं गच्छंति नान्यथा॥",
    translation:
      "One who contributes to the construction of a temple and establishes the deities therein is honored by all and attains heaven through such righteous acts.",
    video: `${CLOUDINARY_BASE}/garuda_purana.mp4`,
  },
  {
    citation: "Vishnu Purana (3.8.27)",
    sanskrit:
      "य: देवालयनिर्माणे य: च दानं समर्पयेत्।\nसर्वपापे विनिर्मुक्तो स्वर्गलोकं गमिष्यति॥",
    translation:
      "One who donates towards the construction of a temple is liberated from all sins and attains the heavenly realms.",
    video: `${CLOUDINARY_BASE}/vishnu_purana.mp4`,
  },
  {
    citation: "The Vamana Purana",
    sanskrit:
      "अ॒ज्ये॒ष्ठासो॒ अ॑निष्ठास ए॒ते सं भ्रात॑रो वावृधु॒: सौभ॑गाय ।\nयुवा॑ पि॒ता स्वपा॑ रु॒द्र ए॑षां सु॒दुघा॒ पृश्नि॑: सु॒दिना॑ म॒रुद्भ्य॑: ॥",
    translation:
      "One can attain the eternal spiritual world (Vaikuntha) by donating for the construction or renovation of a temple.",
    video: `${CLOUDINARY_BASE}/vamana_purana.mp4`,
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
              Sacred scriptures glorify those who support spiritual causes
            </p>
            <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
              The Power of <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Giving</span>
            </h2>
          </div>
          <div className="flex gap-2 md:hidden">
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
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SCRIPTURES.map((s) => (
            <div
              key={s.citation}
              className="w-80 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-background shadow-sm md:w-auto"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <video
                  src={s.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover scale-150"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-white drop-shadow-md">
                    {s.citation}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <p className="mb-3 font-heading text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                  {s.sanskrit}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  &ldquo;{s.translation}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
