"use client";

// Preacher portal: sign in with the mobile number on the temple's devotee list (OTP by SMS), then see only your own
// donation numbers and your seva-page links. Not an admin page; no receipts are raised here.
export const dynamic = "force-dynamic";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, Copy, IndianRupee, Loader2, LogOut, Share2, Users } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";
const KEY = "hkm_preacher_token";
const SEVA_LINKS: { group: string; items: { label: string; path: string }[] }[] = [
  {
    group: "Main sevas",
    items: [
      { label: "Anna Daan", path: "anna-daan-seva" },
      { label: "Gau Seva", path: "gau-seva" },
      { label: "Square Foot Seva", path: "sqft-seva-campaign" },
      { label: "Brick Seva", path: "brick-seva-campaign" },
      { label: "Gita Daan", path: "gita-daan-seva" },
      { label: "Alankara Vastra", path: "alankara-vastra-seva" },
      { label: "Subhojanam", path: "subhojanam" },
      { label: "Patron", path: "patron" },
      { label: "Special Occasion", path: "special-occasion" },
      { label: "Emergency Relief", path: "emergency-relief" },
    ],
  },
  {
    group: "Festival sevas",
    items: [
      { label: "Kartik Maas", path: "kartik-maas" },
      { label: "Diwali", path: "diwali" },
      { label: "Govardhan Puja", path: "govardhan-puja" },
      { label: "Vaikuntha Ekadashi", path: "vaikuntha-ekadashi" },
      { label: "Ekadashi", path: "ekadashi" },
      { label: "Pitru Paksha", path: "pitru-paksha" },
      { label: "Janmashtami", path: "janmashtami" },
      { label: "Radhashtami", path: "radhashtami" },
      { label: "Chaturmas", path: "chaturmas" },
      { label: "Vijayadashami", path: "vijayadashami" },
    ],
  },
];

type Me = { name: string; code: string; dccEnrolledById: number };
type Sum = { count: number; total: number; donors: number };
type Data = {
  me: Me;
  accounts: Me[];
  today: Sum;
  month: Sum;
  allTime: Sum;
  range: Sum;
  donations: { items: { _id: string; donorName: string; amount: number; sevaName?: string; sourcePage?: string; createdAt: string }[]; total: number; page: number; totalPages: number };
  daily: { _id: string; total: number; count: number }[];
};

const inr = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
const nice = (d: string) => new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const site = () => (typeof window !== "undefined" && !/localhost|127\.0\.0\.1/.test(window.location.hostname) ? window.location.origin : "https://www.hkmvizag.org");
const card = "rounded-2xl border border-vk-100 bg-white p-4";

