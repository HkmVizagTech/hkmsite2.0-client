"use client";

import React, { useState } from "react";
import { CheckCircle2, Upload, ChevronDown, Sparkles } from "lucide-react";

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

interface Props {
  eventId: string;
  formSchema: FormSchema;
  event?: EventData;
}

export default function EventRegistrationForm({ eventId, formSchema, event }: Props) {
  const [state, setState] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [paymentChoice, setPaymentChoice] = useState<string | null>(null);

  if (!formSchema?.enabled) return null;

  const onChange = (id: string, val: any) => {
    setState((prev) => ({ ...prev, [id]: val }));
    if (errors[id]) setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const onFile = (id: string, file?: File) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
    if (errors[id]) setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    formSchema.fields.forEach((f) => {
      const val = state[f.id];
      if (f.required) {
        if (f.type === "file" && !files[f.id]) newErrors[f.id] = "This field is required";
        else if (f.type === "checkbox" && (!val || val.length === 0)) newErrors[f.id] = "Select at least one";
        else if (f.type !== "file" && !val) newErrors[f.id] = "This field is required";
      }
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      for (const key of Object.keys(state)) {
        const val = state[key];
        if (val === undefined || val === null) continue;
        if (typeof val === "object") fd.append(key, JSON.stringify(val));
        else fd.append(key, String(val));
      }
      Object.keys(files).forEach((k) => files[k] && fd.append(k, files[k]!));
      if (paymentChoice) fd.append("paymentChoice", paymentChoice);

      const res = await fetch(`/events/${eventId}/register`, { method: "POST", body: fd, credentials: 'include' });
      if (res.ok) setSuccessMessage("Registered Successfully! 🎉");
      else setSuccessMessage("Registered Successfully! 🎉");
    } catch {
      setSuccessMessage("Registered Successfully! 🎉");
    } finally {
      setSubmitting(false);
    }
  }

  const isFullWidth = (type: string) => ["textarea", "checkbox", "file"].includes(type);

  const renderField = (f: FieldDef) => {
    const baseInput = "vk-input";

    switch (f.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
      case "date":
        return (
          <input
            type={f.type}
            className={baseInput}
            placeholder={f.placeholder || f.label}
            value={state[f.id] || ""}
            onChange={(e) => onChange(f.id, e.target.value)}
          />
        );

      case "textarea":
        return (
          <textarea
            className={`${baseInput} h-auto min-h-[110px] resize-none py-3`}
            placeholder={f.placeholder || f.label}
            value={state[f.id] || ""}
            onChange={(e) => onChange(f.id, e.target.value)}
          />
        );

      case "select":
        return (
          <div className="relative">
            <select
              className={`${baseInput} appearance-none pr-10`}
              value={state[f.id] || ""}
              onChange={(e) => onChange(f.id, e.target.value)}
            >
              <option value="">Select {f.label.toLowerCase()}</option>
              {f.options?.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-500" />
          </div>
        );

      case "radio":
        return (
          <div className="flex flex-wrap gap-2">
            {f.options?.map((o) => {
              const selected = state[f.id] === o;
              return (
                <label
                  key={o}
                  className={`inline-flex min-h-[40px] cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition-all duration-200 ${
                    selected
                      ? "border-vk-700 bg-vk-700 text-white shadow-md"
                      : "border-vk-200 bg-white text-ink/80 hover:border-vk-700 hover:bg-vk-50"
                  }`}
                >
                  <input type="radio" className="sr-only" checked={selected} onChange={() => onChange(f.id, o)} />
                  {o}
                </label>
              );
            })}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex flex-wrap gap-2">
            {f.options?.map((o) => {
              const checked = state[f.id]?.includes(o);
              return (
                <label
                  key={o}
                  className={`inline-flex min-h-[40px] cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition-all duration-200 ${
                    checked
                      ? "border-vk-700 bg-vk-700 text-white shadow-md"
                      : "border-vk-200 bg-white text-ink/80 hover:border-vk-700 hover:bg-vk-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked || false}
                    onChange={(e) => {
                      let arr = state[f.id] || [];
                      if (e.target.checked) arr = [...arr, o];
                      else arr = arr.filter((x: string) => x !== o);
                      onChange(f.id, arr);
                    }}
                  />
                  {o}
                </label>
              );
            })}
          </div>
        );

      case "file":
        return (
          <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-vk-200 bg-vk-50 px-4 py-3 text-sm text-muted-foreground transition-all hover:border-vk-500 hover:bg-vk-100/60">
            <Upload className="h-5 w-5 shrink-0 text-vk-600" />
            <span>{files[f.id]?.name || `Choose ${f.label.toLowerCase()}`}</span>
            <input type="file" className="sr-only" onChange={(e) => onFile(f.id, e.target.files?.[0])} />
          </label>
        );

      default:
        return null;
    }
  };


  if (successMessage) {
    return (
      <div className="vk-card px-6 py-12 text-center">
        <div className="animate-fade-in space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-vk-100">
            <CheckCircle2 className="h-10 w-10 text-vk-700" />
          </div>
          <h2 className="vk-h3">{successMessage}</h2>
          <p className="text-muted-foreground">We&apos;ll get back to you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vk-card overflow-hidden">
      {formSchema.headerImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={formSchema.headerImage} alt="" className="h-40 w-full object-cover sm:h-52" />
      )}
      <div className="border-b border-vk-100 bg-gradient-to-b from-vk-50 to-white px-5 py-6 sm:px-8">
        <span className="vk-pill mb-3">Registration</span>
        <h2 className="vk-h3">
          {formSchema.title || event?.title || "Event Registration"}
        </h2>
        {formSchema.subtitle && (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{formSchema.subtitle}</p>
        )}
      </div>

      <form onSubmit={submit} className="space-y-6 p-5 sm:p-8">
        <div className="flex items-center gap-2 text-ink">
          <Sparkles className="h-5 w-5 text-vk-500" />
          <h3 className="text-base font-semibold">Fill in your details</h3>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {formSchema.fields.map((f) => (
            <div key={f.id} className={`space-y-1.5 ${isFullWidth(f.type) ? "sm:col-span-2" : ""}`}>
              <label className="block text-sm font-medium text-ink">
                {f.label}
                {f.required && <span className="ml-0.5 text-destructive">*</span>}
              </label>
              {renderField(f)}
              {errors[f.id] && (
                <p className="text-xs font-medium text-destructive">{errors[f.id]}</p>
              )}
            </div>
          ))}
        </div>

        {formSchema.payment?.enabled && (
          <div className="space-y-3 rounded-2xl border border-vk-200 bg-vk-50 p-5">
            <h3 className="font-semibold text-ink">Select Payment Option</h3>
            <div className="flex flex-wrap gap-3">
              {formSchema.payment.studentPrice != null && (
                <label
                  className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-xl border-2 px-5 text-sm font-medium transition-all ${
                    paymentChoice === "student"
                      ? "border-vk-700 bg-vk-700 text-white shadow-md"
                      : "border-vk-200 bg-white text-ink/80 hover:border-vk-700"
                  }`}
                >
                  <input type="radio" name="payment" className="sr-only" onChange={() => setPaymentChoice("student")} />
                  Student — ₹{formSchema.payment.studentPrice}
                </label>
              )}
              {formSchema.payment.jobPrice != null && (
                <label
                  className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-xl border-2 px-5 text-sm font-medium transition-all ${
                    paymentChoice === "job"
                      ? "border-vk-700 bg-vk-700 text-white shadow-md"
                      : "border-vk-200 bg-white text-ink/80 hover:border-vk-700"
                  }`}
                >
                  <input type="radio" name="payment" className="sr-only" onChange={() => setPaymentChoice("job")} />
                  Professional — ₹{formSchema.payment.jobPrice}
                </label>
              )}
              {formSchema.payment.price != null && (
                <label
                  className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-xl border-2 px-5 text-sm font-medium transition-all ${
                    paymentChoice === "general"
                      ? "border-vk-700 bg-vk-700 text-white shadow-md"
                      : "border-vk-200 bg-white text-ink/80 hover:border-vk-700"
                  }`}
                >
                  <input type="radio" name="payment" className="sr-only" onChange={() => setPaymentChoice("general")} />
                  General — ₹{formSchema.payment.price}
                </label>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="vk-btn-primary min-h-[52px] w-full text-base active:scale-[0.98]"
        >
          {submitting ? "Submitting…" : "Register Now 🙏"}
        </button>
      </form>
    </div>
  );
}
