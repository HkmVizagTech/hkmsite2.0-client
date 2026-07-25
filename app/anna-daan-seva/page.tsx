"use client";

import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import Ornament from "@/components/Ornament";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Utensils, Heart, Calendar, Users, CheckCircle, Sparkles } from "lucide-react";
import Image from "next/image";

const MEAL_PRICE = 25;

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
  { title: "Daily Sponsor", amount: 5000, desc: "Sponsor all meals for one full day" },
  { title: "Weekly Sponsor", amount: 25000, desc: "Feed devotees and visitors for a week" },
  { title: "Monthly Sponsor", amount: 100000, desc: "Become a monthly Anna-Daan patron" },
  { title: "Annual Patron", amount: 1000000, desc: "Year-round temple meal sponsorship" },
];

function mealsForAmount(amount: number): number {
  return Math.floor(amount / MEAL_PRICE);
}

export default function AnnaDaanPage() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const inView1 = useInView(ref1, { once: true, margin: "-80px" });
  const inView2 = useInView(ref2, { once: true, margin: "-80px" });
  const inView3 = useInView(ref3, { once: true, margin: "-80px" });
  const inView4 = useInView(ref4, { once: true, margin: "-80px" });

  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const activeAmount = useCustom ? (Number(customAmount) || 0) : selectedAmount;
  const activeMeals = activeAmount >= MEAL_PRICE ? mealsForAmount(activeAmount) : 0;

  return (
    <PageLayout>
      <PageHero
        title="Anna-Daan Seva"
        subtitle="The sacred act of feeding the hungry — the highest form of charity"
        breadcrumb="Anna-Daan Seva"
        backgroundImage="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg"
      />
      <section className="py-12 md:py-16 bg-white" ref={ref1}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">Sacred Service</p>
            <Ornament className="mb-5" />
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
              <Image src="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg" alt="Anna-Daan Seva" fill sizes="(min-width: 1024px) 480px, 92vw" className="object-cover shadow-elevated" />
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-16 bg-white" ref={ref2}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">Why It Matters</p>
            <Ornament className="mb-5" />
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
                className="flex gap-5 bg-background p-6 rounded-2xl border border-border hover:shadow-warm transition-shadow group"
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
      <section className="py-12 md:py-16 bg-white" ref={ref3}>
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
              <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">Our Prasadam</p>
            <Ornament className="mb-5" />
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
      <section className="py-12 md:py-16 bg-white" ref={ref4}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView4 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-4 font-medium">Become a Sponsor</p>
            <Ornament className="mb-5" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sponsorship Options
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              All donations are eligible for 80G tax benefits. Choose a sponsorship level that resonates with your heart.
            </p>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {sponsorOptions.map((opt, i) => (
                <motion.div
                  key={opt.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView4 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  onClick={() => { setSelectedAmount(opt.amount); setUseCustom(false); setCustomAmount(""); }}
                  className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                    !useCustom && selectedAmount === opt.amount
                      ? "border-gold bg-gold/5 shadow-md"
                      : "border-border bg-background hover:border-gold/40 hover:shadow-warm"
                  }`}
                >
                  <Utensils className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-heading text-base font-bold text-foreground mb-1">{opt.title}</h3>
                  <div className="text-2xl font-heading font-bold text-primary mb-1">
                    ₹{opt.amount.toLocaleString("en-IN")}
                  </div>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  <div className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold">
                    🍽️ {mealsForAmount(opt.amount).toLocaleString("en-IN")} meals
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Custom amount input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView4 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="overflow-hidden rounded-2xl border-2 border-border bg-card p-5 transition-all focus-within:border-gold/60 focus-within:shadow-[0_0_0_1px_rgba(214,158,46,0.15)]"
            >
              <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Or enter a custom amount
                {useCustom && activeMeals > 0 && (
                  <span className="ml-auto rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-bold text-gold normal-case tracking-normal">
                    🍽️ {activeMeals.toLocaleString("en-IN")} meals
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gold">₹</span>
                <input
                  type="number"
                  min={25}
                  placeholder="Enter any amount"
                  value={customAmount}
                  onFocus={() => setUseCustom(true)}
                  onChange={(e) => { setUseCustom(true); setCustomAmount(e.target.value); }}
                  className="h-11 w-full min-w-0 bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground"
                />
              </div>
              {useCustom && activeMeals > 0 && (
                <p className="mt-2 text-xs font-semibold text-gold">
                  🙏 Your donation will provide {activeMeals.toLocaleString("en-IN")} meals
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView4 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-6"
            >
              <button
                onClick={() => {
                  const url = useCustom && activeAmount > 0
                    ? `/donate/anna-daan-seva?amount=${activeAmount}`
                    : `/donate/anna-daan-seva`;
                  window.open(url, "_self");
                }}
                disabled={useCustom && activeAmount < MEAL_PRICE}
                className="w-full py-3 rounded-full bg-gradient-gold text-[hsl(220,60%,12%)] font-bold text-sm shadow-gold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activeMeals > 0 ? `Donate ₹${activeAmount.toLocaleString("en-IN")} — Feed ${activeMeals.toLocaleString("en-IN")} People` : "Sponsor Now"}
              </button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                All donations eligible for 80G tax benefits
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
