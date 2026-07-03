"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    src: "/assets/home-banner-chaitanya-bhavan.webp",
    title: "Chaitanya Bhavan",
    subtitle: "A devotional landmark for culture, community, and seva in Visakhapatnam.",
    tag: "Featured",
  },
  {
    src: "/assets/home-banner-daily-darshan.webp",
    title: "Daily Darshan",
    subtitle: "Sri Sri Radha Madan Mohan blessing devotees with sacred worship and grace.",
    tag: "Darshan",
  },
  {
    src: "/assets/home-banner-radha-madan-mohan.webp",
    title: "Sri Sri Radha Madan Mohan",
    subtitle: "A serene space for devotion, culture, and community.",
    tag: "Worship",
  },
  {
    src: "/assets/home-banner-jagannatha-rath-yatra.webp",
    title: "Jagannatha Rath Yatra",
    subtitle: "Join the sacred procession of Lord Jagannatha and celebrate with the temple family.",
    tag: "Festival",
  },
];

const TempleCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

 
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, next]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      scale: 1.1,
      opacity: 0,
    }),
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-30%" : "30%",
      scale: 0.95,
      opacity: 0,
    }),
  };

  const currentSlide = slides[current];

  return (
    <section className="relative mt-16 w-full overflow-hidden bg-foreground h-[420px] sm:h-[520px] md:mt-24 md:h-auto md:aspect-[1920/700]">
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={currentSlide.src}
            alt={currentSlide.title}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {
}
      <div className="absolute right-6 md:right-10 bottom-24 md:bottom-32 z-20 flex items-center gap-3">
        <button
          onClick={prev}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/5 backdrop-blur-xl border border-background/10 flex items-center justify-center text-background/70 hover:bg-background/15 hover:text-background transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={next}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/5 backdrop-blur-xl border border-background/10 flex items-center justify-center text-background/70 hover:bg-background/15 hover:text-background transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/5 backdrop-blur-xl border border-background/10 flex items-center justify-center text-background/70 hover:bg-background/15 hover:text-background transition-all duration-300"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5" />}
        </button>
      </div>

      {
}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 max-w-md w-full px-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
              setProgress(0);
            }}
            className="flex-1 h-1 rounded-full overflow-hidden bg-background/15 hover:bg-background/25 transition-colors"
            aria-label={`Go to slide ${i + 1}`}
          >
            <motion.div
              className="h-full rounded-full bg-secondary"
              initial={{ width: "0%" }}
              animate={{
                width: i === current ? `${progress}%` : i < current ? "100%" : "0%",
              }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default TempleCarousel;
