"use client";

import { useRef, useState, useTransition } from "react";
import { createAkun } from "./actions";

type Option = { id: string; name: string };

export default function AddAkunForm({ brands, platforms, pics }: { brands: Option[]; platforms: Option[]; pics: Option[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createAkun(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card space-y-3 h-fit">
      <div className="font-medium text-white text-sm">Tambah Akun</div>
      <div>
        <label className="stat-label block mb-1.5">Username</label>
        <input name="username" required disabled={isPending} placeholder="cth. brandofficial" className="input" />
      </div>
      <div>
        <label className="stat-label block mb-1.5">Brand</label>
        <select name="brandId" required disabled={isPending} className="input">
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <label className="stat-label block mb-1.5">Platform</label>
        <select name="platformId" required disabled={isPending} className="input">
          {platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className="stat-label block mb-1.5">PIC</label>
        <select name="picId" disabled={isPending} className="input">
          <option value="">- Belum ditentukan -</option>
          {pics.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className="stat-label block mb-1.5">Kategori</label>
        <select name="category" required disabled={isPending} className="input">
          <option value="OFFICIAL">Official</option>
          <option value="OUTLET">Outlet</option>
        </select>
      </div>
      {error && <p className="text-bad text-xs">{error}</p>}
      <button className="btn-primary w-full" type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}