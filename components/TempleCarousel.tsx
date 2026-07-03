"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    src: "/assets/home-hero-desktop.webp",
    mobileSrc: "/assets/home-hero-mobile.webp",
    title: "Hare Krishna Vaikuntham",
    subtitle: "A sacred spiritual home rising in Visakhapatnam for darshan, seva, festivals, and prasadam.",
    tag: "Featured",
  },
  {
    src: "/assets/home-temple-construction-banner.webp",
    title: "Temple Construction Seva",
    subtitle: "Every contribution helps build a lasting temple for worship, culture, and Krishna consciousness.",
    tag: "Seva",
  },
  {
    src: "/assets/hero-temple.jpg",
    title: "Daily Darshan and Worship",
    subtitle: "A living temple atmosphere of arati, kirtan, study, and devotional service throughout the day.",
    tag: "Darshan",
  },
  {
    src: "/assets/home-subhojanam-banner.webp",
    title: "Annadana and Subhojanam",
    subtitle: "Offer prasadam seva with compassion and help nourish hundreds with sanctified meals.",
    tag: "Prasadam",
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
    <section className="relative mt-16 h-[calc(78vh-38px)] w-full overflow-hidden bg-foreground md:mt-24 md:h-[calc(90vh-38px)]">
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
          {currentSlide.mobileSrc ? (
            <>
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
            </>
          ) : (
            <Image
              src={currentSlide.src}
              alt={currentSlide.title}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-foreground via-foreground/25 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-foreground/75 via-foreground/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {
}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
        <motion.span
          key={`num-${current}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-mono text-background/50 tracking-widest"
        >
          {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </motion.span>
        <motion.span
          key={`tag-${current}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/80 text-secondary-foreground backdrop-blur-sm"
        >
          {slides[current].tag}
        </motion.span>
      </div>

      {
}
      <div className="absolute inset-0 z-10 flex h-[80vh] items-end pb-24 md:pb-32">
        <div className="container mx-auto px-4 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="max-w-3xl"
            >
              <h2 className="mb-4 font-heading text-4xl font-bold leading-[1.05] text-background md:text-6xl lg:text-7xl">
                {currentSlide.title}
              </h2>
              <p className="max-w-xl text-base font-light leading-relaxed text-background/75 md:text-xl">
                {currentSlide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

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

      {
}
      <div className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 z-20 flex-col gap-2">
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
              setProgress(0);
            }}
            className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              i === current
                ? "border-secondary shadow-glow scale-110"
                : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <Image
              src={slide.src}
              alt=""
              width={64}
              height={48}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default TempleCarousel;
