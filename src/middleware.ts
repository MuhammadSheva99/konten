import { NextResponse, NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  const isLoggedIn = Boolean(session.userId);

  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn || session.role !== "PIC") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  }

  if (!isLoggedIn || session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};