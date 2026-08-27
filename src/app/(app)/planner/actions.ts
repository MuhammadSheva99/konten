"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const contentPlanSchema = z.object({
  title: z.string().trim().min(1, "Judul tidak boleh kosong").max(150),
  brandId: z.string().min(1, "Brand wajib dipilih"),
  platformId: z.string().min(1, "Platform wajib dipilih"),
  akunId: z.string().min(1, "Akun wajib dipilih"),
  picId: z.string().min(1, "PIC wajib dipilih"),
  scheduledDate: z.coerce.date(),
  priority: z.enum(["URGENT", "TINGGI", "NORMAL", "RENDAH"]),
});

export async function createContentPlan(formData: FormData) {
  const parsed = contentPlanSchema.safeParse({
    title: formData.get("title"),
    brandId: formData.get("brandId"),
    platformId: formData.get("platformId"),
    akunId: formData.get("akunId"),
    picId: formData.get("picId"),
    scheduledDate: formData.get("scheduledDate"),
    priority: formData.get("priority"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.contentPlan.create({ data: parsed.data });

  revalidatePath("/planner");
  return { success: true };
}

export async function updatePriority(id: string, priority: "URGENT" | "TINGGI" | "NORMAL" | "RENDAH") {
  await prisma.contentPlan.update({ where: { id }, data: { priority } });
  revalidatePath("/planner");
  return { success: true };
}

export async function deleteContentPlan(id: string) {
  await prisma.contentPlan.delete({ where: { id } });
  revalidatePath("/planner");
  return { success: true };
}
