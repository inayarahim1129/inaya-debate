"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square, Upload, Loader2, CircleAlert } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Format = "LD" | "PF" | "WS";
type Phase = "idle" | "recording" | "uploading" | "transcribing" | "analyzing";

const FORMATS: Array<{ key: Format; label: string; sub: string }> = [
  { key: "LD", label: "Lincoln-Douglas", sub: "1 v 1 · values" },
  { key: "PF", label: "Public Forum", sub: "2 v 2 · policy-lite" },
  { key: "WS", label: "World Schools", sub: "3 v 3 · prop/opp" },
];

const MAX_BYTES = 50 * 1024 * 1024;

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) return c;
  }
  return "";
}

function extFor(mime: string): string {
  if (mime.includes("mp4")) return "m4a";
  if (mime.includes("mpeg")) return "mp3";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("wav")) return "wav";
  return "webm";
}

export default function RoundRecorder() {
  const [format, setFormat] = useState<Format>("LD");
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.start(1000);
      recorderRef.current = rec;
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
      setPhase("recording");
    } catch {
      setError("Couldn't access the microphone. Check browser permissions and try again.");
    }
  }

  async function stopAndSubmit() {
    const rec = recorderRef.current;
    if (!rec) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const mime = rec.mimeType || "audio/webm";
    const blob = await new Promise<Blob>((resolve) => {
      rec.onstop = () => resolve(new Blob(chunksRef.current, { type: mime }));
      rec.stop();
    });
    rec.stream.getTracks().forEach((t) => t.stop());
    await submit(blob, mime);
  }

  async function handleFile(file: File) {
    setError(null);
    if (file.size > MAX_BYTES) {
      setError("That file is over 50 MB. Try a compressed audio format like .m4a or .mp3.");
      return;
    }
    await submit(file, file.type || "audio/mpeg");
  }

  async function submit(blob: Blob, mediaType: string) {
    try {
      setPhase("uploading");

      const res = await fetch("/api/rounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });
      if (!res.ok) throw new Error("Could not start a round. Refresh and try again.");
      const { round } = await res.json();

      const path = `${round.id}/recording.${extFor(mediaType)}`;
      const { error: upErr } = await supabaseBrowser.storage
        .from("round-audio")
        .upload(path, blob, { contentType: mediaType, upsert: true });
      if (upErr) throw new Error("Upload failed: " + upErr.message);

      setPhase("transcribing");
      // Poll for status changes while the analyze request runs server-side.
      const poll = setInterval(async () => {
        const r = await fetch(`/api/rounds/${round.id}`).then((x) => x.json()).catch(() => null);
        if (r?.status === "analyzing") setPhase("analyzing");
        if (r?.status === "done") {
          clearInterval(poll);
          router.push(`/practice-round/${round.id}`);
        }
        if (r?.status === "error") {
          clearInterval(poll);
          setError(r.error || "Something went wrong while judging the round.");
          setPhase("idle");
        }
      }, 4000);

      const analyzeRes = await fetch(`/api/rounds/${round.id}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, mediaType }),
      });
      clearInterval(poll);
      if (analyzeRes.ok) {
        router.push(`/practice-round/${round.id}`);
      } else {
        const body = await analyzeRes.json().catch(() => ({}));
        setError(body.error || "Something went wrong while judging the round.");
        setPhase("idle");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("idle");
    }
  }

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const busy = phase === "uploading" || phase === "transcribing" || phase === "analyzing";

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <h2 className="font-semibold text-ink-900">1 · Pick your event</h2>
        <div className="mt-3 space-y-2">
          {FORMATS.map((f) => (
            <button
              key={f.key}
              disabled={phase !== "idle"}
              onClick={() => setFormat(f.key)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition disabled:opacity-60 ${
                format === f.key
                  ? "border-ink-900 bg-ink-950 text-white"
                  : "border-ink-200 bg-white text-ink-800 hover:border-ink-400"
              }`}
            >
              <span className="font-semibold">{f.label}</span>
              <span className={`text-xs ${format === f.key ? "text-gold-300" : "text-ink-400"}`}>
                {f.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-ink-900">2 · Record or upload your round</h2>
        <div className="mt-3 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          {phase === "idle" && (
            <div className="flex flex-col items-center gap-5 py-6">
              <button
                onClick={startRecording}
                className="flex items-center gap-3 rounded-full bg-red-600 px-8 py-4 text-lg font-semibold text-white shadow transition hover:bg-red-500"
              >
                <Mic className="h-6 w-6" /> Start recording
              </button>
              <div className="flex w-full items-center gap-3 text-ink-300">
                <div className="h-px flex-1 bg-ink-100" /> or <div className="h-px flex-1 bg-ink-100" />
              </div>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-ink-200 px-5 py-3 font-medium text-ink-700 transition hover:border-gold-500 hover:text-ink-900">
                <Upload className="h-5 w-5" />
                Upload a recording (.mp3, .m4a, .wav, .webm)
                <input
                  type="file"
                  accept="audio/*,video/webm,video/mp4"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </label>
            </div>
          )}

          {phase === "recording" && (
            <div className="flex flex-col items-center gap-5 py-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-red-600" />
                </span>
                <span className="font-mono text-3xl font-bold text-ink-900">
                  {mm}:{ss}
                </span>
              </div>
              <p className="text-sm text-ink-500">Recording your {format} round… debate as normal.</p>
              <button
                onClick={stopAndSubmit}
                className="flex items-center gap-2 rounded-full bg-ink-950 px-8 py-4 text-lg font-semibold text-white transition hover:bg-ink-800"
              >
                <Square className="h-5 w-5 fill-current" /> Stop & send to the judge
              </button>
            </div>
          )}

          {busy && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-gold-600" />
              <p className="font-semibold text-ink-900">
                {phase === "uploading" && "Uploading your recording…"}
                {phase === "transcribing" && "The judge is listening to your round…"}
                {phase === "analyzing" && "Writing your ballot — decision, RFD, and feedback…"}
              </p>
              <p className="max-w-sm text-sm text-ink-500">
                This usually takes 1–3 minutes for a full round. Keep this tab open.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
