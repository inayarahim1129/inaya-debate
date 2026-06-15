import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);
const BASE = "http://localhost:3000";

// 1. access code → cookie
const access = await fetch(`${BASE}/api/access`, {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: "DEMO2026" }),
});
const cookie = access.headers.get("set-cookie").split(";")[0];
console.log("access:", access.status, cookie.slice(0, 30) + "…");

// 2. create round
const created = await fetch(`${BASE}/api/rounds`, {
  method: "POST", headers: { "Content-Type": "application/json", cookie },
  body: JSON.stringify({ format: "LD" }),
});
const { round } = await created.json();
console.log("round:", created.status, round.id);

// 3. upload audio to storage (same path the browser uses)
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const audio = readFileSync("/tmp/round.m4a");
const path = `${round.id}/recording.m4a`;
const { error: upErr } = await db.storage.from("round-audio")
  .upload(path, audio, { contentType: "audio/mp4", upsert: true });
if (upErr) throw upErr;
console.log("upload: ok", path);

// 4. analyze
console.time("analyze");
const analyzed = await fetch(`${BASE}/api/rounds/${round.id}/analyze`, {
  method: "POST", headers: { "Content-Type": "application/json", cookie },
  body: JSON.stringify({ path, mediaType: "audio/mp4" }),
});
console.timeEnd("analyze");
const result = await analyzed.json();
console.log("analyze:", analyzed.status, JSON.stringify(result).slice(0, 200));
console.log("RESULT URL:", `${BASE}/practice-round/${round.id}`);
