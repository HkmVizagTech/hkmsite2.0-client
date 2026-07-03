"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, CalendarDays, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    src: "/assets/home-banner-chaitanya-bhavan.webp",
    mobileSrc: "/assets/home-banner-chaitanya-bhavan-mobile.webp",
    title: "Chaitanya Bhavan",
    subtitle: "A devotional landmark for culture, community, and seva in Visakhapatnam.",
    tag: "Featured",
  },
  {
    src: "/assets/home-banner-daily-darshan.webp",
    mobileSrc: "/assets/home-banner-daily-darshan-mobile.webp",
    title: "Daily Darshan",
    subtitle: "Sri Sri Radha Madan Mohan blessing devotees with sacred worship and grace.",
    tag: "Darshan",
  },
  {
    src: "/assets/home-banner-radha-madan-mohan.webp",
    mobileSrc: "/assets/home-banner-radha-madan-mohan-mobile.webp",
    title: "Sri Sri Radha Madan Mohan",
    subtitle: "A serene space for devotion, culture, and community.",
    tag: "Worship",
  },
  {
    src: "/assets/home-banner-jagannatha-rath-yatra.webp",
    mobileSrc: "/assets/home-banner-jagannatha-rath-yatra-mobile.webp",
    title: "Jagannatha Rath Yatra",
    subtitle: "Join the sacred procession of Lord Jagannatha and celebrate with the temple family.",
    tag: "Festival",
  },
  {
    src: "/assets/home-banner-srinivasa-govinda.webp",
    mobileSrc: "/assets/home-banner-srinivasa-govinda-mobile.webp",
    title: "Srinivasa Govinda Temple",
    subtitle: "A divine temple project rising in Visakhapatnam with grace and devotion.",
    tag: "Temple",
  },
];

const TempleCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [nextEvent, setNextEvent] = useState<{ title: string; days: number } | null>(null);

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

  // Live "next festival" chip — nearest upcoming event from the API
  useEffect(() => {
    (async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${apiUrl}/events?limit=20`);
        if (!res.ok) return;
        const data = await res.json();
        const now = new Date();
        const upcoming = (data.events || [])
          .map((e: any) => ({ title: e.title, date: new Date(e.date) }))
          .filter((e: any) => e.date > now)
          .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())[0];
        if (upcoming) {
          const days = Math.ceil((upcoming.date.getTime() - now.getTime()) / 86400000);
          setNextEvent({ title: upcoming.title, days });
        }
      } catch {}
    })();
  }, []);

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

      {/* Cinematic scrim — readable content without hiding the photography */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[hsl(220,80%,10%,0.25)] via-transparent to-[hsl(220,85%,8%,0.82)]" />

      {/* Slide content — title, subtitle, CTAs (previously never rendered) */}
      <div className="absolute inset-x-0 bottom-0 z-10 pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background backdrop-blur-md">
                <Flame className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
                {currentSlide.tag}
              </span>
              <h1 className="mb-3 text-3xl font-bold leading-[1.08] tracking-tight text-background md:text-5xl lg:text-6xl">
                {currentSlide.title}
              </h1>
              <p className="mb-7 max-w-xl text-sm leading-relaxed text-background/85 md:text-lg">
                {currentSlide.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/donations"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5 md:px-8 md:text-base"
                >
                  🪔 Support Temple Seva
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-background/40 bg-background/10 px-7 py-3.5 text-sm font-semibold text-background backdrop-blur-md transition-colors hover:bg-background/20 md:px-8 md:text-base"
                >
                  Visit the Temple
                </Link>
              </div>
              {nextEvent && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-background/20 bg-background/10 px-4 py-2 text-xs text-background backdrop-blur-md md:text-sm">
                  <CalendarDays className="h-4 w-4 text-[hsl(var(--gold))]" />
                  Next: <b className="text-[hsl(var(--gold))]">{nextEvent.title}</b>
                  <span className="text-background/70">·</span>
                  <b className="text-[hsl(var(--gold))]">{nextEvent.days} days</b>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 md:right-10 md:top-auto md:bottom-24 md:gap-3">
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
      <div className="absolute bottom-6 left-1/2 z-20 flex w-full max-w-xs -translate-x-1/2 gap-2 px-8 md:bottom-8 md:max-w-md">
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
