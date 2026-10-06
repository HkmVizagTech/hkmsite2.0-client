"use client";

import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb: string;
  backgroundImage?: string;
  /** Optional eyebrow pill above the title. */
  eyebrow?: string;
}

/**
 * GVD-standard inner-page hero.
 * - With an image: a rounded, inset photo card (not full-bleed) with a
 *   navy gradient and the title set inside it — the same treatment GVD
 *   uses for its banner cards.
 * - Without an image: a soft tinted band with a large centred ink title.
 */
const PageHero = ({ title, subtitle, breadcrumb, backgroundImage, eyebrow }: PageHeroProps) => {
  const crumbs = (light: boolean) => (
    <nav
      aria-label="Breadcrumb"
      className={`mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium md:text-[13px] ${
        light ? "bg-white/15 text-white/85 backdrop-blur" : "bg-white text-ink/70 shadow-sm"
      }`}
    >
      <Link href="/" className={`inline-flex items-center gap-1 transition-colors ${light ? "hover:text-white" : "hover:text-vk-700"}`}>
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>
      <ChevronRight className="h-3.5 w-3.5 opacity-60" />
      <span className={`max-w-[220px] truncate ${light ? "text-white" : "font-semibold text-vk-700"}`} aria-current="page">
        {breadcrumb}
      </span>
    </nav>
  );

  if (backgroundImage) {
    return (
      <section className="bg-gradient-to-b from-vk-50 to-white">
        <div>
          <div className="relative isolate overflow-hidden bg-vk-900">
            <Image
              src={backgroundImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1280px) 1248px, 100vw"
              className="-z-10 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-vk-900/90 via-vk-900/55 to-vk-900/25" />
            <div className="flex min-h-[300px] flex-col items-center justify-end px-5 pb-10 pt-16 text-center md:min-h-[400px] md:px-10 md:pb-14">
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                {crumbs(true)}
              </motion.div>
              {eyebrow && <span className="vk-pill-light mb-3">{eyebrow}</span>}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="vk-h1 max-w-4xl !text-white"
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.6 }}
                  className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/85 md:text-lg"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-vk-100 via-vk-50 to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-vk-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-vk-200/50 blur-3xl"
      />
      <div className="vk-container relative py-12 text-center md:py-20">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          {crumbs(false)}
        </motion.div>
        {eyebrow && (
          <div>
            <span className="vk-pill mb-3">{eyebrow}</span>
          </div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="vk-h1 mx-auto max-w-4xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
