import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy, Swords, TriangleAlert, Dumbbell, ScrollText, Gavel } from "lucide-react";
import { getRound } from "@/lib/supabase";
import Markdown from "@/components/Markdown";

export const dynamic = "force-dynamic";

export default async function RoundResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const round = await getRound(id);
  if (!round?.id) notFound();

  if (round.status !== "done" || !round.analysis) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <Gavel className="mx-auto h-10 w-10 text-gold-600" />
        <h1 className="font-display mt-4 text-2xl font-bold text-ink-900">
          {round.status === "error" ? "This round couldn't be judged" : "Still judging this round…"}
        </h1>
        <p className="mt-2 text-ink-600">
          {round.status === "error"
            ? round.error ?? "Something went wrong. Try recording again."
            : "Refresh this page in a minute — the ballot is being written."}
        </p>
        <Link
          href="/practice-round"
          className="mt-6 inline-block rounded-lg bg-ink-950 px-5 py-2.5 font-semibold text-white hover:bg-ink-800"
        >
          Back to the practice judge
        </Link>
      </div>
    );
  }

  const a = round.analysis;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/practice-round"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4" /> Judge another round
      </Link>

      {/* Decision banner */}
      <div className="mt-4 rounded-2xl bg-ink-950 p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">
          Official practice ballot · {round.debate_format}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <Trophy className="h-10 w-10 shrink-0 text-gold-400" />
          <div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              {a.decision.winner} wins.
            </h1>
            <p className="mt-1 text-ink-100">{a.decision.summary}</p>
          </div>
        </div>
      </div>

      {/* Speaker points */}
      {a.speakerPoints.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-2xl font-bold text-ink-900">Speaker points</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {a.speakerPoints.map((sp) => (
              <div key={sp.speaker} className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-ink-900">{sp.speaker}</h3>
                  <span className="font-display text-3xl font-bold text-gold-600">{sp.points}</span>
                </div>
                <p className="text-xs uppercase tracking-wide text-ink-400">{sp.side}</p>
                <p className="mt-2 text-sm text-ink-600">{sp.justification}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RFD */}
      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-ink-900">Reason for decision</h2>
        <div className="mt-3 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
          <Markdown>{a.rfd}</Markdown>
        </div>
      </section>

      {/* Key clashes */}
      {a.keyClashes.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink-900">
            <Swords className="h-6 w-6 text-gold-600" /> Where the round was decided
          </h2>
          <div className="mt-3 space-y-3">
            {a.keyClashes.map((c) => (
              <div key={c.title} className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-ink-900">{c.title}</h3>
                  <span className="rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-gold-300">
                    Won by {c.wonBy}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-600">{c.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dropped arguments */}
      {a.droppedArguments.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink-900">
            <TriangleAlert className="h-6 w-6 text-red-500" /> Dropped arguments
          </h2>
          <div className="mt-3 space-y-3">
            {a.droppedArguments.map((d, i) => (
              <div key={i} className="rounded-xl border border-red-100 bg-red-50/50 p-5">
                <p className="font-semibold text-ink-900">{d.argument}</p>
                <p className="mt-1 text-sm text-ink-600">
                  <span className="font-semibold text-red-600">Dropped by {d.droppedBy}.</span>{" "}
                  {d.impact}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Per-speaker feedback */}
      {a.speakerFeedback.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-2xl font-bold text-ink-900">Coaching feedback</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {a.speakerFeedback.map((f) => (
              <div key={f.speaker} className="rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-ink-900">{f.speaker}</h3>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-emerald-600">
                  What worked
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-700">
                  {f.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gold-600">
                  To improve
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-700">
                  {f.improvements.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Drills */}
      {a.drills.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink-900">
            <Dumbbell className="h-6 w-6 text-gold-600" /> Drills for this week
          </h2>
          <div className="mt-3 space-y-3">
            {a.drills.map((d, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-ink-100 bg-white p-5 shadow-sm">
                <span className="font-display text-2xl font-bold text-gold-500">{i + 1}</span>
                <div>
                  <h3 className="font-semibold text-ink-900">{d.title}</h3>
                  <p className="mt-1 text-sm text-ink-600">{d.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rules notes */}
      {a.rulesNotes.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-2xl font-bold text-ink-900">NSDA rules notes</h2>
          <ul className="mt-3 list-disc space-y-1.5 rounded-xl border border-ink-100 bg-white p-5 pl-10 text-sm text-ink-700 shadow-sm">
            {a.rulesNotes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Transcript */}
      {round.transcript && (
        <details className="mt-8 rounded-xl border border-ink-100 bg-white shadow-sm">
          <summary className="flex cursor-pointer items-center gap-2 p-5 font-semibold text-ink-900">
            <ScrollText className="h-5 w-5 text-ink-400" /> Full round transcript
          </summary>
          <div className="border-t border-ink-100 p-6">
            <Markdown>{round.transcript}</Markdown>
          </div>
        </details>
      )}
    </div>
  );
}
