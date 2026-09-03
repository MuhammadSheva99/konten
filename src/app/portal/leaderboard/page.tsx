import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function PortalLeaderboardPage() {
  const session = await getSession();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [akunList, perfAgg, postingAgg] = await Promise.all([
    prisma.akun.findMany({
      select: { id: true, pic: { select: { id: true, name: true } } },
    }),
    prisma.performance.groupBy({
      by: ["akunId"],
      _sum: { views: true, leadsWaDm: true },
      where: { date: { gte: startOfMonth, lte: now } },
    }),
    prisma.posting.groupBy({
      by: ["akunId"],
      _count: { id: true },
      where: { postedAt: { gte: startOfMonth, lte: now } },
    }),
  ]);

  const perfMap = new Map(perfAgg.map((p) => [p.akunId, p._sum]));
  const postingMap = new Map(postingAgg.map((p) => [p.akunId, p._count.id]));

  const picAgg = new Map<string, { name: string; views: number; posting: number; leads: number }>();
  for (const a of akunList) {
    if (!a.pic) continue;
    const current = picAgg.get(a.pic.id) ?? { name: a.pic.name, views: 0, posting: 0, leads: 0 };
    current.views += perfMap.get(a.id)?.views ?? 0;
    current.leads += perfMap.get(a.id)?.leadsWaDm ?? 0;
    current.posting += postingMap.get(a.id) ?? 0;
    picAgg.set(a.pic.id, current);
  }

  const rows = Array.from(picAgg.entries())
    .map(([id, stats]) => ({ id, ...stats }))
    .sort((a, b) => b.views - a.views);

  const myRank = rows.findIndex((r) => r.id === session.userId) + 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-muted text-sm mt-1">Ranking bulan berjalan berdasarkan performa seluruh PIC</p>
      </div>

      {myRank > 0 && (
        <div className="card">
          <div className="stat-label">Posisi Kamu</div>
          <div className="text-3xl font-bold text-accent mt-1">#{myRank}</div>
          <div className="text-muted text-sm">dari {rows.length} PIC</div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Nama</th><th>Views</th><th>Posting</th><th>Leads</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={r.id === session.userId ? "bg-accent/10" : ""}>
                <td>{i + 1}</td>
                <td className={r.id === session.userId ? "text-accent font-semibold" : "text-white"}>
                  {r.name} {r.id === session.userId && "(Kamu)"}
                </td>
                <td className="text-accent font-medium">{r.views.toLocaleString("id-ID")}</td>
                <td>{r.posting}</td>
                <td>{r.leads}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="text-muted text-center py-6">Belum ada data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
