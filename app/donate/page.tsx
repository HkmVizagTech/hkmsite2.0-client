"use client";

import PageLayout from "@/components/PageLayout";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Heart, Utensils, BookOpen, Home, Flower2, Shield,
  CheckCircle2, ArrowRight, Sparkles, TrendingUp,
  IndianRupee, Quote, X, CreditCard,
  Smartphone, Building2, Wallet, ChevronRight,
  Download, PieChart, Lock, Award, Clock, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import Image from "next/image";



const impactCards = [
  { icon: Utensils, title: "Free Prasadam", stat: "12,000 meals served daily", desc: "Sanctified food distributed to the needy every single day" },
  { icon: Flower2, title: "Daily Pujas & Aartis", stat: "5 aartis performed every day", desc: "Uninterrupted devotional worship since temple inception" },
  { icon: Home, title: "Temple Restoration", stat: "₹2.5 Cr invested", desc: "Continuous preservation of our sacred heritage" },
  { icon: BookOpen, title: "Vedic Education", stat: "3,000+ students enrolled", desc: "Gurukul and Sunday school programs across the city" },
];

const campaigns = [
  { title: "Annadanam Fund", desc: "Provide free meals to thousands of devotees and underprivileged daily", goal: 2500000, raised: 1875000, image: "/assets/gallery-annadaan-1.jpg" },
  { title: "Gaushala Seva", desc: "Maintain and care for 200+ sacred cows with fodder, shelter & medical care", goal: 1500000, raised: 900000, image: "/assets/gallery-darshan-1.jpg" },
  { title: "Festival Celebrations", desc: "Grand celebrations of Janmashtami, Gaura Purnima & Ratha Yatra", goal: 1000000, raised: 720000, image: "/assets/gallery-festival-1.jpg" },
  { title: "Temple Construction", desc: "Build the magnificent Sri Sri Radha Krishna Vaikuntham temple", goal: 50000000, raised: 32500000, image: "/assets/hero-temple.jpg" },
];

const presetAmounts = [
  { amount: 101, label: "₹101", desc: "1 prasadam plate" },
  { amount: 251, label: "₹251", desc: "Flower garland for deity" },
  { amount: 501, label: "₹501", desc: "1 day of lamp oil", popular: true },
  { amount: 1001, label: "₹1,001", desc: "Sponsor daily aarti" },
  { amount: 5001, label: "₹5,001", desc: "Full day prasadam" },
  { amount: 11000, label: "₹11,000", desc: "Grand festival seva" },
];

const testimonials = [
  { name: "Rajesh Kumar", city: "Hyderabad", quote: "Donating to the temple has been the most fulfilling experience. Knowing that my contribution feeds thousands brings immense joy to my heart." },
  { name: "Priya Sharma", city: "Vizag", quote: "The temple's book distribution program has changed so many lives. I'm proud to be a regular contributor to this sacred mission." },
  { name: "Venkat Rao", city: "Bangalore", quote: "Being part of the temple construction project gives me a sense of spiritual connection that nothing else can provide." },
];

const recentDonors = [
  { name: "Ramesh M.", city: "Mumbai", amount: "₹1,001", time: "2 mins ago" },
  { name: "Sunita D.", city: "Delhi", amount: "₹5,001", time: "5 mins ago" },
  { name: "Arun K.", city: "Hyderabad", amount: "₹501", time: "8 mins ago" },
  { name: "Meera P.", city: "Chennai", amount: "₹2,100", time: "12 mins ago" },
  { name: "Suresh R.", city: "Vizag", amount: "₹11,000", time: "15 mins ago" },
  { name: "Lakshmi N.", city: "Pune", amount: "₹1,001", time: "18 mins ago" },
  { name: "Gopal S.", city: "Kolkata", amount: "₹251", time: "22 mins ago" },
  { name: "Radha V.", city: "Bangalore", amount: "₹5,001", time: "25 mins ago" },
  { name: "Kiran T.", city: "Jaipur", amount: "₹501", time: "30 mins ago" },
  { name: "Anitha B.", city: "Lucknow", amount: "₹1,001", time: "35 mins ago" },
];

