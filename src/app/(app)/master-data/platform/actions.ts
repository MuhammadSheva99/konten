"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const platformSchema = z.object({
  name: z.string().trim().min(1, "Nama platform tidak boleh kosong").max(50),
});

export async function createPlatform(formData: FormData) {
  const parsed = platformSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.platform.create({ data: parsed.data });
  } catch {
    return { error: "Gagal menyimpan. Nama platform mungkin sudah dipakai." };
  }

  revalidatePath("/master-data/platform");
  return { success: true };
}

export async function updatePlatform(id: string, name: string) {
  const parsed = platformSchema.safeParse({ name });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.platform.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "Gagal menyimpan. Nama platform mungkin sudah dipakai." };
  }

  revalidatePath("/master-data/platform");
  return { success: true };
}

export async function deletePlatform(id: string) {
  try {
    await prisma.platform.delete({ where: { id } });
    revalidatePath("/master-data/platform");
    return { success: true };
  } catch {
    return { error: "Gagal menghapus. Platform ini masih punya data terkait (akun/konten/dll)." };
  }
}
