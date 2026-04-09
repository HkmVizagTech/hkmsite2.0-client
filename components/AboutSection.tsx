"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, BookOpen, Users, Flower2 } from "lucide-react";

const highlights = [
  { icon: Heart, title: "Spiritual Well-being", desc: "Programs for physical, emotional and spiritual growth" },
  { icon: BookOpen, title: "Vedic Wisdom", desc: "Insights from ancient scriptures for modern living" },
  { icon: Users, title: "Community Service", desc: "Feeding the needy and serving society with compassion" },
  { icon: Flower2, title: "Value Education", desc: "Inculcating values in children through engaging programs" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">About Us</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6">
            Spreading Krishna Consciousness
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Following in the footsteps of our revered Founder-Acharya Srila Prabhupada, 
            Hare Krishna Movement India (HKMI), Visakhapatnam has been conducting spiritual, 
            educational and cultural activities since 2015 — bringing about physical, emotional 
            and spiritual well-being.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <p className="text-muted-foreground text-center leading-relaxed">
            The advancement of Science and Technology has come to drastically change the dynamics of life. 
            HKMI digs deep into the ancient Vedic scriptures to derive insights that address the important 
            questions and enigmas of life, bringing about alternative paradigms for better living.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="bg-card p-8 rounded-2xl border border-border hover:shadow-warm transition-shadow duration-300 text-center group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
