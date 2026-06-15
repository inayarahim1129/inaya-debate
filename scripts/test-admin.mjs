import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>[l.slice(0,l.indexOf("=")),l.slice(l.indexOf("=")+1).trim()]));
const BASE = "http://localhost:3000";

// admin login
const login = await fetch(`${BASE}/api/admin/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ password: env.ADMIN_PASSWORD })});
const cookie = login.headers.get("set-cookie").split(";")[0];
console.log("admin login:", login.status);

// upload a test file to library-files (same path the browser admin uses)
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const path = `${Date.now()}-test-handout.txt`;
const { error: upErr } = await db.storage.from("library-files").upload(path, Buffer.from("Sample debate handout: always signpost!"), { contentType: "text/plain" });
console.log("storage upload:", upErr ? "FAIL "+upErr.message : "ok");

// create the resource record
const res = await fetch(`${BASE}/api/admin/resources`, { method:"POST", headers:{"Content-Type":"application/json", cookie}, body: JSON.stringify({ section:"library", category:"handouts", title:"Test Handout (delete me)", description:"Verification file", type:"file", storage_path: path })});
const body = await res.json();
console.log("resource create:", res.status, body.resource?.id);

// public URL fetch (what students click)
const pub = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/library-files/${path}`);
console.log("public download:", pub.status, (await pub.text()).slice(0, 30));

// delete (also removes from storage)
const del = await fetch(`${BASE}/api/admin/resources`, { method:"DELETE", headers:{"Content-Type":"application/json", cookie}, body: JSON.stringify({ id: body.resource.id })});
console.log("resource delete:", del.status);
const pub2 = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/library-files/${path}`);
console.log("file gone after delete:", pub2.status === 400 || pub2.status === 404 ? "yes" : "NO ("+pub2.status+")");
