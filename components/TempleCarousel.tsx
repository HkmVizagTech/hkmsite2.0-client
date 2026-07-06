"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Built-in fallback slides — shown until admin uploads real banners via
// /admin/banners, and as a safety net if that API call ever fails.
const defaultSlides = [
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

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

/**
 * Pure banner carousel — image only, no overlaid text, no controls,
 * no progress dots. Auto-rotates on a timer. Banners are managed
 * from /admin/banners (desktop + mobile pair per slide); falls back to
 * the built-in default slides if none are configured yet.
 */
const TempleCarousel = () => {
  const [slides, setSlides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/hero-banners`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.banners) && data.banners.length > 0) {
            setSlides(
              data.banners.map((b: any) => ({
                src: b.desktopImage,
                mobileSrc: b.mobileImage,
                title: b.title,
              }))
            );
          }
        }
      } catch {
        // Keep the built-in default slides on any failure.
      }
    })();
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  useEffect(() => {
    // Reset to the first slide if the slide set changes size (e.g. after
    // the admin-configured banners load in) to avoid an out-of-range index.
    setCurrent(0);
  }, [slides.length]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", scale: 1.1, opacity: 0 }),
    center: { x: 0, scale: 1, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-30%" : "30%", scale: 0.95, opacity: 0 }),
  };

  const currentSlide = slides[current] || slides[0];

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
    </section>
  );
};

export default TempleCarousel;
