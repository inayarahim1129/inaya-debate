import Link from "next/link";
import { cookies } from "next/headers";
import { BookOpen, Mic, Swords, FolderOpen, Scale, Zap, ArrowRight } from "lucide-react";
import { verifySession, SCHOOL_COOKIE, SchoolSession } from "@/lib/session";

const TILES = [
  {
    href: "/case-construction",
    icon: BookOpen,
    title: "Case Construction",
    text: "How to build a case in LD, Public Forum, and World Schools — plus every type of argument: kritiks, theory, DAs, counterplans, and more.",
  },
  {
    href: "/rebuttals",
    icon: Swords,
    title: "Rebuttals",
    text: "Answer arguments line-by-line, weigh impacts, and collapse to your winning path.",
  },
  {
    href: "/styles/lay-ld",
    icon: Scale,
    title: "Lay LD Debate",
    text: "Win in front of parent and community judges with clear, persuasive, traditional debate.",
  },
  {
    href: "/styles/progressive",
    icon: Zap,
    title: "Progressive Debate",
    text: "Circuit-style debate: spreading, kritiks, theory, and technical strategy.",
  },
  {
    href: "/library",
    icon: FolderOpen,
    title: "File Library",
    text: "Download shared prep — past cases, kritik files (including Afropessimism), and evidence.",
  },
  {
    href: "/practice-round",
    icon: Mic,
    title: "AI Practice Judge",
    text: "Record or upload a practice round and get a full NSDA-style ballot with an RFD, speaker points, and drills.",
    featured: true,
  },
];

export default async function HomePage() {
  const store = await cookies();
  const session = await verifySession<SchoolSession>(store.get(SCHOOL_COOKIE)?.value);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
        {session?.schoolName ?? "Partner school"}
      </p>
      <h1 className="font-display mt-1 text-3xl font-bold text-ink-900 sm:text-4xl">
        Welcome to debate practice.
      </h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Work through the lessons in order if you&apos;re new — start with Case Construction,
        then Rebuttals. When you&apos;re ready, run a practice round and let the AI judge give
        you a ballot.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`group rounded-2xl border p-6 shadow-sm transition hover:shadow-md ${
              t.featured
                ? "border-ink-900 bg-ink-950 text-white hover:border-gold-400"
                : "border-ink-100 bg-white hover:border-gold-400"
            }`}
          >
            <t.icon className={`h-7 w-7 ${t.featured ? "text-gold-400" : "text-gold-600"}`} />
            <h2 className={`mt-3 font-display text-xl font-bold ${t.featured ? "text-white" : "text-ink-900"}`}>
              {t.title}
            </h2>
            <p className={`mt-1.5 text-sm ${t.featured ? "text-ink-200" : "text-ink-600"}`}>{t.text}</p>
            <span
              className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${
                t.featured ? "text-gold-300" : "text-ink-700"
              }`}
            >
              Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
