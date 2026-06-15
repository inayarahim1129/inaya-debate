import { NextRequest, NextResponse } from "next/server";
import { generateText, generateObject } from "ai";
import { getRound, updateRound, downloadRoundAudio } from "@/lib/supabase";
import { verifySession, SCHOOL_COOKIE, SchoolSession } from "@/lib/session";
import { analysisSchema, judgeSystemPrompt, transcribePrompt } from "@/lib/judging";
import { resolveModel } from "@/lib/models";

export const maxDuration = 300;

const TRANSCRIBE_MODEL = process.env.TRANSCRIBE_MODEL ?? "google/gemini-2.5-flash";
const JUDGE_MODEL = process.env.JUDGE_MODEL ?? "google/gemini-2.5-flash";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession<SchoolSession>(req.cookies.get(SCHOOL_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { id } = await params;
  const { path, mediaType } = await req.json().catch(() => ({}));
  if (!path || typeof path !== "string" || !path.startsWith(`${id}/`)) {
    return NextResponse.json({ error: "Invalid audio path" }, { status: 400 });
  }

  const round = await getRound(id);
  if (!round?.id) return NextResponse.json({ error: "Round not found" }, { status: 404 });
  if (round.status === "transcribing" || round.status === "analyzing") {
    return NextResponse.json({ error: "Already processing" }, { status: 409 });
  }

  const format = round.debate_format;

  try {
    await updateRound(id, { status: "transcribing", audio_path: path, audio_type: mediaType ?? null });

    const blob = await downloadRoundAudio(path);
    const audio = new Uint8Array(await blob.arrayBuffer());

    const transcription = await generateText({
      model: resolveModel(TRANSCRIBE_MODEL),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: transcribePrompt(format) },
            { type: "file", data: audio, mediaType: mediaType || "audio/webm" },
          ],
        },
      ],
    });
    const transcript = transcription.text;
    if (!transcript || transcript.trim().length < 40) {
      throw new Error(
        "The recording couldn't be transcribed — it may be too short, silent, or in an unsupported format."
      );
    }

    await updateRound(id, { status: "analyzing", transcript });

    const { object: analysis } = await generateObject({
      model: resolveModel(JUDGE_MODEL),
      schema: analysisSchema,
      system: judgeSystemPrompt(format),
      prompt: `Here is the transcript of the practice ${format} round. Judge it and complete the full ballot.\n\n<transcript>\n${transcript}\n</transcript>`,
    });

    await updateRound(id, { status: "done", analysis });
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    let message = err instanceof Error ? err.message : "Analysis failed";
    if (/rate.?limit|free tier/i.test(message)) {
      message =
        "The AI judge is at its usage limit right now. Wait a couple of minutes and try again.";
    }
    await updateRound(id, { status: "error", error: message }).catch(() => {});
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
