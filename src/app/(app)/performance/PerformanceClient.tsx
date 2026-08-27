"use client";

import { useRef, useState, useTransition } from "react";
import { createPerformance } from "./actions";

type Option = { id: string; name: string };
type PostingOption = { id: string; akunUsername: string; platformName: string; postedAt: Date };
type PerformanceRow = {
  id: string;
  date: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  profileVisit: number;
  websiteClick: number;
  follows: number;
  leadsWaDm: number;
  source: "MANUAL" | "API";
  akun: { username: string };
  platform: { name: string };
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

export default function PerformanceClient({
  performances,
  platforms,
  postings,
}: {
  performances: PerformanceRow[];
  platforms: Option[];
  postings: PostingOption[];
}) {
  const [platformFilter, setPlatformFilter] = useState("");
  const [formPlatformFilter, setFormPlatformFilter] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = performances.filter((r) => !platformFilter || r.platform.name === platformFilter);
  const postingOptions = postings.filter((p) => !formPlatformFilter || p.platformName === formPlatformFilter);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createPerformance(formData);
      if (res?.error) setError(res.error);
      else formRef.current?.reset();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Performance Tracker</h1>
          <p className="text-muted text-sm mt-1">Input performa per posting.</p>
        </div>
        <div>
          <label className="stat-label block mb-1.5">Filter Platform</label>
          <select
            className="bg-transparent border border-white/20 rounded px-3 py-1.5 text-white text-sm"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="" className="bg-black">Semua Platform</option>
            {platforms.map((p) => <option key={p.id} value={p.name} className="bg-black">{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th><th>Akun</th><th>Platform</th><th>Views</th>
                <th>Like</th><th>Comment</th><th>Share</th><th>Save</th>
                <th>Profile Visit</th><th>Follow</th><th>Web Click</th><th>Leads</th><th>Sumber</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.date).toLocaleDateString("id-ID")}</td>
                  <td className="text-white">@{r.akun.username}</td>
                  <td>{r.platform.name}</td>
                  <td>{r.views.toLocaleString("id-ID")}</td>
                  <td>{r.likes.toLocaleString("id-ID")}</td>
                  <td>{r.comments.toLocaleString("id-ID")}</td>
                  <td>{r.shares.toLocaleString("id-ID")}</td>
                  <td>{r.saves.toLocaleString("id-ID")}</td>
                  <td>{r.profileVisit}</td>
                  <td>{r.follows}</td>
                  <td>{r.websiteClick}</td>
                  <td>{r.leadsWaDm}</td>
                  <td><span className="badge bg-panel text-muted">{r.source}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={13} className="text-muted text-center py-6">Tidak ada data untuk platform ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <form ref={formRef} action={handleSubmit} className="card space-y-3 h-fit">
          <div className="font-medium text-white text-sm">Input Performa</div>

          <div>
            <label className="stat-label block mb-1.5">Platform</label>
            <select
              className="input"
              value={formPlatformFilter}
              onChange={(e) => setFormPlatformFilter(e.target.value)}
              disabled={isPending}
            >
              <option value="">Semua Platform</option>
              {platforms.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="stat-label block mb-1.5">Posting</label>
            <select name="postingId" className="input" required disabled={isPending}>
              {postingOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  @{p.akunUsername} — {new Date(p.postedAt).toLocaleDateString("id-ID")}
                </option>
              ))}
            </select>
          </div>

          {METRIC_FIELDS.map((f) => (
            <div key={f.name}>
              <label className="stat-label block mb-1.5">{f.label}</label>
              <input name={f.name} className="input" type="number" min="0" defaultValue={0} disabled={isPending} />
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