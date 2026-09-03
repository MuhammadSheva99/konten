"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function savePortalKpiInput(
  templateItemId: string,
  period: string,
  value: number
) {
  const session = await getSession();
  if (!session.userId || session.role !== "PIC") {
    return { error: "Sesi tidak valid." };
  }

  if (isNaN(value) || value < 0) {
    return { error: "Nilai tidak valid" };
  }

  await prisma.kpiManualInput.upsert({
    where: {
      templateItemId_scopeType_scopeId_period: {
        templateItemId,
        scopeType: "PIC",
        scopeId: session.userId,
        period,
      },
    },
    update: { value },
    create: { templateItemId, scopeType: "PIC", scopeId: session.userId, period, value },
  });

  return { success: true };
}