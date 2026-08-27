import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const errorParam = req.nextUrl.searchParams.get("error");

  const savedState = req.cookies.get("tiktok_oauth_state")?.value;
  const codeVerifier = req.cookies.get("tiktok_oauth_verifier")?.value;
  const akunId = req.cookies.get("tiktok_oauth_akun_id")?.value;

  const redirectBase = new URL("/master-data/akun", req.url);

  if (errorParam) {
    redirectBase.searchParams.set("tiktok_error", "Otorisasi dibatalkan atau ditolak.");
    return NextResponse.redirect(redirectBase);
  }

  if (!code || !state || !savedState || state !== savedState || !codeVerifier || !akunId) {
    redirectBase.searchParams.set("tiktok_error", "Sesi otorisasi tidak valid atau kedaluwarsa. Coba lagi.");
    return NextResponse.redirect(redirectBase);
  }

  try {
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || tokenData.error) {
      console.error("TikTok token exchange gagal:", tokenData);
      redirectBase.searchParams.set("tiktok_error", "Gagal menukar kode otorisasi dengan token.");
      return NextResponse.redirect(redirectBase);
    }

    const { access_token, refresh_token, expires_in, open_id } = tokenData;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await prisma.akun.update({
      where: { id: akunId },
      data: {
        tiktokOpenId: open_id,
        tiktokAccessToken: access_token,
        tiktokRefreshToken: refresh_token,
        tiktokTokenExpiresAt: expiresAt,
        apiConnected: true,
      },
    });

    redirectBase.searchParams.set("tiktok_success", "1");
  } catch (err) {
    console.error("Error saat proses callback TikTok:", err);
    redirectBase.searchParams.set("tiktok_error", "Terjadi kesalahan tak terduga.");
  }

  const response = NextResponse.redirect(redirectBase);
  response.cookies.delete("tiktok_oauth_state");
  response.cookies.delete("tiktok_oauth_verifier");
  response.cookies.delete("tiktok_oauth_akun_id");
  return response;
}
