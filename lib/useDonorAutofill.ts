"use client";

// Shared across every donation form on the site — one hook, one fetch
// implementation, so a logged-in donor never has to retype their name/
// mobile/email regardless of which seva page they land on. If there's no
// active donor session, this quietly returns nulls and every consuming
// form behaves exactly as it did before (blank, ask for details).

import { useEffect, useState } from "react";
import { donorFetch, getDonorToken } from "@/lib/donorAuthClient";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

export interface DonorAutofillData {
  name: string;
  mobile: string;
  email: string;
}

export function useDonorAutofill(): { data: DonorAutofillData | null; loading: boolean; loggedIn: boolean } {
  const [data, setData] = useState<DonorAutofillData | null>(null);
  const [loading, setLoading] = useState(true);
  const loggedIn = !!getDonorToken();

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      return;
    }
    donorFetch(`${API_URL}/donor/me`)
      .then((res) => {
        if (!res.ok) throw new Error("not logged in");
        return res.json();
      })
      .then((json) => {
        setData({
          name: json.donor?.name || "",
          mobile: json.donor?.mobile || "",
          email: json.donor?.email || "",
        });
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, loggedIn };
}
