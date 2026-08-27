"use client";
import { mockPendingApprovals, mockApprovalHistory } from "@/lib/mockData";
import { useState } from "react";

export default function ApprovalPage() {
  const [pending, setPending] = useState(mockPendingApprovals);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Approval Konten</h1>
        <p className="text-muted text-sm mt-1">Review konten yang disubmit PIC sebelum dijadwalkan</p>
      </div>
      <div className="card">
        <div className="stat-label mb-3">Menunggu Persetujuan ({pending.length})</div>
        <div className="space-y-3">
          {pending.map((a) => (
            <div key={a.id} className="flex items-center justify-between border border-border rounded-lg p-3">
              <div>
                <div className="text-white text-sm font-medium">{a.title}</div>
                <div className="text-xs text-muted mt-0.5">{a.brand} · @{a.akun} · Submit oleh {a.submittedBy} · Revisi ke-{a.revision}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary py-1.5 text-xs" onClick={() => setPending((p) => p.filter((x) => x.id !== a.id))}>Approve</button>
                <button className="btn-secondary py-1.5 text-xs hover:border-bad hover:text-bad" onClick={() => setPending((p) => p.filter((x) => x.id !== a.id))}>Reject</button>
              </div>
            </div>
          ))}
          {pending.length === 0 && <div className="text-muted text-sm text-center py-6">Tidak ada konten menunggu approval.</div>}
        </div>
      </div>
      <div className="card overflow-x-auto">
        <div className="stat-label mb-3">Riwayat Revisi</div>
        <table className="data-table">
          <thead><tr><th>Konten</th><th>Status</th><th>Catatan</th><th>Diputuskan Oleh</th><th>Tanggal</th></tr></thead>
          <tbody>
            {mockApprovalHistory.map((h) => (
              <tr key={h.id}>
                <td className="text-white">{h.title}</td>
                <td><span className={`badge ${h.status === "APPROVED" ? "bg-good/15 text-good" : "bg-bad/15 text-bad"}`}>{h.status}</span></td>
                <td className="text-muted">{h.note}</td>
                <td>{h.decidedBy}</td>
                <td>{h.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
