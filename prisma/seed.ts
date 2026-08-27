import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  mockBrands,
  mockPlatforms,
  mockUsers,
  mockAkun,
  mockTargetKpi,
  mockContentPlans,
  mockPostings,
  mockPerformance,
  mockPendingApprovals,
  mockApprovalHistory,
  mockActivityLog,
  mockDraftStock,
} from "../src/lib/mockData";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Users
  for (const u of mockUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        role: u.role as "ADMIN" | "PIC",
        isActive: u.isActive,
      },
    });
  }

  // 2. Brands
  for (const b of mockBrands) {
    await prisma.brand.upsert({
      where: { name: b.name },
      update: {},
      create: { name: b.name, isActive: b.isActive },
    });
  }

  // 3. Platforms
  for (const p of mockPlatforms) {
    await prisma.platform.upsert({
      where: { name: p.name },
      update: {},
      create: { name: p.name },
    });
  }

  // 4. Akun
  for (const a of mockAkun) {
    const brand = await prisma.brand.findUnique({ where: { name: a.brand } });
    const platform = await prisma.platform.findUnique({ where: { name: a.platform } });
    const pic = await prisma.user.findFirst({ where: { name: a.pic } });

    if (!brand || !platform) continue;

    await prisma.akun.upsert({
      where: { username_platformId: { username: a.username, platformId: platform.id } },
      update: {},
      create: {
        username: a.username,
        status: a.status as "ACTIVE" | "INACTIVE",
        apiConnected: a.apiConnected,
        lastPostAt: new Date(a.lastPostAt),
        brandId: brand.id,
        platformId: platform.id,
        picId: pic?.id,
      },
    });
  }

  // 5. Target KPI
  for (const t of mockTargetKpi) {
    const brand = await prisma.brand.findUnique({ where: { name: t.brand } });
    const pic = await prisma.user.findFirst({ where: { name: t.pic } });
    if (!brand || !pic) continue;

    await prisma.targetKpi.create({
      data: {
        period: t.period,
        targetPosting: t.targetPosting,
        targetViews: t.targetViews,
        targetLeads: t.targetLeads,
        brandId: brand.id,
        picId: pic.id,
      },
    });
  }

  // 6. Content Plans
  for (const c of mockContentPlans) {
    const brand = await prisma.brand.findUnique({ where: { name: c.brand } });
    const platform = await prisma.platform.findUnique({ where: { name: c.platform } });
    const pic = await prisma.user.findFirst({ where: { name: c.pic } });
    const akun = platform
      ? await prisma.akun.findFirst({ where: { username: c.akun, platformId: platform.id } })
      : null;

    if (!brand || !platform || !akun || !pic) continue;

    await prisma.contentPlan.create({
      data: {
        title: c.title,
        scheduledDate: new Date(c.scheduledDate),
        status: c.status as
          | "DRAFT"
          | "EDITING"
          | "APPROVAL"
          | "SCHEDULED"
          | "POSTED",
        brandId: brand.id,
        platformId: platform.id,
        akunId: akun.id,
        picId: pic.id,
      },
    });
  }

  // 7. Postings
  for (const p of mockPostings) {
    const brand = await prisma.brand.findUnique({ where: { name: p.brand } });
    const platform = await prisma.platform.findUnique({ where: { name: p.platform } });
    const akun = platform
      ? await prisma.akun.findFirst({ where: { username: p.akun, platformId: platform.id } })
      : null;

    if (!brand || !platform || !akun) continue;

    await prisma.posting.create({
      data: {
        link: p.link,
        postedAt: new Date(p.postedAt),
        brandId: brand.id,
        platformId: platform.id,
        akunId: akun.id,
      },
    });
  }

  // 8. Performance
  for (const p of mockPerformance) {
    const platform = await prisma.platform.findUnique({ where: { name: p.platform } });
    const akun = platform
      ? await prisma.akun.findFirst({ where: { username: p.akun, platformId: platform.id } })
      : null;

    if (!platform || !akun) continue;

    await prisma.performance.create({
      data: {
        date: new Date(p.date),
        views: p.views,
        likes: p.likes,
        comments: p.comments,
        shares: p.shares,
        saves: p.saves,
        profileVisit: p.profileVisit,
        websiteClick: p.websiteClick,
        follows: p.follows,
        leadsWaDm: p.leadsWaDm,
        source: p.source as "MANUAL" | "API",
        akunId: akun.id,
        platformId: platform.id,
      },
    });
  }

  // 9. Pending Approvals
  for (const ap of mockPendingApprovals) {
    const brand = await prisma.brand.findUnique({ where: { name: ap.brand } });
    const akun = await prisma.akun.findFirst({ where: { username: ap.akun } });
    const submittedBy = await prisma.user.findFirst({ where: { name: ap.submittedBy } });

    if (!brand || !akun || !submittedBy) continue;

    await prisma.pendingApproval.create({
      data: {
        title: ap.title,
        revision: ap.revision,
        brandId: brand.id,
        akunId: akun.id,
        submittedById: submittedBy.id,
      },
    });
  }

  // 10. Approval History
  for (const ah of mockApprovalHistory) {
    const decidedBy = await prisma.user.findFirst({ where: { name: ah.decidedBy } });
    if (!decidedBy) continue;

    await prisma.approvalHistory.create({
      data: {
        title: ah.title,
        status: ah.status as "APPROVED" | "REJECTED",
        note: ah.note,
        date: new Date(ah.date),
        decidedById: decidedBy.id,
      },
    });
  }

  // 11. Activity Log
  for (const log of mockActivityLog) {
    const user = await prisma.user.findFirst({ where: { name: log.user } });
    if (!user) continue;

    await prisma.activityLog.create({
      data: {
        action: log.action,
        entity: log.entity,
        detail: log.detail,
        userId: user.id,
      },
    });
  }

  // 12. Draft Stock + weeks
  for (const ds of mockDraftStock) {
    // brand & pic di data ini belum tentu ada di mockBrands/mockUsers,
    // jadi kita upsert brand-nya biar tetap konsisten (idempotent)
    const brand = await prisma.brand.upsert({
      where: { name: ds.brand },
      update: {},
      create: { name: ds.brand, isActive: true },
    });

    let pic = await prisma.user.findFirst({ where: { name: ds.pic } });
    if (!pic) {
      pic = await prisma.user.create({
        data: {
          name: ds.pic,
          email: `${ds.pic.toLowerCase().replace(/\s+/g, ".")}@kontenmanager.local`,
          role: "PIC",
          isActive: true,
        },
      });
    }

    const draftStock = await prisma.draftStock.create({
      data: {
        linkDraft: ds.linkDraft,
        brandId: brand.id,
        picId: pic.id,
      },
    });

    for (const w of ds.weeks) {
      await prisma.draftStockWeek.create({
        data: {
          label: w.label,
          count: w.count,
          draftStockId: draftStock.id,
        },
      });
    }
  }

  console.log("Seeding selesai");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });