import { createFileRoute } from "@tanstack/react-router";
import { isAdmin } from "@/lib/recep-auth.server";

export const Route = createFileRoute("/api/recep/session")({ server: { handlers: { GET: ({ request }) => Response.json({ authenticated: isAdmin(request) }) } } });
