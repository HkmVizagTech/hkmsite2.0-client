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
  Plus, Trash2, RotateCcw, Loader2, ExternalLink, FolderOpen, Save, ChevronDown, ChevronUp,
} from "lucide-react";
import { DEFAULT_CAMPAIGN, type EkadashiCampaign } from "@/lib/ekadashiCampaign";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "") || "http://localhost:3000";

const ICON_OPTIONS = [
  { value: "utensils", label: "Utensils" },
  { value: "heart", label: "Heart" },
  { value: "star", label: "Star" },
  { value: "book", label: "Book" },
  { value: "flower", label: "Flower" },
];

const cloneCampaign = (c: EkadashiCampaign): EkadashiCampaign =>
  JSON.parse(JSON.stringify(c)) as EkadashiCampaign;

/* ------------------------------------------------------------------ */
/* Small field helpers                                                 */
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
        <img src={value} alt={label} className="h-28 w-full object-cover rounded-lg border" />
      )}
      <div className="flex gap-1.5">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image URL (R2 / media library)…" />
      </div>
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
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

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

  const toggle = (key: string) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const CollapseHeader = ({ id, title, count }: { id: string; title: string; count?: number }) => (
    <button
      type="button"
      onClick={() => toggle(id)}
      className="flex w-full items-center justify-between py-1"
    >
      <span className="text-sm font-semibold">
        {title}
        {typeof count === "number" && <span className="ml-1.5 text-muted-foreground">({count})</span>}
      </span>
      {collapsed[id] ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
    </button>
  );

  /* ---- Seva editor helpers ---- */
  const updateSeva = (index: number, patch: Partial<EkadashiCampaign["sevas"][number]>) =>
    setForm((prev) => {
      const sevas = [...prev.sevas];
      sevas[index] = { ...sevas[index], ...patch };
      return { ...prev, sevas };
    });

  const updateTier = (sevaIndex: number, tierIndex: number, patch: Record<string, unknown>) =>
    setForm((prev) => {
      const sevas = [...prev.sevas];
      const tiers = [...sevas[sevaIndex].tiers];
      tiers[tierIndex] = { ...tiers[tierIndex], ...patch } as EkadashiCampaign["sevas"][number]["tiers"][number];
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

  /* ---- Generic list editors ---- */
  const updateListItem = <K extends "sevaCards" | "significancePoints" | "whyDonateSections">(
    key: K,
    index: number,
    patch: Record<string, unknown>
  ) =>
    setForm((prev) => {
      const list = [...(prev[key] as unknown as Array<Record<string, unknown>>)];
      list[index] = { ...list[index], ...patch };
      return { ...prev, [key]: list } as EkadashiCampaign;
    });

  const addListItem = <K extends "sevaCards" | "significancePoints" | "whyDonateSections">(key: K, empty: Record<string, unknown>) =>
    setForm((prev) => {
      const list = [...(prev[key] as unknown as Array<Record<string, unknown>>), empty];
      return { ...prev, [key]: list } as EkadashiCampaign;
    });

  const removeListItem = <K extends "sevaCards" | "significancePoints" | "whyDonateSections">(key: K, index: number) =>
    setForm((prev) => {
      const list = [...(prev[key] as unknown as Array<Record<string, unknown>>)];
      list.splice(index, 1);
      return { ...prev, [key]: list } as EkadashiCampaign;
    });

  const updateFaq = (index: number, patch: Record<string, unknown>) =>
    setForm((prev) => {
      const faqs = [...prev.faqs];
      faqs[index] = { ...faqs[index], ...patch } as EkadashiCampaign["faqs"][number];
      return { ...prev, faqs };
    });

  const addFaq = () => setForm((prev) => ({ ...prev, faqs: [...prev.faqs, { q: "", a: "" }] }));
  const removeFaq = (index: number) => setForm((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));

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
            Edit the standalone <code className="text-foreground">/ekadashi</code> page — reuse it for every Ekadashi by changing the name, banners, seva pricing and text.
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

      {/* ── General ── */}
      <Section title="General" description="Campaign name drives every section heading; copy powers SEO & social sharing.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Campaign name" value={form.campaignName} onChange={(v) => set("campaignName", v)} hint='e.g. "Kamika Ekadashi"' />
          <Field label="Page title (heading)" value={form.pageTitle} onChange={(v) => set("pageTitle", v)} />
          <Field label="Meta title" value={form.metaTitle} onChange={(v) => set("metaTitle", v)} />
          <Field label="Meta description" value={form.metaDesc} onChange={(v) => set("metaDesc", v)} />
          <Field label="OpenGraph title" value={form.ogTitle} onChange={(v) => set("ogTitle", v)} />
          <Field label="OpenGraph description" value={form.ogDesc} onChange={(v) => set("ogDesc", v)} />
        </div>
        <ImageField label="OpenGraph image" value={form.ogImage} onChange={(v) => set("ogImage", v)} />
      </Section>

      {/* ── Hero banner ── */}
      <Section title="Hero banner" description="Used at the top of the page. Desktop ~wide 16:9; mobile ~portrait poster.">
        <ImageField label="Hero image (desktop)" value={form.heroImage} onChange={(v) => set("heroImage", v)} />
        <ImageField label="Hero image (mobile)" value={form.heroImageMobile} onChange={(v) => set("heroImageMobile", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Hero tagline (eyebrow)" value={form.heroTagline} onChange={(v) => set("heroTagline", v)} />
          <Field label="Hero heading — line 1" value={form.heroHeading1} onChange={(v) => set("heroHeading1", v)} />
          <Field label="Hero heading — line 2" value={form.heroHeading2} onChange={(v) => set("heroHeading2", v)} />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium">Hero description</label>
          <Textarea rows={3} value={form.heroDesc} onChange={(e) => set("heroDesc", e.target.value)} />
        </div>
      </Section>

      {/* ── Donation form ── */}
      <Section title="Donation form" description="Headings, labels and contact details on the donation card.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Form heading" value={form.formHeading} onChange={(v) => set("formHeading", v)} />
          <Field label="Order type (receipt category)" value={form.orderType} onChange={(v) => set("orderType", v)} />
          <Field label="Phone (display)" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="Phone link (tel:)" value={form.phoneHref} onChange={(v) => set("phoneHref", v)} />
          <Field label="Contact email" value={form.email} onChange={(v) => set("email", v)} />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium">Form subheading</label>
          <Textarea rows={3} value={form.formSubheading} onChange={(e) => set("formSubheading", e.target.value)} />
        </div>
      </Section>

      {/* ── Sevas & price tiers ── */}
      <Section title="Sevas & price tiers" description="What donors can choose on the form, and the preset amounts for each seva.">
        {form.sevas.map((seva, si) => (
          <div key={seva.key || si} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <CollapseHeader id={`seva-${si}`} title={`${si + 1}. ${seva.label || "Unnamed seva"}`} />
              <RemoveButton onClick={() => removeSeva(si)} />
            </div>
            {!collapsed[`seva-${si}`] && (
              <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Key (id)" value={seva.key} onChange={(v) => updateSeva(si, { key: v })} />
                  <Field label="Label (button)" value={seva.label} onChange={(v) => updateSeva(si, { label: v })} />
                  <Field label="Icon (emoji)" value={seva.icon} onChange={(v) => updateSeva(si, { icon: v })} />
                  <Field label="Name on receipt" value={seva.sevaName} onChange={(v) => updateSeva(si, { sevaName: v })} />
                  <Field label="Category (accounting)" value={seva.category} onChange={(v) => updateSeva(si, { category: v })} />
                </div>

                {/* Unit (optional) */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field
                    label="Unit price (optional, Rs)"
                    value={seva.unit ? String(seva.unit.price) : ""}
                    onChange={(v) => {
                      const price = Number(v);
                      if (!v) updateSeva(si, { unit: undefined });
                      else if (Number.isFinite(price)) {
                        updateSeva(si, { unit: { price, singular: seva.unit?.singular || "unit", plural: seva.unit?.plural || "units" } });
                      }
                    }}
                    hint="e.g. 25 per meal — lets custom amounts show their impact"
                  />
                  <Field label="Unit singular" value={seva.unit?.singular || ""} onChange={(v) => updateSeva(si, { unit: { price: seva.unit?.price || 0, singular: v, plural: seva.unit?.plural || `${v}s` } })} />
                  <Field label="Unit plural" value={seva.unit?.plural || ""} onChange={(v) => updateSeva(si, { unit: { price: seva.unit?.price || 0, singular: seva.unit?.singular || "unit", plural: v } })} />
                </div>

                {/* Tiers */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount tiers</p>
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
                          checked={!!tier.default}
                          onChange={(e) => updateTier(si, ti, { default: e.target.checked })}
                        />
                        Default
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={!!tier.popular}
                          onChange={(e) => updateTier(si, ti, { popular: e.target.checked })}
                        />
                        Most donated
                      </label>
                      <RemoveButton onClick={() => removeTier(si, ti)} />
                    </div>
                  ))}
                  <AddButton label="Add amount" onClick={() => addTier(si)} />
                </div>
              </>
            )}
          </div>
        ))}
        <AddButton label="Add seva" onClick={addSeva} />
      </Section>

      {/* ── Seva cards (the "{name} Daan" grid) ── */}
      <Section title="Seva cards" description="The cards under the &quot;{campaignName} Daan&quot; grid that link to each seva page.">
        {(form.sevaCards as EkadashiCampaign["sevaCards"]).map((card, ci) => (
          <div key={ci} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{card.title || `Card ${ci + 1}`}</span>
              <RemoveButton onClick={() => removeListItem("sevaCards", ci)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title" value={card.title} onChange={(v) => updateListItem("sevaCards", ci, { title: v })} />
              <Field label="Link (href)" value={card.href} onChange={(v) => updateListItem("sevaCards", ci, { href: v })} />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium">Description</label>
              <Textarea rows={2} value={card.description} onChange={(e) => updateListItem("sevaCards", ci, { description: e.target.value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ImageField
                label="Card image"
                value={card.image}
                onChange={(v) => updateListItem("sevaCards", ci, { image: v })}
              />
              <div className="space-y-1">
                <label className="block text-xs font-medium">Icon</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={card.icon || "flower"}
                  onChange={(e) => updateListItem("sevaCards", ci, { icon: e.target.value })}
                >
                  {ICON_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        <AddButton label="Add card" onClick={() => addListItem("sevaCards", { title: "", description: "", image: "", href: "", icon: "flower" })} />
      </Section>

      {/* ── Significance points ── */}
      <Section title="Significance points" description="Numbered points in the &quot;Why this day matters&quot; section.">
        {(form.significancePoints as EkadashiCampaign["significancePoints"]).map((point, pi) => (
          <div key={pi} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{point.title || `Point ${pi + 1}`}</span>
              <RemoveButton onClick={() => removeListItem("significancePoints", pi)} />
            </div>
            <Field label="Title" value={point.title} onChange={(v) => updateListItem("significancePoints", pi, { title: v })} />
            <div className="space-y-1">
              <label className="block text-xs font-medium">Text</label>
              <Textarea rows={3} value={point.text} onChange={(e) => updateListItem("significancePoints", pi, { text: e.target.value })} />
            </div>
          </div>
        ))}
        <AddButton label="Add point" onClick={() => addListItem("significancePoints", { title: "", text: "" })} />
      </Section>

      {/* ── Why donate ── */}
      <Section title="Why donate sections" description="Editorial blocks in the &quot;Why Donate on {campaignName}?&quot; section.">
        {(form.whyDonateSections as EkadashiCampaign["whyDonateSections"]).map((block, bi) => (
          <div key={bi} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{block.title || `Section ${bi + 1}`}</span>
              <RemoveButton onClick={() => removeListItem("whyDonateSections", bi)} />
            </div>
            <Field label="Heading" value={block.title} onChange={(v) => updateListItem("whyDonateSections", bi, { title: v })} />
            <div className="space-y-1">
              <label className="block text-xs font-medium">Body</label>
              <Textarea rows={4} value={block.text} onChange={(e) => updateListItem("whyDonateSections", bi, { text: e.target.value })} />
            </div>
          </div>
        ))}
        <AddButton label="Add section" onClick={() => addListItem("whyDonateSections", { title: "", text: "" })} />
      </Section>

      {/* ── FAQ ── */}
      <Section title="FAQs" description="Collapsible questions under the donation form.">
        {form.faqs.map((faq, fi) => (
          <div key={fi} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{faq.q || `FAQ ${fi + 1}`}</span>
              <RemoveButton onClick={() => removeFaq(fi)} />
            </div>
            <Field label="Question" value={faq.q} onChange={(v) => updateFaq(fi, { q: v })} />
            <div className="space-y-1">
              <label className="block text-xs font-medium">Answer</label>
              <Textarea rows={3} value={faq.a} onChange={(e) => updateFaq(fi, { a: e.target.value })} />
            </div>
          </div>
        ))}
        <AddButton label="Add FAQ" onClick={addFaq} />
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

      {/* ── Bank details ── */}
      <Section title="Bank details" description="Shown under the &quot;Prefer a direct bank transfer?&quot; accordion.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Beneficiary" value={form.bankDetails.beneficiaryName} onChange={(v) => set("bankDetails", { ...form.bankDetails, beneficiaryName: v })} />
          <Field label="Bank" value={form.bankDetails.bankName} onChange={(v) => set("bankDetails", { ...form.bankDetails, bankName: v })} />
          <Field label="Account no." value={form.bankDetails.accountNumber} onChange={(v) => set("bankDetails", { ...form.bankDetails, accountNumber: v })} />
          <Field label="IFSC" value={form.bankDetails.ifsc} onChange={(v) => set("bankDetails", { ...form.bankDetails, ifsc: v })} />
        </div>
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