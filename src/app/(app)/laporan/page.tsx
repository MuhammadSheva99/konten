import { prisma } from "@/lib/prisma";
import LaporanClient from "./LaporanClient";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default async function LaporanPage() {
  const postings = await prisma.posting.findMany({
    include: {
      brand: { select: { name: true } },
      platform: { select: { name: true } },
      akun: { select: { username: true, pic: { select: { name: true } } } },
    },
    orderBy: { postedAt: "desc" },
  });

  const performances = await prisma.performance.findMany({
    select: { akunId: true, date: true, views: true, leadsWaDm: true },
  });

  const pics = await prisma.user.findMany({
    where: { role: "PIC" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const rows = postings.map((p) => {
    // Cocokkan performance berdasarkan akun yang sama + tanggal yang sama
    const matchedPerf = performances.find(
      (perf) => perf.akunId === p.akunId && isSameDay(new Date(perf.date), new Date(p.postedAt))
    );

    return {
      id: p.id,
      postedAt: p.postedAt,
      brand: p.brand.name,
      platform: p.platform.name,
      akun: p.akun.username,
      pic: p.akun.pic?.name ?? "-",
      views: matchedPerf?.views ?? 0,
      leads: matchedPerf?.leadsWaDm ?? 0,
    };
  });

  return <LaporanClient rows={rows} pics={pics} />;
}
