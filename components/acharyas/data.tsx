"use client";

import { createContext, useContext, useMemo } from "react";
import type { Acharya, AcharyaCategory } from "@/lib/acharyas";

/** The acharyas in the page's language, handed down from the server page (so only that language is sent). */
const Ctx = createContext<Acharya[]>([]);

export function AcharyasProvider({ list, children }: { list: Acharya[]; children: React.ReactNode }) {
  return <Ctx.Provider value={list}>{children}</Ctx.Provider>;
}

export function useAcharyaData() {
  const ACHARYAS = useContext(Ctx);
  return useMemo(() => {
    const bySlug = (slug: string) => ACHARYAS.find((a) => a.slug === slug);
    const CATEGORIES: AcharyaCategory[] = [...new Set(ACHARYAS.map((a) => a.category))];
    // the recorded guru-to-disciple line, eldest first (same rule as lib/acharyas.ts)
    const PARAMPARA: Acharya[] = [];
    let cur = ACHARYAS.find((x) => x.lineage && !x.lineage.guru && x.lineage.disciple);
    while (cur) {
      PARAMPARA.push(cur);
      cur = cur.lineage?.disciple ? bySlug(cur.lineage.disciple) : undefined;
    }
    return { ACHARYAS, CATEGORIES, PARAMPARA, acharyaBySlug: bySlug };
  }, [ACHARYAS]);
}
