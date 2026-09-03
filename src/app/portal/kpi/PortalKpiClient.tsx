"use client";

import { useEffect, useState } from "react";
import { savePortalKpiInput } from "./actions";

type ResultItem = {
  id: string;
  name: string;
  metricDescription: string;
  weight: number;
  targetLabel: string;
  computeType: string;
  realisasiLabel: string;
  realisasiValue: number;
  score: number;
};

type CategoryResult = {
  templateId: string;
  templateName: string;
  category: string;
  items: ResultItem[];
  totalScore: number;
};

function currentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function PortalKpiClient({
  templatesByCategory,
}: {
  templatesByCategory: { category: string; templateId: string }[];
}) {
  const [period, setPeriod] = useState(currentPeriod());
  const [results, setResults] = useState<CategoryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const all: CategoryResult[] = [];
      for (const t of templatesByCategory) {
        const res = await fetch("/api/kpi/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId: t.templateId,
            scopeType: "PIC",
            scopeId: "me",
            period,
            category: t.category,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          all.push({ ...data, templateId: t.templateId, category: t.category });
        }
      }
      setResults(all);
    } catch {
      setError("Gagal memuat data KPI");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  function startEdit(item: ResultItem) {
    setEditingItemId(item.id);
    setEditValue(item.realisasiValue ? String(item.realisasiValue) : "");
  }

  async function handleSaveEdit(itemId: string) {
    setSavingEdit(true);
    const value = parseFloat(editValue);
    const res = await savePortalKpiInput(itemId, period, value);
    setSavingEdit(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    setEditingItemId(null);
    loadAll();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">KPI Kamu</h1>
          <p className="text-muted text-sm mt-1">Skor KPI berdasarkan bobot & target yang berlaku</p>
        </div>
        <div>
          <label className="stat-label block mb-1.5">Periode</label>
          <input
            type="month"
            className="input"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-bad text-xs">{error}</p>}
      {loading && <p className="text-muted text-sm">Menghitung...</p>}

      {!loading && results.length === 0 && (
        <div className="card text-muted text-sm text-center py-6">
          Belum ada template KPI yang sesuai dengan akun kamu.
        </div>
      )}

      {results.map((r) => (
        <div key={r.templateId} className="card overflow-x-auto">
          <div className="stat-label mb-3">{r.templateName}</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>KPI</th><th>Metrik</th><th>Bobot</th><th>Target</th>
                <th>Realisasi</th><th>Score</th>
              </tr>
            </thead>
            <tbody>
              {r.items.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td className="text-white">{item.name}</td>
                  <td className="text-muted text-xs max-w-[200px]">{item.metricDescription}</td>
                  <td>{item.weight}%</td>
                  <td>{item.targetLabel}</td>
                  <td>
                    {editingItemId === item.id ? (
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-24"
                          disabled={savingEdit}
                        />
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          disabled={savingEdit}
                          className="text-xs px-2 py-1 rounded bg-good/15 text-good"
                        >
                          {savingEdit ? "..." : "OK"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{item.realisasiLabel}</span>
                        {item.computeType === "MANUAL" && (
                          <button
                            onClick={() => startEdit(item)}
                            className="text-xs text-accent2 hover:underline"
                          >
                            Edit
                          </button>
                        )}
                        {item.computeType !== "MANUAL" && (
                          <span className="badge bg-good/15 text-good text-[10px]">AUTO</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="text-white font-medium">{item.score}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-white/20">
                <td colSpan={6} className="text-right text-white font-semibold pr-4">TOTAL IPK</td>
                <td className="text-accent font-bold text-lg">{r.totalScore}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}