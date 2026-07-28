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
  Megaphone, Search, Copy, Check, ExternalLink, Eye, EyeOff, Users, IndianRupee, Ruler, CheckCircle2, UserRound, Plus, Pencil,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Campaigner {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  slug: string;
  campaignType: "SQFT" | "JANMASHTAMI";
  referredByDevotee: { _id: string; name: string } | null;
  goalSqft: number;
  message: string;
  status: "pending" | "active" | "hidden";
  createdAt: string;
  raisedAmount: number;
  sqftRaised: number;
  donorCount: number;
}

interface TempleDevotee {
  _id: string;
  name: string;
  dccEnrolledById: number | null;
  status: "active" | "hidden";
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const CAMPAIGN_PATHS: Record<string, string> = {
  SQFT: "/sqft-seva-campaign/c",
  JANMASHTAMI: "/janmashtami/c",
};

export default function AdminCampaigners() {
  const [campaigners, setCampaigners] = useState<Campaigner[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "SQFT" | "JANMASHTAMI">("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Temple devotees management
  const [devotees, setDevotees] = useState<TempleDevotee[]>([]);
  const [devoteesLoading, setDevoteesLoading] = useState(true);
  const [newDevotee, setNewDevotee] = useState({ name: "", dccEnrolledById: "" });
  const [addingDevotee, setAddingDevotee] = useState(false);
  const [editingDevotee, setEditingDevotee] = useState<TempleDevotee | null>(null);

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

  const fetchDevotees = async () => {
    setDevoteesLoading(true);
    try {
      const res = await authFetch(`${API_URL}/temple-devotees/admin/list`, { credentials: "include" });
      const json = await res.json();
      if (res.ok && json.success) setDevotees(json.devotees || []);
    } catch {} finally {
      setDevoteesLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigners();
    fetchDevotees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (c: Campaigner, next: "pending" | "active" | "hidden", successMsg: string) => {
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
      toast({ title: successMsg, description: c.name });
    } catch (e: any) {
      toast({ title: "Failed to update", description: e.message, variant: "destructive" });
    }
  };

  const copyLink = (c: Campaigner) => {
    const url = `${window.location.origin}${CAMPAIGN_PATHS[c.campaignType] || CAMPAIGN_PATHS.SQFT}/${c.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSlug(c.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    });
  };

  const addDevotee = async () => {
    const name = newDevotee.name.trim();
    if (name.length < 2) {
      toast({ title: "Please enter the devotee's name", variant: "destructive" });
      return;
    }
    setAddingDevotee(true);
    try {
      const res = await authFetch(`${API_URL}/temple-devotees/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, dccEnrolledById: newDevotee.dccEnrolledById || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add");
      setDevotees((list) => [...list, json.devotee].sort((a, b) => a.name.localeCompare(b.name)));
      setNewDevotee({ name: "", dccEnrolledById: "" });
      toast({ title: "Devotee added", description: name });
    } catch (e: any) {
      toast({ title: "Failed to add devotee", description: e.message, variant: "destructive" });
    } finally {
      setAddingDevotee(false);
    }
  };

  const saveDevotee = async () => {
    if (!editingDevotee) return;
    try {
      const res = await authFetch(`${API_URL}/temple-devotees/admin/${editingDevotee._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editingDevotee.name,
          dccEnrolledById: editingDevotee.dccEnrolledById,
          status: editingDevotee.status,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save");
      setDevotees((list) => list.map((d) => (d._id === editingDevotee._id ? json.devotee : d)));
      setEditingDevotee(null);
      toast({ title: "Devotee updated" });
    } catch (e: any) {
      toast({ title: "Failed to save", description: e.message, variant: "destructive" });
    }
  };

  const filtered = campaigners.filter((c) => {
    if (typeFilter !== "all" && (c.campaignType || "SQFT") !== typeFilter) return false;
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return (
      c.name.toLowerCase().includes(needle) ||
      c.email.toLowerCase().includes(needle) ||
      c.mobile.includes(needle) ||
      c.slug.includes(needle)
    );
  });

  const pendingCount = campaigners.filter((c) => c.status === "pending").length;

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
            <Megaphone className="h-6 w-6 text-amber-500" /> Campaigners
          </h1>
          <p className="text-sm text-muted-foreground">
            Peer-to-peer fundraisers — Square Foot Seva &amp; Janmashtami. New registrations need your approval.
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
          <p className="text-xs text-muted-foreground">Campaigners{pendingCount > 0 ? ` · ${pendingCount} pending` : ""}</p>
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

      {/* Type filter */}
      <div className="flex gap-2">
        {(["all", "SQFT", "JANMASHTAMI"] as const).map((t) => (
          <Button
            key={t}
            size="sm"
            variant={typeFilter === t ? "default" : "outline"}
            onClick={() => setTypeFilter(t)}
          >
            {t === "all" ? "All" : t === "SQFT" ? "Square Foot" : "Janmashtami"}
          </Button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading campaigners…</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {campaigners.length === 0
              ? "No campaigners yet. Registration links: /sqft-seva-campaign/register and /janmashtami/register"
              : "No campaigners match your filters."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card key={c._id} className={c.status === "hidden" ? "opacity-60" : c.status === "pending" ? "border-amber-300 bg-amber-50/40" : ""}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{c.name}</p>
                    <Badge variant={c.status === "active" ? "default" : c.status === "pending" ? "outline" : "secondary"}
                      className={c.status === "pending" ? "border-amber-400 text-amber-700" : ""}>
                      {c.status}
                    </Badge>
                    <Badge variant="outline">{(c.campaignType || "SQFT") === "SQFT" ? "Square Foot" : "Janmashtami"}</Badge>
                    {c.goalSqft > 0 && <Badge variant="outline">Goal: {c.goalSqft} sq ft</Badge>}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.email} · {c.mobile} · joined{" "}
                    {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {c.referredByDevotee && <> · knows <span className="font-medium text-foreground">{c.referredByDevotee.name}</span></>}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold text-amber-600">₹{c.raisedAmount.toLocaleString("en-IN")}</span>
                    {" · "}
                    {c.donorCount} donation{c.donorCount === 1 ? "" : "s"}
                    {(c.campaignType || "SQFT") === "SQFT" && <>{" · "}<span className="font-semibold">{c.sqftRaised} sq ft</span></>}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {c.status === "pending" && (
                    <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700" onClick={() => setStatus(c, "active", "Campaigner approved — link is now live")}>
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => copyLink(c)} title="Copy campaign link">
                    {copiedSlug === c.slug ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`${CAMPAIGN_PATHS[c.campaignType] || CAMPAIGN_PATHS.SQFT}/${c.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  {c.status !== "pending" && (
                    <Button variant="outline" size="sm" onClick={() => setStatus(c, c.status === "active" ? "hidden" : "active", c.status === "active" ? "Campaign hidden" : "Campaign visible")}>
                      {c.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ---- Temple Devotees management ---- */}
      <div className="border-t pt-6">
        <div className="mb-3">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <UserRound className="h-5 w-5 text-amber-500" /> Temple Devotees
          </h2>
          <p className="text-sm text-muted-foreground">
            The curated list registrants pick from ("devotee you know"). Each devotee's DCC Enrolled-By ID
            controls which devotee the DCC receipt is raised under for donations via their campaigners.
          </p>
        </div>

        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Devotee name (e.g. Krishna Das)"
                value={newDevotee.name}
                onChange={(e) => setNewDevotee({ ...newDevotee, name: e.target.value })}
              />
              <Input
                placeholder="DCC Enrolled-By ID (optional)"
                type="number"
                className="sm:w-56"
                value={newDevotee.dccEnrolledById}
                onChange={(e) => setNewDevotee({ ...newDevotee, dccEnrolledById: e.target.value })}
              />
              <Button onClick={addDevotee} disabled={addingDevotee} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>

            {devoteesLoading ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Loading devotees…</p>
            ) : devotees.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No devotees added yet — registrants can't complete registration until at least one exists.
              </p>
            ) : (
              <div className="divide-y">
                {devotees.map((d) => (
                  <div key={d._id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                    {editingDevotee?._id === d._id ? (
                      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                          value={editingDevotee.name}
                          onChange={(e) => setEditingDevotee({ ...editingDevotee, name: e.target.value })}
                          className="sm:max-w-xs"
                        />
                        <Input
                          type="number"
                          placeholder="DCC ID"
                          value={editingDevotee.dccEnrolledById ?? ""}
                          onChange={(e) => setEditingDevotee({ ...editingDevotee, dccEnrolledById: e.target.value === "" ? null : Number(e.target.value) })}
                          className="sm:w-40"
                        />
                        <select
                          value={editingDevotee.status}
                          onChange={(e) => setEditingDevotee({ ...editingDevotee, status: e.target.value as "active" | "hidden" })}
                          className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                        >
                          <option value="active">active</option>
                          <option value="hidden">hidden</option>
                        </select>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveDevotee}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingDevotee(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{d.name}</span>
                          <Badge variant={d.status === "active" ? "default" : "secondary"}>{d.status}</Badge>
                          <span className="text-xs text-muted-foreground">
                            DCC ID: {d.dccEnrolledById ?? "— (uses default)"}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setEditingDevotee(d)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
