import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// PIC & kategori (OFFICIAL vs OUTLET)
const picGroups: {
  pic: string;
  category: "OFFICIAL" | "OUTLET";
  akun: { username: string; brand: string }[];
}[] = [
  {
    pic: "Rohman",
    category: "OFFICIAL",
    akun: [
      { username: "sundaeeverydae", brand: "Sundae Everyday" },
      { username: "floodbar.id", brand: "Floodbar" },
      { username: "rcgo.id", brand: "RCGO" },
    ],
  },
  {
    pic: "Azim",
    category: "OFFICIAL",
    akun: [
      { username: "sundaeeverydae.official", brand: "Sundae Everyday" },
      { username: "kemitraan.aloha", brand: "Aloha" },
      { username: "kuch2hotahu", brand: "Kuch2Hotahu" },
      { username: "chicktop.indonesia", brand: "Chicktop" },
    ],
  },
  {
    pic: "Putri",
    category: "OFFICIAL",
    akun: [
      { username: "baksomielioner.id", brand: "Baksomielioner" },
      { username: "mac.mozzaro", brand: "Mozzaro" },
      { username: "tahukrax.id", brand: "Tahukrax" },
      { username: "everice.id", brand: "Everice" },
    ],
  },
  {
    pic: "Nadia",
    category: "OFFICIAL",
    akun: [
      { username: "chicktop.id", brand: "Chicktop" },
      { username: "spesialistboothkoper", brand: "Spesialis Booth Koper" },
      { username: "kopikekinian.nyeskoffie", brand: "Nyeskoffie" },
      { username: "mozzy.id", brand: "Mozzy" },
    ],
  },
  {
    pic: "Doni",
    category: "OFFICIAL",
    akun: [
      { username: "chikumiid", brand: "Chikumi" },
      { username: "makemiehappy.id", brand: "Makemiehappy" },
      { username: "bingsusundaeeverydae", brand: "Sundae Everyday" },
      { username: "nyeskoffie.mitra", brand: "Nyeskoffie" },
    ],
  },
  {
    pic: "Fio",
    category: "OUTLET",
    akun: [
      { username: "chikumi.kudus", brand: "Chikumi" },
      { username: "mbakcis_", brand: "Mozzaro" },
      { username: "masdondon03", brand: "Nyeskoffie" },
      { username: "kuch2hotahukudus", brand: "Kuch2Hotahu" },
      { username: "1001bites.kudus", brand: "1001 Bites" },
      { username: "chicktop.kudus", brand: "Chicktop" },
      { username: "minzyku", brand: "Mozzy" },
      { username: "ibmp.id", brand: "IBMP" },
    ],
  },
];

async function main() {
  // 1. Pastikan platform TikTok ada
  const tiktok = await prisma.platform.upsert({
    where: { name: "TikTok" },
    update: {},
    create: { name: "TikTok" },
  });

  for (const group of picGroups) {
    // 2. Upsert PIC (User dengan role PIC)
    let pic = await prisma.user.findFirst({ where: { name: group.pic } });
    if (!pic) {
      pic = await prisma.user.create({
        data: {
          name: group.pic,
          email: `${group.pic.toLowerCase()}@kontenmanager.local`,
          role: "PIC",
          isActive: true,
        },
      });
    }

    for (const item of group.akun) {
      // 3. Upsert Brand
      const brand = await prisma.brand.upsert({
        where: { name: item.brand },
        update: {},
        create: { name: item.brand, isActive: true },
      });

      // 4. Upsert Akun (unique by username + platformId)
      await prisma.akun.upsert({
        where: {
          username_platformId: { username: item.username, platformId: tiktok.id },
        },
        update: {
          brandId: brand.id,
          picId: pic.id,
          category: group.category,
        },
        create: {
          username: item.username,
          brandId: brand.id,
          platformId: tiktok.id,
          picId: pic.id,
          category: group.category,
          status: "ACTIVE",
          apiConnected: false,
        },
      });
    }
  }

  console.log("Seed akun TikTok (Official & Outlet) selesai");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });