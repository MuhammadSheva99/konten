import { prisma } from "@/lib/prisma";
import PlatformRow from "./PlatformRow";
import AddPlatformForm from "./AddPlatformForm";

export default async function PlatformPage() {
  const platforms = await prisma.platform.findMany({
    include: { _count: { select: { akun: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama Platform</th>
              <th>Jumlah Akun</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((p) => (
              <PlatformRow key={p.id} platform={p} />
            ))}
          </tbody>
        </table>
      </div>
      <AddPlatformForm />
    </div>
  );
}
