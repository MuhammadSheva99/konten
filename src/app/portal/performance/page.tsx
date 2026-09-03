import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import PerformanceClient from "./PerformanceClient";

export default async function PortalPerformancePage() {
  const session = await getSession();

  const akunList = await prisma.akun.findMany({
    where: { picId: session.userId },
    select: { id: true },
  });
  const akunIds = akunList.map((a) => a.id);

  const performances = await prisma.performance.findMany({
    where: { akunId: { in: akunIds } },
    include: { akun: { select: { username: true } } },
    orderBy: { date: "desc" },
  });

  const postingsRaw = await prisma.posting.findMany({
    where: { akunId: { in: akunIds } },
    include: { akun: { select: { username: true } } },
    orderBy: { postedAt: "desc" },
  });

  const postings = postingsRaw.map((p) => ({
    id: p.id,
    akunUsername: p.akun.username,
    postedAt: p.postedAt,
  }));

  return <PerformanceClient performances={performances} postings={postings} />;
}
