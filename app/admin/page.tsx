"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, IndianRupee, Image, CalendarDays, TrendingUp, Users, Utensils } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

const stats = [
  { label: "Total Visitors", value: "12,847", change: "+12%", icon: Eye, color: "text-blue-500" },
  { label: "Donations", value: "₹4,85,000", change: "+8%", icon: IndianRupee, color: "text-green-500" },
  { label: "Events This Month", value: "14", change: "+3", icon: CalendarDays, color: "text-primary" },
  { label: "Gallery Images", value: "342", change: "+28", icon: Image, color: "text-purple-500" },
  { label: "Devotees Registered", value: "1,256", change: "+45", icon: Users, color: "text-pink-500" },
  { label: "Meals Served", value: "8,450", change: "+320", icon: Utensils, color: "text-amber-500" },
];

const monthlyData = [
  { month: "Jan", visitors: 4200, donations: 180000 },
  { month: "Feb", visitors: 5100, donations: 220000 },
  { month: "Mar", visitors: 6800, donations: 310000 },
  { month: "Apr", visitors: 5900, donations: 280000 },
  { month: "May", visitors: 7200, donations: 350000 },
  { month: "Jun", visitors: 8500, donations: 420000 },
  { month: "Jul", visitors: 9100, donations: 485000 },
];

const sevaBreakdown = [
  { name: "Square Foot", value: 35 },
  { name: "Brick Seva", value: 25 },
  { name: "Anna Daan", value: 20 },
  { name: "Subhojanam", value: 15 },
  { name: "Other", value: 5 },
];
const COLORS = ["hsl(30,85%,50%)", "hsl(350,45%,35%)", "hsl(42,90%,55%)", "hsl(200,70%,50%)", "hsl(150,60%,40%)"];

const recentActivity = [
  { action: "New donation received", detail: "₹5,000 — Brick Seva", time: "2 min ago" },
  { action: "Event created", detail: "Janmashtami 2026 preparations", time: "1 hr ago" },
  { action: "Gallery updated", detail: "12 new darshan photos added", time: "3 hrs ago" },
  { action: "Devotee registered", detail: "Ramesh Kumar from Vizag", time: "5 hrs ago" },
  { action: "Subhojanam delivery", detail: "150 meals to King George Hospital", time: "Yesterday" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Temple Admin</p>
      </div>

      {
}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> {stat.change}
                    </span>
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
          <CardHeader>
            <CardTitle className="text-lg">Monthly Visitors & Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="visitors" fill="hsl(30,85%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seva Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sevaBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sevaBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex flex-wrap gap-3">
            {sevaBreakdown.map((item, i) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Donation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="donations"
                  stroke="hsl(350,45%,35%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(350,45%,35%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
