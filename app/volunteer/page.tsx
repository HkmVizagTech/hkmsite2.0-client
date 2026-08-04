"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  MapPin,
  Heart,
  CheckCircle,
  HandHeart,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import Ornament from "@/components/Ornament";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") ||
  "http://localhost:8080";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  options: string[];
}

interface VolunteerEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  image: string;
  slots: number;
  filledSlots: number;
  category: string;
  requirements: string;
  status: string;
  formFields: FormField[];
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  festival: { label: "Festival", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  weekly: { label: "Weekly", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  special: { label: "Special", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  outreach: { label: "Outreach", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
};

const WHY_VOLUNTEER = [
  {
    icon: Heart,
    title: "Serve the Lord",
    desc: "Every act of service in the temple is an offering to Lord Krishna — the highest form of devotion.",
  },
  {
    icon: Users,
    title: "Build Community",
    desc: "Connect with like-minded devotees and create lasting bonds through selfless service together.",
  },
  {
    icon: Sparkles,
    title: "Spiritual Growth",
    desc: "Volunteering purifies the heart and accelerates your spiritual journey through karma yoga.",
  },
  {
    icon: HandHeart,
    title: "Make an Impact",
    desc: "Help distribute prasadam, organize festivals, and bring smiles to thousands of visitors.",
  },
];

export default function VolunteerPage() {
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/volunteers`)
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openRegistration = (event: VolunteerEvent) => {
    setSelectedEvent(event);
    const initial: Record<string, any> = {};
    for (const field of event.formFields || []) {
      initial[field.id] = field.type === "checkbox" ? false : "";
    }
    setResponses(initial);
  };

  const handleRegister = async () => {
    if (!selectedEvent) return;
    const missing = (selectedEvent.formFields || [])
      .filter((f) => f.required)
      .filter((f) => {
        const val = responses[f.id];
        return val === undefined || val === null || val === "";
      });
    if (missing.length > 0) {
      toast({
        title: "Please fill all required fields",
        description: missing.map((f) => f.label).join(", "),
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/volunteers/${selectedEvent._id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Registration Successful!", description: "We'll contact you with further details. Hare Krishna!" });
        setSelectedEvent(null);
        setResponses({});
        setEvents((prev) =>
          prev.map((e) =>
            e._id === selectedEvent._id ? { ...e, filledSlots: e.filledSlots + 1 } : e
          )
        );
      } else {
        toast({ title: "Registration Failed", description: data.message || "Please try again", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Please check your connection", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const renderFormField = (field: FormField) => {
    const value = responses[field.id];
    const onChange = (val: any) => setResponses({ ...responses, [field.id]: val });

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder || field.label}
            rows={3}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "select":
        return (
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-foreground">{field.placeholder || field.label}</span>
          </label>
        );
      default:
        return (
          <Input
            type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
            placeholder={field.placeholder || field.label}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <PageLayout>
      <PageHero
        title="Volunteer With Us"
        subtitle="Serve the Lord and community through selfless volunteer work at Hare Krishna Movement Vizag"
        breadcrumb="Volunteer"
        backgroundImage="https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783675995608-1783675986681-SAV01474.JPG.jpg"
      />

      {/* Why Volunteer */}
      <section className="py-12 md:py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3 font-medium">Why Volunteer</p>
            <Ornament className="mb-5" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              The Joy of Selfless Service
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_VOLUNTEER.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-12 md:py-16 bg-white dark:bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3 font-medium">
              Current Opportunities
            </p>
            <Ornament className="mb-5" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Volunteer Events
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Choose an event that resonates with you and register to serve. New opportunities are added regularly.
            </p>
          </div>

          {loading && (
            <div className="text-center text-muted-foreground py-16">Loading events...</div>
          )}

          {!loading && events.length === 0 && (
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No Events Right Now</h3>
              <p className="text-sm text-muted-foreground">
                Check back soon — we regularly add volunteer opportunities for upcoming festivals and temple activities.
              </p>
            </div>
          )}

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => {
              const cat = CATEGORY_LABELS[event.category] || CATEGORY_LABELS.festival;
              const slotsLeft = event.slots > 0 ? event.slots - event.filledSlots : null;
              const isFull = event.slots > 0 && event.filledSlots >= event.slots;

              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-warm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated"
                >
                  {event.image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,85%,10%,0.6)] via-transparent to-transparent" />
                      <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${cat.color}`}>
                        {cat.label}
                      </span>
                    </div>
                  )}
                  {!event.image && (
                    <div className="flex items-center justify-between bg-primary/5 px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${cat.color}`}>
                        {cat.label}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="mb-2 font-heading text-lg font-bold text-foreground leading-tight">
                      {event.title}
                    </h3>
                    <p className="mb-4 text-xs text-muted-foreground line-clamp-3">{event.description}</p>

                    <div className="mb-4 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>{formatDate(event.date)}{event.endDate ? ` – ${formatDate(event.endDate)}` : ""}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.slots > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {isFull
                              ? "All slots filled"
                              : `${slotsLeft} of ${event.slots} slots remaining`}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full rounded-full"
                      disabled={isFull}
                      onClick={() => openRegistration(event)}
                    >
                      {isFull ? "Slots Filled" : "Register to Volunteer"}
                      {!isFull && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden bg-gradient-ocean py-16 text-center md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-3 font-heading text-2xl font-bold text-white md:text-4xl">
            Can&apos;t Find a Suitable Event?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/85">
            We&apos;re always looking for helping hands. Reach out to us and we&apos;ll find the perfect way for you to serve.
          </p>
          <a
            href="https://wa.me/918977761187?text=Hare%20Krishna!%20I%20would%20like%20to%20volunteer%20at%20HKM%20Vizag."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5 md:text-base"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat With Us on WhatsApp
          </a>
        </div>
      </section>

      {/* Registration Modal — dynamic fields */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-background p-6 shadow-elevated"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Register to Volunteer</h2>
                  <p className="text-sm text-muted-foreground">{selectedEvent.title}</p>
                </div>
                <button onClick={() => setSelectedEvent(null)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {selectedEvent.requirements && (
                <div className="mb-4 rounded-xl bg-primary/5 p-3 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Requirements:</span> {selectedEvent.requirements}
                </div>
              )}

              <div className="space-y-3">
                {(selectedEvent.formFields || []).map((field) => (
                  <div key={field.id}>
                    {field.type !== "checkbox" && (
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        {field.label}{field.required ? " *" : ""}
                      </label>
                    )}
                    {renderFormField(field)}
                  </div>
                ))}

                {(!selectedEvent.formFields || selectedEvent.formFields.length === 0) && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No registration form configured for this event.
                  </p>
                )}

                {selectedEvent.formFields && selectedEvent.formFields.length > 0 && (
                  <div className="flex gap-3 pt-1">
                    <Button className="flex-1" onClick={handleRegister} disabled={submitting}>
                      {submitting ? "Registering..." : "Submit Registration"}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedEvent(null)} disabled={submitting}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
