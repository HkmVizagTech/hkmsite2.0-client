"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminFestivalShowcasesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/festivals");
  }, [router]);

  return (
    <div className="py-10 text-center text-sm text-muted-foreground">
      Redirecting to the unified Festivals page…
    </div>
  );
}