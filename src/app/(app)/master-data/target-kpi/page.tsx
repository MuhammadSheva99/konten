import { prisma } from "@/lib/prisma";
import TargetKpiRow from "./TargetKpiRow";
import AddTargetKpiForm from "./AddTargetKpiForm";

export default async function TargetKpiPage() {
  const items = await prisma.targetKpi.findMany({
    include: {
      pic: { select: { name: true } },
      brand: { select: { name: true } },
    },
    orderBy: { period: "desc" },
  });
  const pics = await prisma.user.findMany({
    where: { role: "PIC" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const brands = await prisma.brand.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Periode</th>
              <th>PIC</th>
              <th>Brand</th>
              <th>Target Posting</th>
              <th>Target Views</th>
              <th>Target Leads</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <TargetKpiRow key={item.id} item={item} pics={pics} brands={brands} />
            ))}
          </tbody>
        </table>
      </div>
      <AddTargetKpiForm pics={pics} brands={brands} />
    </div>
  );
}
