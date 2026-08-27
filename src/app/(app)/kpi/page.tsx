import { mockKpiRows } from "@/lib/mockData";

function Bar({ value }: { value: number }) {
  const color = value >= 100 ? "bg-good" : value >= 60 ? "bg-warn" : "bg-bad";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-surface overflow-hidden"><div className={`h-full ${color}`} style={{ width: `${Math.min(100, value)}%` }} /></div>
      <span className="text-xs w-10">{value}%</span>
    </div>
  );
}

export default function KpiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">KPI Otomatis</h1>
        <p className="text-muted text-sm mt-1">Dihitung otomatis dari data Posting Tracker & Performance Tracker vs. Target KPI bulan berjalan</p>
      </div>
      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>PIC</th><th>Brand</th><th>Ach. Posting</th><th>Ach. Views</th><th>Ach. Profile Visit</th><th>Ach. Website Click</th><th>Ach. Leads</th><th>Engagement Rate</th></tr></thead>
          <tbody>
            {mockKpiRows.map((r, i) => (
              <tr key={i}>
                <td className="text-white">{r.pic}</td>
                <td>{r.brand}</td>
                <td><Bar value={r.achPosting} /></td>
                <td><Bar value={r.achViews} /></td>
                <td><Bar value={r.achProfileVisit} /></td>
                <td><Bar value={r.achWebsiteClick} /></td>
                <td><Bar value={r.achLeads} /></td>
                <td>{r.engagementRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
