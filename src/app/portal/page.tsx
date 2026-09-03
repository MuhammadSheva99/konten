import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function PortalDashboard() {
  const session = await getSession();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const akunList = await prisma.akun.findMany({
    where: { picId: session.userId },
    include: {
      brand: { select: { name: true } },
      platform: { select: { name: true } },
    },
    orderBy: { username: "asc" },
  });

  const akunIds = akunList.map((a) => a.id);

  const [postingCount, perfAgg] = await Promise.all([
    prisma.posting.count({
      where: { akunId: { in: akunIds }, postedAt: { gte: startOfMonth, lte: now } },
    }),
    prisma.performance.aggregate({
      _sum: { views: true, likes: true, comments: true, shares: true, leadsWaDm: true },
      where: { akunId: { in: akunIds }, date: { gte: startOfMonth, lte: now } },
    }),
  ]);

  const totalViews = perfAgg._sum.views ?? 0;
  const totalEngagement =
    (perfAgg._sum.likes ?? 0) + (perfAgg._sum.comments ?? 0) + (perfAgg._sum.shares ?? 0);
  const engagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
  const totalLeads = perfAgg._sum.leadsWaDm ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Halo, {session.name}</h1>
        <p className="text-muted text-sm mt-1">Ringkasan performa akun kamu bulan ini</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="stat-label">Posting Bulan Ini</div>
          <div className="text-2xl font-bold text-white mt-1">{postingCount}</div>
        </div>
        <div className="card">
          <div className="stat-label">Total Views</div>
          <div className="text-2xl font-bold text-white mt-1">{totalViews.toLocaleString("id-ID")}</div>
        </div>
        <div className="card">
          <div className="stat-label">Engagement Rate</div>
          <div className="text-2xl font-bold text-white mt-1">{engagementRate.toFixed(1)}%</div>
        </div>
        <div className="card">
          <div className="stat-label">Leads (WA/DM)</div>
          <div className="text-2xl font-bold text-white mt-1">{totalLeads}</div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <div className="stat-label mb-3">Akun yang Kamu Pegang</div>
        <table className="data-table">
          <thead>
            <tr><th>Username</th><th>Brand</th><th>Platform</th><th>Status</th></tr>
          </thead>
          <tbody>
            {akunList.map((a) => (
              <tr key={a.id}>
                <td className="text-white">@{a.username}</td>
                <td>{a.brand.name}</td>
                <td>{a.platform.name}</td>
                <td>
                  <span className={`badge ${a.status === "ACTIVE" ? "bg-good/15 text-good" : "bg-bad/15 text-bad"}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
            {akunList.length === 0 && (
              <tr><td colSpan={4} className="text-muted text-center py-6">Belum ada akun yang ditugaskan ke kamu.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
