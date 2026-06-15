import { NextRequest, NextResponse } from "next/server";
import { adminCreateSchool, adminDeleteSchool, adminListSchools } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ schools: await adminListSchools() });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, code } = await req.json().catch(() => ({}));
  if (!name?.trim() || !code?.trim()) {
    return NextResponse.json({ error: "Name and code are required" }, { status: 400 });
  }
  try {
    const school = await adminCreateSchool(name.trim(), code.trim());
    return NextResponse.json({ school });
  } catch (e) {
    const msg = e instanceof Error && e.message.includes("duplicate")
      ? "That access code is already in use."
      : "Could not create school.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await adminDeleteSchool(id);
  return NextResponse.json({ ok: true });
}
