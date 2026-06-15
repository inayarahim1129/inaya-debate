// Seeds the starter educational content. Idempotent-ish: skips if resources already exist.
// Run: node scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const SECRET = env.SUPABASE_SERVER_SECRET;

const g = (s) => s.trim();

// ---------------------------------------------------------------------------
// Written guides
// ---------------------------------------------------------------------------

const LD_STRUCTURE = g(`
LD is a one-on-one values debate. Your case is a 6-minute (Aff) or ~4-minute portion of a 7-minute (Neg) speech that you write before the tournament. Every traditional LD case has the same skeleton:

## 1. Framing: Value & Criterion

- **Resolution analysis & definitions** — define the key terms fairly. Use dictionaries or topic literature.
- **Value premise** — the thing the round should be about (Justice, Morality, Autonomy…). Most resolutions say "ought," so Morality or Justice is usually safe.
- **Value criterion (standard)** — *how we measure* whether the value is achieved, e.g. "minimizing structural violence" or "protecting individual rights." Your contentions must link to this.

> Think of it like a game: the value is the trophy, the criterion is the scoreboard, and contentions are the points you put on it.

## 2. Contentions (usually 2)

Each contention follows **C-W-I**:

1. **Claim** — one sentence stating the argument ("Contention One: Mandatory voting strengthens democratic legitimacy.")
2. **Warrant** — the *why*: evidence, statistics, expert analysis, or a logical syllogism. Cite your sources by author and year.
3. **Impact** — why it matters **under your criterion**. Always end the contention by linking back: "…and because this protects rights, it affirms."

## 3. Tips that win rounds

- **Underview (optional):** pre-empt the biggest attack you expect.
- Keep the 1AC at ~900 words/6 minutes at a conversational pace for lay judges.
- Every card needs a full citation. Fabricating or distorting evidence is an NSDA disqualifying offense.
- Practice reading it OUT LOUD five times before you compete. Mark where you'll breathe and emphasize.

## Checklist before you call it done

- [ ] Are my definitions fair and sourced?
- [ ] Does every contention explicitly link to my criterion?
- [ ] Do I have impacts a normal person would care about?
- [ ] Is there anything here I can't defend in cross-examination?
`);

const PF_STRUCTURE = g(`
Public Forum is a 2-v-2 event built to be judged by ordinary citizens. Your constructive is a 4-minute speech.

## The PF case skeleton

1. **Hook / framing (optional, 15-20 seconds)** — a vivid fact or story that frames the round in your favor.
2. **Definitions & observations** — only if needed; don't waste time defining the obvious.
3. **Contention 1** and **Contention 2** — two is standard. Each one is **Uniqueness → Link → Impact**:
   - **Uniqueness:** what the world looks like now.
   - **Link:** what the resolution changes.
   - **Impact:** quantified harm or benefit ("saves 40,000 lives a year," "adds $300B to GDP"). Numbers + a source beat vague claims.

## Weighing — build it into the case

End each contention (or the whole case) with a sentence that tells the judge *how to compare* it to the other side: magnitude (how big), probability (how likely), timeframe (how soon), scope (how many people). Judges vote on weighing more than anything else in PF.

## PF-specific rules to respect

- **No plans or counterplans** — NSDA rules prohibit formal plans in PF. Advocate the resolution generally.
- Paraphrasing is allowed, but you must be able to produce the original source on demand — and it must say what you claim.
- Speak at a TV-news pace. If your parents couldn't follow it, it doesn't belong in PF.

## Checklist

- [ ] Two contentions, each with uniqueness, link, and a quantified impact
- [ ] At least one built-in weighing sentence
- [ ] Every statistic has an author/organization and year
- [ ] Reads comfortably in 3:45
`);

const WS_STRUCTURE = g(`
World Schools is a 3-v-3 format (Proposition vs Opposition) that mixes prepared and impromptu motions. It is judged 40% style, 40% content, 20% strategy — so *how* you build the case matters as much as what's in it.

## The team case

Your first speaker presents the team's case in an 8-minute speech:

1. **Definition / model** — interpret the motion fairly. If the motion is a policy ("This House would ban…"), present a clear model: who does it, how it works.
2. **Team line** — one sentence that captures your side's story. Every speaker repeats it.
3. **Case division** — announce what speaker 1 covers and what speaker 2 will add ("I will show the principle; my colleague handles the practical benefits.").
4. **Substantives (2-3 arguments)** — each one needs:
   - **Principle** — the values-level reason ("states may limit speech that silences others")
   - **Practical** — the real-world mechanism and outcome
   - **Example** — World Schools judges expect real-world examples from multiple regions, not hypotheticals.

## Roles by speaker

- **Speaker 1:** definitions, team line, first substantives.
- **Speaker 2:** rebuts, rebuilds, adds the remaining substantive.
- **Speaker 3:** mostly rebuttal — crystallize the 2-3 main clashes. Minimal new matter.
- **Reply (speaker 1 or 2, 4 min):** a "biased adjudication" — explain why your side won the key clashes. No new arguments.

## POIs (Points of Information)

Offer POIs regularly (don't barrack), and **take 1-2 per speech** — declining all of them costs style and strategy points. Have a 10-second answer ready, then return to your structure.
`);

