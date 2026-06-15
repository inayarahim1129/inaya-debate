import Link from "next/link";
import { Gavel } from "lucide-react";
import { adminListSchools, listResources } from "@/lib/supabase";
import AdminSchools from "@/components/admin/AdminSchools";
import AdminResources from "@/components/admin/AdminResources";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [schools, resources] = await Promise.all([adminListSchools(), listResources()]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-ink-800 bg-ink-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <Gavel className="h-5 w-5 text-gold-400" /> Coach Admin
          </div>
          <Link href="/home" className="text-sm text-ink-200 hover:text-white">
            View student site →
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-12 px-4 py-8">
        <AdminSchools initialSchools={schools} />
        <AdminResources initialResources={resources} />
      </main>
    </div>
  );
}
