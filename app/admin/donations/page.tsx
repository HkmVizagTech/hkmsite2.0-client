"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee, Search, Download, Eye, TrendingUp, Users, Calendar, CreditCard, Smartphone, Banknote, X
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';


const monthlyDonations = [
  { month: "Oct", amount: 185000 },
  { month: "Nov", amount: 220000 },
  { month: "Dec", amount: 340000 },
  { month: "Jan", amount: 280000 },
  { month: "Feb", amount: 310000 },
  { month: "Mar", amount: 145700 },
];

const sevaWise = [
  { name: "Square Foot", value: 42 },
  { name: "Brick Seva", value: 22 },
  { name: "Anna Daan", value: 18 },
  { name: "Subhojanam", value: 12 },
  { name: "General", value: 6 },
];

const COLORS = ["hsl(30,85%,50%)", "hsl(350,45%,35%)", "hsl(42,90%,55%)", "hsl(200,70%,50%)", "hsl(150,60%,40%)"];

const methodIcons: Record<string, typeof CreditCard> = {
  UPI: Smartphone,
  Card: CreditCard,
  "Net Banking": Banknote,
  Cash: IndianRupee,
};

export default function AdminDonations() {
  const [search, setSearch] = useState("");
  const [sevaFilter, setSevaFilter] = useState("all");
  const [donations, setDonations] = useState<any[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchDonations(); }, [page, limit]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/donations?page=${page}&limit=${limit}`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setDonations(data.donations || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filtered = donations.filter((d: any) => {
    const lowerSearch = search.toLowerCase();
    const donorStr = (d.donor || d.donorName || d.donorEmail || "").toString();
    const idStr = (d.transactionId || d.razorpayOrderId || d._id || d.id || "").toString();
    const emailStr = (d.email || d.donorEmail || "").toString();

    const matchSearch =
      donorStr.toLowerCase().includes(lowerSearch) ||
      idStr.toLowerCase().includes(lowerSearch) ||
      emailStr.toLowerCase().includes(lowerSearch);
    const matchSeva = sevaFilter === "all" || d.seva === sevaFilter;
    return matchSearch && matchSeva;
  });

  const totalCollected = donations.filter((d: any) => d.status === "completed").reduce((s: number, d: any) => s + (d.amount || 0), 0);
  const totalDonors = new Set(donations.map((d: any) => d.donorEmail || d.donor)).size;
  const thisMonth = donations.filter((d: any) => (d.date || '').toString().startsWith("2026-03") && d.status === "completed").reduce((s: number, d: any) => s + (d.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Donations & Payments</h1>
          <p className="text-muted-foreground">Track all seva donations and payment details</p>
        </div>
        <Button className="gap-2 bg-transparent border border-border text-foreground hover:bg-muted">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {
}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Collected", value: `₹${totalCollected.toLocaleString("en-IN")}`, icon: IndianRupee, sub: "All time", color: "text-green-600" },
          { label: "This Month", value: `₹${thisMonth.toLocaleString("en-IN")}`, icon: TrendingUp, sub: "March 2026", color: "text-primary" },
          { label: "Total Donors", value: totalDonors.toString(), icon: Users, sub: "Unique donors", color: "text-blue-500" },
          { label: "Transactions", value: donations.length.toString(), icon: Calendar, sub: "All records", color: "text-purple-500" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <span className="text-xs text-muted-foreground">{stat.sub}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {
}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Monthly Donations</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyDonations}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Bar dataKey="amount" fill="hsl(30,85%,50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Seva-wise Split</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sevaWise} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {sevaWise.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex flex-wrap gap-3">
            {sevaWise.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {
}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, email or TXN ID" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={sevaFilter}
          onChange={(e) => setSevaFilter(e.target.value)}
        >
          <option value="all">All Sevas</option>
          <option value="Square Foot Seva">Square Foot Seva</option>
          <option value="Brick Seva">Brick Seva</option>
          <option value="Anna Daan">Anna Daan</option>
          <option value="Subhojanam">Subhojanam</option>
          <option value="General Donation">General Donation</option>
        </select>
      </div>

      {
}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">TXN / Order</th>
                  <th className="px-4 py-3 text-left font-medium">Donor</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Method</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                    {filtered.map((d) => {
                  const MethodIcon = methodIcons[d.method] || IndianRupee;
                  return (
                    <tr key={d.id} className="border-b hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs">{d.transactionId || d.razorpayOrderId || d._id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{d.donor}</div>
                        <div className="text-xs text-muted-foreground">{d.email}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold">₹{(d.amount || 0).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <MethodIcon className="w-4 h-4 text-muted-foreground" />
                          <span>{d.method || (d.razorpayPaymentId ? 'Card/UPI' : 'N/A')}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Order: {d.razorpayOrderId || '-'}</div>
                        <div className="text-xs text-muted-foreground">Payment: {d.razorpayPaymentId || '-'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={(d.status === "paid" || d.status === 'completed') ? "bg-green-100 text-green-700" : d.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}>
                          {d.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{new Date(d.date).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button className="p-2 h-auto bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setSelectedDonation(d)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button className="p-2 h-auto bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => navigator.clipboard.writeText(d.razorpayOrderId || d.transactionId || '')}>Copy</Button>
                      </td>
                    </tr>
                  );
                  })}
                  {filtered.length === 0 && !loading && (
                    <tr><td colSpan={7} className="text-center py-6 text-muted-foreground">No donations found.</td></tr>
                  )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

        {
}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}</div>
          <div className="flex items-center gap-2">
            <Button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
            <div className="px-2">Page</div>
            <Input value={String(page)} onChange={(e) => setPage(Math.max(1, Number(e.target.value || 1)))} className="w-16 text-center" />
            <div className="px-2">Limit</div>
            <select value={String(limit)} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="rounded-md border border-input bg-background px-2 py-1 text-sm">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <Button disabled={page * limit >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>

      {
}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setSelectedDonation(null)}>
          <div className="bg-background rounded-2xl p-6 w-full max-w-md shadow-elevated" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold">Donation Details</h2>
              <button onClick={() => setSelectedDonation(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">TXN ID</span><span className="font-mono">{selectedDonation.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Donor</span><span>{selectedDonation.donor}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{selectedDonation.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{selectedDonation.phone || selectedDonation.donorMobile}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold">₹{(selectedDonation.amount || 0).toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span className="font-mono">{selectedDonation.razorpayOrderId || '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Payment ID</span><span className="font-mono">{selectedDonation.razorpayPaymentId || '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Receipt</span><span>{selectedDonation.receiptNumber || selectedDonation.receipt || '-'}</span></div>
              {selectedDonation.wantPrasadam && selectedDonation.prasadamAddress && (
                <div className="border-t pt-3">
                  <div className="text-sm text-muted-foreground mb-2">Maha Prasadam Delivery</div>
                  <div className="text-xs">{selectedDonation.prasadamAddress.doorNo}, {selectedDonation.prasadamAddress.house}</div>
                  <div className="text-xs">{selectedDonation.prasadamAddress.street}, {selectedDonation.prasadamAddress.area}</div>
                  <div className="text-xs">{selectedDonation.prasadamAddress.city} - {selectedDonation.prasadamAddress.pincode}, {selectedDonation.prasadamAddress.state}</div>
                </div>
              )}
              <div className="pt-3 flex gap-2">
                <Button onClick={async () => {
                  try {
                    await fetch(`${apiUrl}/donations/${selectedDonation._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
                    alert('Receipt resend requested');
                  } catch (err) { console.error(err); alert('Failed'); }
                }}>Resend Receipt</Button>
                <Button variant="outline" onClick={() => { navigator.clipboard.writeText(JSON.stringify(selectedDonation, null, 2)); alert('Copied'); }}>Copy JSON</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