const FRAMEWORK_GUIDE = g(`
The framework is the lens the judge uses to evaluate the round. In LD it's traditionally the **value** and **criterion**; in progressive rounds it can be a whole philosophical standard.

## Why framework matters

If you win that the round should be judged by *your* standard, the opponent's arguments only count insofar as they link to it. Many LD rounds are won purely on the framework debate.

## Picking a value

Most "ought" resolutions default to **Morality** or **Justice**. Don't overthink the value — rounds are rarely won at the value level. The real fight is the criterion.

## Picking a criterion

A good criterion is:

1. **A measuring stick, not a synonym** — "achieving justice through fairness" measures nothing. "Minimizing structural violence" can actually evaluate arguments.
2. **Connected to the topic literature** — for a surveillance topic, "protecting privacy rights"; for an economic topic, "maximizing wellbeing (util)."
3. **Strategic** — your contentions should link to it strongly, your opponent's weakly.

Common criteria: utilitarianism (maximize wellbeing), deontology / respecting rights as side-constraints, the social contract, protecting autonomy, structural violence.

## Debating the framework

- **Prefer reasons, not re-assertion:** give comparative reasons your standard is better — better for fairness, better grounded in the resolution's wording, philosophically prior.
- **The "even-if" hedge:** show you win under *both* frameworks. "Even under their criterion of util, we save more lives." This is the single most reliable framework move at any level.
- **Don't kick your own framework silently** — if you abandon it, tell the judge why it doesn't matter.
`);

const KRITIK_GUIDE = g(`
A kritik (K) challenges an assumption your opponent's case (or the resolution itself) rests on — instead of saying their plan fails, you say the *way they think* causes harm.

## The three parts of a K

1. **Link** — what the opponent said or assumed that triggers the criticism ("Their economic growth impacts assume a capitalist frame…").
2. **Impact** — why that mindset/structure is harmful ("…which sustains exploitation and inevitable crises").
3. **Alternative** — what the judge should do instead ("Reject capitalist logic; vote negative to refuse the aff's frame"). The "alt" can be as simple as rejection or as complex as a different mode of analysis.

Most Ks also include **framework/role-of-the-ballot** arguments: claims about what the judge's vote *means* and what should matter in the round.

## Common K literature bases

- **Capitalism / neoliberalism (Cap K)** — the most common entry-level K.
- **Security / threat construction** — IR-based; "threats are manufactured."
- **Biopower (Foucault)** — state control over life and populations.
- **Afropessimism (Wilderson, Sexton)** — argues civil society is structured by anti-Blackness; engages ontology, not just policy. Read the actual literature before running it — this is a body of scholarship that deserves serious engagement, and judges notice when it's run as a gimmick. (Check the File Library for the Afropessimism file.)
- **Settler colonialism, feminist IR, disability studies** and many more.

## Running a K well

- **Know the literature.** You will be cross-examined on it. If you can't explain your author's thesis in two sentences, don't run it.
- **Contextualize the link** to the specific case you're debating, not a generic shell.
- **Be able to explain the alt** concretely: what does the world (or the judge's decision) look like if it's adopted?

## Answering a K

- **No link:** "we don't assume that."
- **Permutation:** "do both" — the plan and the alt aren't exclusive.
- **Alt fails:** the alternative does nothing / has no mechanism.
- **Framework:** the judge should weigh the plan's consequences vs. the K's mindset claims.
- **Impact turn (advanced):** defend the thing they criticize.
`);

