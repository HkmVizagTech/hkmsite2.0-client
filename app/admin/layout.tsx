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

  // Force a password change before letting an admin-created account reach
  // anywhere else in the admin panel — they're logging in with a password
  // an admin chose for them.
  useEffect(() => {
    if (isAuthenticated && user?.mustChangePassword && pathname !== "/admin/change-password") {
      router.push("/admin/change-password");
    }
  }, [isAuthenticated, user, pathname, router]);

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

  // Change-password itself needs auth (checked above) but must be reachable
  // by every role and must skip the role-scoped gates below — a
  // donations_admin or blogs_admin forced to change their password still
  // needs to reach this page, not get bounced to their scoped area.
  if (pathname === "/admin/change-password") {
    return <>{children}</>;
  }

  // A donations_admin account is scoped to /donations/admin only — it must
  // never reach the rest of the site's admin (banners, blogs, campaigners,
  // staff management, etc.), even though it's a valid logged-in session.
  if (user?.role === "donations_admin") {
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

  // A blogs_admin account is scoped to /admin/blogs only — can write/edit
  // posts there, but every other admin area (dashboard, donations,
  // devotees, settings, staff, banners, campaigners...) is off-limits.
  // Deletion-request review is admin-only even though it's nested under
  // /admin/blogs, since approving/rejecting their own deletion requests
  // is exactly what this role must not be able to do.
  if (
    user?.role === "blogs_admin" &&
    (!pathname.startsWith("/admin/blogs") || pathname.startsWith("/admin/blogs/deletion-requests"))
  ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted px-4 text-center">
        <p className="text-lg font-semibold text-foreground">This account only has access to the Blogs admin.</p>
        <div className="flex gap-3">
          <a href="/admin/blogs" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Go to Blogs Admin
          </a>
          <button onClick={() => { logout(); router.push("/admin/login"); }} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground">
            Log Out
          </button>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin" && user?.role !== "blogs_admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-muted px-4 text-center">
        <p className="text-lg font-semibold text-foreground">This account doesn't have admin access.</p>
        <button onClick={() => { logout(); router.push("/admin/login"); }} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground">
          Log Out
        </button>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
