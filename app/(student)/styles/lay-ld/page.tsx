import { listResources } from "@/lib/supabase";
import { SectionHeader, SectionView } from "@/components/SectionView";

export const dynamic = "force-dynamic";

export default async function LayLDPage() {
  const resources = await listResources("lay-ld");
  return (
    <div>
      <SectionHeader
        title="Lay LD Debate"
        lede="Most local tournaments are judged by parents, teachers, and community members — not debate experts. Lay debate is the art of winning their ballot: speak slowly, tell a story, and make your value framework feel like common sense."
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
