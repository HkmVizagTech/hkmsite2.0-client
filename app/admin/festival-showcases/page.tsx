"use client";

// Admin pages must never be statically cached at the CDN edge — they show
// live, admin-managed data and a stale cached shell can end up referencing
// an old JS bundle indefinitely.
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { authFetch } from "@/lib/authClient";
import {
  Plus, Trash2, Loader2, ExternalLink, FolderOpen, Save, Pencil, ArrowLeft,
} from "lucide-react";
import type { FestivalShowcase } from "@/lib/festivalShowcase";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:3003";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "") || "http://localhost:3000";

type Editable = {
  _id?: string;
  title: string;
  slug: string;
  subtitle: string;
  heroImage: string;
  cardImage: string;
  eventDate: string; // YYYY-MM-DD for the date input
  location: string;
  description: string;
  status: "upcoming" | "completed" | "annual";
  featured: boolean;
  active: boolean;
  ctaLabel: string;
  ctaHref: string;
  gallery: string[];
  schedule: { start: string; title: string; description: string }[];
  details: { heading: string; body: string; image: string }[];
  testimonials: { name: string; role: string; message: string; rating: number; avatar: string }[];
};

const API = (path: string) => `${API_URL}${path}`;

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toDateInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const emptyDraft = (): Editable => ({
  title: "",
  slug: "",
  subtitle: "",
  heroImage: "",
  cardImage: "",
  eventDate: "",
  location: "",
  description: "",
  status: "upcoming",
  featured: false,
  active: true,
  ctaLabel: "Donate Now",
  ctaHref: "",
  gallery: [],
  schedule: [],
  details: [],
  testimonials: [],
});

const fromShowcase = (f: FestivalShowcase): Editable => ({
  _id: f._id,
  title: f.title || "",
  slug: f.slug || "",
  subtitle: f.subtitle || "",
  heroImage: f.heroImage || "",
  cardImage: f.cardImage || "",
  eventDate: toDateInput(f.eventDate),
  location: f.location || "",
  description: f.description || "",
  status: f.status || "upcoming",
  featured: !!f.featured,
  active: f.active !== false,
  ctaLabel: f.ctaLabel || "Donate Now",
  ctaHref: f.ctaHref || "",
  gallery: f.gallery || [],
  schedule: (f.schedule || []).map((s) => ({
    start: s.start || "",
    title: s.title || "",
    description: s.description || "",
  })),
  details: (f.details || []).map((d) => ({
    heading: d.heading || "",
    body: d.body || "",
    image: d.image || "",
  })),
  testimonials: (f.testimonials || []).map((t) => ({
    name: t.name || "",
    role: t.role || "",
    message: t.message || "",
    rating: Number(t.rating) || 5,
    avatar: t.avatar || "",
  })),
});

