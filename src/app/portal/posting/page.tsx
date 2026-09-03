import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import PostingClient from "./PostingClient";

export default async function PortalPostingPage() {
  const session = await getSession();

  const akunListRaw = await prisma.akun.findMany({
    where: { picId: session.userId },
    include: {
      brand: { select: { name: true } },
      platform: { select: { name: true } },
    },
    orderBy: { username: "asc" },
  });

  const akunList = akunListRaw.map((a) => ({
    id: a.id,
    username: a.username,
    brandName: a.brand.name,
    platformName: a.platform.name,
  }));

  const akunIds = akunListRaw.map((a) => a.id);

  const postings = await prisma.posting.findMany({
    where: { akunId: { in: akunIds } },
    include: {
      akun: { select: { username: true } },
      brand: { select: { name: true } },
      platform: { select: { name: true } },
    },
    orderBy: { postedAt: "desc" },
  });

  return <PostingClient postings={postings} akunList={akunList} />;
}
