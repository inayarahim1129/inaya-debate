"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccessForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      router.push(params.get("next") || "/home");
      router.refresh();
    } else {
      setError("That code didn't match a partner school. Check with your sponsor and try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-3">
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="SCHOOL ACCESS CODE"
        autoCapitalize="characters"
        autoComplete="off"
        className="flex-1 rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 font-mono tracking-widest text-white placeholder:text-ink-400 focus:border-gold-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gold-500 px-6 py-3 font-semibold text-ink-950 transition hover:bg-gold-400 disabled:opacity-60"
      >
        {loading ? "Checking…" : "Enter"}
      </button>
      {error && <p className="absolute mt-14 text-sm text-red-300">{error}</p>}
    </form>
  );
}