const THEORY_GUIDE = g(`
Theory is an argument that your opponent's *practice* (not their position) is unfair or uneducational — e.g., they ran a case with no stable advocacy, or made you debate against a brand-new shell in the last speech. Theory is meta-debate: a debate about the rules of the debate.

## The four-part shell

Every theory shell has the same structure — memorize it:

1. **Interpretation:** the rule you propose. "Debaters must disclose their case on the wiki 30 minutes before the round."
2. **Violation:** what the opponent did that breaks the rule. Quote them if you can.
3. **Standards:** why your rule is good — link the violation to *fairness* (ground, predictability, reciprocity, time skew) and/or *education* (topic education, clash, real-world skills).
4. **Voters:** why the judge should care and what to do about it — usually "fairness and education are voting issues; drop the debater (or drop the argument)."

## Example mini-shell

> **Interp:** My opponent must defend the resolution as a general principle.
> **Violation:** They defended only one tiny example.
> **Standards:** Ground — I prepped against the whole resolution, they collapsed it to the 1% I couldn't predict; that skews every speech that follows.
> **Voter:** Fairness — debate is a competition; if the practice rigs it, vote them down to deter it.

## Answering theory

- **Counter-interpretation:** propose a better rule that you meet.
- **I meet:** show you didn't actually violate.
- **Reasonability vs. competing interpretations:** argue the judge should ask "was it *fair enough*?" rather than "whose rule is marginally better?"
- **RVI (risky):** claim you should win if you beat the shell.

## A warning for new debaters

In front of lay judges, theory usually loses — it sounds like complaining. Run it only when there's a real abuse story you can explain in plain English, or when the judge is a debate person.
`);

const TOPICALITY_GUIDE = g(`
Topicality (T) argues the affirmative isn't actually defending the resolution. It uses the same four-part structure as a theory shell, but the interpretation is about the **meaning of words in the resolution**.

1. **Interpretation:** define the contested word, with a source ("'Military aid' means equipment and training — Department of Defense definition").
2. **Violation:** the aff's case falls outside that definition.
3. **Standards:** why your definition is better — *limits* (keeps the topic debatable), *ground* (both sides get arguments), *precision* (matches expert usage).
4. **Voter:** topicality is a gateway issue — if the aff isn't topical, the judge votes neg regardless of the case debate.

Answering T mirrors theory: counter-define, "we meet," and argue reasonability.
`);

const DISAD_GUIDE = g(`
A disadvantage (DA) says the opponent's position *causes* a bad outcome. It's the workhorse negative argument in every format.

## The four parts

1. **Uniqueness:** the bad thing isn't happening now ("The economy is stable today").
2. **Link:** their position triggers the change ("The resolution's spending requires massive borrowing").
3. **Internal link:** the chain from link to impact ("Borrowing at that scale spikes interest rates").
4. **Impact:** the terminal harm ("Recession — millions lose jobs").

The judge weighs your DA's impact against the case's advantages, so always finish with weighing: "even if they win their case, our impact is bigger/faster/more probable."

## Attacking a DA

Attack every link in the chain:
- **Non-unique:** the bad thing is happening already.
- **No link:** their position doesn't cause it.
- **Internal link defense:** the chain has a missing step.
- **Impact defense:** the impact is exaggerated.
- **Turn (offense!):** the DA actually goes our way — "spending *prevents* the recession."

One good turn beats four defensive answers, because turns give the judge a reason to vote *for* you, not just "not against" you.
`);

const COUNTERPLAN_GUIDE = g(`
A counterplan (CP) is a negative strategy that says: "There's a better way to solve their harms — and it isn't the resolution." Counterplans are standard in Policy and progressive LD. **They are not allowed in Public Forum.**

## What a CP needs

1. **Text:** exactly what you propose ("The 50 states should fund the program instead of the federal government").
2. **Competition:** a reason the judge can't just do both — usually via a **net benefit**: a DA that applies to the plan but not the CP.
3. **Solvency:** evidence the CP solves the case's harms.

## Common types

- **Agent CP:** a different actor does the plan (states instead of congress).
- **Process CP:** the same thing through a different process (with conditions, by court ruling…).
- **Advantage CP:** solve their impacts a completely different way.

## Answering a CP

- **Permutation:** "do both" — if the plan and CP can coexist, the CP isn't a reason to reject the plan.
- **Solvency deficits:** the CP solves less, and that difference outweighs the net benefit.
- **Theory:** some CPs (especially ones that steal the whole plan through a tiny process change) are arguably abusive.
`);

