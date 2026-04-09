"use client";

import { useEffect, useState } from "react";

type ImportantDate = {
  _id: string;
  title: string;
  date: string;
  description?: string;
  type: "Ekadashi" | "Festival" | "Other";
};

export default function ImportantDatesPage() {
  const [dates, setDates] = useState<ImportantDate[]>([]);

  useEffect(() => {
    fetch("/api/important-dates")
      .then((res) => res.json())
      .then(setDates);
  }, []);

  const grouped = dates.reduce((acc, date) => {
    const d = new Date(date.date);
    const key = d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear();
    if (!acc[key]) acc[key] = [];
    acc[key].push(date);
    return acc;
  }, {} as Record<string, ImportantDate[]>);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Important Dates & Ekadashis</h1>
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{month}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((date) => (
              <div key={date._id} className="border rounded p-4 shadow bg-white">
                <div className="font-bold text-lg mb-1">{date.title}</div>
                <div className="text-sm text-gray-500 mb-1">{new Date(date.date).toLocaleDateString()} ({date.type})</div>
                {date.description && <div className="text-xs text-gray-700 mb-1">{date.description}</div>}
                {date.type === "Festival" && <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-semibold">Festival</span>}
                {date.type === "Ekadashi" && <span className="inline-block px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-semibold">Ekadashi</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
