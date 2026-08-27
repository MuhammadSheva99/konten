"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function PerformanceChart({ data }: { data: { date: string; views: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5b8def" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#5b8def" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3f" vertical={false} />
        <XAxis dataKey="date" stroke="#8b8fa3" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#8b8fa3" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "#1f2230", border: "1px solid #2a2e3f", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#e6e7ee" }}
        />
        <Area type="monotone" dataKey="views" stroke="#5b8def" strokeWidth={2} fill="url(#viewsFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
