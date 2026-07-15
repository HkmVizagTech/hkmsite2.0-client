"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-primary-foreground font-heading font-bold text-xl">ॐ</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // A donations_admin account is scoped to /donations/admin only — it must
  // never reach the rest of the site's admin (banners, blogs, campaigners,
  // staff management, etc.), even though it's a valid logged-in session.
  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted px-4 text-center">
        <p className="text-lg font-semibold text-foreground">This account only has access to the Donations page admin.</p>
        <div className="flex gap-3">
          <a href="/donations/admin" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Go to Donations Admin
          </a>
          <button onClick={() => { logout(); router.push("/admin/login"); }} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground">
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
