import { z } from "zod";

export const analysisSchema = z.object({
  decision: z.object({
    winner: z
      .string()
      .describe('The winning side, e.g. "Affirmative", "Negative", "Pro", "Con", "Proposition", "Opposition"'),
    summary: z.string().describe("One- or two-sentence statement of the decision"),
  }),
  rfd: z
    .string()
    .describe(
      "A full Reason for Decision written exactly like a real tournament ballot, in markdown. Walk through how the round broke down, which arguments were extended/dropped, how you weighed, and why the winner won. 300-600 words."
    ),
  speakerPoints: z
    .array(
      z.object({
        speaker: z.string().describe('Identifier, e.g. "Affirmative speaker" or "Pro — Speaker 1" or a name if stated in the round'),
        side: z.string(),
        points: z
          .number()
          .describe("NSDA speaker points on the 20.0-30.0 scale in tenths of a point. Average is ~27.5; reserve below 25 for major issues and below 20 is not allowed absent egregious conduct."),
        justification: z.string(),
      })
    )
    .describe("One entry per debater heard in the recording"),
  keyClashes: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().describe("What both sides said on this clash and how it resolved"),
        wonBy: z.string(),
      })
    )
    .describe("The 2-5 most important points of clash in the round"),
  droppedArguments: z
    .array(
      z.object({
        argument: z.string(),
        droppedBy: z.string(),
        impact: z.string().describe("How much the drop mattered to the decision"),
      })
    )
    .describe("Arguments that were conceded or never answered. Empty array if none."),
  speakerFeedback: z
    .array(
      z.object({
        speaker: z.string(),
        strengths: z.array(z.string()),
        improvements: z.array(z.string()),
      })
    )
    .describe("Constructive coaching feedback for each debater"),
  drills: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().describe("A concrete practice drill with instructions the student can do this week"),
      })
    )
    .describe("3-5 specific practice drills targeted at the weaknesses shown in this round"),
  rulesNotes: z
    .array(z.string())
    .describe(
      "Any NSDA rules or norms issues observed (evidence ethics, time limits exceeded, new arguments in late speeches, prep time issues). Empty array if none."
    ),
});

export type AnalysisOutput = z.infer<typeof analysisSchema>;

const FORMAT_DETAILS: Record<string, string> = {
  LD: `FORMAT: NSDA Lincoln-Douglas Debate (1 vs 1).
Speech order and times: 1AC (6 min), CX by Neg (3), 1NC (7), CX by Aff (3), 1AR (4), 2NR/NR (6), 2AR (4). Each debater has 4 minutes of prep.
Judging notes for LD:
- LD is a values debate. Resolve the framework debate (value/criterion or other standards) first when contested, then evaluate which side best links into the winning framework.
- Weigh contention-level offense through the framework. If frameworks are conceded or collapse to the same thing, weigh offense directly.
- The 1AR is the hardest speech; give some leniency on depth but not on drops.
- New arguments in the 2AR (or NR responses to nothing) should be disregarded and noted.`,
  PF: `FORMAT: NSDA Public Forum Debate (2 vs 2).
Speech order and times: Team A Constructive (4), Team B Constructive (4), Crossfire (3), Rebuttals (4 each), Crossfire (3), Summaries (3 each), Grand Crossfire (3), Final Focus (2 each). 3 minutes prep per team.
Judging notes for PF:
- PF should be accessible to a citizen judge. Heavy jargon, spreading, or plans/counterplans are against the spirit (and plans are against the rules) of the event — note it in rulesNotes.
- Arguments must be in summary AND final focus to be voted on ("collapse and extend"). First summary must answer second rebuttal; defense is not "sticky" in varsity norms.
- Weighing (magnitude, probability, timeframe, scope) should decide close rounds. Reward explicit comparative weighing.
- Evidence: NSDA rules require evidence to not be fabricated or distorted; paraphrasing must be supportable by the original source.`,
  WS: `FORMAT: World Schools Debate (3 vs 3, Proposition vs Opposition).
Speech order: Prop 1 (8), Opp 1 (8), Prop 2 (8), Opp 2 (8), Prop 3 (8), Opp 3 (8), Opp Reply (4), Prop Reply (4). Reply speeches given by the 1st or 2nd speaker. Points of Information (POIs) may be offered between minute 1 and 7 of main speeches.
Judging notes for World Schools:
- Score holistically on Style (40%), Content (40%), Strategy (20%) per speech. Standard speech scores range 60-80 with 70 as average (reply speeches are scored out of half).
- Reward principled (values-based) AND practical argumentation; the best teams do both.
- Engagement with POIs matters: speakers should take 1-2 POIs and handle them well.
- Reply speeches must be a biased adjudication of the round — no new arguments.
- For the speakerPoints field, use the World Schools 60-80 scale instead of the NSDA 20-30 scale, and say so in the justification.`,
};

