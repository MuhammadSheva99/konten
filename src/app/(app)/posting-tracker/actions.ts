"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const postingSchema = z.object({
  link: z.string().trim().url("Link harus berupa URL yang valid"),
  brandId: z.string().min(1, "Brand wajib dipilih"),
  platformId: z.string().min(1, "Platform wajib dipilih"),
  akunId: z.string().min(1, "Akun wajib dipilih"),
  postedAt: z.coerce.date(),
});

export async function createPosting(formData: FormData) {
  const parsed = postingSchema.safeParse({
    link: formData.get("link"),
    brandId: formData.get("brandId"),
    platformId: formData.get("platformId"),
    akunId: formData.get("akunId"),
    postedAt: formData.get("postedAt"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.posting.create({ data: parsed.data });

  revalidatePath("/posting-tracker");
  return { success: true };
}

export async function deletePosting(id: string) {
  await prisma.posting.delete({ where: { id } });
  revalidatePath("/posting-tracker");
  return { success: true };
}
