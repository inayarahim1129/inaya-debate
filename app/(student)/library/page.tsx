import { listResources, publicFileUrl } from "@/lib/supabase";
import { SectionHeader } from "@/components/SectionView";
import LibraryBrowser from "@/components/LibraryBrowser";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const resources = await listResources("library");
  const files = resources.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    debate_format: r.debate_format,
    href: r.storage_path ? publicFileUrl(r.storage_path) : r.url ?? "#",
    created_at: r.created_at,
  }));
  return (
    <div>
      <SectionHeader
        title="File Library"
        lede="Everything your partner coach has shared — past cases, kritik files (including Afropessimism), evidence, and handouts. Search, filter, and download."
      />
      <LibraryBrowser files={files} />
    </div>
  );
}
