import { prisma } from "@/lib/prisma";
import MonitoringClient from "./MonitoringClient";

export default async function MonitoringPage() {
  const akunList = await prisma.akun.findMany({
    include: {
      brand: { select: { name: true } },
      platform: { select: { name: true } },
      pic: { select: { name: true } },
    },
    orderBy: { username: "asc" },
  });
  const pics = await prisma.user.findMany({
    where: { role: "PIC" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <MonitoringClient akunList={akunList} pics={pics} />;
}