const EVIDENCE_GUIDE = g(`
"Cutting a card" means turning a source into a piece of debate evidence you can read in-round.

## Anatomy of a card

1. **Tag:** one sentence stating what the evidence proves — written by you.
2. **Cite:** author, qualifications, publication, full date, URL. NSDA rules require you to be able to produce the full source.
3. **Body:** the author's actual words. You **bold/underline** the parts you'll read aloud — you may shrink the rest, but you may never delete words in a way that changes meaning.

## The ethics rules (NSDA)

- Never fabricate: every quoted word must appear in the source, in order.
- Never distort: the underlined portion must keep the author's meaning; cutting out "not" is a career-ending move.
- Paraphrase only when the format allows it (PF does) and keep the original on hand.

Violations aren't just "against the rules" — evidence ethics challenges can end a tournament (and a reputation). When in doubt, read more of the card.

## Practical workflow

1. Research with search terms from the resolution's wording.
2. Save the URL and full text immediately.
3. Write the tag *after* you cut the body — the tag must match what the card actually says.
4. Organize files by argument, with a table of contents.
`);

const LD_TEMPLATE = g(`
Use this annotated skeleton to draft your first LD affirmative. Replace the bracketed text. Your coach's real cases in the File Library show what a finished version looks like.

## Resolved: [the resolution]

**Because I agree, I affirm.**

### Definitions
[Define 1-3 key terms. Source each definition. Pick fair definitions — if a definition wins the round by itself, it's probably abusive.]

### Value
I value **[Morality / Justice]**, because the resolution's use of "[ought]" implies a moral obligation.

### Criterion
The standard for the round is **[minimizing structural violence / protecting rights / maximizing wellbeing]**, because [1-2 sentence justification — why this is the best way to measure the value on this topic].

### Contention 1: [Claim in one sentence]
[Warrant: evidence or analysis. Read a card: tag, cite, body.]
[Impact: link it to your criterion explicitly: "Because X reduces structural violence, it affirms."]

### Contention 2: [Claim in one sentence]
[Same structure: warrant → impact → link to criterion.]

### Underview (optional)
[Pre-empt the attack you most expect — e.g., "Even if my opponent wins their disadvantage, prefer my case because…"]

**For these reasons, I affirm. I'm now ready for cross-examination.**
`);

const PF_TEMPLATE = g(`
A fill-in-the-blanks skeleton for your first PF constructive. Replace the bracketed text.

## Resolved: [the resolution]

**My partner and I [affirm/negate] the resolution.**

[Optional hook: one vivid fact or story, 15 seconds max.]

### Contention 1: [Name it something memorable — "Saving Rural Hospitals"]

- **Status quo:** [What's happening now — with a cited statistic.]
- **Link:** [What changes if the resolution passes/fails.]
- **Impact:** [Quantified outcome: lives, dollars, people affected. Cite it.]

### Contention 2: [Name]

- [Same structure: status quo → link → impact.]

### Weighing
Prefer our case on **[magnitude/probability/timeframe]**: [one sentence comparing your impacts to their likely impacts — write this BEFORE the round; you already know what they'll run.]

**For these reasons, we are proud to [affirm/negate].**
`);

const REBUTTAL_GUIDE = g(`
The four-step refutation ("They say / We say") is the foundation of every rebuttal in every format.

## The four steps

For each argument you answer:

1. **"They say…"** — name the argument you're answering. This is *signposting*, and it's what separates debaters from people having an argument. ("On their Contention 1 about economic growth…")
2. **"But we say…"** — your response, stated in one clear sentence.
3. **"Because…"** — the warrant: evidence or analysis for your response.
4. **"Therefore…"** — what happens to their argument now, and why it matters for the round. ("So their only economic impact is gone, and our rights impact is the only offense left.")

## The five ways to answer any argument

- **Deny it:** the claim is false (bring evidence).
- **Mitigate it:** it's much smaller/less likely than they say.
- **Turn it:** it actually supports your side (the strongest answer — it creates offense).
- **Outweigh it:** even if true, your impacts matter more.
- **Concede strategically:** "we never disputed this; it just doesn't win them the round because…"

## Organizing the speech

Go **line by line in their order** ("Their C1… their C2…"), then return to your own case and rebuild what they attacked ("frontlines"). Budget your time: never spend more than a third of a rebuttal on one argument unless the round genuinely collapses to it.

## Golden rules

- An argument they **dropped** is an argument you've won — but you must *extend* it ("they never answered our turn — extend it; it's conceded") and explain why it decides the round.
- Don't answer everything equally; answer what matters. Judges reward debaters who know which arguments are alive.
- Write "blocks" (pre-written answers to predictable arguments) before the tournament.
`);

