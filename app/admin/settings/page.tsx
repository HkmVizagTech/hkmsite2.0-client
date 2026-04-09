"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, Bell, Palette, Shield, LogOut, Save, Eye, EyeOff } from "lucide-react";

export default function AdminSettings() {
  const { logout, user } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState({
    name: user?.name || "Temple Admin",
    email: user?.email || "admin@harekrishnavizag.org",
  });
  
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  
  const [notifications, setNotifications] = useState({
    newDonation: true,
    newDevotee: true,
    eventReminders: true,
    weeklyReport: false,
  });
  
  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactMode: false,
  });

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        {
}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input value={profile.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input type="email" value={profile.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <Button><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
          </CardContent>
        </Card>

        {
}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" /> Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <label className="text-sm font-medium mb-1 block">Current Password</label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.current}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({ ...passwordForm, current: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">New Password</label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.new}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({ ...passwordForm, new: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Confirm New Password</label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.confirm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowPasswords(!showPasswords)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPasswords ? "Hide" : "Show"} passwords
              </button>
            </div>
            <Button><Lock className="w-4 h-4 mr-2" /> Update Password</Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "newDonation", label: "New Donation Alerts", desc: "Get notified when a new donation is received" },
              { key: "newDevotee", label: "New Devotee Registration", desc: "Get notified when someone registers" },
              { key: "eventReminders", label: "Event Reminders", desc: "Reminders for upcoming temple events" },
              { key: "weeklyReport", label: "Weekly Report", desc: "Receive a weekly summary email" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {
}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5" /> Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme for the admin panel</p>
              </div>
              <Switch
                checked={appearance.darkMode}
                onCheckedChange={(checked) => setAppearance({ ...appearance, darkMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Compact Mode</p>
                <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
              </div>
              <Switch
                checked={appearance.compactMode}
                onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {
}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button className="bg-transparent border border-border text-foreground hover:bg-muted">Enable 2FA</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-muted-foreground">Manage devices where you&apos;re logged in</p>
              </div>
              <Button className="bg-transparent border border-border text-foreground hover:bg-muted">View Sessions</Button>
            </div>
          </CardContent>
        </Card>

        {
}
        <Card className="border-destructive/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">Sign Out</p>
                <p className="text-sm text-muted-foreground">Sign out of the admin panel</p>
              </div>
              <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
