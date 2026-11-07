"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { AGE_LABELS, AUDIENCES, ENROL_URL, LANGUAGES, TIMES, groupLink } from "@/lib/understandGita";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
const field = "h-12 w-full rounded-xl border border-vk-200 bg-white px-4 text-[15px] text-ink outline-none transition focus:border-vk-500 focus:ring-2 focus:ring-vk-200";
const label = "mb-1.5 block text-[13px] font-semibold text-vk-800";

export default function RegisterForm() {
  const [batch, setBatch] = useState("adults");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ name: string; link: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(f.entries()) as Record<string, string>;
    body.batch = batch;
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/gita-course/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not register. Please try again.");
      setDone({ name: String(body.name || "").split(" ")[0], link: groupLink(batch, String(body.language || "")) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-vk-100 bg-white p-8 text-center md:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600"><CheckCircle2 className="h-9 w-9" /></span>
        <h3 className="mt-5 font-heading text-2xl font-extrabold text-vk-800">Hare Krishna{done.name ? `, ${done.name}` : ""}! You are registered.</h3>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          {done.link ? "Join your batch's WhatsApp group now. All class timings, joining links and study material are shared there." : "We will add you to your batch's WhatsApp group and send the class timings and joining link. You can also message us now to confirm."}
        </p>
        <a href={done.link || ENROL_URL} target="_blank" rel="noopener noreferrer" className="vk-btn-gold mt-6 inline-flex h-12 items-center justify-center gap-2 px-7 text-[15px] font-bold">
          <MessageCircle className="h-5 w-5" /> {done.link ? "Join the WhatsApp group" : "Confirm on WhatsApp"}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-vk-100 bg-white p-6 md:p-9" noValidate>
      <fieldset>
        <legend className={label}>Select your age group *</legend>
        <div className="grid grid-cols-3 gap-2" role="radiogroup">
          {AUDIENCES.map((a) => (
            <button
              key={a.key}
              type="button"
              role="radio"
              aria-checked={batch === a.key}
              onClick={() => setBatch(a.key)}
              className={`min-h-14 rounded-xl border px-1 py-2 text-sm leading-tight font-bold transition ${batch === a.key ? "border-vk-800 bg-vk-800 text-white" : "border-vk-200 bg-white text-vk-800 hover:bg-vk-50"}`}
            >
              {a.title}
              <span className="block text-[11px] font-medium opacity-80">{AGE_LABELS[a.key]}</span>
            </button>
          ))}
        </div>
        {batch === "kids" && <p className="mt-2 text-xs text-muted-foreground">For children 15 years and below, please choose the Kids group.</p>}
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="g-name" className={label}>{batch === "kids" ? "Parent / guardian name" : "Full name"} *</label>
          <input id="g-name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
        </div>
        {batch === "kids" && (
          <div className="sm:col-span-2">
            <label htmlFor="g-kid" className={label}>Child&apos;s name</label>
            <input id="g-kid" name="kidName" className={field} placeholder="Child's name" />
          </div>
        )}
        <div>
          <label htmlFor="g-mobile" className={label}>WhatsApp phone number *</label>
          <input id="g-mobile" name="mobile" required inputMode="numeric" autoComplete="tel" maxLength={14} className={field} placeholder="10-digit mobile number" />
          <p className="mt-1.5 text-xs text-muted-foreground">All class communication and study material will be shared on this number.</p>
        </div>
        <div>
          <label htmlFor="g-email" className={label}>Email (optional)</label>
          <input id="g-email" name="email" type="email" autoComplete="email" className={field} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="g-city" className={label}>City</label>
          <input id="g-city" name="city" autoComplete="address-level2" className={field} placeholder="Visakhapatnam" />
        </div>
        <div>
          <label htmlFor="g-lang" className={label}>Preferred language</label>
          <select id="g-lang" name="language" defaultValue="" className={field}>
            <option value="">Select a language</option>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="g-time" className={label}>Preferred class time</label>
          <select id="g-time" name="preferredTime" defaultValue="" className={field}>
            <option value="">No preference</option>
            {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <button type="submit" disabled={busy} className="vk-btn-gold mt-6 inline-flex h-13 w-full items-center justify-center gap-2 py-3.5 text-base font-bold disabled:opacity-70">
        {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> Registering…</> : "Submit & join the WhatsApp group"}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">Free course. You need WhatsApp on your device. We only use your details to add you to a batch.</p>
    </form>
  );
}
