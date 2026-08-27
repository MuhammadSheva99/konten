"use client";

import { useState, useTransition } from "react";
import { updateAkun, deleteAkun } from "./actions";

type Option = { id: string; name: string };
type Akun = {
  id: string; username: string; status: "ACTIVE" | "INACTIVE"; category: "OFFICIAL" | "OUTLET"; apiConnected: boolean;
  brandId: string; platformId: string; picId: string | null;
  brand: { name: string }; platform: { name: string }; pic: { name: string } | null;
};

export default function AkunRow({ akun, brands, platforms, pics }: { akun: Akun; brands: Option[]; platforms: Option[]; pics: Option[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(akun.username);
  const [brandId, setBrandId] = useState(akun.brandId);
  const [platformId, setPlatformId] = useState(akun.platformId);
  const [picId, setPicId] = useState(akun.picId ?? "");
  const [status, setStatus] = useState(akun.status);
  const [category, setCategory] = useState(akun.category);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const res = await updateAkun(akun.id, {
        username, brandId, platformId, picId: picId || null, status, category, apiConnected: akun.apiConnected,
      });
      if (res?.error) setError(res.error);
      else setIsEditing(false);
    });
  }

  function handleCancel() {
    setUsername(akun.username); setBrandId(akun.brandId); setPlatformId(akun.platformId);
    setPicId(akun.picId ?? ""); setStatus(akun.status); setCategory(akun.category);
    setError(null); setIsEditing(false);
  }

  function handleDelete() {
    if (!confirm(`Hapus akun "@${akun.username}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteAkun(akun.id);
      if (res?.error) setError(res.error);
    });
  }

  async function handleSync() {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/tiktok/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ akunId: akun.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSyncMessage(data.error ?? "Gagal sync.");
      } else {
        setSyncMessage(`Berhasil sync ${data.synced} video.`);
      }
    } catch {
      setSyncMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsSyncing(false);
    }
  }

  if (isEditing) {
    return (
      <tr>
        <td>
          <input value={username} onChange={(e) => setUsername(e.target.value)} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full" />
          {error && <p className="text-bad text-xs mt-1">{error}</p>}
        </td>
        <td>
          <select value={brandId} onChange={(e) => setBrandId(e.target.value)} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full">
            {brands.map((b) => <option key={b.id} value={b.id} className="bg-black">{b.name}</option>)}
          </select>
        </td>
        <td>
          <select value={platformId} onChange={(e) => setPlatformId(e.target.value)} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full">
            {platforms.map((p) => <option key={p.id} value={p.id} className="bg-black">{p.name}</option>)}
          </select>
        </td>
        <td>
          <select value={picId} onChange={(e) => setPicId(e.target.value)} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full">
            <option value="" className="bg-black">- Belum ditentukan -</option>
            {pics.map((p) => <option key={p.id} value={p.id} className="bg-black">{p.name}</option>)}
          </select>
        </td>
        <td>
          <select value={category} onChange={(e) => setCategory(e.target.value as "OFFICIAL" | "OUTLET")} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full">
            <option value="OFFICIAL" className="bg-black">Official</option>
            <option value="OUTLET" className="bg-black">Outlet</option>
          </select>
        </td>
        <td>
          <select value={status} onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")} disabled={isPending} className="bg-transparent border border-white/20 rounded px-2 py-1 text-white text-sm w-full">
            <option value="ACTIVE" className="bg-black">ACTIVE</option>
            <option value="INACTIVE" className="bg-black">INACTIVE</option>
          </select>
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
      <td className="text-white">@{akun.username}</td>
      <td>{akun.brand.name}</td>
      <td>{akun.platform.name}</td>
      <td>{akun.pic?.name ?? "-"}</td>
      <td>
        <span className={`badge ${akun.category === "OFFICIAL" ? "bg-blue-500/15 text-blue-400" : "bg-purple-500/15 text-purple-400"}`}>
          {akun.category === "OFFICIAL" ? "Official" : "Outlet"}
        </span>
      </td>
      <td>
        <span className={`badge ${akun.status === "ACTIVE" ? "bg-good/15 text-good" : "bg-bad/15 text-bad"}`}>{akun.status}</span>
      </td>
      <td className="flex gap-2 items-center flex-wrap">
        {akun.apiConnected ? (
          <>
            <span className="text-xs px-2 py-1 rounded bg-good/15 text-good">✓ TikTok Terhubung</span>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="text-xs px-2 py-1 rounded bg-accent/15 text-accent hover:bg-accent/25"
            >
              {isSyncing ? "Sync..." : "Sync Data"}
            </button>
          </>
        ) : (
          <a
            href={`/api/auth/tiktok/login?akunId=${akun.id}`}
            className="text-xs px-2 py-1 rounded bg-accent/15 text-accent hover:bg-accent/25"
          >
            Connect TikTok
          </a>
        )}
        <button onClick={() => setIsEditing(true)} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">Edit</button>
        <button onClick={handleDelete} disabled={isPending} className="text-xs px-2 py-1 rounded bg-bad/15 text-bad hover:bg-bad/25">{isPending ? "..." : "Hapus"}</button>
      </td>
      {error && <td colSpan={7} className="text-bad text-xs">{error}</td>}
      {syncMessage && <td colSpan={7} className="text-accent text-xs">{syncMessage}</td>}
    </tr>
  );
}
