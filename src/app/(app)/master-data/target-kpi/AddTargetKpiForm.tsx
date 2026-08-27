"use client";

import { useRef, useState, useTransition } from "react";
import { createTargetKpi } from "./actions";

type Option = { id: string; name: string };

export default function AddTargetKpiForm({ pics, brands }: { pics: Option[]; brands: Option[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createTargetKpi(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card space-y-3 h-fit">
      <div className="font-medium text-white text-sm">Tambah Target KPI</div>
      <div>
        <label className="stat-label block mb-1.5">Periode</label>
        <input name="period" required disabled={isPending} placeholder="Contoh: Sep 2026" className="input" />
      </div>
      <div>
        <label className="stat-label block mb-1.5">PIC</label>
        <select name="picId" required disabled={isPending} className="input">
          {pics.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className="stat-label block mb-1.5">Brand</label>
        <select name="brandId" required disabled={isPending} className="input">
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <label className="stat-label block mb-1.5">Target Posting</label>
        <input name="targetPosting" type="number" min="0" required disabled={isPending} className="input" />
      </div>
      <div>
        <label className="stat-label block mb-1.5">Target Views</label>
        <input name="targetViews" type="number" min="0" required disabled={isPending} className="input" />
      </div>
      <div>
        <label className="stat-label block mb-1.5">Target Leads</label>
        <input name="targetLeads" type="number" min="0" required disabled={isPending} className="input" />
      </div>
      {error && <p className="text-bad text-xs">{error}</p>}
      <button type="submit" disabled={isPending} className="btn-primary w-full">
        {isPending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
