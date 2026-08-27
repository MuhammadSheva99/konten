"use client";

import { useRef, useState, useTransition } from "react";
import { createPosting, deletePosting } from "./actions";

type Option = { id: string; name: string };
type AkunOption = { id: string; username: string };
type Posting = {
  id: string;
  link: string;
  postedAt: Date;
  brand: { name: string };
  platform: { name: string };
  akun: { username: string; pic: { name: string } | null };
};

// TODO: ganti dengan session/auth asli begitu login sistem sudah dibangun.
// Untuk sekarang perilakunya dipertahankan sama seperti versi mock: Admin = true.
const isAdmin = true;

export default function PostingTrackerClient({
  postings,
  brands,
  platforms,
  akunList,
  pics,
}: {
  postings: Posting[];
  brands: Option[];
  platforms: Option[];
  akunList: AkunOption[];
  pics: Option[];
}) {
  const [picFilter, setPicFilter] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = postings.filter((p) => {
    if (!picFilter) return true;
    return p.akun.pic?.name === picFilter;
  });

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createPosting(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Hapus catatan posting ini?")) return;
    startTransition(() => deletePosting(id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Posting Tracker</h1>
          <p className="text-muted text-sm mt-1">Catatan seluruh konten yang sudah tayang</p>
        </div>
        <div>
          <label className="stat-label block mb-1.5">Filter PIC</label>
          <select className="input" value={picFilter} onChange={(e) => setPicFilter(e.target.value)}>
            <option value="">Semua PIC</option>
            {pics.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isAdmin ? "" : "lg:grid-cols-4"} gap-6`}>
        <div className={`${isAdmin ? "" : "lg:col-span-3"} card overflow-x-auto`}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Brand</th>
                <th>Platform</th>
                <th>Akun</th>
                <th>PIC</th>
                <th>Link</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>{new Date(p.postedAt).toLocaleDateString("id-ID")}</td>
                  <td>{p.brand.name}</td>
                  <td>{p.platform.name}</td>
                  <td>@{p.akun.username}</td>
                  <td>{p.akun.pic?.name ?? "-"}</td>
                  <td>
                    <a href={p.link} target="_blank" className="text-accent hover:underline truncate block max-w-[220px]">
                      {p.link}
                    </a>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(p.id)} disabled={isPending} className="text-xs px-2 py-1 rounded bg-bad/15 text-bad hover:bg-bad/25">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-muted text-center py-6">Tidak ada posting untuk filter ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isAdmin && (
          <form ref={formRef} action={handleSubmit} className="card space-y-3 h-fit">
            <div className="font-medium text-white text-sm">Catat Posting</div>
            <div>
              <label className="stat-label block mb-1.5">Link Posting</label>
              <input name="link" className="input" type="url" required disabled={isPending} />
            </div>
            <div>
              <label className="stat-label block mb-1.5">Brand</label>
              <select name="brandId" className="input" required disabled={isPending}>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="stat-label block mb-1.5">Platform</label>
              <select name="platformId" className="input" required disabled={isPending}>
                {platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="stat-label block mb-1.5">Akun</label>
              <select name="akunId" className="input" required disabled={isPending}>
                {akunList.map((a) => <option key={a.id} value={a.id}>@{a.username}</option>)}
              </select>
            </div>
            <div>
              <label className="stat-label block mb-1.5">Tanggal Upload</label>
              <input name="postedAt" className="input" type="date" required disabled={isPending} />
            </div>
            {error && <p className="text-bad text-xs">{error}</p>}
            <button className="btn-primary w-full" type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
