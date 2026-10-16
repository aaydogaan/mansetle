import { createFileRoute } from "@tanstack/react-router";
import { clearSessionCookie } from "@/lib/recep-auth.server";

export const Route = createFileRoute("/api/recep/logout")({ server: { handlers: { POST: () => Response.json({ ok: true }, { headers: { "Set-Cookie": clearSessionCookie() } }) } } });
