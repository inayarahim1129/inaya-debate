import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getResource } from "@/lib/supabase";
import Markdown from "@/components/Markdown";
import { FormatBadge } from "@/components/ResourceCards";

export const dynamic = "force-dynamic";

const SECTION_LINKS: Record<string, { href: string; label: string }> = {
  "case-construction": { href: "/case-construction", label: "Case Construction" },
  rebuttals: { href: "/rebuttals", label: "Rebuttals" },
  "lay-ld": { href: "/styles/lay-ld", label: "Lay LD" },
  progressive: { href: "/styles/progressive", label: "Progressive" },
  library: { href: "/library", label: "File Library" },
};

export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = await getResource(id);
  if (!resource || resource.type !== "guide" || !resource.content) notFound();

  const back = SECTION_LINKS[resource.section] ?? { href: "/home", label: "Home" };

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={back.href}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {back.label}
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">{resource.title}</h1>
        <FormatBadge format={resource.debate_format} />
      </div>
      {resource.description && <p className="mt-2 text-lg text-ink-600">{resource.description}</p>}
      <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm sm:p-10">
        <Markdown>{resource.content}</Markdown>
      </div>
    </article>
  );
}
