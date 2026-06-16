import Link from "next/link";
import { cookies } from "next/headers";
import { Gavel } from "lucide-react";
import { verifySession, SCHOOL_COOKIE, EVENT_COOKIE, SchoolSession, DebateEvent } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

const NAV: Array<{ href: string; label: string; events?: DebateEvent[] }> = [
  { href: "/home", label: "Home" },
  { href: "/case-construction", label: "Case Construction" },
  { href: "/rebuttals", label: "Rebuttals" },
  { href: "/styles/lay-ld", label: "Lay LD", events: ["LD"] },
  { href: "/styles/progressive", label: "Progressive", events: ["LD"] },
  { href: "/library", label: "File Library" },
  { href: "/practice-round", label: "AI Practice Judge" },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const session = await verifySession<SchoolSession>(store.get(SCHOOL_COOKIE)?.value);
  const event = store.get(EVENT_COOKIE)?.value as DebateEvent | undefined;
  // Until a student picks an event, only show Home — everything else lives
  // inside the LD/PF section and appears after they choose.
  const nav = event
    ? NAV.filter((item) => !item.events || item.events.includes(event))
    : NAV.filter((item) => item.href === "/home");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
          <Link href="/home" className="flex items-center gap-2 font-display text-lg font-bold">
            <Gavel className="h-5 w-5 text-gold-400" />
            <span className="hidden sm:inline">Inaya Debate</span>
          </Link>
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-ink-100 transition hover:bg-ink-800 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            {session && (
              <span className="hidden whitespace-nowrap text-gold-300 md:inline">
                {session.schoolName}
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t border-ink-100 py-5 text-center text-xs text-ink-400">
        Inaya Debate Partnership — questions? Ask your club sponsor to reach out to your partner coach.
      </footer>
    </div>
  );
}
