import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Resource, Round, School, Section } from "./types";

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
  }
  return client;
}

const secret = () => process.env.SUPABASE_SERVER_SECRET!;

// All privileged operations go through security-definer RPCs guarded by the
// server secret — the anon key alone can only read public resources.

export async function verifyAccessCode(code: string): Promise<School | null> {
  const { data, error } = await supabase().rpc("verify_access_code", { p_code: code });
  if (error) throw error;
  return data && data.length > 0 ? (data[0] as School) : null;
}

export async function listResources(section?: Section): Promise<Resource[]> {
  let q = supabase()
    .from("resources")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (section) q = q.eq("section", section);
  const { data, error } = await q;
  if (error) throw error;
  return data as Resource[];
}

export async function getResource(id: string): Promise<Resource | null> {
  const { data, error } = await supabase().from("resources").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Resource | null;
}

export async function adminListSchools(): Promise<School[]> {
  const { data, error } = await supabase().rpc("admin_list_schools", { p_secret: secret() });
  if (error) throw error;
  return data as School[];
}

export async function adminCreateSchool(name: string, code: string): Promise<School> {
  const { data, error } = await supabase().rpc("admin_create_school", {
    p_secret: secret(),
    p_name: name,
    p_code: code,
  });
  if (error) throw error;
  return data as School;
}

export async function adminDeleteSchool(id: string): Promise<void> {
  const { error } = await supabase().rpc("admin_delete_school", { p_secret: secret(), p_id: id });
  if (error) throw error;
}

export async function adminCreateResource(r: {
  section: string;
  category: string;
  title: string;
  description?: string | null;
  type: string;
  url?: string | null;
  storage_path?: string | null;
  content?: string | null;
  debate_format?: string;
  sort_order?: number;
}): Promise<Resource> {
  const { data, error } = await supabase().rpc("admin_create_resource", {
    p_secret: secret(),
    p_section: r.section,
    p_category: r.category,
    p_title: r.title,
    p_description: r.description ?? null,
    p_type: r.type,
    p_url: r.url ?? null,
    p_storage_path: r.storage_path ?? null,
    p_content: r.content ?? null,
    p_debate_format: r.debate_format ?? "all",
    p_sort_order: r.sort_order ?? 0,
  });
  if (error) throw error;
  return data as Resource;
}

export async function adminDeleteResource(id: string): Promise<Resource> {
  const { data, error } = await supabase().rpc("admin_delete_resource", {
    p_secret: secret(),
    p_id: id,
  });
  if (error) throw error;
  return data as Resource;
}

export async function createRound(schoolId: string, format: string): Promise<Round> {
  const { data, error } = await supabase().rpc("create_round", {
    p_secret: secret(),
    p_school_id: schoolId,
    p_format: format,
  });
  if (error) throw error;
  return data as Round;
}

export async function getRound(id: string): Promise<Round | null> {
  const { data, error } = await supabase().rpc("get_round", { p_secret: secret(), p_id: id });
  if (error) throw error;
  return (data ?? null) as Round | null;
}

export async function updateRound(
  id: string,
  fields: Partial<Pick<Round, "status" | "audio_path" | "audio_type" | "transcript" | "error">> & {
    analysis?: unknown;
  }
): Promise<void> {
  const { error } = await supabase().rpc("update_round", {
    p_secret: secret(),
    p_id: id,
    p_status: fields.status ?? null,
    p_audio_path: fields.audio_path ?? null,
    p_audio_type: fields.audio_type ?? null,
    p_transcript: fields.transcript ?? null,
    p_analysis: fields.analysis ?? null,
    p_error: fields.error ?? null,
  });
  if (error) throw error;
}

export function publicFileUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/library-files/${storagePath}`;
}

export async function downloadRoundAudio(path: string): Promise<Blob> {
  const { data, error } = await supabase().storage.from("round-audio").download(path);
  if (error) throw error;
  return data;
}
