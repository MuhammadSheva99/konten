import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function refreshAccessTokenIfNeeded(akun: {
  id: string;
  tiktokAccessToken: string | null;
  tiktokRefreshToken: string | null;
  tiktokTokenExpiresAt: Date | null;
}) {
  const isExpired =
    !akun.tiktokTokenExpiresAt || akun.tiktokTokenExpiresAt.getTime() < Date.now() + 60_000;

  if (!isExpired) return akun.tiktokAccessToken!;

  if (!akun.tiktokRefreshToken) {
    throw new Error("Refresh token tidak tersedia. Silakan connect ulang akun ini.");
  }

  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: akun.tiktokRefreshToken,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error("Gagal refresh token TikTok. Silakan connect ulang akun ini.");
  }

  const expiresAt = new Date(Date.now() + data.expires_in * 1000);
  await prisma.akun.update({
    where: { id: akun.id },
    data: {
      tiktokAccessToken: data.access_token,
      tiktokRefreshToken: data.refresh_token,
      tiktokTokenExpiresAt: expiresAt,
    },
  });

  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  const { akunId } = await req.json();
  if (!akunId) {
    return NextResponse.json({ error: "akunId wajib diisi" }, { status: 400 });
  }

  const akun = await prisma.akun.findUnique({ where: { id: akunId } });
  if (!akun || !akun.apiConnected) {
    return NextResponse.json({ error: "Akun ini belum terhubung ke TikTok." }, { status: 400 });
  }

  try {
    const accessToken = await refreshAccessTokenIfNeeded(akun);

    const fields = [
      "id",
      "create_time",
      "share_url",
      "view_count",
      "like_count",
      "comment_count",
      "share_count",
    ].join(",");

    const videoRes = await fetch(
      `https://open.tiktokapis.com/v2/video/list/?fields=${fields}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ max_count: 20 }),
      }
    );
    const videoData = await videoRes.json();

    if (!videoRes.ok || videoData.error?.code !== "ok") {
      console.error("TikTok video.list gagal:", videoData);
      return NextResponse.json(
        { error: "Gagal mengambil data video dari TikTok." },
        { status: 502 }
      );
    }

    // Ambil & simpan snapshot follower count hari ini
    try {
      const userInfoRes = await fetch(
        "https://open.tiktokapis.com/v2/user/info/?fields=follower_count",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const userInfoData = await userInfoRes.json();
      const followerCount = userInfoData?.data?.user?.follower_count;

      if (typeof followerCount === "number") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await prisma.akunFollowerSnapshot.upsert({
          where: { akunId_date: { akunId: akun.id, date: today } },
          update: { followerCount },
          create: { akunId: akun.id, date: today, followerCount },
        });
      }
    } catch (snapErr) {
      // Snapshot follower gagal bukan alasan buat gagalin seluruh sync video
      console.error("Gagal ambil snapshot follower:", snapErr);
    }

    const videos = videoData.data?.videos ?? [];
    let synced = 0;

    for (const v of videos) {
      const postedAt = new Date(v.create_time * 1000);

      const posting = await prisma.posting.upsert({
        where: { tiktokVideoId: v.id },
        update: { link: v.share_url },
        create: {
          tiktokVideoId: v.id,
          link: v.share_url,
          postedAt,
          brandId: akun.brandId,
          platformId: akun.platformId,
          akunId: akun.id,
        },
      });
      void posting;

      await prisma.performance.upsert({
        where: { tiktokVideoId: v.id },
        update: {
          views: v.view_count ?? 0,
          likes: v.like_count ?? 0,
          comments: v.comment_count ?? 0,
          shares: v.share_count ?? 0,
        },
        create: {
          tiktokVideoId: v.id,
          date: postedAt,
          views: v.view_count ?? 0,
          likes: v.like_count ?? 0,
          comments: v.comment_count ?? 0,
          shares: v.share_count ?? 0,
          saves: 0,
          profileVisit: 0,
          websiteClick: 0,
          follows: 0,
          leadsWaDm: 0,
          source: "API",
          akunId: akun.id,
          platformId: akun.platformId,
        },
      });

      synced++;
    }

    return NextResponse.json({ success: true, synced });
  } catch (err) {
    console.error("Error sync TikTok:", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}