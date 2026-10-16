import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "mansetle_admin";
// 30 days persistent session
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "mansetle-admin-session-secure-key-2026";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function readCookie(request: Request) {
  const raw = request.headers.get("cookie") ?? "";
  return raw
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
}

export function isAdmin(request: Request) {
  try {
    const token = readCookie(request);
    if (!token) return false;
    const [expiresAt, signature] = token.split(".");
    if (!expiresAt || !signature || Number(expiresAt) < Date.now()) return false;
    const expected = sign(expiresAt);
    return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD yapılandırılmamış.");
  const received = Buffer.from(password.trim());
  const target = Buffer.from(expected.trim());
  return received.length === target.length && timingSafeEqual(received, target);
}

export function sessionCookie() {
  const expiresAtMs = Date.now() + MAX_AGE * 1000;
  const expiresAt = String(expiresAtMs);
  const expiresDate = new Date(expiresAtMs).toUTCString();
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${expiresAt}.${sign(expiresAt)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}; Expires=${expiresDate}${secureFlag}`;
}

export function clearSessionCookie() {
  const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`;
}
