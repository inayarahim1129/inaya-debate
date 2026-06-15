import { Suspense } from "react";
import { BookOpen, Mic, Swords, FolderOpen, Scale } from "lucide-react";
import AccessForm from "@/components/AccessForm";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Build a Case",
    text: "Step-by-step case structures for LD, Public Forum, and World Schools, with real example cases.",
  },
  {
    icon: Swords,
    title: "Master Rebuttals",
    text: "Learn line-by-line refutation, weighing, and collapsing with videos and worked examples.",
  },
  {
    icon: Scale,
    title: "Lay & Progressive",
    text: "Two tracks: persuade a parent judge, or go deep on Ks, theory, and circuit-style debate.",
  },
  {
    icon: FolderOpen,
    title: "File Library",
    text: "Download real prep — cases, kritik files, and evidence shared by your partner coach.",
  },
  {
    icon: Mic,
    title: "AI Practice Judge",
    text: "Record a practice round and get a full ballot — decision, RFD, speaker points, and drills — judged on NSDA standards.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <div className="bg-ink-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <p className="text-gold-400 font-semibold tracking-widest uppercase text-sm">
            Inaya Debate Partnership
          </p>
          <h1 className="font-display mt-4 text-4xl sm:text-6xl font-bold leading-tight">
            Your debate coach,
            <br />
            <span className="text-gold-300">even when we&apos;re not there.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-100">
            A complete debate classroom for our partner schools: learn to build cases, give
            rebuttals, explore lay and progressive styles, use shared prep files, and get a
            full AI-judged ballot on your practice rounds.
          </p>

          <div className="mt-10 max-w-md">
            <Suspense>
              <AccessForm />
            </Suspense>
            <p className="mt-3 text-sm text-ink-300">
              Your school&apos;s access code was provided by your partner coach. Lost it? Ask
              your club sponsor.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="font-display text-2xl font-bold text-ink-900">What&apos;s inside</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-ink-100 bg-white p-6 shadow-sm"
            >
              <f.icon className="h-7 w-7 text-gold-600" />
              <h3 className="mt-3 font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-1 text-sm text-ink-700">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-ink-100 py-6 text-center text-sm text-ink-400">
        Inaya Debate Partnership · Bringing competitive debate to every school
      </footer>
    </main>
  );
}
