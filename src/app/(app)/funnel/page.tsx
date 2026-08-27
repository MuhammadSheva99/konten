import { mockFunnel } from "@/lib/mockData";

export default function FunnelPage() {
  const max = mockFunnel[0].value || 1;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Funnel Analysis</h1>
        <p className="text-muted text-sm mt-1">Views → Profile Visit → Website Click → WhatsApp/DM → Leads → Closing</p>
      </div>
      <div className="card space-y-4">
        {mockFunnel.map((s, i) => {
          const width = Math.max(4, Math.round((s.value / max) * 100));
          const prev = i > 0 ? mockFunnel[i - 1].value : null;
          const conv = prev && prev > 0 ? Math.round((s.value / prev) * 1000) / 10 : null;
          return (
            <div key={s.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white font-medium">{s.label}</span>
                <span className="text-muted">{s.value.toLocaleString("id-ID")}{conv !== null && <span className="ml-2 text-accent">({conv}% dari tahap sebelumnya)</span>}</span>
              </div>
              <div className="h-8 rounded-lg bg-surface overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent to-accent2" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
