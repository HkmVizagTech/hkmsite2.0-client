"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  "in-progress": "bg-blue-100 text-blue-800",
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
        <div className="mb-3 flex items-center justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowForm((v) => !v)}
            className="gap-1.5 border-gold/40 text-gold hover:bg-gold/10 hover:text-gold"
          >
            <Plus className="h-3.5 w-3.5" /> Raise an Issue
          </Button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="mb-4 space-y-2 rounded-lg border border-border p-3">
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or issue..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button type="submit" size="sm" disabled={submitting} className="gap-1.5">
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Submit"}
            </Button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
        ) : issues.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No issues raised yet.</p>
        ) : (
          <div className="space-y-2">
            {issues.map((i) => (
              <div key={i._id} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{i.subject}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_STYLES[i.status]}`}>
                    {i.status === "resolved" ? <CheckCircle2 className="mr-0.5 inline h-3 w-3" /> : <Clock className="mr-0.5 inline h-3 w-3" />}
                    {i.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{i.message}</p>
                {i.adminResponse && (
                  <div className="mt-2 rounded-md bg-muted/50 p-2 text-xs">
                    <span className="font-semibold">Our response: </span>{i.adminResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
  );
}
