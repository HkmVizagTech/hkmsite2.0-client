"use client";

import { useEffect, useState } from "react";
import { Loader2, Truck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { authFetch } from "@/lib/authClient";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const rupees = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function AdminShopSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shopEnabled, setShopEnabled] = useState(true);
  const [flatShippingCharge, setFlatShippingCharge] = useState("0");
  const [freeShippingAbove, setFreeShippingAbove] = useState("0");
  const [deliveryEstimate, setDeliveryEstimate] = useState("");
  const [supportMobile, setSupportMobile] = useState("");
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_URL}/shop-admin/settings`);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Could not load shop settings.");
        const s = data.settings || {};
        setShopEnabled(s.shopEnabled !== false);
        setFlatShippingCharge(String(s.flatShippingCharge ?? 0));
        setFreeShippingAbove(String(s.freeShippingAbove ?? 0));
        setDeliveryEstimate(s.deliveryEstimate || "");
        setSupportMobile(s.supportMobile || "");
        setAnnouncement(s.announcement || "");
      } catch (err: any) {
        setError(err?.message || "Could not load shop settings. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const flat = Number(flatShippingCharge) || 0;
  const free = Number(freeShippingAbove) || 0;

  // A worked example beats the two numbers above it: staff set these rarely
  // and the "above" threshold is easy to read as "below".
  const shippingExample = () => {
    if (flat <= 0) return "Shipping is free on every order.";
    if (free <= 0) return `Every order pays ${rupees(flat)} shipping, whatever the value.`;
    const under = Math.max(1, Math.round((free * 0.6) / 10) * 10);
    return `A ${rupees(under)} order pays ${rupees(flat)} shipping. A ${rupees(free)} order ships free.`;
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await authFetch(`${API_URL}/shop-admin/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopEnabled,
          flatShippingCharge: flat,
          freeShippingAbove: free,
          deliveryEstimate: deliveryEstimate.trim(),
          supportMobile: supportMobile.trim(),
          announcement: announcement.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not save the settings.");
      toast({ title: "Shop settings saved." });
    } catch (err: any) {
      setError(err?.message || "Could not save the settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Shop Settings</h1>
        <p className="text-sm text-muted-foreground">Shipping rules, support details and the storefront banner.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
      )}

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <Label htmlFor="shop-enabled" className="text-base">
              Shop is open
            </Label>
            <p className="mt-0.5 text-sm text-muted-foreground">
              When closed, the catalogue stays visible so devotees can still browse products — only checkout is
              switched off, with a message in place of the Buy button.
            </p>
          </div>
          <Switch id="shop-enabled" checked={shopEnabled} onCheckedChange={setShopEnabled} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipping</CardTitle>
          <CardDescription>One flat charge, waived above a threshold.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="flat-shipping">Flat shipping charge (₹)</Label>
              <Input
                id="flat-shipping"
                type="number"
                min={0}
                value={flatShippingCharge}
                onChange={(e) => setFlatShippingCharge(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="free-shipping">Free shipping above (₹)</Label>
              <Input
                id="free-shipping"
                type="number"
                min={0}
                value={freeShippingAbove}
                onChange={(e) => setFreeShippingAbove(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Set to 0 to charge shipping on every order.</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="font-semibold text-foreground">How this reads to a customer</p>
              <p className="text-muted-foreground">{shippingExample()}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="delivery-estimate">Delivery estimate</Label>
            <Input
              id="delivery-estimate"
              value={deliveryEstimate}
              onChange={(e) => setDeliveryEstimate(e.target.value)}
              placeholder="Delivered in 5–7 working days"
            />
            <p className="text-xs text-muted-foreground">Shown on the product page and at checkout.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Storefront</CardTitle>
          <CardDescription>What devotees see and who they contact.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="support-mobile">Support mobile</Label>
            <Input
              id="support-mobile"
              value={supportMobile}
              onChange={(e) => setSupportMobile(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="announcement">Announcement banner</Label>
            <Textarea
              id="announcement"
              rows={3}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Janmashtami dispatch pauses from 14–17 September."
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to hide the banner. It sits above the product grid on every shop page.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="gap-1.5">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save settings
        </Button>
      </div>
    </div>
  );
}
