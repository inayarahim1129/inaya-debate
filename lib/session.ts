// Signed-cookie sessions using Web Crypto (works in middleware and route handlers).

const encoder = new TextEncoder();

async function hmacKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function signSession(payload: object): Promise<string> {
  const key = await hmacKey();
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)).buffer as ArrayBuffer);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return `${body}.${toBase64Url(sig)}`;
}

export async function verifySession<T>(token: string | undefined): Promise<T | null> {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    const key = await hmacKey();
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(sig) as unknown as ArrayBuffer,
      encoder.encode(body)
    );
    if (!ok) return null;
    const json = new TextDecoder().decode(fromBase64Url(body));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export interface SchoolSession {
  schoolId: string;
  schoolName: string;
}

export interface AdminSession {
  admin: true;
}

export const SCHOOL_COOKIE = "debate_school";
export const ADMIN_COOKIE = "debate_admin";
