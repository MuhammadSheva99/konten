import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ScopeType = "PIC" | "BRAND" | "AKUN";

async function getAkunIdsForScope(scopeType: ScopeType, scopeId: string): Promise<string[]> {
  if (scopeType === "AKUN") return [scopeId];
  if (scopeType === "BRAND") {
    const akun = await prisma.akun.findMany({ where: { brandId: scopeId }, select: { id: true } });
    return akun.map((a) => a.id);
  }
  // PIC
  const akun = await prisma.akun.findMany({ where: { picId: scopeId }, select: { id: true } });
  return akun.map((a) => a.id);
}

function getPeriodRange(period: string) {
  // period format: "YYYY-MM"
  const [year, month] = period.split("-").map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

export async function POST(req: NextRequest) {
  const { templateId, scopeType, scopeId, period } = await req.json();

  if (!templateId || !scopeType || !scopeId || !period) {
    return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
  }

  const template = await prisma.kpiTemplate.findUnique({
    where: { id: templateId },
    include: { items: { orderBy: { order: "asc" } } },
  });
  if (!template) {
    return NextResponse.json({ error: "Template tidak ditemukan" }, { status: 404 });
  }

  const akunIds = await getAkunIdsForScope(scopeType, scopeId);
  const { start, end } = getPeriodRange(period);

  const results = [];
  let totalScore = 0;

  for (const item of template.items) {
    let realisasi = 0;
    let realisasiLabel = "0";

    if (item.computeType === "AUTO_POSTING_COUNT") {
      realisasi = await prisma.posting.count({
        where: { akunId: { in: akunIds }, postedAt: { gte: start, lte: end } },
      });
      realisasiLabel = realisasi.toLocaleString("id-ID");
    } else if (item.computeType === "AUTO_TOTAL_VIEWS") {
      const agg = await prisma.performance.aggregate({
        _sum: { views: true },
        where: { akunId: { in: akunIds }, date: { gte: start, lte: end } },
      });
      realisasi = agg._sum.views ?? 0;
      realisasiLabel = realisasi.toLocaleString("id-ID");
    } else if (item.computeType === "AUTO_ENGAGEMENT_RATE") {
      const agg = await prisma.performance.aggregate({
        _sum: { views: true, likes: true, comments: true, shares: true, saves: true },
        where: { akunId: { in: akunIds }, date: { gte: start, lte: end } },
      });
      const totalViews = agg._sum.views ?? 0;
      const totalEngagement =
        (agg._sum.likes ?? 0) + (agg._sum.comments ?? 0) + (agg._sum.shares ?? 0) + (agg._sum.saves ?? 0);
      realisasi = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
      realisasiLabel = `${realisasi.toFixed(1)}%`;
    } else if (item.computeType === "AUTO_HEALTHY_ACCOUNTS") {
      let healthyCount = 0;
      for (const akunId of akunIds) {
        const agg = await prisma.performance.aggregate({
          _sum: { views: true, likes: true, comments: true, shares: true, saves: true },
          where: { akunId, date: { gte: start, lte: end } },
        });
        const v = agg._sum.views ?? 0;
        const eng = (agg._sum.likes ?? 0) + (agg._sum.comments ?? 0) + (agg._sum.shares ?? 0) + (agg._sum.saves ?? 0);
        const er = v > 0 ? (eng / v) * 100 : 0;
        if (er >= 6) healthyCount++;
      }
      realisasi = healthyCount;
      realisasiLabel = `${healthyCount} Akun`;
    } else if (item.computeType === "AUTO_FOLLOWER_GROWTH_ABS" || item.computeType === "AUTO_FOLLOWER_GROWTH_PCT") {
      let totalStart = 0;
      let totalEnd = 0;
      let hasEnoughData = true;

      for (const akunId of akunIds) {
        const startSnap = await prisma.akunFollowerSnapshot.findFirst({
          where: { akunId, date: { lte: start } },
          orderBy: { date: "desc" },
        });
        const endSnap = await prisma.akunFollowerSnapshot.findFirst({
          where: { akunId, date: { lte: end } },
          orderBy: { date: "desc" },
        });

        if (!startSnap || !endSnap) {
          hasEnoughData = false;
          continue;
        }
        totalStart += startSnap.followerCount;
        totalEnd += endSnap.followerCount;
      }

      if (!hasEnoughData && totalStart === 0) {
        realisasi = 0;
        realisasiLabel = "- (data snapshot belum cukup)";
      } else if (item.computeType === "AUTO_FOLLOWER_GROWTH_ABS") {
        realisasi = totalEnd - totalStart;
        realisasiLabel = realisasi.toLocaleString("id-ID");
      } else {
        const pct = totalStart > 0 ? ((totalEnd - totalStart) / totalStart) * 100 : 0;
        realisasi = pct;
        realisasiLabel = `${pct.toFixed(1)}%`;
      }
    } else {
      // MANUAL
      const manual = await prisma.kpiManualInput.findUnique({
        where: {
          templateItemId_scopeType_scopeId_period: {
            templateItemId: item.id,
            scopeType,
            scopeId,
            period,
          },
        },
      });
      realisasi = manual?.value ?? 0;
      realisasiLabel = manual ? realisasi.toLocaleString("id-ID") : "-";
    }

    const target = item.targetNumeric ?? 0;
    const score = target > 0 ? Math.min(realisasi / target, 1) * item.weight : 0;
    totalScore += score;

    results.push({
      id: item.id,
      name: item.name,
      metricDescription: item.metricDescription,
      weight: item.weight,
      targetLabel: item.targetLabel,
      computeType: item.computeType,
      realisasiLabel,
      realisasiValue: realisasi,
      score: Math.round(score * 10) / 10,
    });
  }

  return NextResponse.json({
    templateName: template.name,
    items: results,
    totalScore: Math.round(totalScore * 10) / 10,
  });
}