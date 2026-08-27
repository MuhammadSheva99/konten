import { prisma } from "@/lib/prisma";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function ReminderPage() {
  const today = startOfDay(new Date());
  const twoDaysFromNow = new Date(today);
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  twoDaysFromNow.setHours(23, 59, 59, 999);

  const [contentPlans, postings, performances] = await Promise.all([
    prisma.contentPlan.findMany({
      where: { status: { not: "POSTED" } },
      include: {
        brand: { select: { name: true } },
        pic: { select: { name: true } },
      },
      orderBy: { scheduledDate: "asc" },
    }),
    prisma.posting.findMany({
      include: {
        brand: { select: { name: true } },
        akun: { select: { username: true } },
      },
    }),
    prisma.performance.findMany({
      select: { akunId: true, date: true },
    }),
  ]);

  const belumUpload = contentPlans
    .filter((c) => new Date(c.scheduledDate) < today)
    .map((c) => ({
      title: c.title,
      brand: c.brand.name,
      pic: c.pic.name,
      scheduledDate: c.scheduledDate,
      daysLate: Math.floor((today.getTime() - new Date(c.scheduledDate).getTime()) / 86400000),
    }));

  const deadlineDekat = contentPlans
    .filter((c) => {
      const d = new Date(c.scheduledDate);
      return d >= today && d <= twoDaysFromNow;
    })
    .map((c) => ({
      title: c.title,
      brand: c.brand.name,
      pic: c.pic.name,
      scheduledDate: c.scheduledDate,
    }));

  const belumInputPerforma = postings
    .filter((p) => {
      const hasMatch = performances.some(
        (perf) => perf.akunId === p.akunId && isSameDay(new Date(perf.date), new Date(p.postedAt))
      );
      return !hasMatch;
    })
    .map((p) => ({
      akun: p.akun.username,
      brand: p.brand.name,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Reminder Otomatis</h1>
        <p className="text-muted text-sm mt-1">Dihitung otomatis dari status konten & data performa</p>
      </div>

      <div className="card">
        <div className="stat-label mb-3 text-bad">⚠ Konten Belum Upload ({belumUpload.length})</div>
        {belumUpload.map((c, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b border-border/60 last:border-0">
            <span className="text-white">{c.title} <span className="text-muted">— {c.brand} · {c.pic}</span></span>
            <span className="text-bad">
              Jadwal {new Date(c.scheduledDate).toLocaleDateString("id-ID")} ({c.daysLate} hari terlewat)
            </span>
          </div>
        ))}
        {belumUpload.length === 0 && (
          <div className="text-muted text-sm py-2">Tidak ada konten yang terlambat.</div>
        )}
      </div>

      <div className="card">
        <div className="stat-label mb-3 text-warn">Deadline 2 Hari ke Depan ({deadlineDekat.length})</div>
        {deadlineDekat.map((c, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b border-border/60 last:border-0">
            <span className="text-white">{c.title} <span className="text-muted">— {c.brand} · {c.pic}</span></span>
            <span className="text-warn">{new Date(c.scheduledDate).toLocaleDateString("id-ID")}</span>
          </div>
        ))}
        {deadlineDekat.length === 0 && (
          <div className="text-muted text-sm py-2">Tidak ada deadline dalam 2 hari ke depan.</div>
        )}
      </div>

      <div className="card">
        <div className="stat-label mb-3 text-accent2">Belum Input Performa ({belumInputPerforma.length})</div>
        {belumInputPerforma.map((a, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b border-border/60 last:border-0">
            <span className="text-white">@{a.akun} <span className="text-muted">— {a.brand}</span></span>
            <span className="text-accent2">Ada posting tanpa data performa</span>
          </div>
        ))}
        {belumInputPerforma.length === 0 && (
          <div className="text-muted text-sm py-2">Semua posting sudah punya data performa.</div>
        )}
      </div>
    </div>
  );
}