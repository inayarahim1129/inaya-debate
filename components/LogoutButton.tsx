"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/access", { method: "DELETE" });
        router.push("/");
        router.refresh();
      }}
      className="rounded-md border border-ink-700 px-3 py-1.5 text-ink-200 transition hover:bg-ink-800"
    >
      Exit
    </button>
  );
}
