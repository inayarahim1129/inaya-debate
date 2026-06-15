import Link from "next/link";
import { FileText, Download, BookOpen } from "lucide-react";
import type { Resource } from "@/lib/types";
import { publicFileUrl } from "@/lib/supabase";
import YouTubeCard from "./YouTubeCard";

export function FormatBadge({ format }: { format: string }) {
  if (format === "all") return null;
  const colors: Record<string, string> = {
    LD: "bg-ink-100 text-ink-800",
    PF: "bg-gold-300/40 text-gold-600",
    WS: "bg-emerald-100 text-emerald-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[format] ?? "bg-ink-50 text-ink-600"}`}>
      {format}
    </span>
  );
}

export function GuideCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/guide/${resource.id}`}
      className="group flex items-start gap-4 rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-gold-400 hover:shadow"
    >
      <div className="rounded-lg bg-ink-900 p-2.5">
        <BookOpen className="h-5 w-5 text-gold-400" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-ink-900 group-hover:text-ink-700">{resource.title}</h4>
          <FormatBadge format={resource.debate_format} />
        </div>
        {resource.description && (
          <p className="mt-1 text-sm text-ink-600 line-clamp-2">{resource.description}</p>
        )}
      </div>
    </Link>
  );
}

export function FileCard({ resource }: { resource: Resource }) {
  const href = resource.storage_path ? publicFileUrl(resource.storage_path) : resource.url ?? "#";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-4 rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-gold-400 hover:shadow"
    >
      <div className="rounded-lg bg-ink-50 p-2.5">
        <FileText className="h-5 w-5 text-ink-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-ink-900">{resource.title}</h4>
          <FormatBadge format={resource.debate_format} />
        </div>
        {resource.description && (
          <p className="mt-1 text-sm text-ink-600 line-clamp-2">{resource.description}</p>
        )}
      </div>
      <Download className="h-5 w-5 shrink-0 text-ink-300 transition group-hover:text-gold-600" />
    </a>
  );
}

export function ResourceBlock({ resource }: { resource: Resource }) {
  if (resource.type === "youtube" && resource.url) {
    return <YouTubeCard url={resource.url} title={resource.title} description={resource.description} />;
  }
  if (resource.type === "guide") return <GuideCard resource={resource} />;
  return <FileCard resource={resource} />;
}
