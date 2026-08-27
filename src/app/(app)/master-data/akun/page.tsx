import { prisma } from "@/lib/prisma";
import AkunTableWithFilter from "./AkunTableWithFilter";
import AddAkunForm from "./AddAkunForm";

export default async function AkunPage() {
  const akunList = await prisma.akun.findMany({
    include: {
      brand: { select: { name: true } },
      platform: { select: { name: true } },
      pic: { select: { name: true } },
    },
    orderBy: { username: "asc" },
  });
  const brands = await prisma.brand.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  const platforms = await prisma.platform.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  const pics = await prisma.user.findMany({ where: { role: "PIC" }, select: { id: true, name: true }, orderBy: { name: "asc" } });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card overflow-x-auto">
        <AkunTableWithFilter akunList={akunList} brands={brands} platforms={platforms} pics={pics} />
      </div>
      <AddAkunForm brands={brands} platforms={platforms} pics={pics} />
    </div>
  );
}