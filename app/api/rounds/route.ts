import { NextRequest, NextResponse } from "next/server";
import { createRound } from "@/lib/supabase";
import { verifySession, SCHOOL_COOKIE, SchoolSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await verifySession<SchoolSession>(req.cookies.get(SCHOOL_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { format } = await req.json().catch(() => ({}));
  if (!["LD", "PF", "WS"].includes(format)) {
    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  }
  const round = await createRound(session.schoolId, format);
  return NextResponse.json({ round });
}
