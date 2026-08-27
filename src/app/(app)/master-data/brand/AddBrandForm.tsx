"use client";

import { useRef, useState, useTransition } from "react";
import { createBrand } from "./actions";

export default function AddBrandForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createBrand(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card space-y-3 h-fit">
      <div className="font-medium text-white text-sm">Tambah Brand</div>
      <div>
        <label className="stat-label block mb-1.5">Nama Brand</label>
        <input name="name" required disabled={isPending} placeholder="Contoh: Brand D" className="w-full bg-transparent border border-white/20 rounded px-3 py-2 text-white text-sm" />
      </div>
      {error && <p className="text-bad text-xs">{error}</p>}
      <button type="submit" disabled={isPending} className="w-full text-sm px-3 py-2 rounded bg-white/10 text-white hover:bg-white/20">
        {isPending ? "Menyimpan..." : "Tambah"}
      </button>
    </form>
  );
}
