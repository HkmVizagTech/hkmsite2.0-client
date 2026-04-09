"use client";

import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, BookOpen, Users, Flower2, Globe, Calendar, Music, GraduationCap } from "lucide-react";
import Image from "next/image";

const values = [
  { icon: Heart, title: "Spiritual Well-being", desc: "Programs designed to nurture the soul and bring inner peace through the teachings of Bhagavad Gita and Srimad Bhagavatam." },
  { icon: BookOpen, title: "Vedic Wisdom", desc: "Deep dive into ancient scriptures to derive practical insights that address modern life's questions and challenges." },
  { icon: Users, title: "Community Service", desc: "Dedicated to feeding the needy, educating the young, and serving society with compassion and devotion." },
  { icon: Flower2, title: "Value Education", desc: "Inculcating timeless values in children through interactive programs, summer camps, and cultural activities." },
];

const activities = [
  { icon: Calendar, title: "Daily Programs", desc: "Morning and evening aartis, kirtan sessions, and Bhagavad Gita classes open to all." },
  { icon: Music, title: "Kirtan & Bhajans", desc: "Soul-stirring musical sessions that connect hearts to the divine through devotional singing." },
  { icon: GraduationCap, title: "Youth Programs", desc: "Engaging sessions for college students covering personality development, stress management, and spiritual growth." },
  { icon: Globe, title: "Cultural Festivals", desc: "Grand celebrations of Janmashtami, Gaura Purnima, Ratha Yatra, and other Vaishnava festivals." },
];

const milestones = [
  { year: "2015", event: "Registered as a trust in Visakhapatnam" },
  { year: "2016", event: "Began regular Bhagavad Gita study circles" },
  { year: "2018", event: "Launched Subhojanam food distribution programme" },
  { year: "2019", event: "Expanded to serve 500+ meals daily at KGH Hospital" },
  { year: "2021", event: "Extended food service to GGH Hospital, Kakinada" },
  { year: "2023", event: "Announced Hare Krishna Vaikuntham Temple project" },
];

export default function AboutPage() {
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
        title="About Us"
        subtitle="Spreading the timeless message of Lord Krishna through devotion, service, and community"
        breadcrumb="About Us"
        backgroundImage="/assets/about-community.jpg"
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
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Our Story</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Legacy of Devotion & Service
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Over five hundred years ago, Lord Sri Chaitanya made a prophecy that every town and village 
                of the world would chant the holy name of Lord Krishna. The September of 1965 saw His Divine 
                Grace A.C. Bhaktivedanta Swami Prabhupada leaving the shores of India to fulfill this prophecy.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Following in the footsteps of our revered Founder-Acharya, we at Hare Krishna Movement India 
                (HKMI), Visakhapatnam have been conducting spiritual, educational and cultural activities with 
                the devoted purpose of bringing about physical, emotional and spiritual well-being.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Registered as a trust in the year 2015, HKMI&apos;s activities have been growing consistently ever since, 
                touching thousands of lives across Visakhapatnam and beyond.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image
                src="/assets/about-community.jpg"
                alt="Community gathering"
                width={600}
                height={400}
                className="rounded-2xl shadow-elevated w-full"
              />
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
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">What We Stand For</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Our Core Values</h2>
          </motion.div>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-8">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="flex gap-5 bg-background p-6 rounded-2xl border border-border hover:shadow-warm transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
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
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">What We Do</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Our Activities</h2>
          </motion.div>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-border text-center hover:shadow-warm transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
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
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Our Journey</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Key Milestones</h2>
          </motion.div>
          <div className="max-w-2xl mx-auto space-y-0">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={inView4 ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex gap-6 items-start relative pb-8"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="bg-background rounded-xl p-4 border border-border flex-1 mt-1">
                  <p className="text-foreground font-medium">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
