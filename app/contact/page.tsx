"use client";

import PageLayout from "@/components/PageLayout";
import WhatsAppCommunityCTA from "@/components/WhatsAppCommunityCTA";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube, Building, ChevronDown, BadgeCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: MapPin, title: "Address", lines: ["Chaitanya Bhavan, Hare Krishna Vaikuntam Cultural Centre", "IIM Rd, opp. Akshaya Patra Foundation, Gambhiram", "Visakhapatnam, Andhra Pradesh 531163"] },
  { icon: Phone, title: "Phone", lines: ["+91 89777 61187"] },
  { icon: Mail, title: "Email", lines: ["social@hkmvizag.org"] },
  { icon: Clock, title: "Visiting Hours", lines: ["Morning: 4:30 AM - 1:00 PM", "Evening: 4:00 PM - 8:30 PM"] },
];

const faqs = [
  { q: "What are the temple timings?", a: "The temple is open daily from 4:30 AM to 1:00 PM and 4:00 PM to 8:30 PM. Mangala Aarti begins at 4:30 AM." },
  { q: "How can I volunteer?", a: "We welcome volunteers! Please visit us during temple hours or send us a message through the contact form. We have opportunities in cooking, distribution, education, and event management." },
  { q: "Are donations tax-deductible?", a: "Yes, all donations to Hare Krishna Movement India are eligible for 80G income tax benefits under the Finance Act. PAN details are required for the certificate." },
  { q: "Can I sponsor a special occasion?", a: "Absolutely! You can sponsor festivals, birthdays, anniversaries, and other occasions. Contact us for special event sponsorship packages." },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [authorization, setAuthorization] = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorization) {
      toast({
        title: "Authorization required",
        description: "Please authorize us to send you SMS / promotional / informational messages.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/contact-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, authorization }),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast({ title: "Message Sent!", description: "Hare Krishna! We'll respond soon." });
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
      setAuthorization(false);
    } catch (err) {
      toast({
        title: "Couldn't send message",
        description: "Please try again, or reach us directly at social@hkmvizag.org",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };
  // Accordion UI state for the FAQ list (presentation only).
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <PageLayout>
      <div className="pt-[var(--header-h)]">
        <PageHero
          title="Visit & Contact ISKCON Gambheeram"
          subtitle="We'd love to hear from you. Reach out to us for any queries or assistance."
          breadcrumb="Contact"
        />

        {/* ── CONTACT INFO + FORM ──────────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <Reveal>
              <span className="vk-pill mb-4">Reach Out</span>
              <h2 className="vk-h2">Get In Touch</h2>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 md:gap-4">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className={`vk-card flex gap-4 p-5 ${info.title === "Address" ? "sm:col-span-2" : ""}`}
                  >
                    <span className="vk-icon-chip">
                      <info.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="mb-1 text-[15px] font-bold text-foreground">{info.title}</h3>
                      {info.lines.map((line) => (
                        <p key={line} className="break-words text-sm leading-relaxed text-muted-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <form onSubmit={handleSubmit} className="vk-card space-y-4 p-5 md:p-8">
                <div>
                  <h3 className="vk-bar-title text-xl text-foreground">Send a Message</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input placeholder="Your Name" required value={form.name} onChange={handleChange("name")} className="vk-input" />
                  <input placeholder="Phone Number" value={form.phone} onChange={handleChange("phone")} className="vk-input" />
                </div>
                <input placeholder="Email Address" type="email" required value={form.email} onChange={handleChange("email")} className="vk-input" />
                <input placeholder="Subject" required value={form.subject} onChange={handleChange("subject")} className="vk-input" />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange("message")}
                  className="vk-input h-auto resize-none py-3"
                />
                <label className="flex cursor-pointer select-none items-start gap-3 rounded-xl bg-vk-50 p-3 text-sm leading-relaxed text-muted-foreground">
                  <Checkbox
                    checked={authorization}
                    onCheckedChange={(v) => setAuthorization(!!v)}
                    className="mt-0.5 h-5 w-5 rounded-md border-vk-400 data-[state=checked]:border-vk-700 data-[state=checked]:bg-vk-700"
                    required
                  />
                  <span>
                    I hereby authorize to send the notifications on SMS / Messages / Promotional / Informational Messages
                  </span>
                </label>
                <button type="submit" className="vk-btn-primary w-full py-3" disabled={sending}>
                  <Send className="h-4 w-4" />
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </Reveal>
          </div>
        </section>

        {/* ── BANK DETAILS + SOCIAL ────────────────────────────── */}
        <section className="vk-section vk-band">
          <div className="vk-container grid gap-6 lg:grid-cols-2 lg:gap-8">
            <Reveal>
              <div className="vk-card h-full p-6 md:p-8">
                <span className="vk-pill mb-4">Bank Transfer</span>
                <h2 className="vk-h3">Donation Details</h2>
                <div className="mt-5 flex items-center gap-3">
                  <span className="vk-icon-chip">
                    <Building className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold text-foreground md:text-lg">Hare Krishna Movement India</h3>
                </div>
                <dl className="mt-5 divide-y divide-vk-100 rounded-2xl border border-vk-100 bg-vk-50/60 px-4 text-sm">
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-3">
                    <dt className="text-muted-foreground">Account Number</dt>
                    <dd className="font-semibold tabular-nums text-foreground">10091415313</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-3">
                    <dt className="text-muted-foreground">IFSC Code</dt>
                    <dd className="font-semibold text-foreground">IDFB0080412</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-3">
                    <dt className="text-muted-foreground">Bank</dt>
                    <dd className="font-semibold text-foreground">IDFC First Bank Ltd</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-3">
                    <dt className="text-muted-foreground">Branch</dt>
                    <dd className="font-semibold text-foreground">Daba Gardens, Vizag</dd>
                  </div>
                </dl>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-vk-700">
                  <BadgeCheck className="h-4 w-4" />
                  Avail 80G tax benefits on all donations
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="vk-card flex h-full flex-col p-6 md:p-8">
                <span className="vk-pill mb-4 self-start">Stay Connected</span>
                <h2 className="vk-h3">Follow Us</h2>
                <p className="vk-lead mt-2">
                  Stay updated with our latest events, festivals, and seva activities through our social media channels.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { icon: Facebook, name: "Facebook" },
                    { icon: Instagram, name: "Instagram" },
                    { icon: Youtube, name: "YouTube" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href="#"
                      className="group flex flex-col items-center rounded-2xl border border-vk-100 bg-vk-50 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-vk-300 hover:bg-white hover:shadow-card"
                    >
                      <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-vk-700 shadow-sm transition-colors group-hover:bg-vk-700 group-hover:text-white">
                        <social.icon className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-semibold text-foreground">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="vk-section">
          <div className="vk-container">
            <SectionHeading align="center" eyebrow="Common Questions" title="FAQs" />
            <div className="mx-auto max-w-3xl space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={faq.q}
                    className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${
                      isOpen ? "border-vk-200 shadow-card" : "border-vk-100"
                    }`}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`contact-faq-${i}`}
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex min-h-[52px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink"
                      >
                        <span>{faq.q}</span>
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                            isOpen ? "rotate-180 bg-vk-700 text-white" : "bg-vk-100 text-vk-700"
                          }`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`contact-faq-${i}`}
                      role="region"
                      className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <WhatsAppCommunityCTA />
      </div>
    </PageLayout>
  );
}
