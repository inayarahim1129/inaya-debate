import { cookies } from "next/headers";
import { listResources } from "@/lib/supabase";
import { SectionHeader, SectionView } from "@/components/SectionView";
import { EVENT_COOKIE, DebateEvent } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function RebuttalsPage() {
  const store = await cookies();
  const event = store.get(EVENT_COOKIE)?.value as DebateEvent | undefined;
  const all = await listResources("rebuttals");
  const resources = all.filter((r) => r.debate_format === "all" || !event || r.debate_format === event);
  return (
    <div>
      <SectionHeader
        title="Rebuttals"
        lede="Cases win rounds; rebuttals win championships. Learn to answer arguments line-by-line, weigh your impacts against theirs, and collapse to the arguments you're winning."
      />
      <SectionView
        resources={resources}
        categories={[
          {
            key: "guide",
            heading: "Rebuttal skills",
            blurb: "The core skills in order: signposting, the four-step refutation, weighing, and collapsing.",
          },
          {
            key: "video",
            heading: "Watch and learn",
          },
          {
            key: "example",
            heading: "Examples from real rounds",
            blurb: "Rebuttal documents and worked examples shared by your partner coach.",
          },
        ]}
      />
    </div>
  );
}
