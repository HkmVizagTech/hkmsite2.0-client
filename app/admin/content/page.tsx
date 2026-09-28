"use client";

// Admin pages must never be statically cached at the CDN edge — they show
// live, admin-managed data and a stale cached shell can end up referencing
// an old JS bundle indefinitely.
export const dynamic = "force-dynamic";

import { authFetch } from "@/lib/authClient";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Save, X, FileText, Globe, Phone, Mail, MapPin, Clock, Loader2, PartyPopper, Megaphone, Image as ImageIcon, Video, Upload, Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MAJOR_FESTIVALS } from "@/lib/majorFestival";
import { FESTIVAL_PAGE_BANNER } from "@/lib/festivalShowcase";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface SitePhoto {
  url: string;
  caption?: string;
}

interface SiteContent {
  hero: { title: string; subtitle: string; tagline: string };
  about: { heading: string; body: string };
  contact: { phone: string; email: string; address: string; morningHours: string; eveningHours: string };
  navbar: { majorFestival: string; customLink: { enabled: boolean; label: string; href: string } };
  festival: { bannerDesktop: string; bannerMobile: string };
  construction: { videoUrl: string; videoId: string; photos: SitePhoto[] };
}

const defaultContent: SiteContent = {
  hero: { title: "Hare Krishna Movement", subtitle: "Visakhapatnam", tagline: "Spreading the timeless message of Lord Krishna through devotion, service, and community" },
  about: { heading: "A Legacy of Devotion & Service", body: "" },
  contact: { phone: "+91 89777 61187", email: "social@hkmvizag.org", address: "Chaitanya Bhavan, Hare Krishna Vaikuntam Cultural Centre, IIM Rd, opp. Akshaya Patra Foundation, Gambhiram, Visakhapatnam, Andhra Pradesh 531163", morningHours: "4:30 AM - 1:00 PM", eveningHours: "4:00 PM - 8:30 PM" },
  navbar: { majorFestival: "auto", customLink: { enabled: false, label: "", href: "" } },
  festival: { bannerDesktop: FESTIVAL_PAGE_BANNER.desktop, bannerMobile: FESTIVAL_PAGE_BANNER.mobile },
  construction: { videoUrl: "", videoId: "", photos: [] },
};


// Preview-only twin of parseYouTubeId in siteContent.controller.js. It exists
// so the admin sees the actual video the moment they paste, instead of saving
// and then going to the public page to check. The server re-parses on save and
// is the source of truth for what gets stored.
const previewYouTubeId = (raw: string): string | null => {
  const input = (raw || "").trim();
  if (!input) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
  const patterns = [
    /youtube(?:-nocookie)?\.com\/shorts\/([A-Za-z0-9_-]{11})/i,
    /youtu\.be\/([A-Za-z0-9_-]{11})/i,
    /youtube(?:-nocookie)?\.com\/watch\?[^]*?\bv=([A-Za-z0-9_-]{11})/i,
    /youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/i,
    /youtube(?:-nocookie)?\.com\/live\/([A-Za-z0-9_-]{11})/i,
    /youtube(?:-nocookie)?\.com\/v\/([A-Za-z0-9_-]{11})/i,
  ];
  for (const re of patterns) {
    const m = input.match(re);
    if (m) return m[1];
  }
  return null;
};

const FESTIVAL_OPTIONS: { value: string; label: string }[] = [
  { value: "none", label: "None — hide the highlight (default)" },
  { value: "auto", label: "Auto — pick the current festival from the calendar" },
  ...MAJOR_FESTIVALS.map((f) => ({ value: f.key, label: f.label })),
];

