import { NextRequest } from "next/server";
import { verifySession, ADMIN_COOKIE, AdminSession } from "./session";

export async function requireAdmin(req: NextRequest): Promise<boolean> {
  const session = await verifySession<AdminSession>(req.cookies.get(ADMIN_COOKIE)?.value);
  return session?.admin === true;
}