const WEIGHING_GUIDE = g(`
Weighing is comparing impacts — telling the judge whose arguments matter MORE when both sides are winning something. Late-round speeches that weigh almost always beat speeches that just repeat.

## The big four weighing mechanisms

1. **Magnitude:** whose impact is bigger? (a recession vs. a small tax increase)
2. **Probability:** whose impact is more likely to actually happen? Attack long link chains here.
3. **Timeframe:** whose impact happens sooner? Sooner harms are more certain and harder to reverse.
4. **Scope:** how many people are affected, and how directly?

There's also **reversibility** (death is forever; economic dips recover) and **structural weighing** (harms to already-marginalized groups compound).

## How to phrase weighing

The formula: **"Prefer our impact on [mechanism], because [comparison]. Even if they win [their best argument], [why you still win]."**

> "Prefer our case on probability: their economic collapse needs four links to happen — ours is happening right now, documented in the status quo. Even if you grant their full impact, a possible recession can't outweigh certain deaths."

## When to weigh

- **PF:** weighing must start by the rebuttal/summary and be in final focus.
- **LD:** weigh through your criterion first — framework IS weighing in LD.
- **WS:** the third speaker and reply speech are weighing speeches by design.

The side that compares first usually controls the comparison for the rest of the round.
`);

const COLLAPSE_GUIDE = g(`
You cannot win every argument — and trying to is how you lose all of them. *Collapsing* means choosing your winning path and spending your precious final speeches there.

## Why collapse?

Final speeches are short (2-4 minutes). If you "go for everything," each argument gets 20 underdeveloped seconds, and the judge fills the gaps — usually against you. If you collapse to your best 1-2 arguments, you can extend the full claim-warrant-impact, answer everything they said on it, and weigh.

## How to choose what to collapse to

Pick the argument that is:
1. **Cleanly won** — they under-covered or dropped it;
2. **Impacted** — it links to the framework/weighing you're winning;
3. **Independent** — it alone is a reason to vote for you.

## How to extend properly

An extension is NOT "extend our Contention 1." It's:

> "Extend Contention 1 — [restate claim]. They said [their answer], but [your response]. That means [impact], which outweighs because [weighing]."

Claim → their answer → your answer → impact → weighing. Every extension, every time.

## Format notes

- **PF:** whatever's in your Final Focus must have been in your Summary. Collapse no later than the Summary.
- **LD:** the 2AR is 4 minutes against a 6-minute NR. Collapsing isn't optional — pick the cleanest path by the 1AR.
- **WS:** the reply speech is a pure collapse: 2-3 clashes, biased adjudication.
`);

const LAY_GUIDE = g(`
A "lay" judge is a parent, teacher, or community member — smart, attentive, but not trained in debate jargon. Most local tournaments are lay-judged, and winning them is a skill progressive debaters often lack. Master it.

## The lay mindset shift

Lay judges don't vote on the flow. They vote for the debater who **sounded right** — clearer, more confident, more reasonable. Technical "wins" you don't *communicate* don't exist.

## The ten commandments of lay debate

1. **Speak at conversation speed.** 150-180 words/minute. Slower than feels natural.
2. **No jargon.** Say "their argument doesn't account for…" not "non-unique." Never say "extend," "drop," "flow," or "turn" — show the concept instead: "they never answered this, so it stands."
3. **Tell a story.** Frame the round as one big question ("This round comes down to whether safety justifies surveillance") and answer it.
4. **Three points max.** A lay judge remembers 2-3 things from the entire round; choose them deliberately.
5. **Be likable.** Smile, thank the judge and opponent, be gracious in crossfire. Perceived rudeness loses lay ballots faster than any argument.
6. **Use the rule of three and contrast:** "It's cheaper. It's faster. And unlike their plan, it's actually been tried."
7. **Signpost in plain English:** "My opponent made three claims. Let me take them one by one."
8. **Crystallize at the end:** the last 30 seconds of your last speech should write the judge's ballot for them: "If you believe X, you vote affirmative — and we proved X three ways."
9. **Eye contact beats your flow.** Look up on every impact and every weighing sentence.
10. **Dress and posture count.** Unfair? Maybe. True? Absolutely.

## Adapting your case

Cut card-heavy contentions; keep the one with the cleanest story. Replace philosophy with common-sense framing ("at the end of the day, this is about whether we treat people fairly"). Your value/criterion stays, but explain it like you'd explain it to a neighbor.
`);

