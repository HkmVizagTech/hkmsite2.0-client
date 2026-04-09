"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Mail, Phone, MapPin, Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const devotees = [
  { id: 1, name: "Ramesh Kumar", email: "ramesh.k@gmail.com", phone: "+91 98765 43210", city: "Visakhapatnam", joinedDate: "2024-01-15", donations: 5, totalAmount: 75000, status: "active" },
  { id: 2, name: "Lakshmi Devi", email: "lakshmi.d@gmail.com", phone: "+91 87654 32109", city: "Hyderabad", joinedDate: "2023-08-20", donations: 12, totalAmount: 125000, status: "active" },
  { id: 3, name: "Suresh Babu", email: "suresh.b@yahoo.com", phone: "+91 76543 21098", city: "Visakhapatnam", joinedDate: "2024-03-10", donations: 2, totalAmount: 10000, status: "active" },
  { id: 4, name: "Priya Sharma", email: "priya.s@gmail.com", phone: "+91 65432 10987", city: "Chennai", joinedDate: "2023-11-05", donations: 8, totalAmount: 45000, status: "active" },
  { id: 5, name: "Venkat Rao", email: "venkat.rao@outlook.com", phone: "+91 54321 09876", city: "Bangalore", joinedDate: "2022-05-18", donations: 20, totalAmount: 350000, status: "patron" },
  { id: 6, name: "Anitha Reddy", email: "anitha.r@gmail.com", phone: "+91 43210 98765", city: "Visakhapatnam", joinedDate: "2024-02-28", donations: 1, totalAmount: 1100, status: "new" },
  { id: 7, name: "Krishna Murthy", email: "krishna.m@gmail.com", phone: "+91 32109 87654", city: "Vijayawada", joinedDate: "2023-06-12", donations: 6, totalAmount: 66000, status: "active" },
  { id: 8, name: "Sita Devi", email: "sita.devi@gmail.com", phone: "+91 21098 76543", city: "Tirupati", joinedDate: "2023-09-01", donations: 15, totalAmount: 180000, status: "active" },
];

export default function AdminDevotees() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDevotee, setSelectedDevotee] = useState<(typeof devotees)[0] | null>(null);

  const filtered = devotees.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalDevotees = devotees.length;
  const patrons = devotees.filter(d => d.status === "patron").length;
  const newThisMonth = devotees.filter(d => d.joinedDate.startsWith("2024-03")).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Devotees</h1>
          <p className="text-muted-foreground">Manage registered devotees and donors</p>
        </div>
        <Button className="gap-2 bg-transparent border border-border text-foreground hover:bg-muted">
          <Download className="w-4 h-4" /> Export List
        </Button>
      </div>

      {
}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Devotees</p>
            <p className="text-2xl font-bold mt-1">{totalDevotees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Patrons</p>
            <p className="text-2xl font-bold mt-1">{patrons}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-2xl font-bold mt-1">{newThisMonth}</p>
          </CardContent>
        </Card>
      </div>

      {
}
      <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or email" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="patron">Patron</option>
          <option value="new">New</option>
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
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Contact</th>
                  <th className="px-4 py-3 text-left font-medium">City</th>
                  <th className="px-4 py-3 text-left font-medium">Donations</th>
                  <th className="px-4 py-3 text-left font-medium">Total</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                          {d.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">Joined {new Date(d.joinedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {d.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {d.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {d.city}</span>
                    </td>
                    <td className="px-4 py-3">{d.donations}</td>
                    <td className="px-4 py-3 font-semibold">₹{d.totalAmount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <Badge className={
                        d.status === "patron" ? "bg-amber-100 text-amber-700" :
                        d.status === "new" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      }>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button className="p-2 h-auto bg-transparent border border-border text-foreground hover:bg-muted" onClick={() => setSelectedDevotee(d)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {
}
      {selectedDevotee && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setSelectedDevotee(null)}>
          <div className="bg-background rounded-2xl p-6 w-full max-w-md shadow-elevated" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold">Devotee Details</h2>
              <button onClick={() => setSelectedDevotee(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                {selectedDevotee.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedDevotee.name}</h3>
                <Badge className="capitalize">{selectedDevotee.status}</Badge>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{selectedDevotee.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{selectedDevotee.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">City</span><span>{selectedDevotee.city}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span>{new Date(selectedDevotee.joinedDate).toLocaleDateString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Donations</span><span>{selectedDevotee.donations}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Amount</span><span className="font-semibold">₹{selectedDevotee.totalAmount.toLocaleString("en-IN")}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
