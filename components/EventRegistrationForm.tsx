"use client";

import React, { useState } from "react";

type FieldDef = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "file" | "date" | "number" | "radio" | "checkbox";
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

type FormSchema = {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  headerImage?: string;
  fields: FieldDef[];
  payment?: {
    enabled?: boolean;
    price?: number;
    studentPrice?: number;
    jobPrice?: number;
  };
};

type EventData = {
  title?: string;
  images?: string[];
  payment?: {
    enabled?: boolean;
    price?: number;
    studentPrice?: number;
    jobPrice?: number;
  };
};

interface EventRegistrationFormProps {
  eventId: string;
  formSchema: FormSchema;
  event?: EventData;
}

const OmSymbol = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 text-saffron opacity-30" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="75" textAnchor="middle" fontSize="88" fontFamily="serif">ॐ</text>
  </svg>
);

const inputBaseClass =
  "w-full rounded-xl border border-gold-light/50 bg-temple-cream/50 px-5 py-4 font-body text-foreground placeholder:text-muted-foreground/60 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:border-saffron focus:bg-temple-cream text-base";

export default function EventRegistrationForm({ eventId, formSchema, event }: EventRegistrationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [paymentChoice, setPaymentChoice] = useState<string | null>(null);

  if (!formSchema || !formSchema.enabled) return null;

  const onChange = (id: string, v: any) => setState((s) => ({ ...s, [id]: v }));
  const onFile = (id: string, f?: File) => setFiles((s) => ({ ...s, [id]: f }));

  const heroImage = formSchema.headerImage || (event?.images && event.images[0]) || "/assets/hero-temple.jpg";
  const lotusOrnament = "/assets/logo.png";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    for (const f of formSchema.fields) {
      const val = state[f.id];
      if (f.required) {
        const empty = f.type === "file" ? !files[f.id] : (val === undefined || val === null || String(val || "").trim() === "");
        if (empty) newErrors[f.id] = "This field is required";
      }
      if (val && f.type === "email") {
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(val))) newErrors[f.id] = "Please enter a valid email";
      }
      if (val && f.type === "number") {
        if (isNaN(Number(val))) newErrors[f.id] = "Please enter a valid number";
      }
    }
    const p = formSchema?.payment || event?.payment || {};
    const student = (p as any).studentPrice ?? (p as any).price;
    const job = (p as any).jobPrice ?? (p as any).price;
    if (p?.enabled && student != null && job != null && student !== job && !paymentChoice) {
      newErrors["__payment"] = "Please select a payment option";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const fd = new FormData();
      for (const key of Object.keys(state)) fd.append(key, state[key]);
      if (paymentChoice) fd.append("paymentChoice", paymentChoice);
      for (const k of Object.keys(files)) {
        const f = files[k];
        if (f) fd.append(k, f);
      }
      const res = await fetch(`${apiUrl}/events/${eventId}/register`, {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.token) setToken(json.token);
        setSuccessMessage("Hare Krishna! You have been registered successfully 🙏");
      }
    } catch {
    }
    setSubmitting(false);
  }

  const renderField = (f: FieldDef) => {
    switch (f.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
      case "date":
        return (
          <input
            type={f.type}
            className={inputBaseClass}
            placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}`}
            value={state[f.id] || ""}
            onChange={(e) => onChange(f.id, e.target.value)}
          />
        );
      case "textarea":
        return (
          <textarea
            className={`${inputBaseClass} min-h-[150px] resize-y text-base`}
            placeholder={f.placeholder || `Enter ${f.label.toLowerCase()}`}
            value={state[f.id] || ""}
            onChange={(e) => onChange(f.id, e.target.value)}
          />
        );
      case "select":
        return (
          <select
            className={inputBaseClass}
            value={state[f.id] || ""}
            onChange={(e) => onChange(f.id, e.target.value)}
          >
            <option value="">Select an option</option>
            {f.options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="flex flex-col gap-2 pt-1">
            {f.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${state[f.id] === opt ? "border-saffron bg-saffron/10" : "border-gold-light"}`}>
                  {state[f.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-saffron" />}
                </div>
                <span className="font-body text-foreground/80 group-hover:text-foreground transition-colors">{opt}</span>
                <input type="radio" name={f.id} value={opt} className="sr-only" checked={state[f.id] === opt} onChange={() => onChange(f.id, opt)} />
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="flex flex-col gap-2 pt-1">
            {f.options?.map((opt) => {
              const checked = Array.isArray(state[f.id]) && state[f.id].includes(opt);
              return (
                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? "border-saffron bg-saffron text-primary-foreground" : "border-gold-light"}`}>
                    {checked && <span className="text-xs">✓</span>}
                  </div>
                  <span className="font-body text-foreground/80 group-hover:text-foreground transition-colors">{opt}</span>
                  <input type="checkbox" className="sr-only" value={opt} checked={checked} onChange={(e) => {
                    const curr = Array.isArray(state[f.id]) ? [...state[f.id]] : [];
                    if (e.target.checked) curr.push(opt);
                    else { const idx = curr.indexOf(opt); if (idx > -1) curr.splice(idx, 1); }
                    onChange(f.id, curr);
                  }} />
                </label>
              );
            })}
          </div>
        );
      case "file":
        return (
          <div className="relative">
            <input
              type="file"
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-saffron/10 file:text-saffron file:font-body file:font-medium file:cursor-pointer hover:file:bg-saffron/20 file:transition-colors cursor-pointer text-muted-foreground"
              onChange={(e) => onFile(f.id, e.target.files?.[0])}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-screen bg-gradient-temple flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-[scale-in_0.5s_ease-out]">
          <img src={lotusOrnament} alt="" className="w-24 h-24 mx-auto animate-float" width={512} height={512} />
          <h2 className="font-display text-3xl font-bold text-gradient-saffron">🙏 Hare Krishna!</h2>
          <p className="font-body text-foreground/80 text-lg">{successMessage}</p>
          {token && (
            <div className="bg-card rounded-xl p-6 border border-gold-light/30 space-y-3">
              <p className="text-sm text-muted-foreground font-body">Your Registration QR</p>
              <div className="flex items-center justify-center">
                <img src={(() => {
                  try {
                    const site = (process.env.NEXT_PUBLIC_SITE_URL as string) || (typeof window !== 'undefined' ? window.location.origin : '');
                    const url = `${site}/events/${eventId}/checkin/${encodeURIComponent(token!)}`;
                    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
                  } catch (e) {
                    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(token || '')}`;
                  }
                })()} alt="qr" className="w-40 h-40" />
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const site = (process.env.NEXT_PUBLIC_SITE_URL as string) || (typeof window !== 'undefined' ? window.location.origin : '');
                    const url = `${site}/events/${eventId}/checkin/${encodeURIComponent(token || '')}`;
                    navigator.clipboard.writeText(url);
                  }}
                  className="px-5 py-2 rounded-lg border border-saffron/30 text-saffron font-body font-medium hover:bg-saffron/10 transition-colors"
                >
                  Copy Check-in URL
                </button>
                <button
                  onClick={() => { setToken(null); setSuccessMessage(null); setState({}); setFiles({}); }}
                  className="px-5 py-2 rounded-lg bg-saffron text-primary-foreground font-body font-medium hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-temple">
  {
}
  <div className="relative h-[380px] sm:h-[460px] overflow-hidden">
        <img
          src={heroImage}
          alt="Event"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-saffron/10 to-transparent" />

        {
}
        <img
          src={lotusOrnament}
          alt=""
          className="absolute top-4 right-4 w-16 h-16 opacity-40 animate-float"
          loading="lazy"
          width={512}
          height={512}
        />
        <img
          src={lotusOrnament}
          alt=""
          className="absolute top-8 left-6 w-12 h-12 opacity-25 animate-float"
          style={{ animationDelay: "2s" }}
          loading="lazy"
          width={512}
          height={512}
        />

        {
}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <OmSymbol />
              <span className="text-saffron/70 font-body text-sm tracking-[0.3em] uppercase">Hare Krishna</span>
              <OmSymbol />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {formSchema.title || event?.title || "Event Registration"}
            </h1>
            {formSchema.subtitle && (
              <p className="mt-3 font-body text-muted-foreground text-lg">{formSchema.subtitle}</p>
            )}
          </div>
        </div>
      </div>

    {
}
    <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-4 pb-16 relative z-10">
  <form onSubmit={submit} className="bg-card rounded-2xl p-8 sm:p-12 space-y-8">
          {
}
          <div className="h-1 -mt-6 sm:-mt-10 mx-auto w-24 rounded-full bg-gradient-saffron" />

          {formSchema.fields.map((f: FieldDef, idx: number) => (
            <div
              key={f.id}
              className="space-y-2"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <label className="block font-display text-base font-semibold text-foreground/90 tracking-wide">
                {f.label}
                {f.required && <span className="text-lotus ml-1">*</span>}
              </label>
              {renderField(f)}
              {errors[f.id] && (
                <p className="text-destructive text-xs font-body flex items-center gap-1">
                  <span>⚠</span> {errors[f.id]}
                </p>
              )}
            </div>
          ))}

          {
}
          {((formSchema.payment?.enabled) || (event?.payment?.enabled)) && (
            <div className="rounded-xl border border-saffron/20 bg-saffron/5 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🪔</span>
                <h3 className="font-display font-semibold text-foreground">Dakshina (Payment)</h3>
              </div>
              {(() => {
                const p = formSchema?.payment || event?.payment || {};
                const student = (p as any).studentPrice ?? (p as any).price;
                const job = (p as any).jobPrice ?? (p as any).price;
                if (student != null && job != null && student === job) {
                  return <p className="font-body text-foreground/80">Amount: <strong className="text-saffron">₹{student}</strong></p>;
                }
                return (
                  <div className="flex flex-col gap-3">
                    {student != null && (
                      <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-transparent hover:border-saffron/20 hover:bg-saffron/5 transition-all">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentChoice === `student:${student}` ? "border-saffron bg-saffron/10" : "border-gold-light"}`}>
                          {paymentChoice === `student:${student}` && <div className="w-2.5 h-2.5 rounded-full bg-saffron" />}
                        </div>
                        <span className="font-body text-foreground/80">Student — <strong className="text-saffron">₹{student}</strong></span>
                        <input type="radio" name="payment" className="sr-only" value={`student:${student}`} checked={paymentChoice === `student:${student}`} onChange={() => setPaymentChoice(`student:${student}`)} />
                      </label>
                    )}
                    {job != null && (
                      <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-transparent hover:border-saffron/20 hover:bg-saffron/5 transition-all">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentChoice === `job:${job}` ? "border-saffron bg-saffron/10" : "border-gold-light"}`}>
                          {paymentChoice === `job:${job}` && <div className="w-2.5 h-2.5 rounded-full bg-saffron" />}
                        </div>
                        <span className="font-body text-foreground/80">Working Professional — <strong className="text-saffron">₹{job}</strong></span>
                        <input type="radio" name="payment" className="sr-only" value={`job:${job}`} checked={paymentChoice === `job:${job}`} onChange={() => setPaymentChoice(`job:${job}`)} />
                      </label>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {
}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-display text-xl font-semibold tracking-wide hover:opacity-95 active:opacity-90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "🙏 Register Now"
              )}
            </button>
          </div>

          <p className="text-center text-muted-foreground text-sm font-body">
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare
          </p>
        </form>
      </div>
    </div>
  );
}
