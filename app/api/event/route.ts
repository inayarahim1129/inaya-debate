import { NextRequest, NextResponse } from "next/server";
import { EVENT_COOKIE } from "@/lib/session";

export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get("format");
  const url = req.nextUrl.clone();
  url.pathname = "/home";
  url.search = "";
  const res = NextResponse.redirect(url);

  if (format === "LD" || format === "PF") {
    res.cookies.set(EVENT_COOKIE, format, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  } else {
    res.cookies.delete(EVENT_COOKIE);
  }

  return res;
}
