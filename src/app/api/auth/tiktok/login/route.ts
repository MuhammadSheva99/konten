import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const akunId = req.nextUrl.searchParams.get("akunId");
  if (!akunId) {
    return NextResponse.json({ error: "akunId wajib diisi" }, { status: 400 });
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY!;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI!;

  // PKCE: TikTok Desktop meminta code_challenge dalam bentuk hex-encoded SHA256
  const codeVerifier = crypto.randomBytes(64).toString("hex"); // 128 karakter, sesuai batas 43-128
  const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("hex");

  const state = crypto.randomBytes(16).toString("hex");

  const scopes = ["user.info.basic", "user.info.stats", "video.list"].join(",");

  const authorizeUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  authorizeUrl.searchParams.set("client_key", clientKey);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", scopes);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(authorizeUrl.toString());

  // Simpan state, verifier, dan akunId sementara (httpOnly cookie, berlaku 10 menit)
  const cookieOptions = { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax" as const };
  response.cookies.set("tiktok_oauth_state", state, cookieOptions);
  response.cookies.set("tiktok_oauth_verifier", codeVerifier, cookieOptions);
  response.cookies.set("tiktok_oauth_akun_id", akunId, cookieOptions);

  return response;
}
