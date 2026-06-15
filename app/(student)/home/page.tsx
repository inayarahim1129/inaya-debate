import Link from "next/link";
import { cookies } from "next/headers";
import { BookOpen, Mic, Swords, FolderOpen, Scale, Zap, ArrowRight, Gavel, Users } from "lucide-react";
import { verifySession, SCHOOL_COOKIE, EVENT_COOKIE, SchoolSession, DebateEvent } from "@/lib/session";

const TILES: Array<{
  href: string;
  icon: typeof BookOpen;
  title: string;
  text: string;
  featured?: boolean;
  events?: DebateEvent[];
}> = [
  {
    href: "/case-construction",
    icon: BookOpen,
    title: "Case Construction",
    text: "How to build a case in LD and Public Forum — plus every type of argument: kritiks, theory, DAs, counterplans, and more.",
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
    events: ["LD"],
  },
  {
    href: "/styles/progressive",
    icon: Zap,
    title: "Progressive Debate",
    text: "Circuit-style debate: spreading, kritiks, theory, and technical strategy.",
    events: ["LD"],
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

const EVENTS: Array<{
  key: DebateEvent;
  icon: typeof Scale;
  title: string;
  text: string;
}> = [
  {
    key: "LD",
    icon: Scale,
    title: "Lincoln-Douglas (LD)",
    text: "1 v 1 debate centered on values and philosophy. Includes lay and progressive (circuit) tracks.",
  },
  {
    key: "PF",
    icon: Users,
    title: "Public Forum (PF)",
    text: "2 v 2 team debate on current events, focused on practical impacts and weighing.",
  },
];

export default async function HomePage() {
  const store = await cookies();
  const session = await verifySession<SchoolSession>(store.get(SCHOOL_COOKIE)?.value);
  const event = store.get(EVENT_COOKIE)?.value as DebateEvent | undefined;

  if (event !== "LD" && event !== "PF") {
    return (
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
          {session?.schoolName ?? "Partner school"}
        </p>
        <h1 className="font-display mt-1 text-3xl font-bold text-ink-900 sm:text-4xl">
          What event do you debate?
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Choose your event to get lessons, practice tools, and a library tailored to it. You
          can switch anytime from the menu at the top.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {EVENTS.map((e) => (
            <Link
              key={e.key}
              href={`/api/event?format=${e.key}`}
              className="group rounded-2xl border border-ink-100 bg-white p-8 shadow-sm transition hover:border-gold-400 hover:shadow-md"
            >
              <e.icon className="h-9 w-9 text-gold-600" />
              <h2 className="mt-4 font-display text-2xl font-bold text-ink-900">{e.title}</h2>
              <p className="mt-2 text-ink-600">{e.text}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink-700">
                Choose <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const tiles = TILES.filter((t) => !t.events || t.events.includes(event));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
            {session?.schoolName ?? "Partner school"}
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold text-ink-900 sm:text-4xl">
            Welcome to debate practice.
          </h1>
        </div>
        <Link
          href="/api/event"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm font-semibold text-ink-700 shadow-sm transition hover:border-gold-400"
        >
          <Gavel className="h-4 w-4 text-gold-600" />
          {event === "LD" ? "Lincoln-Douglas" : "Public Forum"} · Switch
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-ink-600">
        Work through the lessons in order if you&apos;re new — start with Case Construction,
        then Rebuttals. When you&apos;re ready, run a practice round and let the AI judge give
        you a ballot.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
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
