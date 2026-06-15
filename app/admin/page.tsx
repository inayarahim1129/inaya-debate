import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession, ADMIN_COOKIE, AdminSession } from "@/lib/session";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const store = await cookies();
  const session = await verifySession<AdminSession>(store.get(ADMIN_COOKIE)?.value);
  if (session?.admin) redirect("/admin/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center bg-ink-950 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
          Inaya Debate Partnership
        </p>
        <h1 className="font-display mt-1 text-2xl font-bold text-ink-900">Coach admin</h1>
        <p className="mt-1 text-sm text-ink-500">
          Manage school access codes, files, videos, and example cases.
        </p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
