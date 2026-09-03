"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const performanceSchema = z.object({
  postingId: z.string().min(1, "Posting wajib dipilih"),
  views: z.coerce.number().int().min(0),
  likes: z.coerce.number().int().min(0),
  comments: z.coerce.number().int().min(0),
  shares: z.coerce.number().int().min(0),
  saves: z.coerce.number().int().min(0),
  profileVisit: z.coerce.number().int().min(0),
  websiteClick: z.coerce.number().int().min(0),
  follows: z.coerce.number().int().min(0),
  leadsWaDm: z.coerce.number().int().min(0),
});

export async function createPortalPerformance(formData: FormData) {
  const session = await getSession();
  if (!session.userId || session.role !== "PIC") {
    return { error: "Sesi tidak valid. Silakan login ulang." };
  }

  const parsed = performanceSchema.safeParse({
    postingId: formData.get("postingId"),
    views: formData.get("views"),
    likes: formData.get("likes"),
    comments: formData.get("comments"),
    shares: formData.get("shares"),
    saves: formData.get("saves"),
    profileVisit: formData.get("profileVisit"),
    websiteClick: formData.get("websiteClick"),
    follows: formData.get("follows"),
    leadsWaDm: formData.get("leadsWaDm"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const posting = await prisma.posting.findUnique({
    where: { id: parsed.data.postingId },
    include: { akun: true },
  });
  if (!posting || posting.akun.picId !== session.userId) {
    return { error: "Posting ini bukan milik kamu." };
  }

  const { postingId, ...metrics } = parsed.data;
  void postingId;

  await prisma.performance.create({
    data: {
      ...metrics,
      akunId: posting.akunId,
      platformId: posting.platformId,
      date: posting.postedAt,
      source: "MANUAL",
    },
  });

  revalidatePath("/portal/performance");
  revalidatePath("/portal");
  return { success: true };
}
