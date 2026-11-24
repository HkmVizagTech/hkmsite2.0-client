"use client";

// UTM Builder — generates trackable donation links. Pick a known donation
// page (or enter a custom URL), fill in campaign params, and get a ready-to-
// share link whose UTM values flow straight into the donation record via the
// shared useAttribution hook. The values here match exactly what lib/tracking.ts
// reads on landing (utm_source / utm_medium / utm_campaign / utm_content / utm_term).

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Link2, Loader2, RotateCcw, Scissors, Trash2 } from "lucide-react";
import { sevas, getSevaHref } from "@/lib/sevaConfig";
import { authFetch } from "@/lib/authClient";
import { toast } from "@/hooks/use-toast";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.harekrishnavizag.org").replace(/\/+$/, "");
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface ShortLink { _id: string; code: string; path: string; label?: string; clicks: number; createdAt: string }
const shortUrl = (code: string) => `${SITE}/go/${code}`;
// "/kartik-purnima?utm_campaign=x" -> "/kartik-purnima · x"
const describe = (path: string) => {
  const [page, query = ""] = path.split("?");
  const campaign = new URLSearchParams(query).get("utm_campaign");
  return campaign ? `${page} · ${campaign}` : page;
};

// Known donation entry points across the whole site. Value is the path.
const KNOWN_PAGES: { label: string; path: string }[] = [
  { label: "Donations page", path: "/donations" },
  { label: "Subhojanam (Annadana)", path: "/subhojanam" },
  { label: "Square Foot Seva Campaign", path: "/sqft-seva-campaign" },
  { label: "Brick Seva Campaign", path: "/brick-seva-campaign" },
  { label: "Special Occasion", path: "/special-occasion" },
  { label: "Janmashtami", path: "/janmashtami" },
  { label: "Ekadashi Seva", path: "/ekadashi" },
  { label: "Vastra & Alankara Seva", path: "/alankara-vastra-seva" },
  // Per-seva donate pages, pulled live from sevaConfig
  ...sevas.map((s) => ({ label: `Donate — ${s.title}`, path: getSevaHref(s) })),
];

// Common presets to keep source/medium consistent across the team.
const SOURCE_PRESETS = ["facebook", "instagram", "whatsapp", "google", "youtube", "email", "sms", "telegram"];
const MEDIUM_PRESETS = ["social", "cpc", "organic", "broadcast", "banner", "bio", "referral"];