export function judgeSystemPrompt(format: "LD" | "PF" | "WS"): string {
  return `You are an experienced, NSDA-certified high school debate judge writing a ballot for a PRACTICE round. Your audience is novice debaters at a school without a debate coach, so your feedback must be encouraging, concrete, and educational — but your decision must be honest and rigorous.

${FORMAT_DETAILS[format]}

NSDA JUDGING STANDARDS YOU MUST FOLLOW:
1. Be tabula rasa within reason: judge the round that was debated, not the round you wish was debated. Do not vote on your personal opinions of the topic.
2. Decisions must be based ONLY on arguments made in the round: a dropped argument is conceded, but it only matters as much as the debaters weigh it.
3. No new arguments in final speeches may factor into the decision (new weighing/extensions of existing arguments are fine).
4. Evidence ethics: flag (in rulesNotes) anything that sounds fabricated, distorted, or unsourced when a source is claimed. NSDA rules make evidence fabrication a disqualifying offense in real tournaments.
5. Speaker points (LD/PF): use the 20.0-30.0 scale in tenths. 27.5 is an average varsity performance; 29+ is excellent; below 25 signals serious problems; never below 20 absent egregious conduct. Judge novices on a fair curve and say you did so.
6. Speed/clarity: if a debater was unclear on the recording, you may treat unclear arguments as not communicated — note this in feedback.
7. Be respectful and constructive at all times. Critique arguments and skills, never the person. This is educational feedback for students learning without a coach.

The transcript you receive was auto-transcribed from an audio recording, so tolerate transcription noise; focus on the substance. If the recording contains only part of a round (e.g., just two speeches), judge what is there, say clearly in the RFD that it was a partial round, and base the "winner" on who is ahead on the flow so far.

Fill in every field of the requested structure. Write the RFD like a real ballot a student would receive at an NSDA tournament.`;
}

export function transcribePrompt(format: "LD" | "PF" | "WS"): string {
  const speeches: Record<string, string> = {
    LD: "1AC, Cross-Examination, 1NC, Cross-Examination, 1AR, NR (2NR), 2AR",
    PF: "Team A Constructive, Team B Constructive, Crossfire, Rebuttals, Crossfire, Summaries, Grand Crossfire, Final Focuses",
    WS: "Prop 1, Opp 1, Prop 2, Opp 2, Prop 3, Opp 3, Opp Reply, Prop Reply",
  };
  return `Transcribe this recording of a practice ${format === "LD" ? "Lincoln-Douglas" : format === "PF" ? "Public Forum" : "World Schools"} debate round completely and accurately.

Format the transcript with a markdown heading for each speech you can identify (expected speeches in order: ${speeches[format]}). If you cannot tell where one speech ends and another begins, use your best judgment and label uncertain sections. Label speakers consistently (e.g. "AFF:" / "NEG:" or "Speaker 1 (Pro):"). Include everything said — arguments, evidence citations, cross-examination exchanges. Do not summarize, editorialize, or omit content. If parts are inaudible write [inaudible].`;
}
