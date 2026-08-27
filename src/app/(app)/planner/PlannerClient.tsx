"use client";

import { useRef, useState, useTransition } from "react";
import { createContentPlan, updatePriority } from "./actions";

const URGENCY = ["URGENT", "TINGGI", "NORMAL", "RENDAH"] as const;
const URGENCY_COLOR: Record<string, string> = {
  URGENT: "text-bad",
  TINGGI: "text-warn",
  NORMAL: "text-accent",
  RENDAH: "text-muted",
};

type Option = { id: string; name: string };
type AkunOption = { id: string; username: string };
type ContentPlan = {
  id: string;
  title: string;
  scheduledDate: Date;
  priority: "URGENT" | "TINGGI" | "NORMAL" | "RENDAH";
  brand: { name: string };
  platform: { name: string };
  akun: { username: string };
  pic: { name: string };
};

export default function PlannerClient({
  plans,
  brands,
  platforms,
  akunList,
  pics,
}: {
  plans: ContentPlan[];
  brands: Option[];
  platforms: Option[];
  akunList: AkunOption[];
  pics: Option[];
}) {
  const [items, setItems] = useState(plans);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUrgencyChange(id: string, priority: typeof URGENCY[number]) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, priority } : p)));
    startTransition(() => updatePriority(id, priority));
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createContentPlan(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Request Konten</h1>
        <p className="text-muted text-sm mt-1">Permintaan & jadwal produksi konten per PIC</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Brand / Platform</th>
                <th>Akun</th>
                <th>PIC</th>
                <th>Jadwal</th>
                <th>Prioritas</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="text-white">{p.title}</td>
                  <td>{p.brand.name} · {p.platform.name}</td>
                  <td>@{p.akun.username}</td>
                  <td>{p.pic.name}</td>
                  <td>{new Date(p.scheduledDate).toLocaleDateString("id-ID")}</td>
                  <td>
                    <select
                      className={`input py-1 text-xs w-auto font-semibold ${URGENCY_COLOR[p.priority]}`}
                      value={p.priority}
                      onChange={(e) => handleUrgencyChange(p.id, e.target.value as typeof URGENCY[number])}
                      disabled={isPending}
                    >
                      {URGENCY.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="text-muted text-center py-6">Belum ada request konten.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <form ref={formRef} action={handleSubmit} className="card space-y-3 h-fit">
          <div className="font-medium text-white text-sm">Request Konten Baru</div>
          <div>
            <label className="stat-label block mb-1.5">Judul</label>
            <input name="title" className="input" required disabled={isPending} />
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
            <label className="stat-label block mb-1.5">PIC</label>
            <select name="picId" className="input" required disabled={isPending}>
              {pics.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="stat-label block mb-1.5">Jadwal Upload</label>
            <input name="scheduledDate" className="input" type="date" required disabled={isPending} />
          </div>
          <div>
            <label className="stat-label block mb-1.5">Prioritas</label>
            <select name="priority" className="input" defaultValue="NORMAL" required disabled={isPending}>
              {URGENCY.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          {error && <p className="text-bad text-xs">{error}</p>}
          <button className="btn-primary w-full" type="submit" disabled={isPending}>
            {isPending ? "Mengirim..." : "Kirim Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
