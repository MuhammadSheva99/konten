import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import PortalKpiClient from "./PortalKpiClient";

export default async function PortalKpiPage() {
  const session = await getSession();

  const akunList = await prisma.akun.findMany({
    where: { picId: session.userId },
    select: { category: true },
  });

  const categories = Array.from(new Set(akunList.map((a) => a.category)));

  const templates = await prisma.kpiTemplate.findMany({
    where: { category: { in: categories } },
    select: { id: true, category: true },
  });

  const templatesByCategory = templates.map((t) => ({
    category: t.category,
    templateId: t.id,
  }));

  return <PortalKpiClient templatesByCategory={templatesByCategory} />;
}