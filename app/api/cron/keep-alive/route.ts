import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Never cache — every hit must reach the live database.
export const dynamic = "force-dynamic";

// Keep-alive ping.
//
// Supabase free-tier projects pause after ~7 days with no database activity
// (this is what paused the app's original Supabase project). A daily Vercel
// Cron job hits this route and runs one trivial read, so the database always
// sees activity inside the 7-day window and never pauses.
//
// Wired up in vercel.json -> crons. Harmless to hit manually too.
export async function GET() {
  const { error } = await supabase().from("resources").select("id").limit(1);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
}
