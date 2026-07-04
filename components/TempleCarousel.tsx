"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    src: "/assets/home-banner-chaitanya-bhavan.webp",
    mobileSrc: "/assets/home-banner-chaitanya-bhavan-mobile.webp",
    title: "Chaitanya Bhavan",
  },
  {
    src: "/assets/home-banner-daily-darshan.webp",
    mobileSrc: "/assets/home-banner-daily-darshan-mobile.webp",
    title: "Daily Darshan",
  },
  {
    src: "/assets/home-banner-radha-madan-mohan.webp",
    mobileSrc: "/assets/home-banner-radha-madan-mohan-mobile.webp",
    title: "Sri Sri Radha Madan Mohan",
  },
  {
    src: "/assets/home-banner-jagannatha-rath-yatra.webp",
    mobileSrc: "/assets/home-banner-jagannatha-rath-yatra-mobile.webp",
    title: "Jagannatha Rath Yatra",
  },
  {
    src: "/assets/home-banner-srinivasa-govinda.webp",
    mobileSrc: "/assets/home-banner-srinivasa-govinda-mobile.webp",
    title: "Srinivasa Govinda Temple",
  },
];

/**
 * Pure banner carousel — no overlaid text/CTAs.
 * Slide content (titles, subtitles, CTAs) is intentionally NOT rendered;
 * banners are managed directly from the admin panel.
 */
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
        return p + 1.4;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, next]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", scale: 1.1, opacity: 0 }),
    center: { x: 0, scale: 1, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-30%" : "30%", scale: 0.95, opacity: 0 }),
  };

  const currentSlide = slides[current];

  return (
    <section className="relative w-full overflow-hidden bg-foreground aspect-[1080/1350] md:aspect-[1920/700]">
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
            src={currentSlide.mobileSrc}
            alt={currentSlide.title}
            fill
            sizes="100vw"
            className="object-cover object-center md:hidden"
            priority
          />
          <Image
            src={currentSlide.src}
            alt={currentSlide.title}
            fill
            sizes="100vw"
            className="hidden object-cover object-center md:block"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2 md:right-10 md:bottom-8 md:gap-3">
        <button
          onClick={prev}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-background/10 bg-background/5 text-background/70 backdrop-blur-xl transition-all duration-300 hover:bg-background/15 hover:text-background md:h-12 md:w-12"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={next}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-background/10 bg-background/5 text-background/70 backdrop-blur-xl transition-all duration-300 hover:bg-background/15 hover:text-background md:h-12 md:w-12"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-background/10 bg-background/5 text-background/70 backdrop-blur-xl transition-all duration-300 hover:bg-background/15 hover:text-background md:h-12 md:w-12"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>

      {/* Gold progress dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex w-full max-w-xs -translate-x-1/2 gap-2 px-8 md:bottom-24 md:max-w-md">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
              setProgress(0);
            }}
            className="h-1 flex-1 overflow-hidden rounded-full bg-background/15 transition-colors hover:bg-background/25"
            aria-label={`Go to slide ${i + 1}`}
          >
            <motion.div
              className="h-full rounded-full bg-[hsl(var(--gold))]"
              initial={{ width: "0%" }}
              animate={{ width: i === current ? `${progress}%` : i < current ? "100%" : "0%" }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default TempleCarousel;
