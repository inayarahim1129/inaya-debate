import Link from "next/link";
import {
  Rocket,
  Scale,
  Users,
  ClipboardCheck,
  CalendarCheck,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionView";

export const metadata = { title: "Get Started — Inaya Debate" };

function ExternalLinkRow({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 underline-offset-2 hover:text-gold-600 hover:underline"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5 opacity-60 transition group-hover:opacity-100" />
    </a>
  );
}

export default function GetStartedPage() {
  return (
    <div>
      <SectionHeader
        title="Get Started in Debate"
        lede="New to competitive debate? This is your roadmap. Work through it top to bottom — by the end you'll know which event fits you, how to register with the right organizations, and how to enter your first tournament."
      />

      {/* Why debate matters */}
      <section className="mt-8">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-ink-900 p-2.5">
            <GraduationCap className="h-5 w-5 text-gold-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Why debate matters</h2>
        </div>
        <p className="mt-3 max-w-3xl text-ink-600">
          Debate is one of the highest-impact activities a student can do. It builds skills that
          pay off in school, college applications, and careers:
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Sharpens critical thinking and the ability to argue both sides of an issue.",
            "Dramatically improves public speaking and confidence under pressure.",
            "Teaches research, evidence evaluation, and how to spot weak reasoning.",
            "Looks excellent on college applications — NSDA awards and ranks are nationally recognized.",
            "Builds a community of motivated peers and mentors.",
            "Develops real-world skills: persuasion, listening, and thinking on your feet.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-white p-4 text-sm text-ink-700 shadow-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* LD vs PF */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-ink-900 p-2.5">
            <Scale className="h-5 w-5 text-gold-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900">LD vs. PF — which event is right for you?</h2>
        </div>
        <p className="mt-3 max-w-3xl text-ink-600">
          The two most popular events are Lincoln-Douglas (LD) and Public Forum (PF). They reward
          different strengths — here&apos;s how to choose.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
            <Scale className="h-7 w-7 text-gold-600" />
            <h3 className="mt-3 font-display text-xl font-bold text-ink-900">Lincoln-Douglas (LD)</h3>
            <p className="mt-1 text-sm text-ink-600">One-on-one debate about values, ethics, and philosophy.</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              <li><strong>Format:</strong> 1 vs. 1.</li>
              <li><strong>Topic changes:</strong> every two months.</li>
              <li><strong>Focus:</strong> morality and principles — &ldquo;ought&rdquo; questions.</li>
              <li><strong>Best for:</strong> students who like philosophy, independent work, and deep arguments.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
            <Users className="h-7 w-7 text-gold-600" />
            <h3 className="mt-3 font-display text-xl font-bold text-ink-900">Public Forum (PF)</h3>
            <p className="mt-1 text-sm text-ink-600">Two-on-two debate about current events and policy.</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              <li><strong>Format:</strong> 2 vs. 2 (you have a partner).</li>
              <li><strong>Topic changes:</strong> monthly.</li>
              <li><strong>Focus:</strong> real-world impacts, evidence, and persuading a general audience.</li>
              <li><strong>Best for:</strong> students who like teamwork, current events, and accessible debate.</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-gold-300 bg-gold-300/10 p-4 text-sm text-ink-700">
          <strong>Not sure?</strong> Try PF first if you want a partner and current-events topics; pick LD
          if you enjoy philosophy and one-on-one competition. You can always switch. Pick an event on
          the <Link href="/home" className="font-semibold underline underline-offset-2 hover:text-gold-600">home page</Link> to see lessons tailored to it.
        </div>
      </section>

      {/* Onboarding hub */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-ink-900 p-2.5">
            <ClipboardCheck className="h-5 w-5 text-gold-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Onboarding hub — register with the right orgs</h2>
        </div>
        <p className="mt-3 max-w-3xl text-ink-600">
          Competitive debate runs through a few organizations. Talk to your coach or club sponsor
          before registering — your school usually handles the membership, and you join under it.
        </p>
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-ink-900">1. NSDA — National Speech &amp; Debate Association</h3>
            <p className="mt-1.5 text-sm text-ink-600">
              The national governing body. Your school registers as a <strong>member chapter</strong>, then
              adds students as members. Membership lets you earn points, ranks, and qualify for nationals.
              If your school doesn&apos;t have a chapter yet, a coach/teacher can start one.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <ExternalLinkRow href="https://www.speechanddebate.org/join/" label="Register a chapter / join NSDA" />
              <ExternalLinkRow href="https://www.speechanddebate.org/start-a-team/" label="How to start a team" />
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-ink-900">2. UIL — University Interscholastic League (Texas public schools)</h3>
            <p className="mt-1.5 text-sm text-ink-600">
              The official league for Texas public schools. UIL runs its own debate and speech
              contests leading to a state championship. Your school&apos;s UIL coordinator enrolls the
              school; ask your coach about academic/debate sign-up.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <ExternalLinkRow href="https://www.uiltexas.org/academics/speech-debate" label="UIL Speech &amp; Debate" />
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-ink-900">3. TFA — Texas Forensic Association</h3>
            <p className="mt-1.5 text-sm text-ink-600">
              The main circuit for Texas tournaments (open to public and private schools). TFA
              membership lets you compete on the TFA circuit and earn a bid to the TFA State
              tournament. Schools and students register through the TFA site.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <ExternalLinkRow href="https://www.txfa.org/" label="Texas Forensic Association" />
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-400">
          UIL and TFA are Texas-specific. If you compete in another state, ask your coach which state
          league applies — NSDA membership is national and applies everywhere.
        </p>
      </section>

      {/* Registering for tournaments */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-ink-900 p-2.5">
            <CalendarCheck className="h-5 w-5 text-gold-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900">How to register for tournaments</h2>
        </div>
        <p className="mt-3 max-w-3xl text-ink-600">
          Almost every tournament uses <strong>Tabroom.com</strong> (run by the NSDA). Here&apos;s the flow:
        </p>
        <ol className="mt-4 space-y-3">
          {[
            ["Make a Tabroom account", "Sign up at tabroom.com with your email. Link yourself to your school once your coach adds you."],
            ["Find a tournament", "Browse upcoming tournaments by date and location. Your coach will usually point you to the ones your team is attending."],
            ["Get registered by your coach", "For most school-based competition, your coach registers you into the event (LD or PF). Confirm with them before the entry deadline."],
            ["Check your postings", "On tournament day, Tabroom shows your room, your opponent, and your judge for each round. Refresh often."],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-gold-400">
                {i + 1}
              </span>
              <div>
                <h4 className="font-semibold text-ink-900">{title}</h4>
                <p className="mt-0.5 text-sm text-ink-600">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4">
          <ExternalLinkRow href="https://www.tabroom.com/" label="Go to Tabroom.com" />
        </div>
      </section>

      {/* Checklist + next step */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-ink-900 p-2.5">
            <Rocket className="h-5 w-5 text-gold-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Your first-week checklist</h2>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Pick your event (LD or PF) on the home page.",
            "Join your school's NSDA chapter (and UIL/TFA if in Texas).",
            "Make a Tabroom.com account.",
            "Read the Case Construction guide for your event.",
            "Watch the intro videos and study an example case.",
            "Record a short practice round and get an AI ballot.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-white p-4 text-sm text-ink-700 shadow-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href="/home"
          className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-ink-950 px-5 py-3 font-semibold text-white transition hover:bg-ink-900"
        >
          Choose your event and start learning
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </section>
    </div>
  );
}
