import { prisma } from "@/lib/prisma";
import BrandRow from "./BrandRow";
import AddBrandForm from "./AddBrandForm";

export default async function BrandPage() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { akun: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama Brand</th>
              <th>Jumlah Akun</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <BrandRow key={b.id} brand={b} />
            ))}
          </tbody>
        </table>
      </div>
      <AddBrandForm />
    </div>
  );
}