const faqs = [
  { q: "Is my donation tax-deductible?", a: "Yes, all donations are eligible for tax exemption under Section 80G of the Income Tax Act. You will receive an 80G certificate via email immediately after your donation." },
  { q: "Can I donate from abroad?", a: "Yes, we accept international donations through our FCRA-registered account. You can donate via international credit/debit cards or wire transfer." },
  { q: "How will I receive my receipt?", a: "A digital receipt and 80G certificate will be sent to your registered email address within minutes of your donation. You can also download it from your donor dashboard." },
  { q: "Can I make a recurring monthly donation?", a: "Absolutely! You can set up automatic monthly donations. This helps us plan our seva activities better and ensures sustained service to devotees." },
  { q: "Where exactly does my money go?", a: "60% goes to Annadanam (free meals), 20% to temple upkeep and deity worship, 15% to Vedic education programs, and 5% to administrative costs. We publish annual reports for full transparency." },
  { q: "Can I donate in someone's memory or on their behalf?", a: "Yes, during the donation process you can dedicate your offering 'In Memory Of' or 'On Behalf Of' a loved one. A special acknowledgment will be included in the receipt." },
];

const pieData = [
  { label: "Annadanam", pct: 60, color: "hsl(var(--secondary))" },
  { label: "Temple Upkeep", pct: 20, color: "hsl(var(--accent))" },
  { label: "Education", pct: 15, color: "hsl(var(--primary))" },
  { label: "Admin", pct: 5, color: "hsl(var(--muted-foreground))" },
];



const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
};

const AnimatedCounter = ({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);
  
  return <span ref={ref}>{prefix}{count.toLocaleString("en-IN")}{suffix}</span>;
};



