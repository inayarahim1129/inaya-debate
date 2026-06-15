import { NextRequest, NextResponse } from "next/server";
import { getRound } from "@/lib/supabase";
import { verifySession, SCHOOL_COOKIE, SchoolSession } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession<SchoolSession>(req.cookies.get(SCHOOL_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { id } = await params;
  const round = await getRound(id);
  if (!round?.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: round.id, status: round.status, error: round.error });
}
