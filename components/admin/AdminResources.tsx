"use client";

import { useState } from "react";
import { Trash2, Plus, FileText, Video, BookOpen, Loader2 } from "lucide-react";
import type { Resource } from "@/lib/types";
import { supabaseBrowser } from "@/lib/supabase-browser";

const SECTIONS = [
  { key: "case-construction", label: "Case Construction" },
  { key: "rebuttals", label: "Rebuttals" },
  { key: "lay-ld", label: "Lay LD" },
  { key: "progressive", label: "Progressive" },
  { key: "library", label: "File Library" },
];

const CATEGORY_HINTS: Record<string, string[]> = {
  "case-construction": ["structure", "argumentation", "example-case"],
  rebuttals: ["guide", "video", "example"],
  "lay-ld": ["guide", "video", "example"],
  progressive: ["guide", "video", "example"],
  library: ["cases", "kritiks", "evidence", "handouts", "general"],
};

export default function AdminResources({ initialResources }: { initialResources: Resource[] }) {
  const [resources, setResources] = useState(initialResources);
  const [section, setSection] = useState("library");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"file" | "youtube" | "guide">("file");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [format, setFormat] = useState("all");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterSection, setFilterSection] = useState<string | null>(null);

  async function addResource(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      let storage_path: string | null = null;
      if (type === "file") {
        if (!file) throw new Error("Choose a file to upload.");
        if (file.size > 50 * 1024 * 1024) throw new Error("Files must be under 50 MB.");
        storage_path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { error: upErr } = await supabaseBrowser.storage
          .from("library-files")
          .upload(storage_path, file, { contentType: file.type || undefined });
        if (upErr) throw new Error("Upload failed: " + upErr.message);
      }
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          category,
          title,
          description,
          type,
          url: type === "youtube" ? url : null,
          storage_path,
          content: type === "guide" ? content : null,
          debate_format: format,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to save.");
      setResources([body.resource, ...resources]);
      setTitle("");
      setDescription("");
      setUrl("");
      setContent("");
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this resource?")) return;
    await fetch("/api/admin/resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setResources(resources.filter((r) => r.id !== id));
  }

  const shown = filterSection ? resources.filter((r) => r.section === filterSection) : resources;
  const typeIcon = { file: FileText, youtube: Video, guide: BookOpen };

  return (
    <section>
      <h2 className="font-display text-2xl font-bold text-ink-900">Content & files</h2>
      <p className="mt-1 text-sm text-ink-600">
        Upload files (cases, kritik files, evidence), add YouTube videos, or write guides. Pick
        the section and category that controls where it appears.
      </p>

      <form
        onSubmit={addResource}
        className="mt-4 space-y-3 rounded-xl border border-ink-100 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-wrap gap-3">
          <label className="text-sm font-medium text-ink-700">
            Section
            <select
              value={section}
              onChange={(e) => {
                setSection(e.target.value);
                setCategory("");
              }}
              className="mt-1 block rounded-lg border border-ink-200 bg-white px-3 py-2"
            >
              {SECTIONS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-ink-700">
            Category
            <input
              list="category-hints"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={CATEGORY_HINTS[section]?.[0] ?? "general"}
              className="mt-1 block rounded-lg border border-ink-200 bg-white px-3 py-2"
            />
            <datalist id="category-hints">
              {(CATEGORY_HINTS[section] ?? []).map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className="text-sm font-medium text-ink-700">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="mt-1 block rounded-lg border border-ink-200 bg-white px-3 py-2"
            >
              <option value="file">File upload</option>
              <option value="youtube">YouTube video</option>
              <option value="guide">Written guide</option>
            </select>
          </label>
          <label className="text-sm font-medium text-ink-700">
            Event
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="mt-1 block rounded-lg border border-ink-200 bg-white px-3 py-2"
            >
              <option value="all">All events</option>
              <option value="LD">LD</option>
              <option value="PF">PF</option>
              <option value="WS">World Schools</option>
            </select>
          </label>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (e.g. 'Afropessimism K — full file' or 'My state finals AC')"
          className="w-full rounded-lg border border-ink-200 px-3 py-2 focus:border-gold-500 focus:outline-none"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description students will see (optional)"
          className="w-full rounded-lg border border-ink-200 px-3 py-2 focus:border-gold-500 focus:outline-none"
        />

        {type === "file" && (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-ink-950 file:px-4 file:py-2 file:font-semibold file:text-white"
          />
        )}
        {type === "youtube" && (
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 font-mono text-sm focus:border-gold-500 focus:outline-none"
          />
        )}
        {type === "guide" && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Write the guide in Markdown — headings with #, lists with -, bold with **text**…"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 font-mono text-sm focus:border-gold-500 focus:outline-none"
          />
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !title.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {busy ? "Saving…" : "Add resource"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterSection(null)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            filterSection === null ? "bg-ink-900 text-white" : "border border-ink-200 bg-white text-ink-700"
          }`}
        >
          All ({resources.length})
        </button>
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilterSection(s.key === filterSection ? null : s.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              filterSection === s.key ? "bg-ink-900 text-white" : "border border-ink-200 bg-white text-ink-700"
            }`}
          >
            {s.label} ({resources.filter((r) => r.section === s.key).length})
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm">
        {shown.length === 0 ? (
          <p className="p-6 text-center text-sm text-ink-400">No resources in this section yet.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {shown.map((r) => {
              const Icon = typeIcon[r.type] ?? FileText;
              return (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <Icon className="h-4 w-4 shrink-0 text-ink-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink-900">{r.title}</p>
                    <p className="text-xs text-ink-400">
                      {r.section} · {r.category}
                      {r.debate_format !== "all" && ` · ${r.debate_format}`}
                    </p>
                  </div>
                  <button onClick={() => remove(r.id)} className="text-ink-300 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
