"use client";

import { useState, useTransition } from "react";
import { updateBrand, deleteBrand } from "./actions";

type Brand = { id: string; name: string; isActive: boolean; _count: { akun: number } };

export default function BrandRow({ brand }: { brand: Brand }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(brand.name);
  const [isActive, setIsActive] = useState(brand.isActive);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const res = await updateBrand(brand.id, { name, isActive });
      if (res?.error) setError(res.error);
      else setIsEditing(false);
    });
  }

  function handleCancel() {
    setName(brand.name);
    setIsActive(brand.isActive);
    setError(null);
    setIsEditing(false);
  }

  function handleDelete() {
    if (!confirm(`Hapus brand "${brand.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteBrand(brand.id);
      if (res?.error) setError(res.error);
    });
  }

  if (isEditing) {
    return (
      <tr>
        <td>
          <input value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full" disabled={isPending} />
          {error && <p className="text-bad text-xs mt-1">{error}</p>}
        </td>
        <td>{brand._count.akun}</td>
        <td>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={isPending} />
            Aktif
          </label>
        </td>
        <td className="flex gap-2">
          <button onClick={handleSave} disabled={isPending} className="text-xs px-2 py-1 rounded bg-good/15 text-good hover:bg-good/25">{isPending ? "..." : "Simpan"}</button>
          <button onClick={handleCancel} disabled={isPending} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">Batal</button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="text-white">{brand.name}</td>
      <td>{brand._count.akun}</td>
      <td>
        <span className={`badge ${brand.isActive ? "bg-good/15 text-good" : "bg-bad/15 text-bad"}`}>
          {brand.isActive ? "Aktif" : "Nonaktif"}
        </span>
      </td>
      <td className="flex gap-2">
        <button onClick={() => setIsEditing(true)} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">Edit</button>
        <button onClick={handleDelete} disabled={isPending} className="text-xs px-2 py-1 rounded bg-bad/15 text-bad hover:bg-bad/25">{isPending ? "..." : "Hapus"}</button>
      </td>
      {error && <td colSpan={4} className="text-bad text-xs">{error}</td>}
    </tr>
  );
}
