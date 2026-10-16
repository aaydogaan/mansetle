import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { generateNewsDraft } from "@/lib/gemini.server";
import { isAdmin } from "@/lib/recep-auth.server";
import { isSystemActive } from "@/lib/settings.server";

export function turkishSlugify(text: string): string {
  if (!text) return "";
  const charMap: Record<string, string> = {
    ç: "c", Ç: "c",
    ğ: "g", Ğ: "g",
    ı: "i", I: "i", İ: "i",
    ö: "o", Ö: "o",
    ş: "s", Ş: "s",
    ü: "u", Ü: "u",
    â: "a", Â: "a",
    î: "i", Î: "i",
    û: "u", Û: "u",
  };

  let str = text;
  for (const [key, val] of Object.entries(charMap)) {
    str = str.replaceAll(key, val);
  }

  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 85);
}

export const Route = createFileRoute("/api/recep/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });
        if (!(await isSystemActive())) {
          return Response.json({ error: "Sistem duraklatılmıştır. Yeni taslak oluşturmak için önce sistemi aktifleştirin." }, { status: 403 });
        }
        const body = (await request.json()) as { sourceFeedItemId?: number };
        if (!Number.isInteger(body.sourceFeedItemId)) return Response.json({ error: "Geçersiz haber." }, { status: 400 });
        const sql = await getSql();
        const rows = await sql.query<{ id: number; title: string; url: string; sourceName: string; articleId: number | null }>(
          `SELECT f.id, f.external_title AS title, f.external_url AS url, s.name AS "sourceName", a.id AS "articleId"
           FROM source_feed_items f
           JOIN news_sources s ON s.id = f.source_id
           LEFT JOIN news_articles a ON a.source_feed_item_id = f.id
           WHERE f.id = $1`,
          [body.sourceFeedItemId]
        );
        const item = rows[0];
        if (!item) return Response.json({ error: "Kaynak haberi bulunamadı." }, { status: 404 });
        if (item.articleId) return Response.json({ error: "Bu haber için taslak zaten var." }, { status: 409 });

        const draft = await generateNewsDraft({ sourceName: item.sourceName, sourceTitle: item.title, sourceUrl: item.url });

        // Clean SEO slug without feed item ID suffix
        const baseSlug = turkishSlugify(draft.title) || `haber-${item.id}`;
        let finalSlug = baseSlug;

        // Check if slug already exists to prevent duplicate key constraint
        const existing = await sql.query<{ id: number }>("SELECT id FROM news_articles WHERE slug = $1 LIMIT 1", [finalSlug]);
        if (existing[0]) {
          finalSlug = `${baseSlug}-${item.id}`;
        }

        const result = await sql.query<{ id: number }>(
          `INSERT INTO news_articles (source_feed_item_id, slug, title, summary, body_markdown, category, ai_model, input_tokens, output_tokens)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
          [item.id, finalSlug, draft.title, draft.summary, draft.bodyMarkdown, draft.category, draft.model, draft.inputTokens, draft.outputTokens]
        );
        return Response.json({ articleId: result[0]?.id, slug: finalSlug });
      },
    },
  },
});
