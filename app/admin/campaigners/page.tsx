"use client";

// Admin pages must never be statically cached at the CDN edge — they show
// live, admin-managed data and a stale cached shell can end up referencing
// an old JS bundle indefinitely.
export const dynamic = "force-dynamic";

import { authFetch } from "@/lib/authClient";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Megaphone, Search, Copy, Check, ExternalLink, Eye, EyeOff, Users, IndianRupee, Ruler,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Campaigner {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  slug: string;
  goalSqft: number;
  message: string;
  status: "active" | "hidden";
  createdAt: string;
  raisedAmount: number;
  sqftRaised: number;
  donorCount: number;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

export default function AdminCampaigners() {
  const [campaigners, setCampaigners] = useState<Campaigner[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const fetchCampaigners = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/campaigners/admin/list`, { credentials: "include" });
      const json = await res.json();
      if (res.ok) {
        setCampaigners(json.campaigners || []);
      } else {
        toast({ title: "Failed to load campaigners", description: json.message, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStatus = async (c: Campaigner) => {
    const next = c.status === "active" ? "hidden" : "active";
    try {
      const res = await authFetch(`${API_URL}/campaigners/admin/${c._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Update failed");
      setCampaigners((list) => list.map((x) => (x._id === c._id ? { ...x, status: next } : x)));
      toast({ title: next === "hidden" ? "Campaign hidden" : "Campaign visible", description: c.name });
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/sqft-seva-campaign/c/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const filtered = campaigners.filter((c) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return (
      c.name.toLowerCase().includes(needle) ||
      c.email.toLowerCase().includes(needle) ||
      c.mobile.includes(needle) ||
      c.slug.includes(needle)
    );
  });

  const totals = campaigners.reduce(
    (acc, c) => ({
      raised: acc.raised + c.raisedAmount,
      sqft: acc.sqft + c.sqftRaised,
      donors: acc.donors + c.donorCount,
    }),
    { raised: 0, sqft: 0, donors: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Megaphone className="h-6 w-6 text-amber-500" /> Sqft Campaigners
          </h1>
          <p className="text-sm text-muted-foreground">
            Peer-to-peer fundraisers for the Square Foot Seva campaign.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, mobile…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold">{campaigners.length}</p>
          <p className="text-xs text-muted-foreground">Campaigners</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="flex items-center justify-center gap-1 text-2xl font-bold">
            <IndianRupee className="h-5 w-5" />{totals.raised.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground">Raised via campaigners</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="flex items-center justify-center gap-1 text-2xl font-bold">
            <Ruler className="h-5 w-5" />{totals.sqft.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground">Sq ft attributed</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="flex items-center justify-center gap-1 text-2xl font-bold">
            <Users className="h-5 w-5" />{totals.donors.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground">Donations via links</p>
        </CardContent></Card>
      </div>

      {/* List */}
      {loading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading campaigners…</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {campaigners.length === 0
              ? "No campaigners yet. Share the registration link: /sqft-seva-campaign/register"
              : "No campaigners match your search."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card key={c._id} className={c.status === "hidden" ? "opacity-60" : ""}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{c.name}</p>
                    <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
                    {c.goalSqft > 0 && (
                      <Badge variant="outline">Goal: {c.goalSqft} sq ft</Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.email} · {c.mobile} · joined{" "}
                    {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold text-amber-600">₹{c.raisedAmount.toLocaleString("en-IN")}</span>
                    {" · "}
                    <span className="font-semibold">{c.sqftRaised} sq ft</span>
                    {" · "}
                    {c.donorCount} donation{c.donorCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyLink(c.slug)}>
                    {copiedSlug === c.slug ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/sqft-seva-campaign/c/${c.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleStatus(c)}>
                    {c.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