export default function AdminContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_URL}/site-content`);
        if (res.ok) {
          const data = await res.json();
          setContent({
            ...defaultContent,
            ...data.content,
            navbar: {
              ...defaultContent.navbar,
              ...data.content?.navbar,
              customLink: { ...defaultContent.navbar.customLink, ...data.content?.navbar?.customLink },
            },
            festival: {
              ...defaultContent.festival,
              ...data.content?.festival,
            },
            construction: {
              ...defaultContent.construction,
              ...data.content?.construction,
              photos: Array.isArray(data.content?.construction?.photos)
                ? data.content.construction.photos
                : [],
            },
          });
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const [uploading, setUploading] = useState(false);

  // Uploads go through the existing Media Library endpoint, so a construction
  // photo is also filed there and can be reused elsewhere later — rather than
  // a second, parallel upload path that only this tab knows about.
  const uploadPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await authFetch(`${API_URL}/media`, { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({ title: "Upload failed", description: json.message, variant: "destructive" });
        return;
      }
      const added: SitePhoto[] = (json.items || [])
        .filter((it: { url?: string }) => it?.url)
        .map((it: { url: string; name?: string }) => ({ url: it.url, caption: "" }));
      setContent((c) => ({
        ...c,
        construction: { ...c.construction, photos: [...c.construction.photos, ...added] },
      }));
      toast({
        title: `${added.length} photo${added.length === 1 ? "" : "s"} added`,
        description: "Add captions, then press Save to publish.",
      });
    } catch (e: unknown) {
      toast({
        title: "Upload failed",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const updatePhoto = (index: number, patch: Partial<SitePhoto>) =>
    setContent((c) => ({
      ...c,
      construction: {
        ...c.construction,
        photos: c.construction.photos.map((p, i) => (i === index ? { ...p, ...patch } : p)),
      },
    }));

  const removePhoto = (index: number) =>
    setContent((c) => ({
      ...c,
      construction: { ...c.construction, photos: c.construction.photos.filter((_, i) => i !== index) },
    }));

  // Order in this list is the order on the page, so moving a photo is how a
  // new month's work is put first.
  const movePhoto = (index: number, dir: -1 | 1) =>
    setContent((c) => {
      const photos = [...c.construction.photos];
      const target = index + dir;
      if (target < 0 || target >= photos.length) return c;
      [photos[index], photos[target]] = [photos[target], photos[index]];
      return { ...c, construction: { ...c.construction, photos } };
    });

  const handleSave = async (section: "hero" | "about" | "contact" | "navbar" | "festival" | "construction") => {
    setSaving(true);
    try {
      const res = await authFetch(`${API_URL}/site-content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [section]: content[section] }),
      });
      if (res.ok) {
        toast({ title: "Saved", description: "This is now live on the public website." });
        setEditingSection(null);
      } else {
        const json = await res.json().catch(() => ({}));
        toast({ title: "Failed to save", description: json.message, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-muted-foreground">Loading content…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">
          Edit site copy. Changes save to the database and take effect immediately on the public site.
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        {/* Six tabs, so this must not be a fixed column count. At 5 columns
            the sixth wrapped to a second row that TabsList's h-10 clipped
            away, and Construction looked like it did not exist at all. Rows
            are now declared alongside the columns and h-auto lets the list grow
            into them, so every tab stays visible; the column count steps down on
            narrow screens so the labels never have to truncate. */}
        <TabsList className="w-full max-w-2xl grid grid-cols-2 grid-rows-3 h-auto gap-1 sm:grid-cols-3 sm:grid-rows-2 md:grid-cols-6 md:grid-rows-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="festival">Festivals</TabsTrigger>
          <TabsTrigger value="construction">Construction</TabsTrigger>
        </TabsList>

        {/* HERO */}
        <TabsContent value="hero">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Hero Section</CardTitle>
              {editingSection === "hero" ? (
                <div className="flex gap-2">
                  <Button onClick={() => handleSave("hero")} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save
                  </Button>
                  <Button className="bg-transparent text-foreground hover:bg-muted" onClick={() => setEditingSection(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <Button className="bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setEditingSection("hero")}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input value={content.hero.title} disabled={editingSection !== "hero"} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subtitle</label>
                <Input value={content.hero.subtitle} disabled={editingSection !== "hero"} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tagline</label>
                <Textarea value={content.hero.tagline} disabled={editingSection !== "hero"} onChange={(e) => setContent({ ...content, hero: { ...content.hero, tagline: e.target.value } })} rows={2} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT */}
        <TabsContent value="about">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> About Section</CardTitle>
              {editingSection === "about" ? (
                <div className="flex gap-2">
                  <Button onClick={() => handleSave("about")} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save
                  </Button>
                  <Button className="bg-transparent text-foreground hover:bg-muted" onClick={() => setEditingSection(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <Button className="bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setEditingSection("about")}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Heading</label>
                <Input value={content.about.heading} disabled={editingSection !== "about"} onChange={(e) => setContent({ ...content, about: { ...content.about, heading: e.target.value } })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Body</label>
                <Textarea value={content.about.body} disabled={editingSection !== "about"} onChange={(e) => setContent({ ...content, about: { ...content.about, body: e.target.value } })} rows={5} placeholder="Optional — leave blank to use the default About page copy" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACT */}
        <TabsContent value="contact">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5" /> Contact Information</CardTitle>
              {editingSection === "contact" ? (
                <div className="flex gap-2">
                  <Button onClick={() => handleSave("contact")} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save
                  </Button>
                  <Button className="bg-transparent text-foreground hover:bg-muted" onClick={() => setEditingSection(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <Button className="bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setEditingSection("contact")}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</label>
                <Input value={content.contact.phone} disabled={editingSection !== "contact"} onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</label>
                <Input value={content.contact.email} disabled={editingSection !== "contact"} onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Address</label>
                <Textarea value={content.contact.address} disabled={editingSection !== "contact"} onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Morning Hours</label>
                  <Input value={content.contact.morningHours} disabled={editingSection !== "contact"} onChange={(e) => setContent({ ...content, contact: { ...content.contact, morningHours: e.target.value } })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Evening Hours</label>
                  <Input value={content.contact.eveningHours} disabled={editingSection !== "contact"} onChange={(e) => setContent({ ...content, contact: { ...content.contact, eveningHours: e.target.value } })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NAVBAR */}
        <TabsContent value="navigation">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><PartyPopper className="w-5 h-5" /> Navbar — Major Festival Highlight</CardTitle>
              {editingSection === "navbar" ? (
                <div className="flex gap-2">
                  <Button onClick={() => handleSave("navbar")} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save
                  </Button>
                  <Button className="bg-transparent text-foreground hover:bg-muted" onClick={() => setEditingSection(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <Button className="bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setEditingSection("navbar")}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Highlighted festival</label>
                <select
                  value={content.navbar.majorFestival}
                  disabled={editingSection !== "navbar"}
                  onChange={(e) => setContent({ ...content, navbar: { ...content.navbar, majorFestival: e.target.value } })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-gold disabled:opacity-60"
                >
                  {FESTIVAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted-foreground">
                The navbar can highlight one major festival at a time. By default the highlight is hidden;
                choose &ldquo;Auto&rdquo; to pick the current festival from the Vaishnava calendar automatically,
                or pick a specific festival to pin it. Only festivals that have a page on the site are available
                here.
              </p>

              <div className="border-t border-border pt-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Megaphone className="h-4 w-4" /> Custom nav link
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    id="customLinkEnabled"
                    type="checkbox"
                    checked={content.navbar.customLink.enabled}
                    disabled={editingSection !== "navbar"}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        navbar: { ...content.navbar, customLink: { ...content.navbar.customLink, enabled: e.target.checked } },
                      })
                    }
                    className="h-4 w-4 rounded border-input disabled:opacity-60"
                  />
                  <label htmlFor="customLinkEnabled" className="text-sm">
                    Show this custom link in the navbar
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Link name</label>
                    <Input
                      value={content.navbar.customLink.label}
                      disabled={editingSection !== "navbar"}
                      placeholder="e.g. Krishna Pulse Festival"
                      onChange={(e) =>
                        setContent({
                          ...content,
                          navbar: { ...content.navbar, customLink: { ...content.navbar.customLink, label: e.target.value } },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Redirects to</label>
                    <Input
                      value={content.navbar.customLink.href}
                      disabled={editingSection !== "navbar"}
                      placeholder="/some-page or https://..."
                      onChange={(e) =>
                        setContent({
                          ...content,
                          navbar: { ...content.navbar, customLink: { ...content.navbar.customLink, href: e.target.value } },
                        })
                      }
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  A separate, independent slot from the festival highlight above — both can be shown in the
                  navbar at the same time. It appears in the desktop nav and in the mobile &ldquo;More&rdquo;
                  menu exactly the way the festival highlight does. Leave the name or URL blank (or the
                  checkbox off) to hide it.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      {/* FESTIVALS */}
        <TabsContent value="festival">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Festival Page Banners</CardTitle>
              {editingSection === "festival" ? (
                <div className="flex gap-2">
                  <Button onClick={() => handleSave("festival")} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save
                  </Button>
                  <Button className="bg-transparent text-foreground hover:bg-muted" onClick={() => setEditingSection(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <Button className="bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setEditingSection("festival")}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Desktop banner (title included in the artwork)</label>
                {content.festival.bannerDesktop && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={content.festival.bannerDesktop} alt="Desktop festival banner preview" className="mb-2 h-32 w-full rounded-md border object-cover" />
                )}
                <Input
                  value={content.festival.bannerDesktop}
                  disabled={editingSection !== "festival"}
                  onChange={(e) => setContent({ ...content, festival: { ...content.festival, bannerDesktop: e.target.value } })}
                  placeholder="https://… festivaldesk.webp"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Mobile banner</label>
                {content.festival.bannerMobile && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={content.festival.bannerMobile} alt="Mobile festival banner preview" className="mb-2 h-32 w-full rounded-md border object-cover" />
                )}
                <Input
                  value={content.festival.bannerMobile}
                  disabled={editingSection !== "festival"}
                  onChange={(e) => setContent({ ...content, festival: { ...content.festival, bannerMobile: e.target.value } })}
                  placeholder="https://… Festivalmob.webp"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                These are the hero banners on <code>/festival</code>. The festival title is baked into the
                artwork, so no text is overlaid on top. Desktop is used from the <code>md</code> breakpoint
                up; the mobile banner shows below it.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="construction">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Video className="w-5 h-5" /> Monthly Construction Video</CardTitle>
              {editingSection === "construction" ? (
                <div className="flex gap-2">
                  <Button onClick={() => handleSave("construction")} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Save
                  </Button>
                  <Button className="bg-transparent text-foreground hover:bg-muted" onClick={() => setEditingSection(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <Button className="bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setEditingSection("construction")}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">YouTube link</label>
                <Input
                  value={content.construction.videoUrl}
                  disabled={editingSection !== "construction"}
                  onChange={(e) => setContent({ ...content, construction: { ...content.construction, videoUrl: e.target.value } })}
                  placeholder="https://youtube.com/shorts/XXXXXXXXXXX"
                />
                {/* Paste feedback, before saving rather than after. */}
                {content.construction.videoUrl.trim() !== "" && (
                  previewYouTubeId(content.construction.videoUrl) ? (
                    <p className="mt-1.5 text-xs text-emerald-600">
                      Video id read as <code>{previewYouTubeId(content.construction.videoUrl)}</code> — preview below.
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-destructive">
                      Can&apos;t read a video id from that. Use the Share link from YouTube, e.g.
                      https://youtube.com/shorts/XXXXXXXXXXX
                    </p>
                  )
                )}
              </div>

              {(previewYouTubeId(content.construction.videoUrl) || content.construction.videoId) && (
                <div>
                  <p className="text-sm font-medium mb-2">
                    {previewYouTubeId(content.construction.videoUrl) ? "Preview" : "Currently live"}
                  </p>
                  <div className="relative aspect-[9/16] w-full max-w-[220px] overflow-hidden rounded-xl border">
                    <iframe
                      key={previewYouTubeId(content.construction.videoUrl) || content.construction.videoId}
                      src={`https://www.youtube-nocookie.com/embed/${previewYouTubeId(content.construction.videoUrl) || content.construction.videoId}?rel=0&modestbranding=1&playsinline=1`}
                      title="Construction update preview"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                </div>
              )}

              {/* ── Recent Site Photos ───────────────────────────────── */}
              <div className="border-t pt-5">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <label className="text-sm font-medium">Recent Site Photos</label>
                  <span className="text-xs text-muted-foreground">
                    {content.construction.photos.length} photo
                    {content.construction.photos.length === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  The scrolling strip under the video. The caption appears on top of each photo — keep it
                  short, like &ldquo;Column &amp; Beam Work&rdquo;. First in this list is first on the page.
                </p>

                {editingSection === "construction" && (
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading ? "Uploading…" : "Upload photos"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          uploadPhotos(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <Button
                      className="bg-transparent border border-border text-foreground hover:bg-muted"
                      onClick={() =>
                        setContent({
                          ...content,
                          construction: {
                            ...content.construction,
                            photos: [...content.construction.photos, { url: "", caption: "" }],
                          },
                        })
                      }
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add by URL
                    </Button>
                  </div>
                )}

                {content.construction.photos.length === 0 ? (
                  <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                    No photos yet. The gallery is hidden on the public page until you add one.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {content.construction.photos.map((photo, i) => (
                      <div key={i} className="flex gap-3 rounded-lg border p-3">
                        {/* Plain img on purpose — this previews whatever URL is
                            in the field, including one just typed in. */}
                        {photo.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photo.url}
                            alt={photo.caption || "Site photo"}
                            className="h-20 w-28 shrink-0 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
                            No image
                          </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-2">
                          <Input
                            value={photo.caption || ""}
                            disabled={editingSection !== "construction"}
                            onChange={(e) => updatePhoto(i, { caption: e.target.value })}
                            placeholder="Caption shown on the photo — e.g. Column & Beam Work"
                            maxLength={80}
                          />
                          <Input
                            value={photo.url}
                            disabled={editingSection !== "construction"}
                            onChange={(e) => updatePhoto(i, { url: e.target.value })}
                            placeholder="https://… image URL"
                            className="text-xs"
                          />
                        </div>

                        {editingSection === "construction" && (
                          <div className="flex shrink-0 flex-col gap-1">
                            <Button
                              className="h-7 w-7 bg-transparent p-0 text-foreground hover:bg-muted disabled:opacity-40"
                              disabled={i === 0}
                              onClick={() => movePhoto(i, -1)}
                              title="Move up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              className="h-7 w-7 bg-transparent p-0 text-foreground hover:bg-muted disabled:opacity-40"
                              disabled={i === content.construction.photos.length - 1}
                              onClick={() => movePhoto(i, 1)}
                              title="Move down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              className="h-7 w-7 bg-transparent p-0 text-destructive hover:bg-muted"
                              onClick={() => removePhoto(i)}
                              title="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                This is the vertical video in the <strong>Monthly Construction Update</strong> section of the
                Square Foot Seva and Brick Seva pages. Shorts, normal watch links, youtu.be share links and a
                bare video id all work. Leaving it blank keeps the last known video rather than showing an
                empty frame. Uploaded photos are stored in your Media Library. Press <strong>Save</strong>
                to publish both the video and the photos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
