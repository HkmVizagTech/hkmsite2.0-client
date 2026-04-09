"use client";

import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Utensils, Hospital, Users, Clock, Heart, TrendingUp, Target } from "lucide-react";

const stats = [
  { icon: Utensils, value: "1,000+", label: "Meals Served Daily" },
  { icon: Hospital, value: "2", label: "Government Hospitals" },
  { icon: Users, value: "3,65,000+", label: "Annual Beneficiaries" },
  { icon: Clock, value: "365", label: "Days a Year" },
];

const donationTiers = [
  { meals: "500 Meals", amount: "₹12,500", popular: false },
  { meals: "400 Meals", amount: "₹10,000", popular: true },
  { meals: "300 Meals", amount: "₹7,500", popular: false },
  { meals: "200 Meals", amount: "₹5,000", popular: false },
  { meals: "100 Meals", amount: "₹2,500", popular: false },
];

const impactStories = [
  {
    quote: "When my mother was admitted at KGH, we couldn't afford both food and medicine. The Subhojanam meals were a blessing from God.",
    name: "Ramesh K.",
    role: "Patient Attendant, KGH Visakhapatnam",
  },
  {
    quote: "I've been volunteering with the programme for two years. Seeing the gratitude in people's eyes when they receive a warm meal is the most fulfilling experience.",
    name: "Priya S.",
    role: "Volunteer, Subhojanam Programme",
  },
  {
    quote: "The nutritious food helped my father recover faster. We are forever grateful to the Hare Krishna Movement for this noble service.",
    name: "Suresh M.",
    role: "Patient Family, GGH Kakinada",
  },
];

export default function SubhojanamPage() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const inView1 = useInView(ref1, { once: true, margin: "-80px" });
  const inView2 = useInView(ref2, { once: true, margin: "-80px" });
  const inView3 = useInView(ref3, { once: true, margin: "-80px" });
  const inView4 = useInView(ref4, { once: true, margin: "-80px" });
  const inView5 = useInView(ref5, { once: true, margin: "-80px" });

  return (
    <PageLayout>
      <PageHero
        title="Subhojanam"
        subtitle="Free, hygienic, and nutritious meals for the underprivileged"
        breadcrumb="Subhojanam"
        backgroundImage="/assets/subhojanam.jpg"
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
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">The Programme</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Feeding Hope, One Meal at a Time
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Annadana is one of the greatest forms of charity. Our Subhojanam Programme focuses on 
                providing free, hygienic, and nutritious meals to underprivileged patients and their 
                attendants in government hospitals.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Many families choose to stay hungry just to save money for medicine and treatment costs 
                of their loved ones. Our programme ensures they don&apos;t have to make that difficult choice.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every meal we serve is prepared with love and devotion in hygienic kitchens, 
                following strict quality standards to ensure nutritious and wholesome food reaches 
                every beneficiary.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image src="/assets/subhojanam.jpg" alt="Subhojanam food distribution" width={600} height={400} className="rounded-2xl shadow-elevated w-full" />
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
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Our Impact</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Numbers That Matter</h2>
          </motion.div>
          <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView2 ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="bg-background rounded-2xl p-6 border border-border text-center"
              >
                <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">{s.value}</div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {
}
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="bg-background rounded-2xl p-6 border border-border"
            >
              <Hospital className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">KGH Hospital</h3>
              <p className="text-muted-foreground text-sm mb-2">Visakhapatnam</p>
              <p className="text-primary font-bold">Up to 500 meals served daily</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="bg-background rounded-2xl p-6 border border-border"
            >
              <Hospital className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">GGH Hospital</h3>
              <p className="text-muted-foreground text-sm mb-2">Kakinada</p>
              <p className="text-primary font-bold">Up to 500 meals served daily</p>
            </motion.div>
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
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Stories of Impact</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Voices of Gratitude</h2>
          </motion.div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {impactStories.map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <div className="text-primary text-4xl font-heading mb-3">&quot;</div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">{story.quote}</p>
                <div>
                  <p className="font-heading font-semibold text-foreground">{story.name}</p>
                  <p className="text-xs text-muted-foreground">{story.role}</p>
                </div>
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
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Support Us</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Contribution
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every rupee you donate goes directly towards providing nutritious meals. 
              Help us extend our reach to more beneficiaries and hospitals.
            </p>
          </motion.div>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {donationTiers.map((tier, i) => (
              <motion.div
                key={tier.meals}
                initial={{ opacity: 0, y: 20 }}
                animate={inView4 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className={`rounded-2xl p-6 border text-center ${
                  tier.popular
                    ? "bg-primary text-primary-foreground border-primary shadow-warm"
                    : "bg-background border-border"
                }`}
              >
                {tier.popular && (
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Most Popular</span>
                )}
                <div className={`font-heading text-2xl font-bold mt-2 mb-1 ${tier.popular ? "" : "text-foreground"}`}>
                  {tier.amount}
                </div>
                <p className={`text-sm mb-4 ${tier.popular ? "opacity-80" : "text-muted-foreground"}`}>
                  for {tier.meals}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.open("https://www.harekrishnavizag.org/subhojanam", "_blank")}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 ${
                    tier.popular
                      ? "bg-primary-foreground text-primary"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  Donate
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {
}
      <section className="py-24 bg-background" ref={ref5}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView5 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="grid grid-cols-3 gap-6 mb-12">
              {[
                { icon: Heart, title: "Donate", desc: "Sponsor meals for the needy" },
                { icon: TrendingUp, title: "Volunteer", desc: "Join our serving team" },
                { icon: Target, title: "Spread the Word", desc: "Share our mission" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView5 ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Shoulder the social responsibility of providing nutritious food to those battling health issues. 
              Your generosity will earn you their prayers of gratitude and bring immense happiness to you and your loved ones.
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
