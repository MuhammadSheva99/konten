import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const newFollowers = await prisma.kpiTemplateItem.updateMany({
    where: { name: "New Followers" },
    data: { computeType: "AUTO_FOLLOWER_GROWTH_ABS" },
  });

  const followersGrowth = await prisma.kpiTemplateItem.updateMany({
    where: { name: "Followers Growth" },
    data: { computeType: "AUTO_FOLLOWER_GROWTH_PCT" },
  });

  console.log(`✅ Update selesai. New Followers: ${newFollowers.count} baris, Followers Growth: ${followersGrowth.count} baris.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });