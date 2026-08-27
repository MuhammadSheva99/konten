import { prisma } from "@/lib/prisma";
import PostingTrackerClient from "./PostingTrackerClient";

export default async function PostingTrackerPage() {
  const postings = await prisma.posting.findMany({
    include: {
      brand: { select: { name: true } },
      platform: { select: { name: true } },
      akun: { select: { username: true, pic: { select: { name: true } } } },
    },
    orderBy: { postedAt: "desc" },
  });
  const brands = await prisma.brand.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  const platforms = await prisma.platform.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  const akunList = await prisma.akun.findMany({ select: { id: true, username: true }, orderBy: { username: "asc" } });
  const pics = await prisma.user.findMany({
    where: { role: "PIC" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <PostingTrackerClient
      postings={postings}
      brands={brands}
      platforms={platforms}
      akunList={akunList}
      pics={pics}
    />
  );
}
