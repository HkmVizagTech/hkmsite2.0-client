"use client";

// Admin pages must never be statically cached at the CDN edge — they show
// live, admin-managed data (banners here) and a stale cached shell can end
// up referencing an old JS bundle indefinitely.
export const dynamic = "force-dynamic";

import { authFetch } from "@/lib/authClient";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GalleryHorizontal, Upload, Trash2, Eye, EyeOff, ArrowUp, ArrowDown,
  Monitor, Smartphone, Loader2, Plus, X, Link2, Pencil, Check, CalendarClock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface Banner {
  _id: string;
  title: string;
  desktopImage: string;
  mobileImage: string;
  linkUrl?: string;
  order: number;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

// The schedule is entered and shown in India time (IST), whatever the browser's own time zone is.
const IST_OFFSET = "+05:30";
const toIsoIst = (local: string) => (local ? new Date(`${local}:00${IST_OFFSET}`).toISOString() : "");
const toLocalIst = (iso?: string | null) => {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(iso));
  const g = (t: string) => parts.find((p) => p.type === t)?.value || "";
  return `${g("year")}-${g("month")}-${g("day")}T${g("hour")}:${g("minute")}`;
};
const fmtIst = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "";
function scheduleState(b: Banner): { label: string; cls: string } {
  if (!b.active) return { label: "Hidden", cls: "bg-muted text-muted-foreground" };
  const now = Date.now();
  if (b.startsAt && new Date(b.startsAt).getTime() > now) return { label: "Scheduled", cls: "bg-amber-100 text-amber-800" };
  if (b.endsAt && new Date(b.endsAt).getTime() <= now) return { label: "Ended", cls: "bg-red-100 text-red-700" };
  return { label: "Live", cls: "bg-green-100 text-green-700" };
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [schedStart, setSchedStart] = useState("");
  const [schedEnd, setSchedEnd] = useState("");
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState("");
  const [mobilePreview, setMobilePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLinkValue, setEditingLinkValue] = useState("");
  const [savingLink, setSavingLink] = useState(false);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/hero-banners?all=true`);
      if (res.ok) {
        const data = await res.json();
        setBanners((data.banners || []).sort((a: Banner, b: Banner) => a.order - b.order));
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setTitle("");
    setLinkUrl("");
    setStartsAt("");
    setEndsAt("");
    setDesktopFile(null);
    setMobileFile(null);
    setDesktopPreview("");
    setMobilePreview("");
    setShowForm(false);
  };

  const handleUpload = async () => {
    if (!desktopFile || !mobileFile) {
      toast({ title: "Both images required", description: "Please select a desktop and a mobile image.", variant: "destructive" });
      return;
    }
    if (startsAt && endsAt && new Date(toIsoIst(endsAt)) <= new Date(toIsoIst(startsAt))) {
      toast({ title: "Check the dates", description: "The end time must be after the start time.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("startsAt", toIsoIst(startsAt));
      fd.append("endsAt", toIsoIst(endsAt));
      fd.append("title", title || `Banner ${banners.length + 1}`);
      fd.append("order", String(banners.length));
      fd.append("linkUrl", linkUrl.trim());
      fd.append("desktopImage", desktopFile);
      fd.append("mobileImage", mobileFile);

      const res = await authFetch(`${API_URL}/hero-banners`, { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) {
        toast({ title: "Banner uploaded", description: startsAt ? "It will go live at the start time you set." : "Now live on the homepage hero." });
        resetForm();
        fetchBanners();
      } else {
        toast({ title: "Upload failed", description: json.message, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const fd = new FormData();
      fd.append("active", String(!banner.active));
      const res = await authFetch(`${API_URL}/hero-banners/${banner._id}`, { method: "PUT", body: fd });
      if (res.ok) {
        setBanners((bs) => bs.map((b) => (b._id === banner._id ? { ...b, active: !b.active } : b)));
      }
    } catch {}
  };

  const startEditLink = (banner: Banner) => {
    setEditingLinkId(banner._id);
    setEditingLinkValue(banner.linkUrl || "");
  };

  const saveLinkUrl = async (bannerId: string) => {
    setSavingLink(true);
    try {
      const fd = new FormData();
      fd.append("linkUrl", editingLinkValue.trim());
      const res = await authFetch(`${API_URL}/hero-banners/${bannerId}`, { method: "PUT", body: fd });
      if (res.ok) {
        setBanners((bs) => bs.map((b) => (b._id === bannerId ? { ...b, linkUrl: editingLinkValue.trim() } : b)));
        setEditingLinkId(null);
        toast({ title: editingLinkValue.trim() ? "Link saved" : "Link removed" });
      } else {
        toast({ title: "Failed to save link", variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    } finally {
      setSavingLink(false);
    }
  };

  const startEditSchedule = (banner: Banner) => {
    setEditingScheduleId(banner._id);
    setSchedStart(toLocalIst(banner.startsAt));
    setSchedEnd(toLocalIst(banner.endsAt));
  };

  const saveSchedule = async (bannerId: string) => {
    if (schedStart && schedEnd && new Date(toIsoIst(schedEnd)) <= new Date(toIsoIst(schedStart))) {
      toast({ title: "Check the dates", description: "The end time must be after the start time.", variant: "destructive" });
      return;
    }
    setSavingSchedule(true);
    try {
      const fd = new FormData();
      fd.append("startsAt", toIsoIst(schedStart));
      fd.append("endsAt", toIsoIst(schedEnd));
      const res = await authFetch(`${API_URL}/hero-banners/${bannerId}`, { method: "PUT", body: fd });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setBanners((bs) => bs.map((b) => (b._id === bannerId ? { ...b, startsAt: json.banner?.startsAt ?? null, endsAt: json.banner?.endsAt ?? null } : b)));
        setEditingScheduleId(null);
        toast({ title: schedStart || schedEnd ? "Schedule saved" : "Schedule cleared" });
      } else {
        toast({ title: "Failed to save schedule", description: json.message, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleDelete = async (banner: Banner) => {
    if (!confirm(`Delete "${banner.title}"?`)) return;
    try {
      const res = await authFetch(`${API_URL}/hero-banners/${banner._id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Deleted" });
        setBanners((bs) => bs.filter((b) => b._id !== banner._id));
      }
    } catch {}
  };

  const move = async (index: number, dir: -1 | 1) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= banners.length) return;
    const reordered = [...banners];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setBanners(reordered);
    try {
      await authFetch(`${API_URL}/hero-banners/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((b, i) => ({ id: b._id, order: i })) }),
      });
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <GalleryHorizontal className="h-6 w-6 text-primary" /> Hero Banners
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the rotating banners on the homepage. Each slide needs a desktop image (landscape,
            ~1920×700) and a mobile image (portrait, ~1080×1350).
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Banner
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/30">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">New Banner</h3>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <Input placeholder="Banner title (internal label)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div>
              <Input
                placeholder="Link URL (optional) — e.g. /sqft-seva-campaign or https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Leave empty for a banner that just displays with no click-through. Use a path starting with / for pages on this site, or a full https:// link for elsewhere.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold"><CalendarClock className="h-4 w-4 text-primary" /> Show this banner</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">From (India time)</label>
                  <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Until (India time)</label>
                  <Input type="datetime-local" value={endsAt} min={startsAt || undefined} onChange={(e) => setEndsAt(e.target.value)} />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Leave both empty to show it right away with no end. Set only &quot;From&quot; to start later, or only &quot;Until&quot; to stop on a date. Changes can take up to 5 minutes to appear on the site.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Monitor className="h-3.5 w-3.5" /> Desktop Image (1920×730 landscape)
                </label>
                <div
                  onClick={() => desktopInputRef.current?.click()}
                  className="flex aspect-[1920/730] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 hover:border-primary/50"
                >
                  {desktopPreview ? (
                    <img src={desktopPreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                      <Upload className="h-6 w-6" />
                      <span className="text-xs">Click to upload</span>
                    </div>
                  )}
                </div>
                <input
                  ref={desktopInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setDesktopFile(f); setDesktopPreview(URL.createObjectURL(f)); }
                  }}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Smartphone className="h-3.5 w-3.5" /> Mobile Image (962×1635 portrait)
                </label>
                <div
                  onClick={() => mobileInputRef.current?.click()}
                  className="mx-auto flex aspect-[962/1635] max-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 hover:border-primary/50"
                >
                  {mobilePreview ? (
                    <img src={mobilePreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                      <Upload className="h-6 w-6" />
                      <span className="text-xs">Click to upload</span>
                    </div>
                  )}
                </div>
                <input
                  ref={mobileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setMobileFile(f); setMobilePreview(URL.createObjectURL(f)); }
                  }}
                />
              </div>
            </div>

            <Button onClick={handleUpload} disabled={submitting} className="w-full">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload Banner
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="py-16 text-center text-muted-foreground">Loading…</p>
      ) : banners.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <GalleryHorizontal className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No banners yet — the homepage will show its built-in default slides until you add some.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {banners.map((banner, i) => (
            <Card key={banner._id} className={!banner.active ? "opacity-50" : ""}>
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={banner.desktopImage} alt={banner.title} fill sizes="120px" className="object-cover" />
                  </div>
                  <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={banner.mobileImage} alt={banner.title} fill sizes="60px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-medium">
                      <span className="truncate">{banner.title}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${scheduleState(banner).cls}`}>{scheduleState(banner).label}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Position {i + 1} of {banners.length}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarClock className="h-3 w-3 shrink-0" />
                      {banner.startsAt || banner.endsAt
                        ? `${banner.startsAt ? `From ${fmtIst(banner.startsAt)}` : "From now"}${banner.endsAt ? ` · Until ${fmtIst(banner.endsAt)}` : " · No end date"}`
                        : "Always on (no schedule)"}
                    </p>
                    {banner.linkUrl ? (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-primary">
                        <Link2 className="h-3 w-3 shrink-0" /> {banner.linkUrl}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs text-muted-foreground/60">No link — image only</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => startEditSchedule(banner)} className="h-8 w-8 p-0" title="Edit schedule">
                      <CalendarClock className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => startEditLink(banner)} className="h-8 w-8 p-0" title="Edit link">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0} className="h-8 w-8 p-0">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => move(i, 1)} disabled={i === banners.length - 1} className="h-8 w-8 p-0">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(banner)} className="h-8 w-8 p-0" title={banner.active ? "Hide from homepage" : "Show on homepage"}>
                      {banner.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(banner)} className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {editingScheduleId === banner._id && (
                  <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">From (India time)</label>
                        <Input type="datetime-local" value={schedStart} onChange={(e) => setSchedStart(e.target.value)} className="h-9 text-sm" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Until (India time)</label>
                        <Input type="datetime-local" value={schedEnd} min={schedStart || undefined} onChange={(e) => setSchedEnd(e.target.value)} className="h-9 text-sm" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => saveSchedule(banner._id)} disabled={savingSchedule} className="h-8 px-3">
                        {savingSchedule ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Check className="mr-1.5 h-3.5 w-3.5" />} Save schedule
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setSchedStart(""); setSchedEnd(""); }} className="h-8 px-3 text-xs">Clear dates</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingScheduleId(null)} className="ml-auto h-8 w-8 p-0"><X className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                )}
                {editingLinkId === banner._id && (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2.5">
                    <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <Input
                      autoFocus
                      placeholder="/sqft-seva-campaign or https://..."
                      value={editingLinkValue}
                      onChange={(e) => setEditingLinkValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveLinkUrl(banner._id)}
                      className="h-8 text-sm"
                    />
                    <Button size="sm" onClick={() => saveLinkUrl(banner._id)} disabled={savingLink} className="h-8 shrink-0 px-3">
                      {savingLink ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingLinkId(null)} className="h-8 w-8 shrink-0 p-0">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
