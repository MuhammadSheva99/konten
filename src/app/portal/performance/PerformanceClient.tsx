"use client";

import { useRef, useState, useTransition } from "react";
import { createPortalPerformance } from "./actions";

type PostingOption = { id: string; akunUsername: string; postedAt: Date };
type PerformanceRow = {
  id: string;
  date: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  profileVisit: number;
  websiteClick: number;
  leadsWaDm: number;
  source: "MANUAL" | "API";
  akun: { username: string };
};

const METRIC_FIELDS = [
  { name: "views", label: "Views" },
  { name: "likes", label: "Like" },
  { name: "comments", label: "Comment" },
  { name: "shares", label: "Share" },
  { name: "saves", label: "Save" },
  { name: "profileVisit", label: "Profile Visit" },
  { name: "websiteClick", label: "Website Click" },
  { name: "follows", label: "Follow" },
  { name: "leadsWaDm", label: "Leads (WA/DM)" },
] as const;

export default function PortalPerformanceClient({
  performances,
  postings,
}: {
  performances: PerformanceRow[];
  postings: PostingOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createPortalPerformance(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Performance Akun Kamu</h1>
        <p className="text-muted text-sm mt-1">Input performa untuk posting kamu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th><th>Akun</th><th>Views</th><th>Like</th><th>Comment</th>
                <th>Share</th><th>Profile Visit</th><th>Web Click</th><th>Leads</th><th>Sumber</th>
              </tr>
            </thead>
            <tbody>
              {performances.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.date).toLocaleDateString("id-ID")}</td>
                  <td className="text-white">@{r.akun.username}</td>
                  <td>{r.views.toLocaleString("id-ID")}</td>
                  <td>{r.likes}</td>
                  <td>{r.comments}</td>
                  <td>{r.shares}</td>
                  <td>{r.profileVisit}</td>
                  <td>{r.websiteClick}</td>
                  <td>{r.leadsWaDm}</td>
                  <td><span className="badge bg-panel text-muted">{r.source}</span></td>
                </tr>
              ))}
              {performances.length === 0 && (
                <tr><td colSpan={10} className="text-muted text-center py-6">Belum ada data performa.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <form ref={formRef} action={handleSubmit} className="card space-y-3 h-fit">
          <div className="font-medium text-white text-sm">Input Performa</div>
          <div>
            <label className="stat-label block mb-1.5">Posting</label>
            <select name="postingId" className="input" required disabled={isPending}>
              {postings.map((p) => (
                <option key={p.id} value={p.id}>
                  @{p.akunUsername} — {new Date(p.postedAt).toLocaleDateString("id-ID")}
                </option>
              ))}
            </select>
          </div>
          {METRIC_FIELDS.map((f) => (
            <div key={f.name}>
              <label className="stat-label block mb-1.5">{f.label}</label>
              <input name={f.name} type="number" min="0" defaultValue={0} className="input" disabled={isPending} />
            </div>
          ))}
          {error && <p className="text-bad text-xs">{error}</p>}
          <button className="btn-primary w-full" type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan Data"}
          </button>
        </form>
      </div>
    </div>
  );
}
