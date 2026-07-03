"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const sevas = [
  { title: "Square Foot Seva", amounts: ["Rs. 6,000 / sq ft", "Rs. 12,000 / 2 sq ft", "Rs. 18,000 / 3 sq ft", "Rs. 24,000 / 4 sq ft"] },
  { title: "Brick Seva", amounts: ["Rs. 1,500 / brick", "Rs. 3,000 / 2 bricks", "Rs. 4,500 / 3 bricks", "Rs. 6,000 / 4 bricks"] },
];

const SevasSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="sevas" className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">Temple Sevas</p>
          <h2 className="mb-6 font-heading text-3xl font-bold text-foreground md:text-5xl">
            Donate to Build the Temple
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Contribute to building the Hare Krishna Vaikuntham Temple, an upcoming cultural and spiritual
            center in Visakhapatnam. All donations qualify for 80G tax benefits.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="/assets/home-temple-construction-banner.webp"
              alt="Hare Krishna Vaikuntham Temple construction seva"
              width={600}
              height={400}
              className="w-full rounded-2xl object-cover shadow-elevated"
            />
          </motion.div>

          <div className="space-y-6">
            {sevas.map((seva, i) => (
              <motion.div
                key={seva.title}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">{seva.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {seva.amounts.map((amt) => (
                    <div key={amt} className="rounded-lg bg-primary/5 px-3 py-2 text-center text-sm font-medium text-foreground">
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
              onClick={() => window.open("/donations", "_self")}
              className="w-full rounded-xl bg-primary py-4 text-lg font-semibold text-primary-foreground shadow-warm transition-opacity hover:opacity-90"
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