export default function PreacherPortal() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [account, setAccount] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    try { setToken(localStorage.getItem(KEY)); } catch {}
    setReady(true);
  }, []);

  const logout = () => {
    try { localStorage.removeItem(KEY); } catch {}
    setToken(null);
    setData(null);
    setStep("mobile");
    setOtp("");
  };

  const load = useCallback(async () => {
    if (!token) return;
    const p = new URLSearchParams({ page: String(page) });
    if (account != null) p.set("id", String(account));
    const res = await fetch(`${API_URL}/preacher-portal/dashboard?${p}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) return logout();
    const j = await res.json();
    if (res.ok) setData(j);
  }, [token, account, page]);

  useEffect(() => { load(); }, [load]);

  const send = async () => {
    setError("");
    const m = mobile.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(m)) return setError("Please enter your 10-digit mobile number.");
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/preacher-portal/send-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile: m }) });
      const j = await res.json();
      if (res.ok) { setMobile(m); setStep("otp"); } else setError(j.message || "Could not send the code.");
    } catch { setError("Network error. Please try again."); }
    setBusy(false);
  };

  const verify = async () => {
    setError("");
    if (!/^\d{6}$/.test(otp)) return setError("Please enter the 6-digit code from the SMS.");
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/preacher-portal/verify-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile, otp }) });
      const j = await res.json();
      if (res.ok) {
        try { localStorage.setItem(KEY, j.token); } catch {}
        setToken(j.token);
      } else setError(j.message || "Incorrect code.");
    } catch { setError("Network error. Please try again."); }
    setBusy(false);
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(text);
    setTimeout(() => setCopied(""), 1500);
  };

  const linkKey = data ? data.me.code || String(data.me.dccEnrolledById) : "";
  const url = (path: string) => `${site()}/${path}/${linkKey}`;
  const allText = useMemo(
    () => (data ? [`Hare Krishna! Offer your seva at ISKCON Vizag:`, ...SEVA_LINKS.flatMap((g) => g.items.map((i) => `${i.label}: ${url(i.path)}`))].join("\n") : ""),
    [data, linkKey]
  );
  const maxDay = Math.max(1, ...(data?.daily || []).map((d) => d.total));

  if (!ready) return null;

  return (
    <main className="min-h-screen bg-vk-50/60 pb-16">
      <header className="border-b border-vk-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src="/assets/logo.png" alt="" width={36} height={36} className="h-9 w-9 rounded-full object-contain" />
            <div>
              <p className="text-sm font-bold text-vk-800">Preacher Portal</p>
              <p className="text-xs text-muted-foreground">ISKCON Gambheeram Visakhapatnam</p>
            </div>
          </div>
          {token && <button onClick={logout} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-vk-200 px-3 py-1.5 text-xs font-semibold text-vk-800 hover:bg-vk-50"><LogOut className="h-3.5 w-3.5" /> Log out</button>}
        </div>
      </header>

      {!token ? (
        <div className="mx-auto mt-12 max-w-sm px-4">
          <div className="rounded-3xl border border-vk-100 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold text-ink">{step === "mobile" ? "Preacher login" : "Enter your code"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === "mobile" ? "Use the mobile number registered with the temple. We'll send a code by SMS." : <>Sent by SMS to <strong className="text-ink">+91 {mobile}</strong></>}
            </p>
            {step === "mobile" ? (
              <input value={mobile} onChange={(e) => setMobile(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" className="mt-5 h-12 w-full rounded-xl border border-vk-200 px-4 text-base outline-none focus:border-vk-500" />
            ) : (
              <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} onKeyDown={(e) => e.key === "Enter" && verify()} inputMode="numeric" autoComplete="one-time-code" placeholder="6-digit code" className="mt-5 h-12 w-full rounded-xl border border-vk-200 px-4 text-center text-lg tracking-[0.4em] outline-none focus:border-vk-500" />
            )}
            {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button onClick={step === "mobile" ? send : verify} disabled={busy} className="vk-btn-primary mt-5 h-12 w-full justify-center text-base">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} {step === "mobile" ? "Send code" : "Log in"}
            </button>
            {step === "otp" && (
              <button onClick={() => { setStep("mobile"); setOtp(""); setError(""); }} className="mt-3 w-full text-center text-sm text-vk-700 hover:underline">Change number or resend</button>
            )}
          </div>
        </div>
      ) : !data ? (
        <p className="mt-20 text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></p>
      ) : (
        <div className="mx-auto mt-6 max-w-5xl space-y-5 px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Hare Krishna,</p>
              <h1 className="text-2xl font-bold text-ink">{data.me.name}</h1>
              <p className="text-xs text-muted-foreground">Code {data.me.code || "—"} · ID {data.me.dccEnrolledById}</p>
            </div>
            {data.accounts.length > 1 && (
              <select value={data.me.dccEnrolledById} onChange={(e) => { setAccount(Number(e.target.value)); setPage(1); }} className="h-10 rounded-lg border border-vk-200 bg-white px-3 text-sm">
                {data.accounts.map((a) => <option key={a.dccEnrolledById} value={a.dccEnrolledById}>{a.name} ({a.code || a.dccEnrolledById})</option>)}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Today", s: data.today, hl: true },
              { label: "This month", s: data.month },
              { label: "All time", s: data.allTime },
              { label: "Donors (all time)", value: String(data.allTime.donors), sub: "Unique donors" },
            ].map((c) => (
              <div key={c.label} className={`${card} ${c.hl ? "border-vk-300 bg-vk-50" : ""}`}>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">{c.s ? <IndianRupee className="h-3 w-3" /> : <Users className="h-3 w-3" />} {c.label}</p>
                <p className="mt-1 text-2xl font-bold text-ink">{c.s ? inr(c.s.total) : c.value}</p>
                <p className="text-xs text-muted-foreground">{c.s ? `${c.s.count} donation${c.s.count === 1 ? "" : "s"}` : c.sub}</p>
              </div>
            ))}
          </div>

          {data.daily.length > 0 && (
            <div className={card}>
              <p className="mb-3 text-sm font-semibold text-ink">This month, day by day</p>
              <div className="flex h-32 items-end gap-1 overflow-x-auto">
                {data.daily.map((d) => (
                  <div key={d._id} className="flex min-w-[16px] max-w-[40px] flex-1 flex-col items-center justify-end" title={`${d._id}: ${inr(d.total)} (${d.count})`}>
                    <div className="w-full rounded-t bg-vk-500" style={{ height: `${Math.max(4, (d.total / maxDay) * 104)}px` }} />
                    <span className="mt-1 text-[9px] text-muted-foreground">{d._id.slice(8)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={card}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-ink">Your seva links</p>
                <p className="text-xs text-muted-foreground">Donations made through these links are credited to you.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copy(allText)} className="inline-flex items-center gap-1.5 rounded-full border border-vk-200 px-3 py-1.5 text-xs font-semibold text-vk-800 hover:bg-vk-50">
                  {copied === allText ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy all
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(allText)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white"><Share2 className="h-3.5 w-3.5" /> WhatsApp</a>
              </div>
            </div>
            {SEVA_LINKS.map((g) => (
              <div key={g.group} className="mt-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((i) => (
                    <div key={i.path} className="flex items-center gap-2 rounded-xl border border-vk-100 px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{i.label}</p>
                        <a href={url(i.path)} target="_blank" rel="noreferrer" className="block truncate text-xs text-vk-700 hover:underline">{url(i.path).replace(/^https?:\/\//, "")}</a>
                      </div>
                      <button onClick={() => copy(url(i.path))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-vk-50" aria-label={`Copy ${i.label} link`}>
                        {copied === url(i.path) ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-vk-700" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={card}>
            <p className="mb-3 text-sm font-semibold text-ink">Your donations</p>
            {data.donations.items.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No donations yet. Share your links to get started.</p>
            ) : (
              <ul className="divide-y divide-vk-100">
                {data.donations.items.map((d) => (
                  <li key={d._id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{d.donorName}</p>
                      <p className="truncate text-xs text-muted-foreground">{d.sevaName || d.sourcePage} · {nice(d.createdAt)}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-ink">{inr(d.amount)}</p>
                  </li>
                ))}
              </ul>
            )}
            {data.donations.totalPages > 1 && (
              <div className="mt-3 flex items-center justify-end gap-2 text-sm">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-full border border-vk-200 px-3 py-1 disabled:opacity-40">Previous</button>
                <span className="text-muted-foreground">Page {page} of {data.donations.totalPages}</span>
                <button disabled={page >= data.donations.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-full border border-vk-200 px-3 py-1 disabled:opacity-40">Next</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
