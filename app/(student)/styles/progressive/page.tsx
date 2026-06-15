import { listResources } from "@/lib/supabase";
import { SectionHeader, SectionView } from "@/components/SectionView";

export const dynamic = "force-dynamic";

export default async function ProgressivePage() {
  const resources = await listResources("progressive");
  return (
    <div>
      <SectionHeader
        title="Progressive Debate"
        lede="On the national circuit, LD looks very different: faster speeches, kritiks, theory shells, plans, and judges who vote strictly off the flow. This track teaches circuit-style ('progressive') debate for when you're ready to go technical."
      />
      <SectionView
        resources={resources}
        categories={[
          { key: "guide", heading: "Guides" },
          { key: "video", heading: "Videos" },
          { key: "example", heading: "Examples" },
        ]}
      />
    </div>
  );
}