const DonationModal = ({ open, onClose, initialAmount, festivalSlug }: { open: boolean; onClose: () => void; initialAmount?: number; festivalSlug?: string }) => {
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(initialAmount || null);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
  const [dedicateTo, setDedicateTo] = useState("");
  const [dedicateType, setDedicateType] = useState<"memory" | "behalf">("memory");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorPan, setDonorPan] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (initialAmount) setSelectedAmount(initialAmount);
  }, [initialAmount]);

  const finalAmount = selectedAmount || Number(customAmount) || 0;
  const totalSteps = 5;

  const reset = () => {
    setStep(1);
    setSelectedAmount(initialAmount || null);
    setCustomAmount("");
    setDonationType("one-time");
    setDedicateTo("");
    setDonorName("");
    setDonorEmail("");
    setDonorPhone("");
    setDonorPan("");
    setPaymentMethod("");
    setCompleted(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-background rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-elevated border border-border" onClick={(e) => e.stopPropagation()}>

          {completed ? (
            

            <div className="p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-secondary" />
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold text-foreground mb-3">🙏 Jai Shri Krishna!</h2>
              <p className="text-muted-foreground text-lg mb-2">Your seva of <span className="text-secondary font-bold">₹{finalAmount.toLocaleString("en-IN")}</span> has been recorded.</p>
              <p className="text-muted-foreground text-sm mb-8">A confirmation receipt and 80G certificate will be sent to your email shortly.</p>
              <div className="flex gap-4 justify-center">
                <Button className="rounded-full bg-gradient-ocean text-primary-foreground" onClick={() => { reset(); onClose(); }}>Back to Donations</Button>
                <Button variant="outline" className="rounded-full" onClick={() => { reset(); }}>Donate Again</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row">
              {
}
              <div className="flex-1 p-6 md:p-8">
                {
}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Make Your Offering</h2>
                    <p className="text-muted-foreground text-sm">Step {step} of {totalSteps}</p>
                  </div>
                  <button onClick={onClose} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {
}
                <div className="flex gap-1.5 mb-8">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < step ? "bg-secondary" : "bg-muted"}`} />
                  ))}
                </div>

                {
}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Choose your offering amount</h3>
                    <p className="text-muted-foreground text-sm mb-6">Every rupee is a sacred offering to Sri Sri Radha Krishna</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                      {presetAmounts.map((p) => (
                        <button key={p.amount} onClick={() => { setSelectedAmount(p.amount); setCustomAmount(""); }}
                          className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${selectedAmount === p.amount ? "border-secondary bg-secondary/5 shadow-glow" : "border-border hover:border-secondary/30"}`}>
                          {p.popular && <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold">MOST POPULAR</span>}
                          <span className="text-xl font-bold text-foreground">{p.label}</span>
                          <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                        </button>
                      ))}
                    </div>
                    <div className="relative mb-6">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="number" placeholder="Enter custom amount" value={customAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                        className="pl-10 rounded-xl h-12" />
                    </div>
                    <Button disabled={!finalAmount} className="w-full rounded-full bg-gradient-ocean text-primary-foreground h-12 text-base font-semibold" onClick={() => setStep(2)}>
                      Continue with ₹{finalAmount.toLocaleString("en-IN")} <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </motion.div>
                )}

                {
}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Donation type</h3>
                    <p className="text-muted-foreground text-sm mb-6">Choose one-time or set up a monthly recurring offering</p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {(["one-time", "monthly"] as const).map((t) => (
                        <button key={t} onClick={() => setDonationType(t)}
                          className={`p-6 rounded-2xl border-2 text-center transition-all ${donationType === t ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/30"}`}>
                          <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${donationType === t ? "bg-secondary/20" : "bg-muted"}`}>
                            {t === "one-time" ? <Heart className="w-6 h-6 text-secondary" /> : <Clock className="w-6 h-6 text-secondary" />}
                          </div>
                          <span className="font-semibold text-foreground capitalize">{t === "one-time" ? "One-Time" : "Monthly"}</span>
                          <p className="text-xs text-muted-foreground mt-1">{t === "one-time" ? "Single offering" : "Recurring seva every month"}</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 rounded-full h-12" onClick={() => setStep(1)}>Back</Button>
                      <Button className="flex-1 rounded-full bg-gradient-ocean text-primary-foreground h-12" onClick={() => setStep(3)}>Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                  </motion.div>
                )}

                {
}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Dedicate this offering (optional)</h3>
                    <p className="text-muted-foreground text-sm mb-6">Make this seva in honor or memory of a loved one</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {(["memory", "behalf"] as const).map((t) => (
                        <button key={t} onClick={() => setDedicateType(t)}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${dedicateType === t ? "border-secondary bg-secondary/5 text-foreground" : "border-border text-muted-foreground hover:border-secondary/30"}`}>
                          {t === "memory" ? "In Memory Of" : "On Behalf Of"}
                        </button>
                      ))}
                    </div>
                    <Input placeholder="Enter name (optional)" value={dedicateTo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDedicateTo(e.target.value)} className="rounded-xl h-12 mb-6" />
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 rounded-full h-12" onClick={() => setStep(2)}>Back</Button>
                      <Button className="flex-1 rounded-full bg-gradient-ocean text-primary-foreground h-12" onClick={() => setStep(4)}>Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                  </motion.div>
                )}

                {
}
                {step === 4 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Your details</h3>
                    <p className="text-muted-foreground text-sm mb-6">Required for 80G tax exemption certificate</p>
                    <div className="space-y-4 mb-6">
                      <Input placeholder="Full Name *" value={donorName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonorName(e.target.value)} className="rounded-xl h-12" />
                      <Input type="email" placeholder="Email Address *" value={donorEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonorEmail(e.target.value)} className="rounded-xl h-12" />
                      <Input type="tel" placeholder="Phone Number *" value={donorPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonorPhone(e.target.value)} className="rounded-xl h-12" />
                      <Input placeholder="PAN Number (for 80G)" value={donorPan} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonorPan(e.target.value)} className="rounded-xl h-12" />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 rounded-full h-12" onClick={() => setStep(3)}>Back</Button>
                      <Button disabled={!donorName || !donorEmail || !donorPhone} className="flex-1 rounded-full bg-gradient-ocean text-primary-foreground h-12" onClick={() => setStep(5)}>Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                  </motion.div>
                )}

                {
}
                {step === 5 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Payment method</h3>
                    <p className="text-muted-foreground text-sm mb-6">All transactions are 256-bit SSL encrypted</p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[
                        { id: "upi", icon: Smartphone, label: "UPI / GPay" },
                        { id: "netbanking", icon: Building2, label: "Net Banking" },
                        { id: "card", icon: CreditCard, label: "Credit / Debit" },
                        { id: "wallet", icon: Wallet, label: "Wallet" },
                      ].map((pm) => (
                        <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                          className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${paymentMethod === pm.id ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/30"}`}>
                          <pm.icon className={`w-5 h-5 ${paymentMethod === pm.id ? "text-secondary" : "text-muted-foreground"}`} />
                          <span className="font-medium text-sm text-foreground">{pm.label}</span>
                        </button>
                      ))}
                    </div>

                    {
}
                    <div className="bg-muted/50 rounded-2xl p-4 mb-6 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold text-foreground">₹{finalAmount.toLocaleString("en-IN")}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="text-foreground capitalize">{donationType}</span></div>
                      {dedicateTo && <div className="flex justify-between"><span className="text-muted-foreground">Dedicated</span><span className="text-foreground">{dedicateType === "memory" ? "In memory of" : "On behalf of"} {dedicateTo}</span></div>}
                      <div className="flex justify-between"><span className="text-muted-foreground">Donor</span><span className="text-foreground">{donorName}</span></div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 justify-center">
                      <Lock className="w-3.5 h-3.5" /> SSL Secured
                      <span className="mx-1">•</span>
                      <Shield className="w-3.5 h-3.5" /> 80G Tax Benefit
                      <span className="mx-1">•</span>
                      <Award className="w-3.5 h-3.5" /> FCRA Registered
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 rounded-full h-12" onClick={() => setStep(4)}>Back</Button>
                      <Button disabled={!paymentMethod} className="flex-1 rounded-full h-14 text-base font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-glow" onClick={async () => {
                        try {
                          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";
                          const res = await fetch(`${apiUrl}/donations`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              donorName, donorEmail, amount: finalAmount, type: donationType, message: '', transactionId: '', festivalSlug: festivalSlug || undefined
                            }),
                            credentials: 'include'
                          });
                          if (res.ok) {
                            setCompleted(true);
                          } else {
                            setCompleted(true);
                          }
                        } catch (err) {
                          setCompleted(true);
                        }
                      }}>
                        Complete My Seva 🙏
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {
}
              <div className="hidden lg:block w-72 border-l border-border bg-muted/30 p-6 rounded-r-3xl">
                <h4 className="text-sm font-semibold text-foreground mb-1">Live Donations</h4>
                <p className="text-xs text-muted-foreground mb-4">Real-time seva activity</p>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {recentDonors.slice(0, 8).map((d, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                      className="bg-background rounded-xl p-3 border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-foreground">{d.name}</span>
                        <span className="text-xs font-bold text-secondary">{d.amount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{d.city}</span>
                        <span className="text-[10px] text-muted-foreground">{d.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};



export default function DonatePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAmount, setModalAmount] = useState<number | undefined>();
  const search = useSearchParams();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";
  const festivalQuery = search.get('festival');
  const optionQuery = search.get('option');
  const [festivalSlug, setFestivalSlug] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!festivalQuery) return;
    (async () => {
      try {
  const res = await fetch(`${apiUrl}/festival-donations/${encodeURIComponent(festivalQuery)}`, { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        setFestivalSlug(data.slug);
        let amount: number | undefined;
        if (optionQuery && Array.isArray(data.donationOptions)) {
          const opt = data.donationOptions.find((o: any) => o.label === optionQuery);
          if (opt) amount = opt.amount;
        }
        if (!amount) {
          if (Array.isArray(data.donationOptions) && data.donationOptions.length) amount = data.donationOptions[0].amount;
          else amount = data.meta?.amount || data.donationAmount;
        }
        if (amount) setModalAmount(Number(amount));
        setModalOpen(true);
      } catch (err) {}
    })();
  }, [festivalQuery, optionQuery]);

  const openModal = (amount?: number) => {
    setModalAmount(amount);
    setModalOpen(true);
  };

  return (
    <PageLayout>
 
      <section className="relative pt-20 min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/assets/hero-temple.jpg" alt="Temple" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,90%,8%)] via-[hsl(220,90%,12%,0.95)] to-[hsl(220,90%,15%,0.7)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,90%,8%)] via-transparent to-transparent" />
        </div>
     
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-20 right-20 w-96 h-96 rounded-full bg-secondary/20 blur-[100px]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-accent/15 blur-[80px]" />

        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/15 text-secondary text-sm font-medium mb-6 backdrop-blur-sm border border-secondary/20">
                <Sparkles className="w-4 h-4" /> Your Seva, Their Blessings
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.08]">
                Every offering is a<br />step closer to the{" "}
                <span className="text-gradient-ocean">Divine</span>
              </h1>
              <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
                Join thousands of devotees who have made a difference through their sacred contributions to the Hare Krishna Movement, Visakhapatnam.
              </p>

            
              <div className="flex flex-wrap items-center gap-6 mb-10">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10">
                  <p className="text-3xl md:text-4xl font-bold text-secondary">
                    ₹<AnimatedCounter target={12456000} />
                  </p>
                  <p className="text-white/50 text-sm">raised by <span className="text-white/80 font-semibold">8,342</span> devotees</p>
                </div>
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-ocean border-2 border-[hsl(220,90%,8%)] flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-[hsl(220,90%,8%)] flex items-center justify-center text-secondary text-xs font-bold">
                    +8K
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-10 text-lg font-semibold shadow-glow animate-pulse hover:animate-none" onClick={() => openModal()}>
                  <Heart className="w-5 h-5 mr-2 fill-current" /> Donate Now
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-10 text-lg" onClick={() => document.getElementById("impact")?.scrollIntoView({ behavior: "smooth" })}>
                  See Our Impact <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    
      <section id="impact" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Why Donate</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3">Your Donation&apos;s Impact</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Every contribution creates ripples of divine grace that touch thousands of lives every single day.</p>
            </div>
          </AnimatedSection>

          <div className="max-w-5xl mx-auto text-center">
            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6 justify-center">
                {presetAmounts.map((p) => (
                  <button key={p.amount} onClick={() => openModal(p.amount)}
                    className="relative bg-card hover:bg-background border border-border hover:border-secondary/40 rounded-2xl p-4 transition-all duration-200 group shadow-sm hover:shadow-md transform hover:-translate-y-1">
                    {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold whitespace-nowrap shadow">POPULAR</span>}
                    <span className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors">{p.label}</span>
                    <p className="text-[12px] text-muted-foreground mt-1">{p.desc}</p>
                  </button>
                ))}
              </div>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-12 text-lg font-semibold shadow-glow" onClick={() => openModal()}>
                <Heart className="w-5 h-5 mr-2 fill-current" /> Donate Now
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>

    
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Active Campaigns</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3">Choose a Cause</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Support a specific seva that resonates with your heart.</p>
            </div>
          </AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {campaigns.map((c, i) => {
                const pct = Math.round((c.raised / c.goal) * 100);
                return (
                  <AnimatedSection key={c.title} delay={i * 0.1} className="min-w-[300px] md:min-w-[340px] snap-center">
                    <div className="bg-background rounded-2xl overflow-hidden border border-border hover:border-secondary/30 hover:shadow-warm transition-all duration-300 group h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <Image src={c.image} alt={c.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-bold">{pct}% funded</span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-foreground mb-2">{c.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-1">{c.desc}</p>
                        <div className="mb-3">
                          <Progress value={pct} className="h-2.5 rounded-full" />
                          <div className="flex justify-between mt-2 text-xs">
                            <span className="text-secondary font-semibold">₹{(c.raised / 100000).toFixed(1)}L raised</span>
                            <span className="text-muted-foreground">Goal: ₹{(c.goal / 100000).toFixed(1)}L</span>
                          </div>
                        </div>
                        <Button className="w-full rounded-full bg-gradient-ocean text-primary-foreground" onClick={() => openModal(1001)}>
                          <Heart className="w-4 h-4 mr-2 fill-current" /> Donate to This Cause
                        </Button>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-24 bg-gradient-navy relative overflow-hidden">
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px]" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Quick Donation</h2>
              <p className="text-white/60 mb-10 max-w-lg mx-auto">Select a preset or enter your own amount to make an instant offering</p>
            </AnimatedSection>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactCards.map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.1}>
                <div className="bg-card rounded-2xl p-6 border border-border hover:border-secondary/30 hover:shadow-warm transition-all duration-300 group h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300">
                    <card.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{card.title}</h3>
                  <p className="text-secondary font-semibold text-lg mb-2">{card.stat}</p>
                  <p className="text-sm text-muted-foreground">{card.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

    
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Devotee Stories</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3">Words from Our Donors</h2>
            </div>
          </AnimatedSection>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="bg-card rounded-2xl p-6 border border-border h-full flex flex-col hover:shadow-warm transition-all duration-300">
                  <Quote className="w-8 h-8 text-secondary/30 mb-3" />
                  <p className="text-muted-foreground text-sm leading-relaxed italic flex-1">&quot;{t.quote}&quot;</p>
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-ocean flex items-center justify-center text-white text-sm font-bold">{t.name[0]}</div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.city}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
         
          <AnimatedSection delay={0.3} className="mt-10 max-w-2xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-border aspect-video bg-muted flex items-center justify-center group cursor-pointer hover:shadow-warm transition-all">
              <Image src="/assets/gallery-aarti.jpg" alt="Video testimonial" fill className="object-cover opacity-60" />
              <div className="relative z-10 w-16 h-16 rounded-full bg-secondary/90 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 text-secondary-foreground fill-current ml-1" />
              </div>
              <p className="absolute bottom-4 left-4 text-white text-sm font-medium z-10">Watch: Devotees share their experience</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

     
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Transparency</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3">Where Does Your Money Go?</h2>
            </div>
          </AnimatedSection>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
           
              <div className="relative w-64 h-64 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {(() => {
                    let offset = 0;
                    return pieData.map((seg) => {
                      const circumference = Math.PI * 80;
                      const dash = (seg.pct / 100) * circumference;
                      const gap = circumference - dash;
                      const el = (
                        <circle key={seg.label} cx="50" cy="50" r="40" fill="none" stroke={seg.color} strokeWidth="16"
                          strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} className="transition-all duration-1000" />
                      );
                      offset += dash;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-6 h-6 text-secondary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Fund Allocation</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {pieData.map((seg) => (
                  <div key={seg.label} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="text-muted-foreground">{seg.label} ({seg.pct}%)</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">80G & FCRA Certified</h3>
                    <p className="text-sm text-muted-foreground">Registered under Section 80G of IT Act and FCRA for foreign contributions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Registered Trust</h3>
                    <p className="text-sm text-muted-foreground">Hare Krishna Movement Visakhapatnam is a registered charitable trust (Reg. No. XXXXX).</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Annual Reports</h3>
                    <p className="text-sm text-muted-foreground">We publish detailed annual reports with complete financial transparency.</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-full border-secondary/30 text-secondary hover:bg-secondary/5">
                  <Download className="w-4 h-4 mr-2" /> Download Annual Report
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

     
      <section className="py-16 bg-background overflow-hidden">
        <div className="container mx-auto px-4 mb-8 text-center">
          <AnimatedSection>
            <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Social Proof</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3">Recent Donors</h2>
          </AnimatedSection>
        </div>
       
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          <motion.div animate={{ x: [0, -1200] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex gap-4 whitespace-nowrap">
            {[...recentDonors, ...recentDonors].map((d, i) => (
              <div key={i} className="inline-flex items-center gap-3 bg-card rounded-full px-5 py-3 border border-border shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-ocean flex items-center justify-center text-white text-xs font-bold">{d.name[0]}</div>
                <div>
                  <span className="text-sm font-semibold text-foreground">{d.name}</span>
                  <span className="text-muted-foreground text-xs ml-2">{d.city}</span>
                </div>
                <span className="text-secondary font-bold text-sm">{d.amount}</span>
                <span className="text-muted-foreground text-xs">{d.time}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-secondary text-sm tracking-[0.2em] uppercase font-medium">Common Questions</span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-3">Frequently Asked Questions</h2>
            </div>
          </AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AnimatedSection key={i} delay={i * 0.05}>
                  <AccordionItem value={`faq-${i}`} className="border border-border rounded-2xl px-6 overflow-hidden bg-background">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </AnimatedSection>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

    
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/assets/gallery-darshan-1.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,90%,8%,0.95)] via-[hsl(220,90%,12%,0.9)] to-[hsl(195,80%,30%,0.85)]" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <AnimatedSection>
            <Heart className="w-16 h-16 text-secondary mx-auto mb-6 fill-current opacity-70" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Every Offering<br />Reaches the Lord</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-10">
              No donation is too small. Whether it&apos;s ₹100 or ₹1,00,000 — every rupee is a seed of devotion that blossoms into divine service.
            </p>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-12 text-lg font-semibold shadow-glow" onClick={() => openModal()}>
              <Heart className="w-5 h-5 mr-2 fill-current" /> Make Your Offering
            </Button>
          </AnimatedSection>
        </div>
      </section>

    
  <DonationModal open={modalOpen} onClose={() => setModalOpen(false)} initialAmount={modalAmount} festivalSlug={festivalSlug} />
    </PageLayout>
  );
}
