import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

export const Route = createFileRoute("/api/database-status")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const sql = await getSql();
          const migrations = await sql.query<{ name: string }>(
            "SELECT name FROM _migrations ORDER BY name",
          );
          return Response.json({ connected: true, migrations: migrations.map((row) => row.name) });
        } catch (error) {
          console.error("[database-status] database connection failed", error);
          return Response.json({ connected: false }, { status: 503 });
        }
      },
    },
  },
});
