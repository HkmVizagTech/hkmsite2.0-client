"use client";

import { motion } from "framer-motion";
import Ornament from "@/components/Ornament";

const INTRO_VIDEO_ID = "IJTMCgGBriw";

export default function TempleFeaturesSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <Ornament className="mb-6" />
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-heading text-3xl font-bold text-primary md:text-5xl">
            What&apos;s Being Built
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Every square foot you sponsor becomes part of these halls and spaces.
          </p>
        </div>

        {/* Large intro video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="absolute -inset-4 rounded-[32px] bg-primary/20 blur-3xl opacity-30" />
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl ring-1 ring-white/10 sm:rounded-3xl">
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${INTRO_VIDEO_ID}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&playsinline=1&logo=0`}
                title="Hare Krishna Vaikuntham Temple — Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
