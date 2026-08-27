"use client";

import { useRef, useState, useTransition } from "react";
import { createPic } from "./actions";

export default function AddPicForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createPic(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card space-y-3 h-fit">
      <div className="font-medium text-white text-sm">Tambah PIC</div>
      <div>
        <label className="stat-label block mb-1.5">Nama</label>
        <input name="name" required disabled={isPending} placeholder="Contoh: Budi" className="input" />
      </div>
      <div>
        <label className="stat-label block mb-1.5">Username (untuk login)</label>
        <input name="username" required disabled={isPending} placeholder="Contoh: budi" className="input" />
      </div>
      <div>
        <label className="stat-label block mb-1.5">Password Awal</label>
        <input name="password" type="password" required disabled={isPending} placeholder="Minimal 6 karakter" className="input" />
      </div>
      {error && <p className="text-bad text-xs">{error}</p>}
      <button type="submit" disabled={isPending} className="btn-primary w-full">
        {isPending ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
