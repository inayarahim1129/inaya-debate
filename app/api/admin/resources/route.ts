import { NextRequest, NextResponse } from "next/server";
import { adminCreateResource, adminDeleteResource, listResources, supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ resources: await listResources() });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.section || !body?.title || !body?.type) {
    return NextResponse.json({ error: "section, title, and type are required" }, { status: 400 });
  }
  if (body.type === "youtube" && !body.url) {
    return NextResponse.json({ error: "YouTube resources need a URL" }, { status: 400 });
  }
  if (body.type === "file" && !body.storage_path) {
    return NextResponse.json({ error: "File resources need an uploaded file" }, { status: 400 });
  }
  if (body.type === "guide" && !body.content) {
    return NextResponse.json({ error: "Guides need content" }, { status: 400 });
  }
  const resource = await adminCreateResource({
    section: body.section,
    category: body.category?.trim() || "general",
    title: body.title.trim(),
    description: body.description?.trim() || null,
    type: body.type,
    url: body.url || null,
    storage_path: body.storage_path || null,
    content: body.content || null,
    debate_format: body.debate_format || "all",
    sort_order: Number(body.sort_order) || 0,
  });
  return NextResponse.json({ resource });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const deleted = await adminDeleteResource(id);
  if (deleted?.storage_path) {
    await supabase().storage.from("library-files").remove([deleted.storage_path]).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
