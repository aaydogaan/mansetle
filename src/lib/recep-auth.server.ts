import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "mansetle_admin";
const MAX_AGE = 60 * 60 * 12;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET yapılandırılmamış.");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function readCookie(request: Request) {
  const raw = request.headers.get("cookie") ?? "";
  return raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
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
  const received = Buffer.from(password);
  const target = Buffer.from(expected);
  return received.length === target.length && timingSafeEqual(received, target);
}

export function sessionCookie() {
  const expiresAt = String(Date.now() + MAX_AGE * 1000);
  return `${COOKIE_NAME}=${expiresAt}.${sign(expiresAt)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
