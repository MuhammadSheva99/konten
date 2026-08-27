"use client";

import { useState } from "react";

type Option = { id: string; name: string };
type Akun = {
  id: string;
  username: string;
  status: "ACTIVE" | "INACTIVE";
  lastPostAt: Date | null;
  brand: { name: string };
  platform: { name: string };
  pic: { name: string } | null;
};

export default function MonitoringClient({ akunList, pics }: { akunList: Akun[]; pics: Option[] }) {
  const [picFilter, setPicFilter] = useState("");

  const filtered = akunList.filter((a) => !picFilter || a.pic?.name === picFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Monitoring Multi Akun</h1>
          <p className="text-muted text-sm mt-1">Status, jumlah posting, dan peringatan akun yang tidak aktif</p>
        </div>
        <div>
          <label className="stat-label block mb-1.5">Filter PIC</label>
          <select
            className="bg-transparent border border-white/20 rounded px-3 py-1.5 text-white text-sm"
            value={picFilter}
            onChange={(e) => setPicFilter(e.target.value)}
          >
            <option value="" className="bg-black">Semua PIC</option>
            {pics.map((p) => <option key={p.id} value={p.name} className="bg-black">{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Akun</th><th>Brand</th><th>Platform</th><th>PIC</th><th>Posting Terakhir</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const isWarning = a.status === "INACTIVE";
              return (
                <tr key={a.id}>
                  <td className="text-white">@{a.username}</td>
                  <td>{a.brand.name}</td>
                  <td>{a.platform.name}</td>
                  <td>{a.pic?.name ?? "-"}</td>
                  <td>{a.lastPostAt ? new Date(a.lastPostAt).toLocaleDateString("id-ID") : "-"}</td>
                  <td>
                    {isWarning ? (
                      <span className="badge bg-bad/15 text-bad">idak aktif</span>
                    ) : (
                      <span className="badge bg-good/15 text-good">Sehat</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-muted text-center py-6">Tidak ada akun untuk filter ini.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
