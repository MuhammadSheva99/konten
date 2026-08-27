"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const brandSchema = z.object({
  name: z.string().trim().min(1, "Nama brand tidak boleh kosong").max(100, "Nama brand maksimal 100 karakter"),
  isActive: z.boolean(),
});

export async function createBrand(formData: FormData) {
  const parsed = brandSchema.safeParse({ name: formData.get("name"), isActive: true });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.brand.create({ data: parsed.data });
  } catch {
    return { error: "Gagal menyimpan. Nama brand mungkin sudah dipakai." };
  }

  revalidatePath("/master-data/brand");
  return { success: true };
}

export async function updateBrand(id: string, input: { name: string; isActive: boolean }) {
  const parsed = brandSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.brand.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "Gagal menyimpan. Nama brand mungkin sudah dipakai." };
  }

  revalidatePath("/master-data/brand");
  return { success: true };
}

export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({ where: { id } });
    revalidatePath("/master-data/brand");
    return { success: true };
  } catch {
    return { error: "Gagal menghapus. Brand ini masih punya data terkait (akun/konten/dll)." };
  }
}
