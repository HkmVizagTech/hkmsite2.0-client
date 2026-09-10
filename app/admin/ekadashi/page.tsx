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
  Plus, Trash2, RotateCcw, Loader2, ExternalLink, FolderOpen, Save,
} from "lucide-react";
import {
  DEFAULT_CAMPAIGN,
  type EkadashiCampaign,
  type EkadashiSeva,
} from "@/lib/ekadashiCampaign";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "") || "http://localhost:3000";

const cloneCampaign = (c: EkadashiCampaign): EkadashiCampaign =>
  JSON.parse(JSON.stringify(c)) as EkadashiCampaign;

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

/**
 * Banner image field. The preview reflects the real aspect ratio of the
 * asset so the admin can see the desktop (wide 16:9) and mobile (portrait)
 * crop at a glance — not two identical flat boxes.
 */
function BannerField({
  label, value, onChange, preview,
}: { label: string; value: string; onChange: (v: string) => void; preview: "desktop" | "mobile" }) {
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
      <div className="overflow-hidden rounded-lg border bg-background/50">
        {value ? (
          <img
            src={value}
            alt={label}
            className={`w-full object-cover ${
              preview === "desktop" ? "aspect-video max-h-56" : "aspect-[3/4] max-h-72 mx-auto w-auto"
            }`}
          />
        ) : (
          <div className={preview === "desktop" ? "aspect-video" : "aspect-[3/4] mx-auto w-40"}>
            <p className="flex h-full items-center justify-center text-xs text-muted-foreground">No image</p>
          </div>
        )}
      </div>
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

export default function AdminEkadashi() {
  const [form, setForm] = useState<EkadashiCampaign>(() => cloneCampaign(DEFAULT_CAMPAIGN));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_URL}/ekadashi-campaign/config`, { credentials: "include" });
        if (res.ok) {
          const data = (await res.json()) as Partial<EkadashiCampaign>;
          setForm({ ...cloneCampaign(DEFAULT_CAMPAIGN), ...data });
        } else {
          toast({ title: "Could not load config", variant: "destructive" });
        }
      } catch (e: any) {
        toast({ title: "Network error", description: e.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = <K extends keyof EkadashiCampaign>(key: K, value: EkadashiCampaign[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ---- Seva + tier editors ---- */
  const updateSeva = (index: number, patch: Partial<EkadashiSeva>) =>
    setForm((prev) => {
      const sevas = [...prev.sevas];
      sevas[index] = { ...sevas[index], ...patch };
      return { ...prev, sevas };
    });

  const updateTier = (sevaIndex: number, tierIndex: number, patch: Record<string, unknown>) =>
    setForm((prev) => {
      const sevas = [...prev.sevas];
      const tiers = [...sevas[sevaIndex].tiers];
      tiers[tierIndex] = { ...tiers[tierIndex], ...patch } as EkadashiSeva["tiers"][number];
      sevas[sevaIndex] = { ...sevas[sevaIndex], tiers };
      return { ...prev, sevas };
    });

  const addSeva = () =>
    setForm((prev) => ({
      ...prev,
      sevas: [
        ...prev.sevas,
        {
          key: `seva-${prev.sevas.length + 1}`,
          label: "",
          icon: "🛕",
          sevaName: "",
          category: "GENERAL",
          tiers: [{ amount: 501 }],
        },
      ],
    }));

  const removeSeva = (index: number) =>
    setForm((prev) => ({ ...prev, sevas: prev.sevas.filter((_, i) => i !== index) }));

  const addTier = (sevaIndex: number) =>
    setForm((prev) => {
      const sevas = [...prev.sevas];
      sevas[sevaIndex] = { ...sevas[sevaIndex], tiers: [...sevas[sevaIndex].tiers, { amount: 1000 }] };
      return { ...prev, sevas };
    });

  const removeTier = (sevaIndex: number, tierIndex: number) =>
    setForm((prev) => {
      const sevas = [...prev.sevas];
      sevas[sevaIndex] = { ...sevas[sevaIndex], tiers: sevas[sevaIndex].tiers.filter((_, i) => i !== tierIndex) };
      return { ...prev, sevas };
    });

  const save = async () => {
    setSaving(true);
    try {
      const res = await authFetch(`${API_URL}/ekadashi-campaign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `Save failed (status ${res.status})`);
      toast({ title: "Saved", description: "The /ekadashi page now shows the updated campaign." });
    } catch (e: any) {
      toast({ title: "Failed to save", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Loading campaign config…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold">Ekadashi Campaign</h1>
          <p className="text-muted-foreground">
            Reuse the <code className="text-foreground">/ekadashi</code> page for every Ekadashi — change the name,
            banners, seva pricing and the donation form text. Everything else keeps its default content.
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`${SITE_URL}/ekadashi`} target="_blank" rel="noreferrer">
            <Button variant="outline" type="button" className="gap-2">
              <ExternalLink className="h-4 w-4" /> View page
            </Button>
          </a>
          <Button variant="outline" type="button" className="gap-2" onClick={() => setForm(cloneCampaign(DEFAULT_CAMPAIGN))}>
            <RotateCcw className="h-4 w-4" /> Reset to defaults
          </Button>
          <Button type="button" className="gap-2" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* ── Campaign name ── */}
      <Section
        title="Campaign name"
        description="This single name is used everywhere on the page — changing it renames the whole campaign."
      >
        <Field
          label="Name"
          value={form.campaignName}
          onChange={(v) => set("campaignName", v)}
          placeholder="e.g. Kamika Ekadashi"
          hint="e.g. “Kamika Ekadashi” — shown in the significance, daan and FAQ headings throughout."
        />
      </Section>

      {/* ── Hero banner ── */}
      <Section title="Hero banner" description="Desktop is the wide top banner; mobile is the portrait poster shown on phones.">
        <BannerField label="Hero image — desktop (wide)" value={form.heroImage} onChange={(v) => set("heroImage", v)} preview="desktop" />
        <BannerField label="Hero image — mobile (portrait)" value={form.heroImageMobile} onChange={(v) => set("heroImageMobile", v)} preview="mobile" />
      </Section>

      {/* ── Donation form ── */}
      <Section title="Donation form" description="Only the heading and description of the donation card.">
        <Field label="Heading" value={form.formHeading} onChange={(v) => set("formHeading", v)} />
        <div className="space-y-1">
          <label className="block text-xs font-medium">Description</label>
          <Textarea rows={3} value={form.formSubheading} onChange={(e) => set("formSubheading", e.target.value)} />
        </div>
      </Section>

      {/* ── Sevas & price tiers ── */}
      <Section title="Sevas & price tiers" description="The seva names donors choose and the preset amounts for each.">
        {form.sevas.map((seva, si) => (
          <div key={seva.key || si} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Seva name</label>
                <Input
                  value={seva.label}
                  onChange={(e) => updateSeva(si, { label: e.target.value })}
                  placeholder="e.g. Anna Daan Seva"
                />
              </div>
              <RemoveButton onClick={() => removeSeva(si)} />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amount tiers
              </p>
              {seva.tiers.length === 0 && (
                <p className="text-xs text-muted-foreground">No preset tiers — the donor picks a custom amount only.</p>
              )}
              {seva.tiers.map((tier, ti) => (
                <div key={ti} className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2">
                  <Input
                    className="w-28 h-9"
                    type="number"
                    placeholder="Amount"
                    value={tier.amount || ""}
                    onChange={(e) => updateTier(si, ti, { amount: Number(e.target.value) })}
                  />
                  <Input
                    className="flex-1 min-w-[140px] h-9"
                    placeholder="Label (optional)"
                    value={tier.label || ""}
                    onChange={(e) => updateTier(si, ti, { label: e.target.value })}
                  />
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={!!tier.popular}
                      onChange={(e) => updateTier(si, ti, { popular: e.target.checked })}
                    />
                    Most Donated
                  </label>
                  <RemoveButton onClick={() => removeTier(si, ti)} />
                </div>
              ))}
              <AddButton label="Add amount" onClick={() => addTier(si)} />
            </div>
          </div>
        ))}
        <AddButton label="Add seva" onClick={addSeva} />
      </Section>

      {/* ── Shloka ── */}
      <Section title="Shloka" description="Sanskrit verse shown in the significance section.">
        <div className="space-y-1">
          <label className="block text-xs font-medium">Sanskrit</label>
          <Textarea rows={2} value={form.shloka.sanskrit} onChange={(e) => set("shloka", { ...form.shloka, sanskrit: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium">Translation</label>
          <Textarea rows={2} value={form.shloka.translation} onChange={(e) => set("shloka", { ...form.shloka, translation: e.target.value })} />
        </div>
        <Field label="Reference" value={form.shloka.reference} onChange={(v) => set("shloka", { ...form.shloka, reference: v })} />
      </Section>

      <div className="sticky bottom-4 flex justify-end">
        <Button type="button" className="gap-2 shadow-lg" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}