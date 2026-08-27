import { prisma } from "@/lib/prisma";
import PlannerClient from "./PlannerClient";

export default async function PlannerPage() {
  const plans = await prisma.contentPlan.findMany({
    include: {
      brand: { select: { name: true } },
      platform: { select: { name: true } },
      akun: { select: { username: true } },
      pic: { select: { name: true } },
    },
    orderBy: { scheduledDate: "asc" },
  });
  const brands = await prisma.brand.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  const platforms = await prisma.platform.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  const akunList = await prisma.akun.findMany({ select: { id: true, username: true }, orderBy: { username: "asc" } });
  const pics = await prisma.user.findMany({
    where: { role: "PIC" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <PlannerClient plans={plans} brands={brands} platforms={platforms} akunList={akunList} pics={pics} />
  );
}
