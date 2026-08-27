import { prisma } from "@/lib/prisma";
import HakAksesClient from "./HakAksesClient";

export default async function HakAksesPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isActive: true },
    orderBy: { name: "asc" },
  });

  return <HakAksesClient users={users} />;
}
