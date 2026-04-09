"use client";

import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Building, Blocks, Star, CheckCircle } from "lucide-react";

const sevaCategories = [
  {
    icon: Building,
    title: "Square Foot Seva",
    desc: "Contribute by sponsoring square feet of the temple construction",
    amounts: [
      { qty: "1 sq ft", price: "₹6,000" },
      { qty: "2 sq ft", price: "₹12,000" },
      { qty: "3 sq ft", price: "₹18,000" },
      { qty: "4 sq ft", price: "₹24,000" },
    ],
  },
  {
    icon: Blocks,
    title: "Brick Seva",
    desc: "Sponsor bricks for the temple and leave your mark on this divine project",
    amounts: [
      { qty: "1 brick", price: "₹1,500" },
      { qty: "2 bricks", price: "₹3,000" },
      { qty: "3 bricks", price: "₹4,500" },
      { qty: "4 bricks", price: "₹6,000" },
    ],
  },
];

const templeFeatures = [
  "Grand prayer hall with capacity for 1000+ devotees",
  "Beautiful deity room with intricate carvings",
  "Cultural auditorium for spiritual programs",
  "Vedic library and study rooms",
  "Community kitchen (Annadana Hall)",
  "Meditation gardens with sacred Tulasi groves",
  "Guest house for visiting devotees",
  "Children's education center",
];

const benefits = [
  { title: "Spiritual Merit", desc: "Building a temple is considered one of the highest forms of service. The blessings extend to seven generations of your family." },
  { title: "80G Tax Benefits", desc: "All donations qualify for 80G income tax benefits under the Finance Act. PAN details required for certificate." },
  { title: "Name Inscription", desc: "Major donors will have their names inscribed on the temple walls as a lasting tribute to their generosity." },
  { title: "Special Darshan", desc: "Temple seva donors receive special darshan privileges and invitations to exclusive ceremonies." },
];

export default function SevasPage() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const inView1 = useInView(ref1, { once: true, margin: "-80px" });
  const inView2 = useInView(ref2, { once: true, margin: "-80px" });
  const inView3 = useInView(ref3, { once: true, margin: "-80px" });
  const inView4 = useInView(ref4, { once: true, margin: "-80px" });

  return (
    <PageLayout>
      <PageHero
        title="Temple Seva's"
        subtitle="Contribute to building the Hare Krishna Vaikuntham Temple in Visakhapatnam"
        breadcrumb="Seva's"
        backgroundImage="/assets/temple-seva.jpg"
      />

      {
}
      <section className="py-24 bg-background" ref={ref1}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">The Vision</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Hare Krishna Vaikuntham Temple
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The upcoming Hare Krishna Vaikuntham Temple is envisioned as a grand Cultural & Spiritual 
                Center in Visakhapatnam. This magnificent temple will serve as a beacon of spiritual light, 
                bringing together devotees and seekers from across the region.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Designed with traditional Vedic architecture and modern amenities, the temple will be a 
                center for worship, learning, community service, and cultural preservation for generations to come.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView1 ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image src="/assets/temple-seva.jpg" alt="Temple rendering" width={600} height={400} className="rounded-2xl shadow-elevated w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {
}
      <section className="py-24 bg-card" ref={ref2}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Ways to Contribute</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Choose Your Seva</h2>
          </motion.div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {sevaCategories.map((seva, i) => (
              <motion.div
                key={seva.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="bg-background rounded-2xl p-8 border border-border"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <seva.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{seva.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{seva.desc}</p>
                <div className="space-y-3">
                  {seva.amounts.map((a) => (
                    <div key={a.qty} className="flex justify-between items-center bg-card rounded-lg px-4 py-3 border border-border">
                      <span className="text-foreground font-medium">{a.qty}</span>
                      <span className="text-primary font-bold">{a.price}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open("https://www.harekrishnavizag.org/temple-sevas", "_blank")}
                  className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-warm hover:opacity-90 transition-opacity"
                >
                  Donate Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {
}
      <section className="py-24 bg-background" ref={ref3}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView3 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">What&apos;s Being Built</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Temple Features</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
            {templeFeatures.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={inView3 ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border"
              >
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {
}
      <section className="py-24 bg-card" ref={ref4}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView4 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Why Contribute</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Benefits of Seva</h2>
          </motion.div>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="bg-background rounded-2xl p-6 border border-border"
              >
                <Star className="w-6 h-6 text-accent mb-3" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
