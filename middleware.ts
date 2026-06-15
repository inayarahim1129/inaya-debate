import { NextRequest, NextResponse } from "next/server";
import { verifySession, SCHOOL_COOKIE, ADMIN_COOKIE, SchoolSession, AdminSession } from "./lib/session";

const STUDENT_PREFIXES = [
  "/home",
  "/case-construction",
  "/rebuttals",
  "/styles",
  "/library",
  "/practice-round",
  "/guide",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (STUDENT_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const session = await verifySession<SchoolSession>(req.cookies.get(SCHOOL_COOKIE)?.value);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const session = await verifySession<AdminSession>(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!session?.admin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/case-construction/:path*",
    "/rebuttals/:path*",
    "/styles/:path*",
    "/library/:path*",
    "/practice-round/:path*",
    "/guide/:path*",
    "/home",
    "/case-construction",
    "/rebuttals",
    "/library",
    "/practice-round",
    "/admin/:path*",
  ],
};
