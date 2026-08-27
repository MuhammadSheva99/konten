"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const akunSchema = z.object({
  username: z.string().trim().min(1, "Username tidak boleh kosong").max(50),
  brandId: z.string().min(1, "Brand wajib dipilih"),
  platformId: z.string().min(1, "Platform wajib dipilih"),
  picId: z.string().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  apiConnected: z.boolean(),
});

export async function createAkun(formData: FormData) {
  const parsed = akunSchema.safeParse({
    username: formData.get("username"),
    brandId: formData.get("brandId"),
    platformId: formData.get("platformId"),
    picId: (formData.get("picId") as string) || null,
    status: "ACTIVE",
    apiConnected: false,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.akun.create({ data: parsed.data });
  } catch {
    return { error: "Gagal menyimpan. Username mungkin sudah dipakai di platform yang sama." };
  }

  revalidatePath("/master-data/akun");
  return { success: true };
}

export async function updateAkun(id: string, input: unknown) {
  const parsed = akunSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.akun.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "Gagal menyimpan. Username mungkin sudah dipakai di platform yang sama." };
  }

  revalidatePath("/master-data/akun");
  return { success: true };
}

export async function deleteAkun(id: string) {
  try {
    await prisma.akun.delete({ where: { id } });
    revalidatePath("/master-data/akun");
    return { success: true };
  } catch {
    return { error: "Gagal menghapus. Akun ini masih punya data terkait (konten/posting/performa/dll)." };
  }
}
