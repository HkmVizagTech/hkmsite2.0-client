"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Ornament from "@/components/Ornament";

const sevas = [
  {
    title: "Square Foot Seva",
    image: "/assets/home-temple-construction-banner.webp",
    alt: "Hare Krishna Vaikuntham Temple construction seva",
    amounts: ["Rs. 6,000 / sq ft", "Rs. 12,000 / 2 sq ft", "Rs. 18,000 / 3 sq ft", "Rs. 24,000 / 4 sq ft"],
    note: "Sponsor the sacred ground of the rising temple",
  },
  {
    title: "Brick Seva",
    image: "/assets/home-gallery-annadana.webp",
    alt: "Brick seva for temple construction",
    amounts: ["Rs. 1,500 / brick", "Rs. 3,000 / 2 bricks", "Rs. 4,500 / 3 bricks", "Rs. 6,000 / 4 bricks"],
    note: "Every brick becomes an eternal part of Krishna's home",
  },
];

const SevasSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<Record<number, number>>({ 0: 0, 1: 0 });

  return (
    <section id="sevas" className="bg-gradient-warm py-24 md:py-32">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">Temple Sevas</p>
          <Ornament className="mb-5" />
          <h2 className="mb-6 font-heading text-3xl font-bold text-foreground md:text-5xl">
            Donate to Build the Temple
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Contribute to building the Hare Krishna Vaikuntham Temple, an upcoming cultural and spiritual
            center in Visakhapatnam. All donations qualify for 80G tax benefits.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-7 md:grid-cols-2">
          {sevas.map((seva, i) => (
            <motion.div
              key={seva.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-warm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated"
            >
              <div className="relative aspect-[16/8.5] overflow-hidden">
                <Image
                  src={seva.image}
                  alt={seva.alt}
                  fill
                  sizes="(min-width: 768px) 480px, 92vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,85%,10%,0.78)] via-transparent to-transparent" />
                <h3 className="absolute bottom-4 left-6 font-heading text-xl font-bold text-background md:text-2xl">
                  {seva.title}
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-4 grid grid-cols-2 gap-2.5">
                  {seva.amounts.map((amt, ai) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelected((s) => ({ ...s, [i]: ai }))}
                      className={`rounded-xl border-[1.5px] px-3 py-2.5 text-center text-[13px] font-semibold transition-all ${
                        selected[i] === ai
                          ? "border-[hsl(var(--gold-deep))] bg-[hsl(42,92%,56%,0.12)] text-gold"
                          : "border-border text-foreground hover:border-[hsl(var(--gold-deep))]"
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
                <p className="mb-5 text-xs text-muted-foreground">{seva.note}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open("/donations", "_self")}
                  className="w-full rounded-full bg-gradient-gold py-3.5 text-[15px] font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform"
                >
                  🪔 Sponsor {seva.title.split(" ")[0]} {seva.title.split(" ")[1]}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SevasSection;
