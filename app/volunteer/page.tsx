"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Calendar,
  MapPin,
  Heart,
  HandHeart,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import TempleCarousel from "@/components/TempleCarousel";
import Ornament from "@/components/Ornament";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const VCC_API =
  (process.env.NEXT_PUBLIC_VCC_API_URL || "").replace(/\/+$/, "") ||
  "https://vcc-client.vercel.app";

type CustomFieldType =
  | "short_text"
  | "long_text"
  | "number"
  | "email"
  | "phone"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

interface CustomField {
  id: string;
  label: string;
  type: CustomFieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

interface VccEvent {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  venue?: string;
  bannerImage?: string;
  eventStart: string;
  eventEnd: string;
  status: string;
  availabilitySlots?: string[];
  customFields?: CustomField[];
}

interface ServiceAvailabilityEntry {
  date: string;
  timeSlot: string;
}

const SKILLS = [
  { key: "medical", label: "Medical" },
  { key: "photography", label: "Photography" },
  { key: "videography", label: "Videography" },
  { key: "driving", label: "Driving" },
  { key: "electrical", label: "Electrical" },
  { key: "sound", label: "Sound" },
  { key: "it", label: "IT / Tech" },
  { key: "graphic_design", label: "Graphic Design" },
  { key: "cooking", label: "Cooking" },
  { key: "crowd_management", label: "Crowd Management" },
  { key: "other", label: "Other" },
];

const GENDERS = ["male", "female", "other"];

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

const emptyForm = {
  name: "",
  phone: "",
  age: "",
  gender: "",
  locality: "",
  occupation: "",
  skills: [] as string[],
  serviceAvailability: [] as ServiceAvailabilityEntry[],
  notes: "",
  customAnswers: {} as Record<string, unknown>,
};

interface SuccessInfo {
  name: string;
  volunteerNumber: string;
  sevaToken: string;
  eventName: string;
}

export default function VolunteerPage() {
  const searchParams = useSearchParams();
  const eventSlugParam = searchParams.get("event");

  const [events, setEvents] = useState<VccEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<VccEvent | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessInfo | null>(null);

  useEffect(() => {
    fetch(`${VCC_API}/api/events/public`)
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!eventSlugParam || events.length === 0) return;
    const match = events.find((e) => e.slug === eventSlugParam);
    if (match && match.status === "registration_open" && !selectedEvent) {
      setSelectedEvent(match);
      setForm(emptyForm);
      setSuccess(null);
    }
  }, [eventSlugParam, events, selectedEvent]);

