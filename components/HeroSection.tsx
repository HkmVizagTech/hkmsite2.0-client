"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {
}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero-temple.jpg"
          alt="Hare Krishna Vaikuntham Temple"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-[hsl(220,90%,12%,0.7)] via-[hsl(220,90%,15%,0.5)] to-background" />
      </div>

      {
}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-accent text-sm md:text-base tracking-[0.3em] uppercase mb-6 font-medium"
          >
            Hare Krishna Movement · Visakhapatnam
          </motion.p>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Hare Krishna
            <br />
            <span className="text-gradient-gold">Vaikuntham Temple</span>
          </h1>

          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Upcoming Cultural & Spiritual Center in Vizag — Spreading the timeless message of
            Lord Krishna through devotion, service, and community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open("https://www.harekrishnavizag.org/donate", "_blank")}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg shadow-warm hover:opacity-90 transition-opacity"
            >
              Support the Temple
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToAbout}
              className="px-8 py-4 border-2 border-primary-foreground/30 text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary-foreground/10 transition-colors"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>

      {
}
      <motion.button
        onClick={scrollToAbout}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary-foreground/60"
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
};

export default HeroSection;
