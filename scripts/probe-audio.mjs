import { generateText } from "ai";
import { readFileSync } from "node:fs";
for (const f of [".env.development.local", ".env.local"]) {
  for (const l of readFileSync(f, "utf8").split("\n")) {
    const i = l.indexOf("=");
    if (i > 0 && !l.startsWith("#")) {
      const k = l.slice(0, i).trim();
      if (!(k in process.env)) process.env[k] = l.slice(i + 1).trim().replace(/^"|"$/g, "");
    }
  }
}
const audio = readFileSync("/tmp/round.m4a");
const r = await generateText({
  model: "google/gemini-2.5-flash",
  messages: [{ role: "user", content: [
    { type: "text", text: "Transcribe the first two sentences of this recording." },
    { type: "file", data: audio, mediaType: "audio/mp4" },
  ]}],
});
console.log("AUDIO OK →", r.text.slice(0, 200));
