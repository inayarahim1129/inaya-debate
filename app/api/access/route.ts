import { NextRequest, NextResponse } from "next/server";
import { verifyAccessCode } from "@/lib/supabase";
import { signSession, SCHOOL_COOKIE, SchoolSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { code } = await req.json().catch(() => ({ code: "" }));
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }
  const school = await verifyAccessCode(code);
  if (!school) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }
  const session: SchoolSession = { schoolId: school.id, schoolName: school.name };
  const token = await signSession(session);
  const res = NextResponse.json({ ok: true, schoolName: school.name });
  res.cookies.set(SCHOOL_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 180, // 6 months — survives a semester
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SCHOOL_COOKIE);
  return res;
}
