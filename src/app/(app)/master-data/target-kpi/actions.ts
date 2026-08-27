"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const targetKpiSchema = z.object({
  period: z.string().trim().min(1, "Periode tidak boleh kosong").max(30),
  picId: z.string().min(1, "PIC wajib dipilih"),
  brandId: z.string().min(1, "Brand wajib dipilih"),
  targetPosting: z.coerce.number().int().min(0, "Target posting tidak boleh negatif"),
  targetViews: z.coerce.number().int().min(0, "Target views tidak boleh negatif"),
  targetLeads: z.coerce.number().int().min(0, "Target leads tidak boleh negatif"),
});

export async function createTargetKpi(formData: FormData) {
  const parsed = targetKpiSchema.safeParse({
    period: formData.get("period"),
    picId: formData.get("picId"),
    brandId: formData.get("brandId"),
    targetPosting: formData.get("targetPosting"),
    targetViews: formData.get("targetViews"),
    targetLeads: formData.get("targetLeads"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.targetKpi.create({ data: parsed.data });

  revalidatePath("/master-data/target-kpi");
  return { success: true };
}

export async function updateTargetKpi(id: string, input: unknown) {
  const parsed = targetKpiSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.targetKpi.update({ where: { id }, data: parsed.data });

  revalidatePath("/master-data/target-kpi");
  return { success: true };
}

export async function deleteTargetKpi(id: string) {
  await prisma.targetKpi.delete({ where: { id } });
  revalidatePath("/master-data/target-kpi");
  return { success: true };
}
