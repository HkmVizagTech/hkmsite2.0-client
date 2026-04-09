"use client";

import {
  LayoutDashboard,
  CalendarDays,
  Image,
  FileText,
  Users,
  Settings,
  LogOut,
  BarChart3,
  Bell,
  IndianRupee,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Donations", url: "/admin/donations", icon: IndianRupee },
];

const contentItems = [
  { title: "Events", url: "/admin/events", icon: CalendarDays },
  { title: "Important Dates", url: "/admin/important-dates", icon: CalendarDays },
  { title: "Gallery", url: "/admin/gallery", icon: Image },
  { title: "Festivals", url: "/admin/festivals", icon: Image },
  { title: "Content", url: "/admin/content", icon: FileText },
];

const systemItems = [
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Devotees", url: "/admin/devotees", icon: Users },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (url: string) =>
    url === "/admin" ? pathname === "/admin" : pathname.startsWith(url);

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-semibold mb-1">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-primary/8 ${
                      active
                        ? "bg-primary/12 text-primary font-semibold shadow-sm"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                    )}
                    <item.icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`} />
                    {!collapsed && <span className="flex-1">{item.title}</span>}
                    {!collapsed && active && (
                      <ChevronRight className="w-3.5 h-3.5 text-primary/50" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-card/50 backdrop-blur-sm">
        {
}
        <div className={`p-5 ${collapsed ? "px-2 py-4" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-warm">
              <span className="text-primary-foreground font-heading font-bold text-base">ॐ</span>
            </div>
            {!collapsed && (
              <div>
                <span className="font-heading font-bold text-base leading-tight block text-foreground">
                  HKM Vizag
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">
                  Admin Panel
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator className="mx-4 w-auto opacity-50" />

        <div className="py-2 space-y-1">
          {renderGroup("Overview", mainItems)}
          {renderGroup("Manage", contentItems)}
          {renderGroup("System", systemItems)}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4 bg-card/30">
        {!collapsed && user && (
          <div className="mb-3 px-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">
                  {user.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
