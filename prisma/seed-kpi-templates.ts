import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {

  const brandTemplate = await prisma.kpiTemplate.create({
    data: {
      name: "TikTok Brand (Official)",
      category: "OFFICIAL",
      items: {
        create: [
          { order: 1, name: "Jumlah Leads Masuk WA", metricDescription: "Total leads dari TikTok yang masuk WA", weight: 20, targetLabel: "1000", targetNumeric: 1000, computeType: "MANUAL" },
          { order: 2, name: "Qualified Leads", metricDescription: "Total leads masuk WA yang memang prospek (sesuai kriteria)", weight: 30, targetLabel: "500", targetNumeric: 500, computeType: "MANUAL" },
          { order: 3, name: "FYP/Bulan", metricDescription: "Total konten FYP dari seluruh akun yang dipegang", weight: 15, targetLabel: "20", targetNumeric: 20, computeType: "MANUAL" },
          { order: 4, name: "Kesehatan Akun", metricDescription: "Total akun dengan ER/bulan minimal 6% = (Like+Comment+Share+Save)/Views×100%", weight: 10, targetLabel: "3 Akun", targetNumeric: 3, computeType: "AUTO_HEALTHY_ACCOUNTS" },
          { order: 5, name: "Efisiensi Boost Post", metricDescription: "Cost per 1000 views dari boost post per bulan. Makin rendah makin bagus", weight: 10, targetLabel: "Rp 4.000", targetNumeric: 4000, computeType: "MANUAL" },
          { order: 6, name: "Konsisten Posting", metricDescription: "Total posting aktual vs target/bulan", weight: 10, targetLabel: "140", targetNumeric: 140, computeType: "AUTO_POSTING_COUNT" },
          { order: 7, name: "Evaluasi Konten Mingguan", metricDescription: "Total evaluasi yang dilakukan dalam 1 bulan", weight: 5, targetLabel: "4", targetNumeric: 4, computeType: "MANUAL" },
        ],
      },
    },
  });

  // ===== TikTok Outlet ===== 
  const outletTemplate = await prisma.kpiTemplate.create({
    data: {
      name: "TikTok Outlet",
      category: "OUTLET",
      items: {
        create: [
          { order: 1, name: "Konsisten Posting", metricDescription: "Total posting aktual vs target/bulan", weight: 30, targetLabel: "140", targetNumeric: 140, computeType: "AUTO_POSTING_COUNT" },
          { order: 2, name: "Evaluasi Konten Mingguan", metricDescription: "Total evaluasi yang dilakukan dalam 1 bulan", weight: 15, targetLabel: "4", targetNumeric: 4, computeType: "MANUAL" },
          { order: 3, name: "View Growth Bulanan naik 50%", metricDescription: "Total akun yang view growth-nya naik 50% dibanding bulan sebelumnya", weight: 15, targetLabel: "5 Akun", targetNumeric: 5, computeType: "MANUAL" },
          { order: 4, name: "FYP/Bulan", metricDescription: "Total konten FYP dari seluruh akun yang dipegang", weight: 10, targetLabel: "20", targetNumeric: 20, computeType: "MANUAL" },
          { order: 5, name: "Visit Outlet", metricDescription: "Total visit outlet rutin untuk pembuatan konten", weight: 15, targetLabel: "10", targetNumeric: 10, computeType: "MANUAL" },
          { order: 6, name: "Omset Outlet", metricDescription: "Total omset dari semua outlet", weight: 15, targetLabel: "60jt", targetNumeric: 60000000, computeType: "MANUAL" },
        ],
      },
    },
  });

  // ===== Template 3a: Dracin - Bulan Pertama =====
  const dracinBulan1 = await prisma.kpiTemplate.create({
    data: {
      name: "TikTok Dracin - Bulan Pertama",
      category: "DRACIN",
      items: {
        create: [
          { order: 1, name: "Konsistensi Posting", metricDescription: "Realisasi posting per bulan", weight: 20, targetLabel: "90 video/bulan", targetNumeric: 90, computeType: "AUTO_POSTING_COUNT" },
          { order: 2, name: "Stok Draft Konten", metricDescription: "Jumlah draft siap upload", weight: 10, targetLabel: "24 draft/bulan", targetNumeric: 24, computeType: "MANUAL" },
          { order: 3, name: "Total Views", metricDescription: "Total views seluruh konten selama bulan berjalan", weight: 25, targetLabel: "≥750.000 views", targetNumeric: 750000, computeType: "AUTO_TOTAL_VIEWS" },
          { order: 4, name: "Engagement Rate", metricDescription: "(Like+Comment+Share+Save) ÷ Views", weight: 15, targetLabel: "≥6%", targetNumeric: 6, computeType: "AUTO_ENGAGEMENT_RATE" },
          { order: 5, name: "Profile Views", metricDescription: "Total profile views selama bulan berjalan", weight: 20, targetLabel: "≥15.000 profile views", targetNumeric: 15000, computeType: "MANUAL" },
          { order: 6, name: "New Followers", metricDescription: "Jumlah followers baru selama bulan berjalan", weight: 10, targetLabel: "≥1000 followers", targetNumeric: 1000, computeType: "MANUAL" },
        ],
      },
    },
  });

  // ===== Template 3b: Dracin - Bulan Selanjutnya =====
  const dracinBulanLanjut = await prisma.kpiTemplate.create({
    data: {
      name: "TikTok Dracin - Bulan Selanjutnya",
      category: "DRACIN",
      items: {
        create: [
          { order: 1, name: "Konsistensi Posting", metricDescription: "Realisasi posting per bulan", weight: 20, targetLabel: "±90 video/bulan (3x/hari)", targetNumeric: 90, computeType: "AUTO_POSTING_COUNT" },
          { order: 2, name: "Stok Draft Konten", metricDescription: "Jumlah draft siap upload", weight: 10, targetLabel: "24 draft/bulan", targetNumeric: 24, computeType: "MANUAL" },
          { order: 3, name: "Total Views / View Growth", metricDescription: "Pertumbuhan total views vs bulan sebelumnya (MoM)", weight: 25, targetLabel: "≥50%", targetNumeric: 50, computeType: "MANUAL" },
          { order: 4, name: "Engagement Rate", metricDescription: "(Like+Comment+Share+Save) ÷ Views", weight: 15, targetLabel: "6%", targetNumeric: 6, computeType: "AUTO_ENGAGEMENT_RATE" },
          { order: 5, name: "Profile Views Growth", metricDescription: "Pertumbuhan profile views MoM", weight: 20, targetLabel: "≥40%", targetNumeric: 40, computeType: "MANUAL" },
          { order: 6, name: "Followers Growth", metricDescription: "Pertumbuhan followers MoM", weight: 10, targetLabel: "≥30%", targetNumeric: 30, computeType: "MANUAL" },
        ],
      },
    },
  });

  console.log("Seed KPI templates selesai:");
  console.log("-", brandTemplate.name);
  console.log("-", outletTemplate.name);
  console.log("-", dracinBulan1.name);
  console.log("-", dracinBulanLanjut.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });