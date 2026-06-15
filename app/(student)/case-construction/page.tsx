import { listResources } from "@/lib/supabase";
import { SectionHeader, SectionView } from "@/components/SectionView";

export const dynamic = "force-dynamic";

export default async function CaseConstructionPage() {
  const resources = await listResources("case-construction");
  return (
    <div>
      <SectionHeader
        title="Case Construction"
        lede="A case is your opening speech — the prepared foundation of everything you do in a round. Start with the structure guide for your event, watch the videos, then study the example cases."
      />
      <SectionView
        resources={resources}
        categories={[
          {
            key: "structure",
            heading: "Case structures by event",
            blurb: "How a case is organized in each debate format. Read the guide for the event you compete in first.",
          },
          {
            key: "argumentation",
            heading: "Types of argumentation",
            blurb:
              "Every major argument type you'll see — kritiks, theory shells, disadvantages, counterplans, framework, and more — with a how-to guide and a video for each.",
          },
          {
            key: "example-case",
            heading: "Example cases",
            blurb: "Real cases shared by your partner coach, plus annotated templates. Read them next to the structure guides.",
          },
        ]}
      />
    </div>
  );
}
