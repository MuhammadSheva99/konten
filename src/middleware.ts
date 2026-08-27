import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Halaman portal (PIC) — wajib punya pic_session
  if (pathname.startsWith("/portal")) {
    const picSession = req.cookies.get("pic_session");
    if (!picSession) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Sisanya dianggap area admin — wajib punya admin_session
  const adminSession = req.cookies.get("admin_session");
  if (!adminSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Middleware berlaku untuk semua path KECUALI:
     * - /login (halaman login itu sendiri)
     * - /api (semua API route, termasuk /api/auth/login dan /api/auth/tiktok/*)
     * - file statis Next.js (_next, favicon, dll)
     */
    "/((?!login|api|_next/static|_next/image|favicon.ico).*)",
  ],
};