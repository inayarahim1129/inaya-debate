import { SectionHeader } from "@/components/SectionView";
import RoundRecorder from "@/components/RoundRecorder";

export default function PracticeRoundPage() {
  return (
    <div>
      <SectionHeader
        title="AI Practice Judge"
        lede="Run a practice round with a teammate, record it here (or upload a recording), and get back a full tournament-style ballot: a decision, reason for decision, speaker points, and drills to improve — judged on NSDA rules and standards."
      />
      <div className="mt-4 rounded-xl border border-gold-300 bg-gold-300/10 p-4 text-sm text-ink-700">
        <strong>Tips for a good recording: </strong>put the phone or laptop between the
        debaters, say your speech names out loud (&quot;This is the 1AC&quot;), and keep
        background noise down. Partial rounds are okay — the judge will evaluate what it hears.
        Keep recordings under about 60 minutes / 50&nbsp;MB.
      </div>
      <RoundRecorder />
    </div>
  );
}
