"use client";

import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Utensils, Heart, Calendar, Users, CheckCircle, Sparkles } from "lucide-react";
import Image from "next/image";

const significance = [
  { icon: Heart, title: "Supreme Charity", desc: "Annadana (food donation) is considered the highest form of charity in Vedic tradition, as food sustains life itself." },
  { icon: Sparkles, title: "Divine Blessings", desc: "The act of feeding others is believed to bring divine grace and spiritual merit to the donor and their family." },
  { icon: Calendar, title: "Year-Round Service", desc: "Our Anna-Daan seva operates 365 days a year, ensuring no one goes hungry regardless of the occasion." },
  { icon: Users, title: "Community Building", desc: "Sharing prasadam (sacred food) builds bonds of love and unity among people from all walks of life." },
];

const mealDetails = [
  "Freshly cooked rice with nutritious sambar",
  "Seasonal vegetable curries and dal",
  "Buttermilk or curd for every meal",
  "Special festival meals with sweets and savories",
  "Prepared in hygienic temple kitchens",
  "Served with love by dedicated volunteers",
];

const sponsorOptions = [
  { title: "Daily Sponsor", amount: "₹5,000", desc: "Sponsor all meals for one full day", meals: "200+ meals" },
  { title: "Weekly Sponsor", amount: "₹25,000", desc: "Feed devotees and visitors for a week", meals: "1,400+ meals" },
  { title: "Monthly Sponsor", amount: "₹1,00,000", desc: "Become a monthly Anna-Daan patron", meals: "6,000+ meals" },
  { title: "Annual Patron", amount: "₹10,00,000", desc: "Year-round temple meal sponsorship", meals: "73,000+ meals" },
];

export default function AnnaDaanPage() {
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
        title="Anna-Daan Seva"
        subtitle="The sacred act of feeding the hungry — the highest form of charity"
        breadcrumb="Anna-Daan Seva"
        backgroundImage="/assets/anna-daan.jpg"
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
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Sacred Service</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                The Glory of Anna-Daan
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In the Vedic tradition, Anna-Daan (donation of food) is revered as the most meritorious 
                form of charity. Lord Krishna declares in the Bhagavad Gita that He is the fire of digestion 
                in every living being — thus feeding someone is directly serving the Lord.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Anna-Daan Seva ensures that every visitor to the temple and every devotee who comes 
                for darshan receives wholesome, nutritious prasadam (sacred food offered to the Lord).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The programme also extends beyond the temple walls, reaching communities in need 
                during festivals, natural disasters, and special occasions.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <Image src="/assets/anna-daan.jpg" alt="Anna-Daan Seva" fill className="object-cover shadow-elevated" />
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
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Why It Matters</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              The Significance of Food Charity
            </h2>
          </motion.div>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">
            {significance.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex gap-5 bg-background p-6 rounded-2xl border border-border hover:shadow-warm transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
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
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView3 ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="order-2 md:order-1"
            >
              <div className="grid grid-cols-1 gap-3">
                {mealDetails.map((detail, i) => (
                  <motion.div
                    key={detail}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView3 ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border"
                  >
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground text-sm">{detail}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView3 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 md:order-2"
            >
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Our Prasadam</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                What We Serve
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every meal is prepared as an offering to Lord Krishna, following strict Vedic principles 
                of purity and devotion. Our kitchen is run by trained cooks who prepare food with the 
                highest standards of hygiene.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The prasadam is not just food — it is divine mercy, blessed by the Lord, carrying 
                spiritual potency that nourishes both body and soul.
              </p>
            </motion.div>
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
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Become a Sponsor</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sponsorship Options
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              All donations are eligible for 80G tax benefits. Choose a sponsorship level that resonates with your heart.
            </p>
          </motion.div>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
            {sponsorOptions.map((opt, i) => (
              <motion.div
                key={opt.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="bg-background rounded-2xl p-6 border border-border hover:shadow-warm transition-shadow"
              >
                <Utensils className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">{opt.title}</h3>
                <div className="text-2xl font-heading font-bold text-primary mb-2">{opt.amount}</div>
                <p className="text-sm text-muted-foreground mb-1">{opt.desc}</p>
                <p className="text-xs text-accent font-medium mb-4">{opt.meals}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open("https://www.harekrishnavizag.org/donate", "_blank")}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Sponsor Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
