"use client";

import { useState, useTransition } from "react";
import { updatePlatform, deletePlatform } from "./actions";

type Platform = { id: string; name: string; _count: { akun: number } };

export default function PlatformRow({ platform }: { platform: Platform }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(platform.name);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const res = await updatePlatform(platform.id, name);
      if (res?.error) setError(res.error);
      else setIsEditing(false);
    });
  }

  function handleDelete() {
    if (!confirm(`Hapus platform "${platform.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setError(null);
    startTransition(async () => {
      const res = await deletePlatform(platform.id);
      if (res?.error) setError(res.error);
    });
  }

  if (isEditing) {
    return (
      <tr>
        <td>
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full" />
          {error && <p className="text-bad text-xs mt-1">{error}</p>}
        </td>
        <td>{platform._count.akun}</td>
        <td className="flex gap-2">
          <button onClick={handleSave} disabled={isPending} className="text-xs px-2 py-1 rounded bg-good/15 text-good hover:bg-good/25">{isPending ? "..." : "Simpan"}</button>
          <button onClick={() => { setName(platform.name); setIsEditing(false); setError(null); }} disabled={isPending} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">Batal</button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="text-white">{platform.name}</td>
      <td>{platform._count.akun}</td>
      <td className="flex gap-2">
        <button onClick={() => setIsEditing(true)} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">Edit</button>
        <button onClick={handleDelete} disabled={isPending} className="text-xs px-2 py-1 rounded bg-bad/15 text-bad hover:bg-bad/25">{isPending ? "..." : "Hapus"}</button>
      </td>
      {error && <td colSpan={3} className="text-bad text-xs">{error}</td>}
    </tr>
  );
}
