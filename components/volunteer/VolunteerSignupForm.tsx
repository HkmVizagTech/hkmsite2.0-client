"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { getStoredTracking } from "@/lib/tracking";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

// Keep in sync with the server (volunteer.controller.js) and the admin labels.
export const SKILL_GROUPS = [
  {
    group: "Temple seva",
    options: [
      { value: "festivals", label: "Festival Services" },
      { value: "prasadam", label: "Prasadam Seva" },
      { value: "subhojanam", label: "Subhojanam (Anna-daan)" },
      { value: "temple-services", label: "Temple Services & Decoration" },
      { value: "harinaam", label: "Harinaam Sankirtana" },
      { value: "book-distribution", label: "Book Distribution" },
    ],
  },
  {
    group: "Professional expertise",
    options: [
      { value: "medical", label: "Medical Services" },
      { value: "editorial", label: "Editorial & Publishing" },
      { value: "photography", label: "Photography & Filmmaking" },
      { value: "architecture", label: "Architecture & Interiors" },
      { value: "design", label: "Graphic Design & Fine Arts" },
      { value: "drama", label: "Drama & Performing Arts" },
      { value: "it", label: "IT & Computer Management" },
      { value: "social-media", label: "Social Media" },
    ],
  },
  { group: "", options: [{ value: "other", label: "Other / Anywhere needed" }] },
];

export const AVAILABILITY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "festival-days", label: "Festival days only" },
  { value: "flexible", label: "Flexible" },
];

const Label = ({ children, optional }: { children: React.ReactNode; optional?: boolean }) => (
  <span className="mb-1.5 block text-sm font-semibold text-foreground">
    {children}
    {optional ? <span className="ml-1 font-normal text-muted-foreground">(optional)</span> : <span className="ml-0.5 text-red-600">*</span>}
  </span>
);

const todayIso = () => {
  const d = new Date();
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
};

export default function VolunteerSignupForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", skill: "", availability: "", startDate: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { name: string; updated: boolean }>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const phone = form.phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError("Please enter a valid email address.");
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Please enter a valid 10-digit mobile number.");
    if (!form.skill) return setError("Please select your skill / seva area.");
    if (!form.availability) return setError("Please select your availability.");
    if (!form.startDate) return setError("Please choose your preferred start date.");

    setSubmitting(true);
    try {
      const t = getStoredTracking();
      const res = await fetch(`${API_URL}/volunteers/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone,
          skill: form.skill,
          availability: [form.availability],
          startDate: form.startDate,
          message: form.message,
          utm: t ? { utm_source: t.source, utm_medium: t.medium, utm_campaign: t.campaign } : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
      setDone({ name: form.name.trim().split(/\s+/)[0], updated: !!data.alreadyRegistered });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="px-2 py-8 text-center" role="status">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h3 className="text-2xl font-bold text-foreground">Hare Krishna, {done.name}!</h3>
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          {done.updated
            ? "You were already on our volunteer list — we have updated your details."
            : "Thank you for offering to serve. Our volunteer team will contact you soon with the next seva opportunity."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5 text-left">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <Label>Name of the volunteer</Label>
          <input className="vk-input" value={form.name} onChange={set("name")} autoComplete="name" placeholder="Your full name" required />
        </label>
        <label className="block">
          <Label>Email ID</Label>
          <input className="vk-input" value={form.email} onChange={set("email")} type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label className="block">
          <Label>Phone number</Label>
          <input
            className="vk-input"
            value={form.phone}
            onChange={set("phone")}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={14}
            placeholder="10-digit mobile number"
            required
          />
        </label>
        <label className="block">
          <Label>Select your skill</Label>
          <select className="vk-input" value={form.skill} onChange={set("skill")} required>
            <option value="">Select a seva category</option>
            {SKILL_GROUPS.map((g) =>
              g.group ? (
                <optgroup key={g.group} label={g.group}>
                  {g.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </optgroup>
              ) : (
                g.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)
              ),
            )}
          </select>
        </label>
        <label className="block">
          <Label>Availability</Label>
          <select className="vk-input" value={form.availability} onChange={set("availability")} required>
            <option value="">Select your availability</option>
            {AVAILABILITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <label className="block">
          <Label>Preferred start date</Label>
          <input className="vk-input" value={form.startDate} onChange={set("startDate")} type="date" min={todayIso()} required />
        </label>
      </div>

      <label className="block">
        <Label optional>Brief experience / portfolio</Label>
        <textarea
          className="vk-input !h-auto min-h-[96px] py-2.5"
          value={form.message}
          onChange={set("message")}
          maxLength={1000}
          placeholder="Past seva experience, skills, languages, or a link to your work…"
        />
      </label>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="vk-btn-gold w-full justify-center px-6 py-3.5 text-base disabled:opacity-70">
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {submitting ? "Submitting…" : "Submit"}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        We use your details only to contact you about seva. Your number is never shared.
      </p>
    </form>
  );
}
