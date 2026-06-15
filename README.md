# Inaya Debate Partnership

A debate classroom app for partner public schools that don't have debate teams. Students at partner schools enter a school access code and get:

- **Case Construction** — case structures for LD, PF, and World Schools; how-to guides + YouTube videos for every argument type (kritiks, theory shells, topicality, DAs, counterplans, framework, evidence); annotated case templates and the coach's example cases
- **Rebuttals** — four-step refutation, weighing, collapsing guides with videos and examples
- **Lay LD** and **Progressive** — two style tracks
- **File Library** — searchable downloads of the coach's shared prep (cases, kritik files incl. Afropessimism, evidence)
- **AI Practice Judge** — record (or upload) a practice round; it's transcribed and judged on NSDA rules and standards, returning a decision, ballot-style RFD, speaker points (20–30 NSDA scale / WS 60–80 scale), key clashes, dropped arguments, per-speaker coaching, and practice drills

## How it's built

- Next.js (App Router) + Tailwind, deployed on Vercel
- Supabase: Postgres (schools, resources, rounds) + Storage (`library-files` public bucket, `round-audio` private bucket)
- Vercel AI SDK + AI Gateway: Gemini transcribes the audio; the judge model writes the ballot (`TRANSCRIBE_MODEL` / `JUDGE_MODEL` env vars)
- No user accounts: school access codes set a signed cookie; the admin panel uses `ADMIN_PASSWORD`
- All privileged DB writes go through `SECURITY DEFINER` RPCs guarded by `SUPABASE_SERVER_SECRET` — the public anon key can only read educational content

## Day-to-day use (coach)

1. Go to `/admin`, sign in with the admin password
2. **Partner schools:** add a school + access code (e.g. `LINCOLN2026`); give students the code
3. **Content & files:** upload files (≤50 MB), add YouTube links, or write Markdown guides; "Section" + "Category" control where they appear:
   - Case Construction: `structure`, `argumentation`, `example-case`
   - Rebuttals / Lay LD / Progressive: `guide`, `video`, `example`
   - File Library: `cases`, `kritiks`, `evidence`, `handouts`, or anything else

## Environment variables

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project + public key |
| `SUPABASE_SERVER_SECRET` | Guards the privileged DB RPCs (also stored in the `app_config` table) |
| `SESSION_SECRET` | Signs the school/admin cookies |
| `ADMIN_PASSWORD` | Admin panel login |
| `TRANSCRIBE_MODEL` | Gateway model for audio → transcript (default `google/gemini-2.5-flash`) |
| `JUDGE_MODEL` | Gateway model that writes the ballot |

AI calls authenticate to the Vercel AI Gateway automatically (OIDC) — no API key needed on Vercel. Locally, run `vercel env pull .env.development.local` to refresh the token.

> **Important — make the AI judge reliable (pick one):**
> 1. **Free:** create an API key at [aistudio.google.com](https://aistudio.google.com) and set `GOOGLE_GENERATIVE_AI_API_KEY` (Vercel → Project → Settings → Environment Variables). `google/*` models then call Google directly, skipping gateway free-tier rate limits.
> 2. **Paid (best ballots):** add AI Gateway credits in the Vercel dashboard (AI tab), then set `JUDGE_MODEL=anthropic/claude-fable-5`.
>
> Without one of these, the gateway free tier rate-limits the judge after a handful of rounds and students will see "the AI judge is at its usage limit."

## Development

```bash
npm install
npm run dev          # http://localhost:3000
node scripts/seed.mjs        # one-time: seeds starter guides/videos + DEMO2026 school
node scripts/test-round.mjs  # end-to-end test of the AI judging pipeline
```
