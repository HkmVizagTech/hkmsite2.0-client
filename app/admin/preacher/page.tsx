"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Receipt, Users, BarChart3 } from "lucide-react";
import RaiseReceiptTab from "./RaiseReceiptTab";
import MyDonorsTab from "./MyDonorsTab";
import MyReportsTab from "./MyReportsTab";

const MODULE_TABS = [
  { key: "raise-receipt", label: "Raise Receipt", icon: Receipt },
  { key: "my-donors", label: "My Donors", icon: Users },
  { key: "my-reports", label: "My Reports", icon: BarChart3 },
];

export default function PreacherDashboard() {
  const { user, logout } = useAuth();
  // Full admins visiting this page (for oversight/testing) see everything;
  // a preacher sees only what they were granted.
  const allowed = user?.role === "admin" ? MODULE_TABS.map((m) => m.key) : user?.allowedModules || [];
  const availableTabs = MODULE_TABS.filter((t) => allowed.includes(t.key));
  const [active, setActive] = useState(availableTabs[0]?.key || "");

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-card px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold">Preacher Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name || user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-3.5 w-3.5" /> Log Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {availableTabs.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              You don't have any modules granted yet. Please ask an admin to grant you access.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap gap-2">
              {availableTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActive(tab.key)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active === tab.key
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {active === "raise-receipt" && <RaiseReceiptTab />}
            {active === "my-donors" && <MyDonorsTab />}
            {active === "my-reports" && <MyReportsTab />}
          </>
        )}
      </div>
    </div>
  );
}
