"use client";

import { useMemo, useState } from "react";
import { FileText, Download, Search } from "lucide-react";

export interface LibraryFile {
  id: string;
  title: string;
  description: string | null;
  category: string;
  debate_format: string;
  href: string;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  cases: "Cases",
  kritiks: "Kritik files",
  evidence: "Evidence",
  handouts: "Handouts",
  general: "Other",
};

export default function LibraryBrowser({ files }: { files: LibraryFile[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(files.map((f) => f.category))).sort(),
    [files]
  );

  const filtered = files.filter((f) => {
    if (category && f.category !== category) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      f.title.toLowerCase().includes(q) ||
      (f.description ?? "").toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-ink-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            className="w-full rounded-lg border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-ink-900 focus:border-gold-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              category === null ? "bg-ink-900 text-white" : "bg-white text-ink-700 border border-ink-200 hover:border-ink-400"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c === category ? null : c)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                category === c ? "bg-ink-900 text-white" : "bg-white text-ink-700 border border-ink-200 hover:border-ink-400"
              }`}
            >
              {CATEGORY_LABELS[c] ?? c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
          {files.length === 0
            ? "No files yet — your partner coach will upload prep files soon."
            : "No files match your search."}
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((f) => (
            <a
              key={f.id}
              href={f.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-4 rounded-xl border border-ink-100 bg-white p-5 shadow-sm transition hover:border-gold-400 hover:shadow"
            >
              <div className="rounded-lg bg-ink-50 p-2.5">
                <FileText className="h-5 w-5 text-ink-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-ink-900">{f.title}</h4>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-gold-600">
                  {CATEGORY_LABELS[f.category] ?? f.category}
                  {f.debate_format !== "all" && ` · ${f.debate_format}`}
                </p>
                {f.description && (
                  <p className="mt-1 text-sm text-ink-600 line-clamp-2">{f.description}</p>
                )}
              </div>
              <Download className="h-5 w-5 shrink-0 text-ink-300 transition group-hover:text-gold-600" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