const PROGRESSIVE_GUIDE = g(`
"Progressive" (circuit) debate is what LD looks like at national-circuit tournaments: faster, more technical, judged by former debaters who vote strictly off the flow.

## What changes from lay LD

| Lay | Progressive |
|---|---|
| Conversation pace | Spreading (250-350+ wpm) |
| Value/criterion | Phil frameworks, theory, Ks, plans/CPs |
| Persuasion wins | The flow wins — dropped arguments are conceded |
| Story and ethos | Technical line-by-line and weighing |

## The progressive toolbox

- **Plans/advocacies:** defending a specific implementation instead of the whole resolution.
- **Counterplans & disads** (borrowed from Policy).
- **Kritiks:** challenging assumptions — see the Kritik guide in Case Construction.
- **Theory & topicality:** debating the rules of debate themselves.
- **Philosophical frameworks:** full normative-ethics cases (Kant, util, contractarianism) instead of value/criterion.
- **Tricks (be careful):** a priori arguments and spikes. Many judges hate them; read the judge's paradigm first.

## Reading the judge: paradigms

Circuit judges publish "paradigms" describing what they'll vote on. **Reading the paradigm before the round is mandatory.** "Tech over truth" means they evaluate the flow strictly; "no spreading" means slow down; "I don't vote on tricks" means don't.

## How to get started

1. Learn to flow fast rounds before you learn to give them — watch circuit rounds (TOC finals are on YouTube) with a flow pad.
2. Practice spreading 10 minutes a day (see the spreading video below) — clarity first, speed second.
3. Start with ONE progressive tool (usually a disad or a simple K) in an otherwise traditional case.
4. Read actual literature. Progressive debate rewards debaters who understand their authors, not just their blocks.
`);

const SPREADING_GUIDE = g(`
Spreading (speed reading) lets you present more arguments per speech. It's standard in progressive LD and Policy — and unwelcome in PF, World Schools, and lay rounds. Know your audience before you use it.

## How to practice (10 minutes a day)

1. **Over-enunciation drills:** read a card with a pen sideways between your teeth, exaggerating every syllable. Two minutes.
2. **Backwards reading:** read a paragraph word-by-word in reverse — it forces word-level clarity since you can't ride the sentence's momentum.
3. **Incremental pacing:** read the same card four times: normal, 25% faster, 50% faster, max. Record the last one. If YOU can't transcribe it, neither can a judge.
4. **Breathing:** mark breath points in your speech doc; gasping mid-card kills clarity (and looks bad).

## Rules of clarity

- **Tags and cites slow, card bodies fast.** The judge flows your tags — those must always be flowable.
- Watch the judge: if they put their pen down, you've lost them. Slow down immediately.
- Being 20% slower and 100% flowed beats being maximally fast. Speed is only useful if it lands on the judge's flow.

## Flowing fast rounds

You can't debate fast rounds if you can't flow them: use columns per speech, abbreviations (T = topicality, FW = framework, ∆ = change), and write warrants, not full sentences. Practice by flowing TOC final rounds on YouTube at 1x, then 1.25x.
`);

// ---------------------------------------------------------------------------
// Verified YouTube videos (found and checked via web search)
// ---------------------------------------------------------------------------

