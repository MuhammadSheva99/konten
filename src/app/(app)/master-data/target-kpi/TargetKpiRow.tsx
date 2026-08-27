"use client";

import { useState, useTransition } from "react";
import { updateTargetKpi, deleteTargetKpi } from "./actions";

type Option = { id: string; name: string };
type TargetKpi = {
  id: string;
  period: string;
  targetPosting: number;
  targetViews: number;
  targetLeads: number;
  picId: string;
  brandId: string;
  pic: { name: string };
  brand: { name: string };
};

export default function TargetKpiRow({
  item,
  pics,
  brands,
}: {
  item: TargetKpi;
  pics: Option[];
  brands: Option[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [period, setPeriod] = useState(item.period);
  const [picId, setPicId] = useState(item.picId);
  const [brandId, setBrandId] = useState(item.brandId);
  const [targetPosting, setTargetPosting] = useState(item.targetPosting);
  const [targetViews, setTargetViews] = useState(item.targetViews);
  const [targetLeads, setTargetLeads] = useState(item.targetLeads);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const res = await updateTargetKpi(item.id, {
        period, picId, brandId, targetPosting, targetViews, targetLeads,
      });
      if (res?.error) setError(res.error);
      else setIsEditing(false);
    });
  }

  function handleCancel() {
    setPeriod(item.period); setPicId(item.picId); setBrandId(item.brandId);
    setTargetPosting(item.targetPosting); setTargetViews(item.targetViews); setTargetLeads(item.targetLeads);
    setError(null); setIsEditing(false);
  }

  function handleDelete() {
    if (!confirm(`Hapus target KPI periode "${item.period}" untuk ${item.pic.name}?`)) return;
    startTransition(() => deleteTargetKpi(item.id));
  }

  if (isEditing) {
    return (
      <tr>
        <td>
          <input value={period} onChange={(e) => setPeriod(e.target.value)} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full" />
          {error && <p className="text-bad text-xs mt-1">{error}</p>}
        </td>
        <td>
          <select value={picId} onChange={(e) => setPicId(e.target.value)} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full">
            {pics.map((p) => <option key={p.id} value={p.id} className="bg-black">{p.name}</option>)}
          </select>
        </td>
        <td>
          <select value={brandId} onChange={(e) => setBrandId(e.target.value)} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full">
            {brands.map((b) => <option key={b.id} value={b.id} className="bg-black">{b.name}</option>)}
          </select>
        </td>
        <td><input type="number" value={targetPosting} onChange={(e) => setTargetPosting(Number(e.target.value))} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-20" /></td>
        <td><input type="number" value={targetViews} onChange={(e) => setTargetViews(Number(e.target.value))} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-24" /></td>
        <td><input type="number" value={targetLeads} onChange={(e) => setTargetLeads(Number(e.target.value))} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-20" /></td>
        <td className="flex gap-2">
          <button onClick={handleSave} disabled={isPending} className="text-xs px-2 py-1 rounded bg-good/15 text-good hover:bg-good/25">{isPending ? "..." : "Simpan"}</button>
          <button onClick={handleCancel} disabled={isPending} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">Batal</button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="text-white">{item.period}</td>
      <td>{item.pic.name}</td>
      <td>{item.brand.name}</td>
      <td>{item.targetPosting}</td>
      <td>{item.targetViews.toLocaleString("id-ID")}</td>
      <td>{item.targetLeads}</td>
      <td className="flex gap-2">
        <button onClick={() => setIsEditing(true)} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">Edit</button>
        <button onClick={handleDelete} disabled={isPending} className="text-xs px-2 py-1 rounded bg-bad/15 text-bad hover:bg-bad/25">{isPending ? "..." : "Hapus"}</button>
      </td>
    </tr>
  );
}