export default function UtmBuilderTab() {
  const [useCustom, setUseCustom] = useState(false);
  const [pagePath, setPagePath] = useState(KNOWN_PAGES[0].path);
  const [customUrl, setCustomUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const [term, setTerm] = useState("");
  const [copied, setCopied] = useState(false);

  // short links
  const [shortCode, setShortCode] = useState("");
  const [shortBusy, setShortBusy] = useState(false);
  const [shortMade, setShortMade] = useState<ShortLink | null>(null);
  const [shortCopied, setShortCopied] = useState<string | null>(null);
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [linksLoading, setLinksLoading] = useState(true);

  const loadLinks = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/short-links`);
      const data = await res.json();
      if (res.ok) setLinks(data.items || []);
    } catch {}
    setLinksLoading(false);
  }, []);
  useEffect(() => { loadLinks(); }, [loadLinks]);

  const baseUrl = useMemo(() => {
    if (useCustom) return customUrl.trim();
    return `${SITE}${pagePath}`;
  }, [useCustom, customUrl, pagePath]);

  const generatedUrl = useMemo(() => {
    if (!baseUrl) return "";
    let root = baseUrl;
    let existingQuery = "";
    try {
      // Preserve any existing query on a custom URL
      const u = new URL(baseUrl.includes("://") ? baseUrl : `https://${baseUrl}`);
      root = `${u.origin}${u.pathname}`;
      existingQuery = u.search.replace(/^\?/, "");
    } catch {
      // Not a full URL yet; use as-is
    }

    const params = new URLSearchParams(existingQuery);
    if (source.trim()) params.set("utm_source", source.trim());
    if (medium.trim()) params.set("utm_medium", medium.trim());
    if (campaign.trim()) params.set("utm_campaign", campaign.trim());
    if (content.trim()) params.set("utm_content", content.trim());
    if (term.trim()) params.set("utm_term", term.trim());

    const qs = params.toString();
    return qs ? `${root}?${qs}` : root;
  }, [baseUrl, source, medium, campaign, content, term]);

  const canGenerate = baseUrl && source.trim() && campaign.trim();

  const copy = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const reset = () => {
    setSource(""); setMedium(""); setCampaign(""); setContent(""); setTerm("");
    setCopied(false); setShortCode(""); setShortMade(null);
  };

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShortCopied(key);
      setTimeout(() => setShortCopied((k) => (k === key ? null : k)), 1800);
    } catch {}
  };

  const makeShort = async () => {
    if (!generatedUrl || !canGenerate) return;
    setShortBusy(true);
    try {
      const res = await authFetch(`${API_URL}/short-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: generatedUrl, code: shortCode.trim(), label: campaign.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortMade(data.link);
        setShortCode("");
        loadLinks();
        copyText(shortUrl(data.link.code), "made");
      } else toast({ title: "Couldn't make the short link", description: data.message, variant: "destructive" });
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    }
    setShortBusy(false);
  };

  const removeShort = async (l: ShortLink) => {
    if (!confirm(`Delete the short link /go/${l.code}? Anyone who already has it will land on the home page.`)) return;
    const res = await authFetch(`${API_URL}/short-links/${l._id}`, { method: "DELETE" });
    if (res.ok) { toast({ title: "Short link deleted" }); if (shortMade?._id === l._id) setShortMade(null); loadLinks(); }
    else toast({ title: "Couldn't delete", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Link2 className="w-5 h-5" /> UTM Link Builder
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Build trackable links for ads, WhatsApp broadcasts, and posts. Every donation from this link
          is tagged with its campaign, source, and origin page automatically.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 space-y-5">
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination page</label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                onClick={() => setUseCustom(false)}
                className={!useCustom ? "" : "bg-transparent border border-border text-foreground hover:bg-muted"}
              >
                Known page
              </Button>
              <Button
                type="button"
                onClick={() => setUseCustom(true)}
                className={useCustom ? "" : "bg-transparent border border-border text-foreground hover:bg-muted"}
              >
                Custom URL
              </Button>
            </div>

            {!useCustom ? (
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={pagePath}
                onChange={(e) => setPagePath(e.target.value)}
              >
                {KNOWN_PAGES.map((p) => (
                  <option key={p.path} value={p.path}>{p.label} — {p.path}</option>
                ))}
              </select>
            ) : (
              <Input
                placeholder="https://www.harekrishnavizag.org/your-page"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
            )}
          </div>

          {/* UTM fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Source <span className="text-red-500">*</span>
                <span className="text-xs text-muted-foreground font-normal"> — where the link lives</span>
              </label>
              <Input list="src-presets" placeholder="facebook" value={source} onChange={(e) => setSource(e.target.value)} />
              <datalist id="src-presets">{SOURCE_PRESETS.map((s) => <option key={s} value={s} />)}</datalist>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Medium
                <span className="text-xs text-muted-foreground font-normal"> — type of traffic</span>
              </label>
              <Input list="med-presets" placeholder="social" value={medium} onChange={(e) => setMedium(e.target.value)} />
              <datalist id="med-presets">{MEDIUM_PRESETS.map((m) => <option key={m} value={m} />)}</datalist>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Campaign <span className="text-red-500">*</span>
                <span className="text-xs text-muted-foreground font-normal"> — the specific push</span>
              </label>
              <Input placeholder="nirjala_ekadashi_2026" value={campaign} onChange={(e) => setCampaign(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Content
                <span className="text-xs text-muted-foreground font-normal"> — which creative / A-B</span>
              </label>
              <Input placeholder="reel_v2" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">
                Term
                <span className="text-xs text-muted-foreground font-normal"> — keyword (for paid search)</span>
              </label>
              <Input placeholder="donate for annadana" value={term} onChange={(e) => setTerm(e.target.value)} />
            </div>
          </div>

          {/* Output */}
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-medium">Generated link</label>
            <div className="rounded-lg bg-muted p-3 text-sm font-mono break-all min-h-[3rem] flex items-center">
              {generatedUrl || <span className="text-muted-foreground font-sans">Fill in Source and Campaign to generate a link…</span>}
            </div>
            <div className="flex gap-2">
              <Button onClick={copy} disabled={!canGenerate} className="gap-2">
                {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy link</>}
              </Button>
              <Button onClick={reset} className="gap-2 bg-transparent border border-border text-foreground hover:bg-muted">
                <RotateCcw className="w-4 h-4" /> Clear fields
              </Button>
            </div>
            {!canGenerate && (baseUrl) && (
              <p className="text-xs text-amber-600">Source and Campaign are required for a meaningful trackable link.</p>
            )}
          </div>

          {/* Short link */}
          <div className="space-y-2 border-t pt-4">
            <label className="text-sm font-medium flex items-center gap-1.5"><Scissors className="w-4 h-4" /> Short link</label>
            <p className="text-xs text-muted-foreground">
              Share a short address instead of the long one. When someone opens it, the page loads with the full UTM link in the address bar, so tracking works exactly the same.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-md border border-input bg-background text-sm">
                <span className="pl-3 text-muted-foreground whitespace-nowrap">{SITE.replace(/^https?:\/\//, "")}/go/</span>
                <input
                  className="h-10 w-40 bg-transparent px-1 outline-none"
                  placeholder="kp-flaxxa (optional)"
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  maxLength={40}
                />
              </div>
              <Button onClick={makeShort} disabled={!canGenerate || shortBusy} className="gap-2">
                {shortBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />} Make short link
              </Button>
            </div>
            {shortMade && (
              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-sm">
                <span className="font-mono font-semibold text-green-800 break-all">{shortUrl(shortMade.code)}</span>
                <Button size="sm" onClick={() => copyText(shortUrl(shortMade.code), "made")} className="gap-1.5">
                  {shortCopied === "made" ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-3">
          <p className="font-medium">Short links</p>
          {linksLoading ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>
          ) : links.length === 0 ? (
            <p className="text-sm text-muted-foreground">No short links yet. Build a UTM link above and press “Make short link”.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground border-b">
                  <tr><th className="py-2 pr-3">Short link</th><th className="py-2 pr-3">Goes to</th><th className="py-2 pr-3">Opened</th><th className="py-2" /></tr>
                </thead>
                <tbody>
                  {links.map((l) => (
                    <tr key={l._id} className="border-b last:border-0 align-top">
                      <td className="py-2 pr-3 font-mono whitespace-nowrap">/go/{l.code}</td>
                      <td className="py-2 pr-3 break-all" title={`${SITE}${l.path}`}>{describe(l.path)}</td>
                      <td className="py-2 pr-3">{l.clicks}</td>
                      <td className="py-2 text-right whitespace-nowrap">
                        <Button size="sm" variant="ghost" onClick={() => copyText(shortUrl(l.code), l._id)} className="gap-1.5">
                          {shortCopied === l._id ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeShort(l)} aria-label="Delete short link"><Trash2 className="w-4 h-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">Naming tips for clean reports</p>
          <p>Keep values lowercase with underscores (e.g. <code className="text-foreground">nirjala_ekadashi_2026</code>), not spaces. Reuse the same <b>campaign</b> name across every link for one push so the UTM Campaigns report groups them together. Once a donor lands, the values are stored for their whole session — even if they navigate to another page before donating.</p>
        </CardContent>
      </Card>
    </div>
  );
}
