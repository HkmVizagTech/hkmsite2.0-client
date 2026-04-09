"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const sevas = [
  { title: "Square Foot Seva", amounts: ["₹6,000 / sq ft", "₹12,000 / 2 sq ft", "₹18,000 / 3 sq ft", "₹24,000 / 4 sq ft"] },
  { title: "Brick Seva", amounts: ["₹1,500 / brick", "₹3,000 / 2 bricks", "₹4,500 / 3 bricks", "₹6,000 / 4 bricks"] },
];

const SevasSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sevas" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Temple Seva&apos;s</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
            Donate to Build the Temple
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Contribute to building the Hare Krishna Vaikuntham Temple — an upcoming Cultural 
            & Spiritual Center in Visakhapatnam. All donations qualify for 80G tax benefits.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="/assets/temple-seva.jpg"
              alt="Hare Krishna Vaikuntham Temple"
              width={600}
              height={400}
              className="rounded-2xl shadow-elevated w-full"
            />
          </motion.div>

          <div className="space-y-6">
            {sevas.map((seva, i) => (
              <motion.div
                key={seva.title}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">{seva.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {seva.amounts.map((amt) => (
                    <div key={amt} className="bg-primary/5 rounded-lg px-3 py-2 text-sm text-foreground font-medium text-center">
                      {amt}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open("https://www.harekrishnavizag.org/temple-sevas", "_blank")}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-warm hover:opacity-90 transition-opacity"
            >
              Donate Now
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SevasSection;
