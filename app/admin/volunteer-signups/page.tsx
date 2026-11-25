"use client";

// Admin pages must never be statically cached at the CDN edge.
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/authClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, Loader2, MessageCircle, RefreshCw, Search, Trash2, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
const BASE = `${API_URL}/volunteers/admin/signups`;

type Status = "new" | "contacted" | "active" | "not_reachable";
interface Signup {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  interests: string[];
  availability: string[];
  startDate?: string;
  message?: string;
  status: Status;
  utm?: { utm_source?: string; utm_medium?: string; utm_campaign?: string };
  createdAt: string;
}

const STATUSES: { value: Status; label: string; cls: string }[] = [
  { value: "new", label: "New", cls: "bg-blue-100 text-blue-800" },
  { value: "contacted", label: "Contacted", cls: "bg-amber-100 text-amber-800" },
  { value: "active", label: "Active volunteer", cls: "bg-emerald-100 text-emerald-800" },
  { value: "not_reachable", label: "Not reachable", cls: "bg-gray-200 text-gray-700" },
];
const INTEREST_LABEL: Record<string, string> = {
  festivals: "Festival Services",
  prasadam: "Prasadam Seva",
  subhojanam: "Subhojanam",
  "temple-services": "Temple Services",
  harinaam: "Harinaam Sankirtana",
  "book-distribution": "Book Distribution",
  outreach: "Outreach",
  medical: "Medical",
  editorial: "Editorial & Publishing",
  photography: "Photography & Filmmaking",
  architecture: "Architecture & Interiors",
  design: "Graphic Design & Fine Arts",
  drama: "Drama & Performing Arts",
  it: "IT & Computer",
  "social-media": "Social Media",
  other: "Other",
};
const AVAIL_LABEL: Record<string, string> = { daily: "Daily", weekdays: "Weekdays", weekends: "Weekends", "festival-days": "Festival days", flexible: "Flexible" };

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "");
const fmt = (d: string) => new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export default function VolunteerSignupsPage() {
  const [items, setItems] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [interest, setInterest] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(BASE);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not load sign-ups");
      setItems(data.signups || []);
    } catch (e) {
      toast({ title: "Could not load sign-ups", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length, new: 0, contacted: 0, active: 0, not_reachable: 0 };
    items.forEach((i) => { c[i.status] = (c[i.status] || 0) + 1; });
    return c;
  }, [items]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((i) => {
      if (status !== "all" && i.status !== status) return false;
      if (interest !== "all" && !i.interests.includes(interest)) return false;
      if (!t) return true;
      return [i.name, i.phone, i.email, i.city, i.occupation].some((v) => (v || "").toLowerCase().includes(t));
    });
  }, [items, q, status, interest]);

  const setStatusFor = async (id: string, next: Status) => {
    const prev = items;
    setItems((l) => l.map((i) => (i._id === id ? { ...i, status: next } : i)));
    try {
      const res = await authFetch(`${BASE}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
      if (!res.ok) throw new Error();
    } catch {
      setItems(prev);
      toast({ title: "Could not update status", variant: "destructive" });
    }
  };

  const remove = async (s: Signup) => {
    if (!window.confirm(`Delete ${s.name}'s sign-up?`)) return;
    try {
      const res = await authFetch(`${BASE}/${s._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((l) => l.filter((i) => i._id !== s._id));
    } catch {
      toast({ title: "Could not delete", variant: "destructive" });
    }
  };

  const exportCsv = () => {
    const head = ["Name", "Phone", "Email", "Skill", "Availability", "Preferred start", "Experience", "Status", "Campaign", "Signed up"];
    const rows = shown.map((i) => [
      i.name, i.phone, i.email,
      i.interests.map((x) => INTEREST_LABEL[x] || x).join("; "),
      i.availability.map((x) => AVAIL_LABEL[x] || x).join("; "),
      fmtDate(i.startDate),
      i.message, STATUSES.find((s) => s.value === i.status)?.label, i.utm?.utm_campaign, fmt(i.createdAt),
    ]);
    const csv = "﻿" + [head, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `volunteer-signups-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Volunteer Sign-ups</h1>
          <p className="text-sm text-muted-foreground">People who registered on the website&apos;s Volunteer page.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button onClick={exportCsv} disabled={shown.length === 0}>
            <Download className="mr-1 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[{ k: "all", label: "Total" }, ...STATUSES.map((s) => ({ k: s.value, label: s.label }))].map((c) => (
          <button key={c.k} onClick={() => setStatus(c.k as "all" | Status)} className="text-left">
            <Card className={status === c.k ? "border-vk-700 ring-1 ring-vk-700" : ""}>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{counts[c.k] ?? 0}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, email, city…" className="pl-9" />
          </div>
          <select value={interest} onChange={(e) => setInterest(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
            <option value="all">All skills</option>
            {Object.entries(INTEREST_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : shown.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Users className="h-8 w-8" />
          <p>{items.length === 0 ? "No volunteer sign-ups yet." : "No sign-ups match these filters."}</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {shown.map((s) => {
            const st = STATUSES.find((x) => x.value === s.status)!;
            return (
              <Card key={s._id}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold">{s.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {[s.email, s.startDate && `Start: ${fmtDate(s.startDate)}`].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={s.status}
                        onChange={(e) => setStatusFor(s._id, e.target.value as Status)}
                        className={`h-9 rounded-md border-0 px-2.5 text-sm font-medium ${st.cls}`}
                        aria-label="Status"
                      >
                        {STATUSES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <a
                        href={`https://wa.me/91${s.phone}?text=${encodeURIComponent(`Hare Krishna ${s.name}! Thank you for registering as a volunteer at HKM Vizag.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#25D366] px-3 text-sm font-medium text-white"
                      >
                        <MessageCircle className="h-4 w-4" /> {s.phone}
                      </a>
                      <Button variant="ghost" size="icon" onClick={() => remove(s)} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.interests.map((x) => <Badge key={x} variant="secondary">{INTEREST_LABEL[x] || x}</Badge>)}
                    {s.availability.map((x) => <Badge key={x} variant="outline">{AVAIL_LABEL[x] || x}</Badge>)}
                  </div>
                  {s.message && <p className="rounded-md bg-muted/50 px-3 py-2 text-sm">{s.message}</p>}
                  <p className="text-xs text-muted-foreground">
                    {fmt(s.createdAt)}
                    {s.utm?.utm_campaign ? ` · via ${s.utm.utm_source || "?"} / ${s.utm.utm_campaign}` : ""}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
