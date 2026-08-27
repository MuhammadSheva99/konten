import { mockActivityLog } from "@/lib/mockData";

export default function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-muted text-sm mt-1">Riwayat seluruh aktivitas di sistem</p>
      </div>
      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Waktu</th><th>User</th><th>Aksi</th><th>Entitas</th><th>Detail</th></tr></thead>
          <tbody>
            {mockActivityLog.map((l) => (
              <tr key={l.id}>
                <td>{l.time}</td>
                <td className="text-white">{l.user}</td>
                <td><span className="badge bg-panel text-muted">{l.action}</span></td>
                <td>{l.entity}</td>
                <td className="text-muted">{l.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
