import { createFileRoute } from "@tanstack/react-router";
import { isAdmin } from "@/lib/recep-auth.server";
import { isSystemActive, setSystemActive } from "@/lib/settings.server";

export const Route = createFileRoute("/api/recep/settings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });
        const active = await isSystemActive();
        return Response.json({ active });
      },
      POST: async ({ request }) => {
        if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });
        const body = (await request.json().catch(() => ({}))) as { active?: boolean };
        if (typeof body.active !== "boolean") {
          return Response.json({ error: "Geçersiz istek. 'active' boolean olmalı." }, { status: 400 });
        }
        const active = await setSystemActive(body.active);
        return Response.json({ active });
      },
    },
  },
});
