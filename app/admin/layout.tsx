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
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    if (!isAuthenticated && pathname !== "/admin/login" && pathname !== "/admin/register") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router, pathname]);

  if (pathname === "/admin/login" || pathname === "/admin/register") {
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

  return <AdminLayout>{children}</AdminLayout>;
}
