"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const benefits = [
  "Support temple activities",
  "Receive prasadam at home",
  "80G tax benefits",
  "Monthly newsletter",
  "Priority event access",
  "Personalized blessings",
];

const SubhojanamSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Monthly Seva</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
              Subhojanam Program
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Contribute monthly to the temple&apos;s Anna Daan program and receive blessed prasadam 
              at your doorstep. Your donation feeds hundreds of people daily and supports spiritual activities.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <Link
                href="/subhojanam"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-warm hover:opacity-90 transition-opacity"
              >
                Join Subhojanam <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <Image
              src="/assets/subhojanam.jpg"
              alt="Subhojanam Program"
              width={600}
              height={450}
              className="rounded-2xl shadow-elevated w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SubhojanamSection;
