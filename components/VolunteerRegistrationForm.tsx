"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Camera, Upload, X, Star, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export type VolunteerCustomFieldType =
  | "short_text"
  | "long_text"
  | "number"
  | "email"
  | "phone"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "devotee_select";

export interface VolunteerCustomField {
  id: string;
  label: string;
  type: VolunteerCustomFieldType;
  required: boolean;
  important?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

export interface VolunteerEvent {
  _id: string;
  name: string;
  eventId?: string;
  description?: string;
  venue?: string;
  bannerImage?: string;
  eventStart: string;
  eventEnd: string;
  status: string;
  availabilitySlots?: string[];
  customFields?: VolunteerCustomField[];
  photoRequired?: boolean;
}

interface Devotee {
  _id: string;
  name: string;
}

function DevoteeSelect({
  devotees,
  value,
  onChange,
}: {
  devotees: Devotee[];
  value: string[];
  onChange: (names: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedName = value[0] || "";
  const filtered = devotees.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-accent"
      >
        <span className={selectedName ? "text-foreground" : "text-muted-foreground"}>
          {selectedName || "Choose a devotee..."}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {selectedName && (
        <button
          type="button"
          aria-label="Clear selection"
          onClick={() => onChange([])}
          className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border bg-background shadow-lg">
          <div className="border-b p-2">
            <Input
              autoFocus
              placeholder="Search devotees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-44 overflow-y-auto">
            {devotees.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">
                Loading devotees...
              </p>
            ) : filtered.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">
                No devotees found.
              </p>
            ) : (
              filtered.map((d) => (
                <button
                  key={d._id}
                  type="button"
                  onClick={() => {
                    onChange([d.name]);
                    setOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  {d.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ServiceAvailabilityEntry {
  date: string;
  timeSlot: string;
}

interface SuccessInfo {
  name: string;
  phone: string;
  eventName: string;
}

const GENDERS = ["male", "female", "other"];

const emptyForm = {
  name: "",
  phone: "",
  age: "",
  gender: "",
  occupationType: "",
  institution: "",
  company: "",
  photoKey: null as string | null,
  serviceAvailability: [] as ServiceAvailabilityEntry[],
  notes: "",
  customAnswers: {} as Record<string, unknown>,
};

async function compressImage(file: File, maxBytes = 950_000): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const max = 1200;
  let w = bmp.width;
  let h = bmp.height;
  if (w > max || h > max) {
    const r = Math.min(max / w, max / h);
    w = Math.round(w * r);
    h = Math.round(h * r);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();

  let quality = 0.88;
  let blob: Blob | null = null;
  while (quality >= 0.1) {
    blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", quality)
    );
    if (blob && blob.size <= maxBytes) return blob;
    quality -= 0.08;
  }
  return blob || new Blob();
}

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

interface Props {
  event: VolunteerEvent;
  vccApi: string;
  variant?: "modal" | "page";
  onClose?: () => void;
}

export default function VolunteerRegistrationForm({
  event,
  vccApi,
  variant = "modal",
  onClose,
}: Props) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessInfo | null>(null);

  const [photoStatus, setPhotoStatus] = useState<
    "idle" | "compressing" | "uploading" | "done" | "error"
  >("idle");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [devotees, setDevotees] = useState<Devotee[]>([]);

  const hasDevoteeField = event.customFields?.some(
    (f) => f.type === "devotee_select"
  );

  useEffect(() => {
    if (!hasDevoteeField) return;
    fetch(`${vccApi}/api/devotees`)
      .then((r) => (r.ok ? r.json() : { devotees: [] }))
      .then((d) => setDevotees(d.devotees || []))
      .catch(() => {});
  }, [hasDevoteeField, vccApi]);

  const setCustomAnswer = (fieldId: string, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      customAnswers: { ...prev.customAnswers, [fieldId]: value },
    }));
  };

  const handlePhotoFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setPhotoError("");
      try {
        setPhotoStatus("compressing");
        const compressed = await compressImage(file, 950_000);
        setPhotoPreview(URL.createObjectURL(compressed));

        setPhotoStatus("uploading");
        const fd = new FormData();
        fd.append("photo", compressed, "photo.jpg");
        const res = await fetch(`${vccApi}/api/upload/photo`, {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        setForm((prev) => ({ ...prev, photoKey: data.key }));
        setPhotoStatus("done");
      } catch {
        setPhotoStatus("error");
        setPhotoError("Photo upload failed. Please try again.");
      }
    },
    [vccApi]
  );

  const removePhoto = () => {
    setForm((prev) => ({ ...prev, photoKey: null }));
    setPhotoPreview(null);
    setPhotoStatus("idle");
    setPhotoError("");
  };

  const handleRegister = async () => {
    const cleaned = form.phone.replace(/\D/g, "");
    if (!form.name.trim() || cleaned.length !== 10) {
      toast({
        title: "Missing details",
        description: cleaned.length !== 10
          ? "Please enter a valid 10-digit phone number."
          : "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (event.photoRequired && !form.photoKey) {
      toast({
        title: "Photo required",
        description: "Please upload your photo to register for this event.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${vccApi}/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          name: form.name.trim(),
          phone: cleaned,
          age: form.age ? Number(form.age) : undefined,
          gender: form.gender || undefined,
          occupationType: form.occupationType || undefined,
          institution: form.institution || undefined,
          company: form.company || undefined,
          occupation: form.occupationType === "student"
            ? "Student"
            : form.occupationType === "working"
              ? "Working"
              : undefined,
          photoKey: form.photoKey || undefined,
          serviceAvailability: form.serviceAvailability,
          customAnswers: form.customAnswers,
          notes: form.notes || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess({
          name: data.volunteer?.name || form.name,
          phone: data.volunteer?.phone || cleaned,
          eventName: event.name,
        });
      } else if (res.status === 409) {
        toast({
          title: "Already registered",
          description:
            "You are already registered for this event. Look out for a message from us with your seva assignment.",
        });
        onClose?.();
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

  const renderCustomField = (field: VolunteerCustomField) => {
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
      case "devotee_select":
        return (
          <DevoteeSelect
            devotees={devotees}
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={(names) => setVal(names)}
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

  if (success) {
    const successBody = (
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
        <div className="mx-auto max-w-xs space-y-2 rounded-xl bg-primary/5 p-4 text-center">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Registered Phone
          </div>
          <div className="font-mono text-lg font-bold text-primary">
            +91 {success.phone}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Use your phone number to look up your seva assignments. The
          coordinator will contact you soon.
        </p>
      </div>
    );

    if (variant === "modal") {
      return (
        <div>
          {successBody}
          <Button className="mt-5 w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center sm:p-10">
        {successBody}
        <Link
          href="/volunteer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110"
        >
          View Other Volunteer Opportunities
        </Link>
      </div>
    );
  }

  const formBody = (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Full Name *
          </label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Phone Number *
          </label>
          <div className="flex items-center gap-2">
            <span className="flex h-9 items-center rounded-md border bg-muted px-2 text-sm text-muted-foreground">
              +91
            </span>
            <Input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="10-digit number"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
          Photo
          {event.photoRequired && <span className="text-destructive">*</span>}
        </label>
        {photoPreview || form.photoKey ? (
          <div className="relative inline-block">
            <img
              src={
                photoPreview ||
                `${vccApi}/api/upload/photo?key=${encodeURIComponent(form.photoKey!)}`
              }
              alt="Photo"
              className="h-20 w-20 rounded-lg border object-cover"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-xs"
            >
              <X className="h-3 w-3" />
            </button>
            {photoStatus === "done" && (
              <p className="mt-1 text-xs text-green-600">Photo uploaded</p>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handlePhotoFile(e.target.files?.[0])}
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              disabled={
                photoStatus === "compressing" || photoStatus === "uploading"
              }
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent disabled:opacity-50"
            >
              <Camera className="h-3.5 w-3.5" />
              Take photo
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={
                photoStatus === "compressing" || photoStatus === "uploading"
              }
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload file
            </button>
          </div>
        )}
        {photoStatus === "compressing" && (
          <p className="mt-1 text-xs text-muted-foreground">Compressing...</p>
        )}
        {photoStatus === "uploading" && (
          <p className="mt-1 text-xs text-muted-foreground">Uploading...</p>
        )}
        {photoError && (
          <p className="mt-1 text-xs text-destructive">{photoError}</p>
        )}
        {event.photoRequired && !photoPreview && !form.photoKey && (
          <p className="mt-1 text-xs text-muted-foreground">
            A photo is required for this event.
          </p>
        )}
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
            onChange={(e) => setForm({ ...form, age: e.target.value })}
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
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
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

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Are you a Student or Working?
        </label>
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={form.occupationType}
          onChange={(e) => setForm({ ...form, occupationType: e.target.value })}
        >
          <option value="">Select</option>
          <option value="student">Student</option>
          <option value="working">Working Professional</option>
        </select>
        {form.occupationType === "student" && (
          <div className="mt-3">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              College / School Name
            </label>
            <Input
              value={form.institution}
              onChange={(e) =>
                setForm({ ...form, institution: e.target.value })
              }
              placeholder="e.g. GITAM University"
            />
          </div>
        )}
        {form.occupationType === "working" && (
          <div className="mt-3">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Company / Organisation Name
            </label>
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. Infosys"
            />
          </div>
        )}
      </div>

      {event.availabilitySlots &&
        event.availabilitySlots.length > 0 &&
        (() => {
          const MONTH_RE = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
          const ORDINAL_RE = /\b\d{1,2}(st|nd|rd|th)\b/i;
          const dateSpecific = event.availabilitySlots.some(
            (s) => MONTH_RE.test(s) || ORDINAL_RE.test(s)
          );

          if (dateSpecific) {
            return (
              <div className="space-y-2 border-t pt-3">
                <label className="block text-xs font-medium text-muted-foreground">
                  Availability
                </label>
                <p className="text-xs text-muted-foreground">
                  Select the slots you are available for.
                </p>
                <div className="flex flex-wrap gap-2">
                  {event.availabilitySlots!.map((slot) => {
                    const active = form.serviceAvailability.some(
                      (e) => e.timeSlot === slot
                    );
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          const exists = form.serviceAvailability.some(
                            (e) => e.timeSlot === slot
                          );
                          const next = exists
                            ? form.serviceAvailability.filter(
                                (e) => e.timeSlot !== slot
                              )
                            : [
                                ...form.serviceAvailability,
                                { date: "", timeSlot: slot },
                              ];
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

          return (
            <div className="space-y-2 border-t pt-3">
              <label className="block text-xs font-medium text-muted-foreground">
                Availability
              </label>
              <p className="text-xs text-muted-foreground">
                Select the time slot you are available for each day.
              </p>
              {eachDay(event.eventStart, event.eventEnd).map((day) => {
                const key = day.iso;
                const selected =
                  form.serviceAvailability.find((e) => e.date === key)
                    ?.timeSlot || "";
                return (
                  <div key={key} className="rounded-md border p-3">
                    <p className="mb-2 text-sm font-medium">{day.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {event.availabilitySlots!.map((slot) => {
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
              })}
            </div>
          );
        })()}

      {event.customFields && event.customFields.length > 0 && (
        <div className="space-y-3 border-t pt-3">
          {event.customFields.map((field) => {
            const isImportant = field.important;
            const effectiveRequired = field.required || isImportant;
            return (
              <div
                key={field.id}
                className={
                  isImportant
                    ? "rounded-md border border-amber-400/50 bg-amber-50/30 dark:bg-amber-950/10 p-3"
                    : ""
                }
              >
                <label className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  {isImportant && (
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                  )}
                  {field.label}
                  {effectiveRequired && (
                    <span className="ml-0.5 text-destructive">*</span>
                  )}
                </label>
                {renderCustomField(field)}
                {field.helpText && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {field.helpText}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Anything else?
        </label>
        <Textarea
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
        {variant === "modal" && (
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );

  if (variant === "modal") {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {success ? "Registration Confirmed" : "Register to Volunteer"}
            </h2>
            <p className="text-sm text-muted-foreground">{event.name}</p>
          </div>
          <button onClick={onClose} type="button" aria-label="Close">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        {formBody}
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="mb-5 flex items-center gap-2 text-foreground">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Fill in your details</h2>
      </div>
      {formBody}
    </form>
  );
}
