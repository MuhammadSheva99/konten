"use client";

import { useMemo, useState } from "react";

type Option = { id: string; name: string };
type Row = {
  id: string;
  postedAt: Date;
  brand: string;
  platform: string;
  akun: string;
  pic: string;
  views: number;
  leads: number;
};

export default function LaporanClient({ rows, pics }: { rows: Row[]; pics: Option[] }) {
  const [picFilter, setPicFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [appliedFilter, setAppliedFilter] = useState({ pic: "", from: "", to: "" });

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (appliedFilter.pic && r.pic !== appliedFilter.pic) return false;
      const posted = new Date(r.postedAt);
      if (appliedFilter.from && posted < new Date(appliedFilter.from)) return false;
      if (appliedFilter.to) {
        const to = new Date(appliedFilter.to);
        to.setHours(23, 59, 59, 999);
        if (posted > to) return false;
      }
      return true;
    });
  }, [rows, appliedFilter]);

  function handleFilter() {
    setAppliedFilter({ pic: picFilter, from: dateFrom, to: dateTo });
  }

  function handleExportCsv() {
    const header = ["Tanggal", "Brand", "Platform", "Akun", "PIC", "Views", "Leads"];
    const csvRows = filtered.map((r) => [
      new Date(r.postedAt).toLocaleDateString("id-ID"),
      r.brand,
      r.platform,
      `@${r.akun}`,
      r.pic,
      r.views,
      r.leads,
    ]);

    const csvContent = [header, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Laporan</h1>
          <p className="text-muted text-sm mt-1">Rekap harian/mingguan/bulanan siap diexport</p>
        </div>
        <div className="flex items-end gap-2 flex-wrap">
          <div>
            <label className="stat-label block mb-1">PIC</label>
            <select className="input" value={picFilter} onChange={(e) => setPicFilter(e.target.value)}>
              <option value="">Semua PIC</option>
              {pics.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="stat-label block mb-1">Dari</label>
            <input className="input" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div>
            <label className="stat-label block mb-1">Sampai</label>
            <input className="input" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <button className="btn-secondary" onClick={handleFilter}>Filter</button>
          <button className="btn-primary" onClick={handleExportCsv}>Export CSV</button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Tanggal</th><th>Brand</th><th>Platform</th><th>Akun</th><th>PIC</th><th>Views</th><th>Leads</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.postedAt).toLocaleDateString("id-ID")}</td>
                <td>{r.brand}</td>
                <td>{r.platform}</td>
                <td className="text-white">@{r.akun}</td>
                <td>{r.pic}</td>
                <td>{r.views.toLocaleString("id-ID")}</td>
                <td>{r.leads}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-muted text-center py-6">Tidak ada data untuk filter ini.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
