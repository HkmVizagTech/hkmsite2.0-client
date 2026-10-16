"use client";

import React, { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";

export default function CheckinPage({ params }: any) {
  const { id, token } = params;
  const [status, setStatus] = useState<string | null>(null);
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function doCheckin() {
      setLoading(true);
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:3000";
  const res = await fetch(`${apiUrl}/events/${id}/checkin/${encodeURIComponent(token)}`, { method: 'POST', credentials: 'include' });
        const json = await res.json();
        if (res.ok) {
          setStatus(json.message || 'Checked in');
          setRegistration(json.registration || null);
        } else {
          setStatus(json.message || 'Check-in failed');
        }
      } catch (e) {
        setStatus('Check-in failed');
      }
      setLoading(false);
    }
    doCheckin();
  }, [id, token]);

  return (
    <PageLayout>
      <div className="bg-white pt-[var(--header-h)]">
        <section className="bg-gradient-to-b from-vk-100 via-vk-50 to-white py-12 md:py-20">
          <div className="vk-container">
            <div className="vk-card mx-auto max-w-2xl p-6 text-center md:p-10">
              <span className="vk-pill mb-4">Event Check-in</span>
              {loading ? (
                <div className="flex flex-col items-center gap-3 py-4 text-muted-foreground">
                  <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-vk-200 border-t-vk-700" aria-hidden />
                  <div>Processing check-in...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="vk-h3">{status}</h2>
                  {registration && (
                    <div className="mt-4 rounded-2xl border border-vk-100 bg-vk-50 p-4 text-left md:p-5">
                      <h3 className="font-semibold text-ink">Registrant details</h3>
                      <div className="mt-3 space-y-2">
                        {Object.entries(registration.data || {}).map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4 border-b border-vk-100 pb-2 last:border-0">
                            <div className="text-sm text-muted-foreground">{k}</div>
                            <div className="break-all text-right text-sm font-medium text-ink">{String(v)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
