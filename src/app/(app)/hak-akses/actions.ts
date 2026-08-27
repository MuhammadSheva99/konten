"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserRole(id: string, role: "ADMIN" | "PIC") {
  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath("/hak-akses");
  return { success: true };
}

export async function toggleUserActive(id: string, isActive: boolean) {
  await prisma.user.update({ where: { id }, data: { isActive } });
  revalidatePath("/hak-akses");
  return { success: true };
}
