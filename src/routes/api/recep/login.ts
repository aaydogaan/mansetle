import { createFileRoute } from "@tanstack/react-router";
import { sessionCookie, verifyAdminPassword } from "@/lib/recep-auth.server";

export const Route = createFileRoute("/api/recep/login")({ server: { handlers: { POST: async ({ request }) => {
  const body = await request.json().catch(() => null) as { password?: string } | null;
  if (!body?.password || !verifyAdminPassword(body.password)) return Response.json({ error: "Parola hatalı." }, { status: 401 });
  return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie() } });
} } } });
