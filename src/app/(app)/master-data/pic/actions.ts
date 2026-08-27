"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

const createPicSchema = z.object({
  name: z.string().trim().min(1, "Nama tidak boleh kosong").max(100),
  username: z.string().trim().min(3, "Username minimal 3 karakter").max(30),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const updatePicSchema = z.object({
  name: z.string().trim().min(1, "Nama tidak boleh kosong").max(100),
  username: z.string().trim().min(3, "Username minimal 3 karakter").max(30),
  isActive: z.boolean(),
  password: z.string().optional(), // kosong = tidak diganti
});

export async function createPic(formData: FormData) {
  const parsed = createPicSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        username: parsed.data.username,
        password: hashedPassword,
        email: `${parsed.data.username}@kontenmanager.local`,
        role: "PIC",
        isActive: true,
      },
    });
  } catch {
    return { error: "Gagal menyimpan. Username mungkin sudah dipakai." };
  }

  revalidatePath("/master-data/pic");
  return { success: true };
}

export async function updatePic(
  id: string,
  input: { name: string; username: string; isActive: boolean; password?: string }
) {
  const parsed = updatePicSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data: { name: string; username: string; isActive: boolean; password?: string } = {
    name: parsed.data.name,
    username: parsed.data.username,
    isActive: parsed.data.isActive,
  };

  if (parsed.data.password && parsed.data.password.length >= 6) {
    data.password = await bcrypt.hash(parsed.data.password, 10);
  }

  try {
    await prisma.user.update({ where: { id }, data });
  } catch {
    return { error: "Gagal menyimpan. Username mungkin sudah dipakai." };
  }

  revalidatePath("/master-data/pic");
  return { success: true };
}

export async function deletePic(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/master-data/pic");
    return { success: true };
  } catch {
    return {
      error: "Gagal menghapus. PIC ini masih punya data terkait (akun/konten/target KPI/dll).",
    };
  }
}