/* ------------------------------------------------------------------ */
/* Field helpers                                                       */
/* ------------------------------------------------------------------ */

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5 space-y-4">
      <div>
        <h3 className="font-heading text-base font-bold">{title}</h3>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, hint,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ImageField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center justify-between text-xs font-medium">
        <span>{label}</span>
        <a
          href="/admin/media"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-primary/70 hover:text-primary"
        >
          <FolderOpen className="h-3 w-3" /> Media library
        </a>
      </label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt={label} className="h-24 w-full object-cover rounded-lg border" />
      )}
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image URL (R2 / media library)…" />
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <Plus className="h-3.5 w-3.5 mr-1" /> {label}
    </Button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={onClick} className="text-destructive">
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AdminFestivalShowcases() {
  const [items, setItems] = useState<FestivalShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editable | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await authFetch(API("/festival-showcases"), { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(emptyDraft());
  };

  const openEdit = (f: FestivalShowcase) => {
    setEditing(fromShowcase(f));
  };

  const backToList = () => {
    setEditing(null);
  };

  const set = <K extends keyof Editable>(key: K, value: Editable[K]) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleDelete = async (f: FestivalShowcase) => {
    if (!confirm(`Delete "${f.title}"? This cannot be undone.`)) return;
    try {
      const res = await authFetch(API(`/festival-showcases/${f._id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast({ title: "Deleted", description: `${f.title} removed.` });
        load();
      } else {
        const json = await res.json().catch(() => ({}));
        toast({ title: "Delete failed", description: json.message || res.statusText, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
  };

  const save = async () => {
    if (!editing) return;
    const slug = editing.slug.trim() || slugify(editing.title);
    if (!editing.title.trim() || !slug) {
      toast({ title: "Missing fields", description: "Title and slug are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title: editing.title.trim(),
        slug,
        subtitle: editing.subtitle,
        heroImage: editing.heroImage,
        cardImage: editing.cardImage,
        eventDate: editing.eventDate ? new Date(`${editing.eventDate}T00:00:00`).toISOString() : "",
        location: editing.location,
        description: editing.description,
        status: editing.status,
        featured: editing.featured,
        active: editing.active,
        ctaLabel: editing.ctaLabel,
        ctaHref: editing.ctaHref,
        gallery: editing.gallery.map((g) => g.trim()).filter(Boolean),
        schedule: editing.schedule
          .filter((s) => s.start || s.title || s.description)
          .map((s) => ({ start: s.start, title: s.title, description: s.description })),
        details: editing.details
          .filter((d) => d.heading || d.body || d.image)
          .map((d) => ({ heading: d.heading, body: d.body, image: d.image })),
        testimonials: editing.testimonials
          .filter((t) => t.name || t.message)
          .map((t) => ({ name: t.name, role: t.role, message: t.message, rating: Number(t.rating) || 5, avatar: t.avatar })),
      };

      const res = editing._id
        ? await authFetch(API(`/festival-showcases/${editing._id}`), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          })
        : await authFetch(API("/festival-showcases"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
          });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `Save failed (status ${res.status})`);
      toast({
        title: "Saved",
        description: "/festivals/" + slug + (editing._id ? " updated." : " created."),
      });
      backToList();
      load();
    } catch (e: any) {
      toast({ title: "Failed to save", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  /* ---- Loading / list view ---- */
  if (loading) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Loading festival showcases…</p>;
  }

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold">
              {editing._id ? "Edit Festival" : "New Festival"}
            </h1>
            <p className="text-sm text-muted-foreground">Banner, gallery, schedule, recap details and testimonials.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={backToList}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button variant="outline" type="button" onClick={() => setEditing(null)}>Reset</Button>
            <Button type="button" className="gap-2" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : "Save Festival"}
            </Button>
          </div>
        </div>

        {/* ── General ── */}
        <Section title="General" description="Name, slug and status drive the URL and how the festival is shown on /festival.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Festival title" value={editing.title} onChange={(v) => set("title", v)} placeholder="e.g. Sri Krishna Janmashtami" />
            <Field label="Slug (URL)" value={editing.slug} onChange={(v) => set("slug", v)} placeholder="auto from title" hint={`/festivals/${editing.slug || slugify(editing.title) || "…"}`} />
            <Field label="Subtitle / tagline" value={editing.subtitle} onChange={(v) => set("subtitle", v)} placeholder="e.g. Appearance of Lord Krishna" />
            <Field label="Location" value={editing.location} onChange={(v) => set("location", v)} placeholder="Temple Premises" />
            <Field label="Festival date" value={editing.eventDate} onChange={(v) => set("eventDate", v)} placeholder="2026-07-18" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium">Status</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editing.status}
                onChange={(e) => set("status", e.target.value as Editable["status"])}
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed (recap)</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured (highlight on /festival — shows on top)
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) => set("active", e.target.checked)}
              />
              Visible on the site
            </label>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium">Short description</label>
            <Textarea rows={3} value={editing.description} onChange={(e) => set("description", e.target.value)} placeholder="One or two lines for the festival card and hero." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Donate button label" value={editing.ctaLabel} onChange={(v) => set("ctaLabel", v)} />
            <Field label="Donate button link" value={editing.ctaHref} onChange={(v) => set("ctaHref", v)} hint='e.g. /festival/janmashtami or /janmashtami. Leave blank for /donate.' />
          </div>
        </Section>

        {/* ── Banners ── */}
        <Section title="Banners" description="Hero is the large top banner; card image is used on the /festival index (falls back to hero).">
          <ImageField label="Hero banner image" value={editing.heroImage} onChange={(v) => set("heroImage", v)} />
          <ImageField label="Card image (index card)" value={editing.cardImage} onChange={(v) => set("cardImage", v)} />
        </Section>

        {/* ── Gallery ── */}
        <Section title="Gallery" description="Photos shown in the gallery section on the festival page.">
          {editing.gallery.length === 0 && <p className="text-xs text-muted-foreground">No photos yet.</p>}
          {editing.gallery.map((g, gi) => (
            <div key={gi} className="flex items-start gap-2">
              <div className="flex-1">
                <ImageField label={`Photo ${gi + 1}`} value={g} onChange={(v) => set("gallery", editing.gallery.map((x, i) => (i === gi ? v : x)))} />
              </div>
              <RemoveButton onClick={() => set("gallery", editing.gallery.filter((_, i) => i !== gi))} />
            </div>
          ))}
          <AddButton label="Add photo" onClick={() => set("gallery", [...editing.gallery, ""])} />
        </Section>

        {/* ── Schedule ── */}
        <Section title="Event schedule" description="The program timeline — time, heading and a short note for each segment.">
          {editing.schedule.length === 0 && <p className="text-xs text-muted-foreground">No schedule items.</p>}
          {editing.schedule.map((s, si) => (
            <div key={si} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{s.title || `Schedule ${si + 1}`}</span>
                <RemoveButton onClick={() => set("schedule", editing.schedule.filter((_, i) => i !== si))} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Time / Day" value={s.start} onChange={(v) => set("schedule", editing.schedule.map((x, i) => (i === si ? { ...x, start: v } : x)))} placeholder="6:00 AM" />
                <Field label="Title" value={s.title} onChange={(v) => set("schedule", editing.schedule.map((x, i) => (i === si ? { ...x, title: v } : x)))} placeholder="Mangala Aarti" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium">Description (optional)</label>
                <Textarea rows={2} value={s.description} onChange={(e) => set("schedule", editing.schedule.map((x, i) => (i === si ? { ...x, description: e.target.value } : x)))} />
              </div>
            </div>
          ))}
          <AddButton label="Add schedule item" onClick={() => set("schedule", [...editing.schedule, { start: "", title: "", description: "" }])} />
        </Section>

        {/* ── Details / recap ── */}
        <Section title="Details & recap" description="Used once the festival has happened — photos and memories in alternating sections.">
          {editing.details.length === 0 && <p className="text-xs text-muted-foreground">No recap sections.</p>}
          {editing.details.map((d, di) => (
            <div key={di} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{d.heading || `Section ${di + 1}`}</span>
                <RemoveButton onClick={() => set("details", editing.details.filter((_, i) => i !== di))} />
              </div>
              <Field label="Heading" value={d.heading} onChange={(v) => set("details", editing.details.map((x, i) => (i === di ? { ...x, heading: v } : x)))} />
              <div className="space-y-1">
                <label className="block text-xs font-medium">Body</label>
                <Textarea rows={4} value={d.body} onChange={(e) => set("details", editing.details.map((x, i) => (i === di ? { ...x, body: e.target.value } : x)))} />
              </div>
              <ImageField label="Section image" value={d.image} onChange={(v) => set("details", editing.details.map((x, i) => (i === di ? { ...x, image: v } : x)))} />
            </div>
          ))}
          <AddButton label="Add recap section" onClick={() => set("details", [...editing.details, { heading: "", body: "", image: "" }])} />
        </Section>

        {/* ── Testimonials ── */}
        <Section title="Reviews & testimonials" description="What devotees and visitors say about the festival.">
          {editing.testimonials.length === 0 && <p className="text-xs text-muted-foreground">No testimonials.</p>}
          {editing.testimonials.map((t, ti) => (
            <div key={ti} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{t.name || `Testimonial ${ti + 1}`}</span>
                <RemoveButton onClick={() => set("testimonials", editing.testimonials.filter((_, i) => i !== ti))} />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Name" value={t.name} onChange={(v) => set("testimonials", editing.testimonials.map((x, i) => (i === ti ? { ...x, name: v } : x)))} />
                <Field label="Role / place" value={t.role} onChange={(v) => set("testimonials", editing.testimonials.map((x, i) => (i === ti ? { ...x, role: v } : x)))} placeholder="Devotee, Vizag" />
                <Field label="Rating (1–5)" value={String(t.rating)} onChange={(v) => set("testimonials", editing.testimonials.map((x, i) => (i === ti ? { ...x, rating: Number(v) || 5 } : x)))} placeholder="5" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium">Message</label>
                <Textarea rows={3} value={t.message} onChange={(e) => set("testimonials", editing.testimonials.map((x, i) => (i === ti ? { ...x, message: e.target.value } : x)))} />
              </div>
              <ImageField label="Avatar (optional)" value={t.avatar} onChange={(v) => set("testimonials", editing.testimonials.map((x, i) => (i === ti ? { ...x, avatar: v } : x)))} />
            </div>
          ))}
          <AddButton label="Add testimonial" onClick={() => set("testimonials", [...editing.testimonials, { name: "", role: "", message: "", rating: 5, avatar: "" }])} />
        </Section>

        <div className="sticky bottom-4 flex justify-end">
          <Button type="button" className="gap-2 shadow-lg" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Festival"}
          </Button>
        </div>
      </div>
    );
  }

  /* ---- List view ---- */
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold">Festival Showcases</h1>
          <p className="text-muted-foreground">
            Rich festival pages with banner, gallery, schedule, recap details & testimonials.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Festival
        </Button>
      </div>

      <section>
        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-10 border border-border rounded-2xl">
            No festivals yet. Create your first one.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((f) => {
            const img = f.cardImage || f.heroImage;
            return (
              <div key={f._id} className="bg-card rounded-2xl overflow-hidden flex flex-col shadow transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative w-full h-44 bg-muted-foreground/5">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={f.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                  )}
                  {!f.active && (
                    <span className="absolute right-2 top-2 rounded-full bg-foreground/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
                      Hidden
                    </span>
                  )}
                  {f.featured && (
                    <span className="absolute left-2 top-2 rounded-full bg-accent/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg leading-tight mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{f.status} · /festivals/{f.slug}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">{f.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(f)} className="text-primary hover:bg-primary/10">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <a
                      href={`${SITE_URL}/festivals/${f.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View
                    </a>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(f)} className="text-destructive ml-auto hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}