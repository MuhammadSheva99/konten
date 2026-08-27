import { prisma } from "@/lib/prisma";
import LeaderboardClient from "./LeaderboardClient";

export default async function LeaderboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [akunList, perfAgg, postingAgg] = await Promise.all([
    prisma.akun.findMany({
      select: {
        id: true,
        username: true,
        brand: { select: { name: true } },
        pic: { select: { name: true } },
      },
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

  // Ranking per Akun
  const akunRows = akunList
    .map((a) => ({
      username: a.username,
      brand: a.brand.name,
      views: perfMap.get(a.id)?.views ?? 0,
    }))
    .sort((a, b) => b.views - a.views);

  // Ranking per PIC (agregasi dari semua akun milik PIC tsb)
  const picAgg = new Map<string, { views: number; posting: number; leads: number }>();
  for (const a of akunList) {
    if (!a.pic) continue;
    const current = picAgg.get(a.pic.name) ?? { views: 0, posting: 0, leads: 0 };
    current.views += perfMap.get(a.id)?.views ?? 0;
    current.leads += perfMap.get(a.id)?.leadsWaDm ?? 0;
    current.posting += postingMap.get(a.id) ?? 0;
    picAgg.set(a.pic.name, current);
  }
  const picRows = Array.from(picAgg.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.views - a.views);

  return <LeaderboardClient picRows={picRows} akunRows={akunRows} />;
}
