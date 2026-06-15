import { generateText } from "ai";
import { readFileSync } from "node:fs";
// load OIDC token like Next dev does
for (const f of [".env.development.local", ".env.local"]) {
  for (const l of readFileSync(f, "utf8").split("\n")) {
    const i = l.indexOf("=");
    if (i > 0 && !l.startsWith("#")) {
      const k = l.slice(0, i).trim();
      let v = l.slice(i + 1).trim().replace(/^"|"$/g, "");
      if (!(k in process.env)) process.env[k] = v;
    }
  }
}
const models = process.argv.slice(2);
for (const m of models) {
  try {
    const r = await generateText({ model: m, prompt: "Say OK." });
    console.log("✓", m, "→", r.text.slice(0, 20).replace(/\n/g, " "));
  } catch (e) {
    console.log("✗", m, "→", (e.message || "").slice(0, 90).replace(/\n/g, " "));
  }
}
