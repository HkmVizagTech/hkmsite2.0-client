"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";

const pageViews = [
  { page: "Home", views: 4520 },
  { page: "Gallery", views: 3210 },
  { page: "Events", views: 2890 },
  { page: "About", views: 1860 },
  { page: "Sevas", views: 1540 },
  { page: "Contact", views: 1120 },
  { page: "Schedule", views: 980 },
];

const weeklyTraffic = [
  { day: "Mon", users: 320 },
  { day: "Tue", users: 410 },
  { day: "Wed", users: 380 },
  { day: "Thu", users: 520 },
  { day: "Fri", users: 490 },
  { day: "Sat", users: 680 },
  { day: "Sun", users: 890 },
];

const monthlyGrowth = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1450 },
  { month: "Mar", users: 1800 },
  { month: "Apr", users: 2100 },
  { month: "May", users: 2600 },
  { month: "Jun", users: 3200 },
  { month: "Jul", users: 3900 },
];

const deviceStats = [
  { device: "Mobile", percentage: 62 },
  { device: "Desktop", percentage: 30 },
  { device: "Tablet", percentage: 8 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Website traffic and engagement insights</p>
      </div>

      {
}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Page Views", value: "48,230" },
          { label: "Unique Visitors", value: "12,847" },
          { label: "Avg. Session", value: "3m 42s" },
          { label: "Bounce Rate", value: "34.2%" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {
}
        <Card>
          <CardHeader><CardTitle className="text-lg">Weekly Traffic</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklyTraffic}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="users" fill="hsl(30,85%,50%/0.2)" stroke="hsl(30,85%,50%)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {
}
        <Card>
          <CardHeader><CardTitle className="text-lg">User Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyGrowth}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="hsl(350,45%,35%)" strokeWidth={2} dot={{ fill: "hsl(350,45%,35%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {
}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Top Pages</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={pageViews} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="page" type="category" tick={{ fontSize: 12 }} width={70} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(42,90%,55%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {
}
        <Card>
          <CardHeader><CardTitle className="text-lg">Device Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-5 pt-2">
              {deviceStats.map((d) => (
                <div key={d.device}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{d.device}</span>
                    <span className="font-medium">{d.percentage}%</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
