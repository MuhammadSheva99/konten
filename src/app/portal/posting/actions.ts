"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const postingSchema = z.object({
  link: z.string().trim().url("Link harus berupa URL yang valid"),
  akunId: z.string().min(1, "Akun wajib dipilih"),
  postedAt: z.coerce.date(),
});

export async function createPortalPosting(formData: FormData) {
  const session = await getSession();
  if (!session.userId || session.role !== "PIC") {
    return { error: "Sesi tidak valid. Silakan login ulang." };
  }

  const parsed = postingSchema.safeParse({
    link: formData.get("link"),
    akunId: formData.get("akunId"),
    postedAt: formData.get("postedAt"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Verifikasi akun ini beneran milik PIC yang login — cegah orang catat posting buat akun orang lain
  const akun = await prisma.akun.findUnique({ where: { id: parsed.data.akunId } });
  if (!akun || akun.picId !== session.userId) {
    return { error: "Akun ini bukan milik kamu." };
  }

  await prisma.posting.create({
    data: {
      link: parsed.data.link,
      postedAt: parsed.data.postedAt,
      akunId: akun.id,
      brandId: akun.brandId,
      platformId: akun.platformId,
    },
  });

  revalidatePath("/portal/posting");
  revalidatePath("/portal");
  return { success: true };
}

export async function deletePortalPosting(id: string) {
  const session = await getSession();
  if (!session.userId || session.role !== "PIC") {
    return { error: "Sesi tidak valid." };
  }

  const posting = await prisma.posting.findUnique({ where: { id }, include: { akun: true } });
  if (!posting || posting.akun.picId !== session.userId) {
    return { error: "Posting ini bukan milik kamu." };
  }

  await prisma.posting.delete({ where: { id } });
  revalidatePath("/portal/posting");
  revalidatePath("/portal");
  return { success: true };
}
