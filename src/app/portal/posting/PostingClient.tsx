"use client";

import { useRef, useState, useTransition } from "react";
import { createPortalPosting, deletePortalPosting } from "./actions";

type AkunOption = { id: string; username: string; brandName: string; platformName: string };
type Posting = {
  id: string;
  link: string;
  postedAt: Date;
  akun: { username: string };
  brand: { name: string };
  platform: { name: string };
};

export default function PostingClient({
  postings,
  akunList,
}: {
  postings: Posting[];
  akunList: AkunOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createPortalPosting(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Hapus catatan posting ini?")) return;
    startTransition(() => deletePortalPosting(id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Catat Posting</h1>
        <p className="text-muted text-sm mt-1">Catat link konten yang sudah kamu upload</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Tanggal</th><th>Akun</th><th>Brand</th><th>Platform</th><th>Link</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {postings.map((p) => (
                <tr key={p.id}>
                  <td>{new Date(p.postedAt).toLocaleDateString("id-ID")}</td>
                  <td className="text-white">@{p.akun.username}</td>
                  <td>{p.brand.name}</td>
                  <td>{p.platform.name}</td>
                  <td>
                    <a href={p.link} target="_blank" className="text-accent hover:underline truncate block max-w-[200px]">
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
              {postings.length === 0 && (
                <tr><td colSpan={6} className="text-muted text-center py-6">Belum ada posting yang dicatat.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <form ref={formRef} action={handleSubmit} className="card space-y-3 h-fit">
          <div className="font-medium text-white text-sm">Catat Posting Baru</div>
          <div>
            <label className="stat-label block mb-1.5">Akun</label>
            <select name="akunId" className="input" required disabled={isPending}>
              {akunList.map((a) => (
                <option key={a.id} value={a.id}>
                  @{a.username} ({a.brandName} · {a.platformName})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="stat-label block mb-1.5">Link Posting</label>
            <input name="link" type="url" className="input" required disabled={isPending} placeholder="https://tiktok.com/..." />
          </div>
          <div>
            <label className="stat-label block mb-1.5">Tanggal Upload</label>
            <input name="postedAt" type="date" className="input" required disabled={isPending} />
          </div>
          {error && <p className="text-bad text-xs">{error}</p>}
          <button className="btn-primary w-full" type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}
