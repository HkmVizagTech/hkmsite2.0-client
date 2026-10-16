"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, CheckCircle2, Clock } from "lucide-react";
import { donorFetch } from "@/lib/donorAuthClient";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface Issue {
  _id: string;
  subject: string;
  message: string;
  status: "open" | "in-progress" | "resolved";
  adminResponse?: string;
  createdAt: string;
}

const STATUS_STYLES: Record<Issue["status"], string> = {
  open: "bg-amber-100 text-amber-800",
  "in-progress": "bg-vk-100 text-vk-700",
  resolved: "bg-green-100 text-green-800",
};

export default function MyIssues() {
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIssues = () => {
    donorFetch(`${API_URL}/donor/issues`)
      .then((res) => res.json())
      .then((data) => setIssues(data.issues || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadIssues(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!subject.trim() || !message.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await donorFetch(`${API_URL}/donor/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not submit.");
      setSubject(""); setMessage(""); setShowForm(false);
      loadIssues();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
        <div className="mb-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="vk-btn-outline h-10 gap-1.5 px-4 text-[13px]"
          >
            <Plus className="h-4 w-4" /> Raise an Issue
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="mb-4 space-y-3 rounded-2xl border border-vk-100 bg-vk-50/60 p-4">
            {error && (
              <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700">{error}</p>
            )}
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="vk-input"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or issue..."
              rows={3}
              className="vk-input h-auto min-h-[96px] py-2.5"
            />
            <button type="submit" disabled={submitting} className="vk-btn-primary h-11 w-full gap-1.5 px-6 sm:w-auto">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-vk-500" /></div>
        ) : issues.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-vk-200 py-6 text-center text-sm text-muted-foreground">
            No issues raised yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {issues.map((i) => (
              <div key={i._id} className="rounded-xl border border-vk-100 bg-white p-3.5 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 break-words font-semibold text-ink">{i.subject}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS_STYLES[i.status]}`}>
                    {i.status === "resolved" ? <CheckCircle2 className="mr-0.5 inline h-3 w-3" /> : <Clock className="mr-0.5 inline h-3 w-3" />}
                    {i.status}
                  </span>
                </div>
                <p className="mt-1 break-words text-xs text-muted-foreground">{i.message}</p>
                {i.adminResponse && (
                  <div className="mt-2.5 break-words rounded-lg bg-vk-50 p-2.5 text-xs text-ink/80">
                    <span className="font-semibold text-vk-700">Our response: </span>{i.adminResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
  );
}
