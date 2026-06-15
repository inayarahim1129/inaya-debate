"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { School } from "@/lib/types";

export default function AdminSchools({ initialSchools }: { initialSchools: School[] }) {
  const [schools, setSchools] = useState(initialSchools);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function addSchool(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code }),
    });
    const body = await res.json();
    if (res.ok) {
      setSchools([body.school, ...schools]);
      setName("");
      setCode("");
    } else {
      setError(body.error);
    }
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("Remove this school? Students with its code will lose access.")) return;
    await fetch("/api/admin/schools", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSchools(schools.filter((s) => s.id !== id));
  }

  return (
    <section>
      <h2 className="font-display text-2xl font-bold text-ink-900">Partner schools</h2>
      <p className="mt-1 text-sm text-ink-600">
        Create one access code per school. Students enter the code once to unlock the app.
      </p>

      <form onSubmit={addSchool} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex-1 min-w-52 text-sm font-medium text-ink-700">
          School name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lincoln High School"
            className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 focus:border-gold-500 focus:outline-none"
          />
        </label>
        <label className="min-w-44 text-sm font-medium text-ink-700">
          Access code
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="LINCOLN2026"
            className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 font-mono focus:border-gold-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={busy || !name.trim() || !code.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add school
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm">
        {schools.length === 0 ? (
          <p className="p-6 text-center text-sm text-ink-400">No schools yet — add your first partner school above.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-2.5">School</th>
                <th className="px-4 py-2.5">Access code</th>
                <th className="px-4 py-2.5">Added</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {schools.map((s) => (
                <tr key={s.id} className="border-t border-ink-100">
                  <td className="px-4 py-3 font-medium text-ink-900">{s.name}</td>
                  <td className="px-4 py-3 font-mono text-ink-700">{s.access_code}</td>
                  <td className="px-4 py-3 text-ink-500">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(s.id)} className="text-ink-300 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
