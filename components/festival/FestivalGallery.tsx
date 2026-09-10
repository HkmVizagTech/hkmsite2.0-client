"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function FestivalGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState<number | null>(null);

  if (!images.length) return null;

  const prev = () =>
    setActive((cur) => (cur === null ? null : (cur + images.length - 1) % images.length));
  const next = () =>
    setActive((cur) => (cur === null ? null : (cur + 1) % images.length));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            className={`group relative overflow-hidden rounded-2xl border border-border ${
              i === 0 ? "col-span-2 sm:col-span-2 row-span-2" : ""
            } ${i === 1 ? "sm:col-span-1" : ""} aspect-[4/3]`}
            aria-label={`View photo ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Festival photo ${i + 1}`}
              loading={i > 2 ? "lazy" : "eager"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
            <span className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/15" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={images[active]}
                alt={`Festival photo ${active + 1}`}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </AnimatePresence>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}