const VIDEOS = {
  "ld-basics": { title: "Lincoln Douglas Debate 1.1: What is LD?", channel: "Tobias Park's LD Course", url: "https://www.youtube.com/watch?v=tQeiTI4K1cM" },
  "pf-basics": { title: "Public Forum Debate Round Introduction", channel: "National Speech & Debate Association", url: "https://www.youtube.com/watch?v=lGd1HVCjpQA" },
  "ws-basics": { title: "Intro to World Schools Debate w/ Arik Karim", channel: "Equality in Forensics", url: "https://www.youtube.com/watch?v=IPzzry5IqkU" },
  "case-writing-ld": { title: "How to Write Lincoln Douglas Debate Cases that WIN!", channel: "Chris Jeub", url: "https://www.youtube.com/watch?v=M0wLRNhEdWU" },
  "case-writing-pf": { title: "How to Write a Public Forum Debate Case", channel: "Debate Clash", url: "https://www.youtube.com/watch?v=nmD2V6e-kzg" },
  framework: { title: "Framework in LD Debate — Value and Criterion", channel: "my LD coach", url: "https://www.youtube.com/watch?v=CJ2D6JTtjHs" },
  "cutting-cards": { title: "How to Cut a Card | Two Minute Tuesday", channel: "Proteus Debate Academy", url: "https://www.youtube.com/watch?v=lrbNMstH56E" },
  kritiks: { title: "Critical Debate (Kritiks) 101", channel: "DebateDrills", url: "https://www.youtube.com/watch?v=G0z3v02AdGk" },
  theory: { title: "Introduction to Theory and Topicality — Debate 101", channel: "DebateDrills", url: "https://www.youtube.com/watch?v=XjzoNgaBTQc" },
  topicality: { title: "Topicality: Part 1 — The Basics", channel: "Go Fight Win! Novice Debate", url: "https://www.youtube.com/watch?v=icTY5l_A1uA" },
  disads: { title: "Disadvantages", channel: "Kentucky Debate", url: "https://www.youtube.com/watch?v=gaNJnjSVoFU" },
  counterplans: { title: "Basic Types of Counterplans | DebateDrills Academy", channel: "DebateDrills", url: "https://www.youtube.com/watch?v=Pwl9_c665ng" },
  spreading: { title: "An Introduction To (Fast) Debate Speaking (And How To Practice It)", channel: "Bill Batterman", url: "https://www.youtube.com/watch?v=ZBmEf_SATYE" },
  flowing: { title: "How To Flow (LD, PF, & Policy Debate)", channel: "Triumph Debate", url: "https://www.youtube.com/watch?v=HUTAMo9vgX0" },
  weighing: { title: "Public Forum: How to Weigh Arguments", channel: "Debate123", url: "https://www.youtube.com/watch?v=BRN4RdYX-l8" },
  collapsing: { title: "Summary and Final Focus Speeches", channel: "Kentucky Debate", url: "https://www.youtube.com/watch?v=s2M1yJivz3Q" },
  frontlining: { title: "Guide to Rebuttal Speeches (PF)", channel: "Kentucky Debate", url: "https://www.youtube.com/watch?v=_GfE53Jcb_M" },
  crossfire: { title: "How to Ask Good Crossfire Questions", channel: "Tsinghua International Speech and Debate", url: "https://www.youtube.com/watch?v=goDOEC4N5E4" },
  "rebuttal-ld": { title: "Lincoln Douglas Debate 4.2: Intro to Rebuttals", channel: "Tobias Park's LD Course", url: "https://www.youtube.com/watch?v=CIKgOUHrf-8" },
  "lay-adaptation": { title: "Lay Judges", channel: "Learn Public Forum", url: "https://www.youtube.com/watch?v=bnHIdw3TPG8" },
  afropessimism: { title: "Frank Wilderson on Afropessimism", channel: "UCI Illuminations", url: "https://www.youtube.com/watch?v=vjPXl7jC670" },
};

const yt = (key, section, category, format, sort, descOverride) => ({
  section,
  category,
  title: VIDEOS[key].title,
  description: descOverride ?? `Video by ${VIDEOS[key].channel}.`,
  type: "youtube",
  url: VIDEOS[key].url,
  debate_format: format,
  sort_order: sort,
});

const guide = (section, category, title, description, content, format, sort) => ({
  section,
  category,
  title,
  description,
  type: "guide",
  content,
  debate_format: format,
  sort_order: sort,
});

