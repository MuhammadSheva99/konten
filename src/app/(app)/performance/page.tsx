import { prisma } from "@/lib/prisma";
import PerformanceClient from "./PerformanceClient";

export default async function PerformancePage() {
  const performances = await prisma.performance.findMany({
    include: {
      akun: { select: { username: true } },
      platform: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });
  const platforms = await prisma.platform.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const postingsRaw = await prisma.posting.findMany({
    include: {
      akun: { select: { username: true } },
      platform: { select: { name: true } },
    },
    orderBy: { postedAt: "desc" },
  });

  const postings = postingsRaw.map((p) => ({
    id: p.id,
    akunUsername: p.akun.username,
    platformName: p.platform.name,
    postedAt: p.postedAt,
  }));

  return (
    <PerformanceClient performances={performances} platforms={platforms} postings={postings} />
  );
}