  const openRegistration = (event: VccEvent) => {
    setSelectedEvent(event);
    setForm(emptyForm);
    setSuccess(null);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setForm(emptyForm);
    setSuccess(null);
  };

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const setCustomAnswer = (fieldId: string, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      customAnswers: { ...prev.customAnswers, [fieldId]: value },
    }));
  };

  const handleRegister = async () => {
    if (!selectedEvent) return;
    if (!form.name.trim() || !form.phone.trim()) {
      toast({
        title: "Missing details",
        description: "Please enter your name and phone number.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${VCC_API}/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent._id,
          name: form.name.trim(),
          phone: form.phone.trim(),
          whatsappNumber: form.phone.trim(),
          age: form.age ? Number(form.age) : undefined,
          gender: form.gender || undefined,
          locality: form.locality || undefined,
          occupation: form.occupation || undefined,
          skills: form.skills,
          serviceAvailability: form.serviceAvailability,
          customAnswers: form.customAnswers,
          notes: form.notes || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess({
          name: data.volunteer?.name || form.name,
          volunteerNumber: data.volunteer?.volunteerNumber || "",
          sevaToken: data.volunteer?.sevaToken || "",
          eventName: selectedEvent.name,
        });
      } else if (res.status === 409) {
        toast({
          title: "Already registered",
          description:
            "You are already registered for this event. Look out for a message from us with your seva assignment.",
        });
        closeModal();
      } else {
        toast({
          title: "Registration failed",
          description: data.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderCustomField = (field: CustomField) => {
    const value = form.customAnswers[field.id];
    const setVal = (v: unknown) => setCustomAnswer(field.id, v);

    switch (field.type) {
      case "long_text":
        return (
          <Textarea
            placeholder={field.placeholder}
            rows={3}
            value={(value as string) || ""}
            onChange={(e) => setVal(e.target.value)}
          />
        );
      case "select":
        return (
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={(value as string) || ""}
            onChange={(e) => setVal(e.target.value)}
          >
            <option value="">Select an option</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="flex flex-col gap-1.5">
            {(field.options || []).map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={() => setVal(opt)}
                  className="h-4 w-4"
                />
                {opt}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="flex flex-col gap-1.5">
            {(field.options || []).map((opt) => {
              const arr = Array.isArray(value) ? (value as string[]) : [];
              return (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={arr.includes(opt)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...arr, opt]
                        : arr.filter((x) => x !== opt);
                      setVal(next);
                    }}
                    className="rounded"
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value === undefined ? "" : String(value)}
            onChange={(e) => setVal(e.target.value)}
          />
        );
      case "email":
        return (
          <Input
            type="email"
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => setVal(e.target.value)}
          />
        );
      case "phone":
        return (
          <Input
            type="tel"
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => setVal(e.target.value)}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={(value as string) || ""}
            onChange={(e) => setVal(e.target.value)}
          />
        );
      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => setVal(e.target.value)}
          />
        );
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  function eachDay(startIso: string, endIso: string) {
    const days: { iso: string; label: string }[] = [];
    const start = new Date(startIso);
    const end = new Date(endIso);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return days;
    const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    while (cursor <= last) {
      const yyyy = cursor.getFullYear();
      const mm = String(cursor.getMonth() + 1).padStart(2, "0");
      const dd = String(cursor.getDate()).padStart(2, "0");
      days.push({
        iso: `${yyyy}-${mm}-${dd}`,
        label: cursor.toLocaleDateString("en-IN", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }

  return (
    <PageLayout>
      {/* HERO */}
      <section className="overflow-hidden pt-[88px] md:pt-[104px]">
        <TempleCarousel />
      </section>

      {/* Why Volunteer */}
      <section className="py-12 md:py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-3 font-medium">
              Why Volunteer
            </p>
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
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
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
              Choose an event that resonates with you and register to serve.
              New opportunities are added regularly.
            </p>
          </div>

          {loading && (
            <div className="text-center text-muted-foreground py-16">
              <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
              Loading events...
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No Events Right Now
              </h3>
              <p className="text-sm text-muted-foreground">
                Check back soon — we regularly add volunteer opportunities for
                upcoming festivals and temple activities.
              </p>
            </div>
          )}

          {!loading && events.length > 0 && (
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-warm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevated"
                >
                  {event.bannerImage ? (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={event.bannerImage}
                        alt={event.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,85%,10%,0.6)] via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center bg-primary/5">
                      <Calendar className="h-14 w-14 text-primary/30" />
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="mb-2 font-heading text-lg font-bold text-foreground leading-tight">
                      {event.name}
                    </h3>
                    {event.description && (
                      <p className="mb-4 text-xs text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    <div className="mb-4 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>{formatDate(event.eventStart)}</span>
                      </div>
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full rounded-full"
                      disabled={event.status !== "registration_open"}
                      onClick={() => openRegistration(event)}
                    >
                      {event.status === "registration_open"
                        ? "Register to Volunteer"
                        : "Registration Closed"}
                      {event.status === "registration_open" && (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden bg-gradient-ocean py-16 text-center md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-3 font-heading text-2xl font-bold text-white md:text-4xl">
            Can&apos;t Find a Suitable Event?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/85">
            We&apos;re always looking for helping hands. Reach out to us and
            we&apos;ll find the perfect way for you to serve.
          </p>
          <a
            href="https://wa.me/918977761187?text=Hare%20Krishna!%20I%20would%20like%20to%20volunteer%20at%20HKM%20Vizag."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-bold text-[hsl(220,60%,12%)] shadow-gold transition-transform hover:-translate-y-0.5 md:text-base"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat With Us on WhatsApp
          </a>
        </div>
      </section>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4"
            onClick={closeModal}
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
                  <h2 className="text-xl font-bold text-foreground">
                    {success ? "Registration Confirmed" : "Register to Volunteer"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.name}
                  </p>
                </div>
                <button onClick={closeModal} type="button" aria-label="Close">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {success ? (
                <div className="space-y-5 py-2">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">
                      Hare Krishna, {success.name}!
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You are registered for {success.eventName}.
                    </p>
                  </div>
                  {success.volunteerNumber && (
                    <div className="mx-auto max-w-xs space-y-2 rounded-xl bg-primary/5 p-4 text-center">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Volunteer Number
                      </div>
                      <div className="font-mono text-lg font-bold text-primary">
                        {success.volunteerNumber}
                      </div>
                    </div>
                  )}
                  <p className="text-center text-xs text-muted-foreground">
                    Save your volunteer number — the coordinator will contact
                    you with your seva assignment.
                  </p>
                  <Button className="w-full" onClick={closeModal}>
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Full Name *
                      </label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        WhatsApp Number *
                      </label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Age
                      </label>
                      <Input
                        type="number"
                        min={13}
                        max={100}
                        value={form.age}
                        onChange={(e) =>
                          setForm({ ...form, age: e.target.value })
                        }
                        placeholder="e.g. 25"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Gender
                      </label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={form.gender}
                        onChange={(e) =>
                          setForm({ ...form, gender: e.target.value })
                        }
                      >
                        <option value="">Select</option>
                        {GENDERS.map((g) => (
                          <option key={g} value={g}>
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Locality / Area
                      </label>
                      <Input
                        value={form.locality}
                        onChange={(e) =>
                          setForm({ ...form, locality: e.target.value })
                        }
                        placeholder="e.g. MVP Colony"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Occupation
                      </label>
                      <Input
                        value={form.occupation}
                        onChange={(e) =>
                          setForm({ ...form, occupation: e.target.value })
                        }
                        placeholder="e.g. Student"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Skills you can offer
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {SKILLS.map((skill) => {
                        const active = form.skills.includes(skill.key);
                        return (
                          <button
                            key={skill.key}
                            type="button"
                            onClick={() => toggleSkill(skill.key)}
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-input bg-transparent text-muted-foreground hover:bg-accent"
                            }`}
                          >
                            {skill.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedEvent.availabilitySlots &&
                    selectedEvent.availabilitySlots.length > 0 && (
                      <div className="space-y-2 border-t pt-3">
                        <label className="block text-xs font-medium text-muted-foreground">
                          Availability
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Select the time slot you are available for each day.
                        </p>
                        {eachDay(selectedEvent.eventStart, selectedEvent.eventEnd).map(
                          (day) => {
                            const key = day.iso;
                            const selected =
                              form.serviceAvailability.find((e) => e.date === key)
                                ?.timeSlot || "";
                            return (
                              <div key={key} className="rounded-md border p-3">
                                <p className="mb-2 text-sm font-medium">
                                  {day.label}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedEvent.availabilitySlots!.map((slot) => {
                                    const active = selected === slot;
                                    return (
                                      <button
                                        key={slot}
                                        type="button"
                                        onClick={() => {
                                          const next =
                                            form.serviceAvailability.filter(
                                              (e) => e.date !== key
                                            );
                                          next.push({ date: key, timeSlot: slot });
                                          setForm({
                                            ...form,
                                            serviceAvailability: next,
                                          });
                                        }}
                                        className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                                          active
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-input bg-transparent text-muted-foreground hover:bg-accent"
                                        }`}
                                      >
                                        {slot}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}

                  {selectedEvent.customFields &&
                    selectedEvent.customFields.length > 0 && (
                      <div className="space-y-3 border-t pt-3">
                        {selectedEvent.customFields.map((field) => (
                          <div key={field.id}>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                              {field.label}
                              {field.required && (
                                <span className="ml-0.5 text-destructive">
                                  *
                                </span>
                              )}
                            </label>
                            {renderCustomField(field)}
                            {field.helpText && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {field.helpText}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Anything else?
                    </label>
                    <Textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      placeholder="Allergies, dietary preferences, or other notes"
                    />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button
                      className="flex-1"
                      onClick={handleRegister}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Submit Registration"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