const RESOURCES = [
  // --- Case construction: structures ---
  guide("case-construction", "structure", "How to Build an LD Case", "Value, criterion, contentions — the full skeleton of a Lincoln-Douglas case, with a pre-round checklist.", LD_STRUCTURE, "LD", 1),
  guide("case-construction", "structure", "How to Build a PF Case", "Uniqueness → link → impact, built-in weighing, and the PF-specific rules you can't break.", PF_STRUCTURE, "PF", 2),
  guide("case-construction", "structure", "How to Build a World Schools Case", "Team line, case division, principle + practical substantives, and speaker roles.", WS_STRUCTURE, "WS", 3),
  yt("ld-basics", "case-construction", "structure", "LD", 4),
  yt("pf-basics", "case-construction", "structure", "PF", 5),
  yt("ws-basics", "case-construction", "structure", "WS", 6),
  yt("case-writing-ld", "case-construction", "structure", "LD", 7),
  yt("case-writing-pf", "case-construction", "structure", "PF", 8),

  // --- Case construction: argumentation types ---
  guide("case-construction", "argumentation", "Framework: Value & Criterion", "How to pick a value and criterion that actually measure the round — and how to debate framework.", FRAMEWORK_GUIDE, "LD", 10),
  guide("case-construction", "argumentation", "Kritiks (the K)", "Link, impact, alternative — how kritiks work, the major literature bases, and how to answer them.", KRITIK_GUIDE, "all", 11),
  guide("case-construction", "argumentation", "How to Write a Theory Shell", "Interpretation, violation, standards, voters — the four-part shell, a worked example, and answers.", THEORY_GUIDE, "all", 12),
  guide("case-construction", "argumentation", "Topicality", "The gateway issue: arguing the aff isn't defending the resolution.", TOPICALITY_GUIDE, "all", 13),
  guide("case-construction", "argumentation", "Disadvantages (DAs)", "Uniqueness, link, internal link, impact — building and beating the workhorse negative argument.", DISAD_GUIDE, "all", 14),
  guide("case-construction", "argumentation", "Counterplans", "Text, competition, net benefits — and why the permutation is your first answer.", COUNTERPLAN_GUIDE, "all", 15),
  guide("case-construction", "argumentation", "Cutting Cards: Evidence 101", "How to cut a card, cite it, and stay on the right side of NSDA evidence ethics.", EVIDENCE_GUIDE, "all", 16),
  yt("framework", "case-construction", "argumentation", "LD", 17),
  yt("kritiks", "case-construction", "argumentation", "all", 18),
  yt("theory", "case-construction", "argumentation", "all", 19),
  yt("topicality", "case-construction", "argumentation", "all", 20),
  yt("disads", "case-construction", "argumentation", "all", 21),
  yt("counterplans", "case-construction", "argumentation", "all", 22),
  yt("cutting-cards", "case-construction", "argumentation", "all", 23),

  // --- Case construction: example cases (templates; coach uploads real ones) ---
  guide("case-construction", "example-case", "LD Case Template (annotated)", "A fill-in-the-blanks affirmative skeleton with coaching notes in every section.", LD_TEMPLATE, "LD", 30),
  guide("case-construction", "example-case", "PF Case Template (annotated)", "A fill-in-the-blanks constructive with the uniqueness/link/impact structure built in.", PF_TEMPLATE, "PF", 31),

  // --- Rebuttals ---
  guide("rebuttals", "guide", "The Four-Step Refutation", "They say → we say → because → therefore. The foundation of every rebuttal, plus the five ways to answer any argument.", REBUTTAL_GUIDE, "all", 1),
  guide("rebuttals", "guide", "Weighing Impacts", "Magnitude, probability, timeframe, scope — how to tell the judge why your arguments matter more.", WEIGHING_GUIDE, "all", 2),
  guide("rebuttals", "guide", "Collapsing & Extending", "Why going for everything loses rounds, how to pick your winning path, and how to extend properly.", COLLAPSE_GUIDE, "all", 3),
  yt("rebuttal-ld", "rebuttals", "video", "LD", 10),
  yt("frontlining", "rebuttals", "video", "PF", 11),
  yt("weighing", "rebuttals", "video", "PF", 12),
  yt("collapsing", "rebuttals", "video", "PF", 13),
  yt("crossfire", "rebuttals", "video", "PF", 14),
  yt("flowing", "rebuttals", "video", "all", 15),

  // --- Lay LD ---
  guide("lay-ld", "guide", "Winning the Lay Ballot", "The ten commandments of lay debate: pace, jargon, storytelling, likability, and crystallization.", LAY_GUIDE, "LD", 1),
  yt("lay-adaptation", "lay-ld", "video", "all", 10),

  // --- Progressive ---
  guide("progressive", "guide", "Intro to Progressive LD", "What changes on the circuit: spreading, Ks, theory, plans, paradigms — and how to get started safely.", PROGRESSIVE_GUIDE, "LD", 1),
  guide("progressive", "guide", "Spreading & Flowing", "Daily drills to build speed with clarity, and how to flow rounds faster than you can speak.", SPREADING_GUIDE, "all", 2),
  yt("spreading", "progressive", "video", "all", 10),
  yt("afropessimism", "progressive", "video", "all", 11, "Frank Wilderson — the foundational thinker of Afropessimism — explains the framework. Background for the Afropessimism files in the library."),
];

async function main() {
  const { data: existing, error: exErr } = await db.from("resources").select("id").limit(1);
  if (exErr) throw exErr;
  if (existing.length > 0) {
    console.log("Resources already exist — skipping seed. Delete rows to re-seed.");
    return;
  }
  for (const r of RESOURCES) {
    const { error } = await db.rpc("admin_create_resource", {
      p_secret: SECRET,
      p_section: r.section,
      p_category: r.category,
      p_title: r.title,
      p_description: r.description ?? null,
      p_type: r.type,
      p_url: r.url ?? null,
      p_storage_path: null,
      p_content: r.content ?? null,
      p_debate_format: r.debate_format ?? "all",
      p_sort_order: r.sort_order ?? 0,
    });
    if (error) throw new Error(`Failed on "${r.title}": ${error.message}`);
    console.log(`✓ ${r.section} / ${r.title}`);
  }

  // A demo school so the app is usable immediately
  const { error: sErr } = await db.rpc("admin_create_school", {
    p_secret: SECRET,
    p_name: "Demo School",
    p_code: "DEMO2026",
  });
  if (sErr && !sErr.message.includes("duplicate")) throw sErr;
  console.log("✓ Demo school (code: DEMO2026)");
  console.log(`\nSeeded ${RESOURCES.length} resources.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
