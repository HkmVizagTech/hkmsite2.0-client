"use client";

import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  { icon: MapPin, title: "Address", lines: ["Hare Krishna Movement India", "Visakhapatnam, Andhra Pradesh", "India"] },
  { icon: Phone, title: "Phone", lines: ["Contact through website", "www.harekrishnavizag.org"] },
  { icon: Mail, title: "Email", lines: ["info@harekrishnavizag.org"] },
  { icon: Clock, title: "Visiting Hours", lines: ["Morning: 4:30 AM - 1:00 PM", "Evening: 4:00 PM - 8:30 PM"] },
];

const faqs = [
  { q: "What are the temple timings?", a: "The temple is open daily from 4:30 AM to 1:00 PM and 4:00 PM to 8:30 PM. Mangala Aarti begins at 4:30 AM." },
  { q: "How can I volunteer?", a: "We welcome volunteers! Please visit us during temple hours or send us a message through the contact form. We have opportunities in cooking, distribution, education, and event management." },
  { q: "Are donations tax-deductible?", a: "Yes, all donations to Hare Krishna Movement India are eligible for 80G income tax benefits under the Finance Act. PAN details are required for the certificate." },
  { q: "Can I sponsor a special occasion?", a: "Absolutely! You can sponsor festivals, birthdays, anniversaries, and other occasions. Contact us for special event sponsorship packages." },
];

export default function ContactPage() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const inView1 = useInView(ref1, { once: true, margin: "-80px" });
  const inView2 = useInView(ref2, { once: true, margin: "-80px" });
  const inView3 = useInView(ref3, { once: true, margin: "-80px" });
  const inView4 = useInView(ref4, { once: true, margin: "-80px" });
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message Sent!", description: "Hare Krishna! We'll respond soon." });
    }, 1000);
  };

  return (
    <PageLayout>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out to us for any queries or assistance."
        breadcrumb="Contact"
      />

      {
}
      <section className="py-24 bg-background" ref={ref1}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            {
}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="space-y-5"
            >
              <p className="text-primary text-sm tracking-[0.2em] uppercase font-medium">Reach Out</p>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Get In Touch</h2>
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView1 ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">{info.title}</h3>
                    {info.lines.map((line) => (
                      <p key={line} className="text-muted-foreground text-sm">{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {
}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-card rounded-2xl p-8 border border-border space-y-5"
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">Send a Message</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Your Name" required className="bg-background" />
                <Input placeholder="Phone Number" className="bg-background" />
              </div>
              <Input placeholder="Email Address" type="email" required className="bg-background" />
              <Input placeholder="Subject" required className="bg-background" />
              <Textarea placeholder="Your Message" rows={5} required className="bg-background resize-none" />
              <Button type="submit" className="w-full" disabled={sending}>
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>
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
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Bank Transfer</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Donation Details</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="max-w-lg mx-auto bg-background rounded-2xl p-8 border border-border"
          >
            <Building className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">Hare Krishna Movement India</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-medium text-foreground">10091415313</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">IFSC Code</span>
                <span className="font-medium text-foreground">IDFB0080412</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Bank</span>
                <span className="font-medium text-foreground">IDFC First Bank Ltd</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Branch</span>
                <span className="font-medium text-foreground">Daba Gardens, Vizag</span>
              </div>
            </div>
            <p className="text-xs text-primary mt-4 font-medium">
              ✓ Avail 80G tax benefits on all donations
            </p>
          </motion.div>
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
            className="text-center mb-12"
          >
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Stay Connected</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Follow Us</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Stay updated with our latest events, festivals, and seva activities through our social media channels.
            </p>
          </motion.div>
          <div className="max-w-lg mx-auto grid grid-cols-3 gap-4">
            {[
              { icon: Facebook, name: "Facebook", color: "bg-primary/10" },
              { icon: Instagram, name: "Instagram", color: "bg-primary/10" },
              { icon: Youtube, name: "YouTube", color: "bg-primary/10" },
            ].map((social, i) => (
              <motion.a
                key={social.name}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={inView3 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-2xl p-6 border border-border text-center hover:shadow-warm transition-shadow"
              >
                <div className={`w-14 h-14 rounded-xl ${social.color} flex items-center justify-center mx-auto mb-3`}>
                  <social.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="font-heading font-semibold text-foreground text-sm">{social.name}</p>
              </motion.a>
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
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 font-medium">Common Questions</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">FAQs</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 15 }}
                animate={inView4 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-background rounded-2xl p-6 border border-border"
              >
                <h3 className="font-heading font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
