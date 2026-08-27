"use client";

import { useState, useTransition } from "react";
import { updatePic, deletePic } from "./actions";

type Pic = {
  id: string;
  name: string;
  username: string | null;
  isActive: boolean;
  _count: { akun: number };
};

export default function PicRow({ pic }: { pic: Pic }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(pic.name);
  const [username, setUsername] = useState(pic.username ?? "");
  const [isActive, setIsActive] = useState(pic.isActive);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const res = await updatePic(pic.id, {
        name,
        username,
        isActive,
        password: newPassword || undefined,
      });
      if (res?.error) setError(res.error);
      else {
        setIsEditing(false);
        setNewPassword("");
      }
    });
  }

  function handleCancel() {
    setName(pic.name);
    setUsername(pic.username ?? "");
    setIsActive(pic.isActive);
    setNewPassword("");
    setError(null);
    setIsEditing(false);
  }

  function handleDelete() {
    if (!confirm(`Hapus PIC "${pic.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setError(null);
    startTransition(async () => {
      const res = await deletePic(pic.id);
      if (res?.error) setError(res.error);
    });
  }

  if (isEditing) {
    return (
      <tr>
        <td>
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full mb-1" placeholder="Nama" />
          <input value={username} onChange={(e) => setUsername(e.target.value)} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full mb-1" placeholder="Username" />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isPending}
            className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full"
            placeholder="Password baru (kosongkan jika tidak diganti)"
          />
          {error && <p className="text-bad text-xs mt-1">{error}</p>}
        </td>
        <td>{pic._count.akun}</td>
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
      <td className="text-white">{pic.name}</td>
      <td>{pic._count.akun}</td>
      <td>
        <span className={`badge ${pic.isActive ? "bg-good/15 text-good" : "bg-bad/15 text-bad"}`}>
          {pic.isActive ? "Aktif" : "Nonaktif"}
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
