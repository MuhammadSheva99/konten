"use client";

import { useState } from "react";

type PicRow = { name: string; views: number; posting: number; leads: number };
type AkunRow = { username: string; brand: string; views: number };

export default function LeaderboardClient({
  picRows,
  akunRows,
}: {
  picRows: PicRow[];
  akunRows: AkunRow[];
}) {
  const [view, setView] = useState<"PIC" | "AKUN">("PIC");

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Leaderboard</h1>
          <p className="text-muted text-sm mt-1">Ranking bulan berjalan berdasarkan performa</p>
        </div>
        <div>
          <label className="stat-label block mb-1.5">Tampilkan</label>
          <select
            className="bg-transparent border border-white/20 rounded px-3 py-1.5 text-white text-sm w-auto"
            value={view}
            onChange={(e) => setView(e.target.value as "PIC" | "AKUN")}
          >
            <option value="PIC" className="bg-black">Ranking PIC</option>
            <option value="AKUN" className="bg-black">Ranking Akun</option>
          </select>
        </div>
      </div>

      {view === "PIC" && (
        <div className="card">
          <div className="stat-label mb-3">Ranking PIC</div>
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Nama</th><th>Views</th><th>Posting</th><th>Leads</th></tr>
            </thead>
            <tbody>
              {picRows.map((p, i) => (
                <tr key={p.name}>
                  <td>{i + 1}</td>
                  <td className="text-white">{p.name}</td>
                  <td className="text-accent font-medium">{p.views.toLocaleString("id-ID")}</td>
                  <td>{p.posting}</td>
                  <td>{p.leads}</td>
                </tr>
              ))}
              {picRows.length === 0 && (
                <tr><td colSpan={5} className="text-muted text-center py-6">Tidak ada data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {view === "AKUN" && (
        <div className="card">
          <div className="stat-label mb-3">Ranking Akun</div>
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Akun</th><th>Brand</th><th>Views</th></tr>
            </thead>
            <tbody>
              {akunRows.map((a, i) => (
                <tr key={a.username}>
                  <td>{i + 1}</td>
                  <td className="text-white">@{a.username}</td>
                  <td>{a.brand}</td>
                  <td className="text-accent font-medium">{a.views.toLocaleString("id-ID")}</td>
                </tr>
              ))}
              {akunRows.length === 0 && (
                <tr><td colSpan={4} className="text-muted text-center py-6">Tidak ada data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}