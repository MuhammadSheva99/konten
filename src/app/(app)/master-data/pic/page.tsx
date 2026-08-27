import { prisma } from "@/lib/prisma";
import PicRow from "./PicRow";
import AddPicForm from "./AddPicForm";

export default async function PicPage() {
  const pics = await prisma.user.findMany({
    where: { role: "PIC" },
    include: { _count: { select: { akun: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Jumlah Akun</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pics.map((p) => (
              <PicRow key={p.id} pic={p} />
            ))}
          </tbody>
        </table>
      </div>
      <AddPicForm />
    </div>
  );
}
