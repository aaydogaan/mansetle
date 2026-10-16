import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/recep-auth.server";
import { isSystemActive } from "@/lib/settings.server";

type GeminiImageResponse = { output_image?: { data?: string; mime_type?: string }; steps?: Array<{ content?: Array<{ type?: string; data?: string; mime_type?: string }> }> };

function imageOutput(payload: GeminiImageResponse) {
  if (payload.output_image?.data) return { data: payload.output_image.data, mimeType: payload.output_image.mime_type || "image/png" };
  for (const step of payload.steps ?? []) for (const content of step.content ?? []) if (content.type === "image" && content.data) return { data: content.data, mimeType: content.mime_type || "image/png" };
  return null;
}

export const Route = createFileRoute("/api/recep/generate-cover")({
  server: { handlers: { POST: async ({ request }) => {
    if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });
    if (!(await isSystemActive())) {
      return Response.json({ error: "Sistem duraklatılmıştır. AI görsel üretmek için önce sistemi aktifleştirin." }, { status: 403 });
    }
    const body = (await request.json()) as { articleId?: number };
    if (!Number.isInteger(body.articleId)) return Response.json({ error: "Geçersiz haber." }, { status: 400 });
    const apiKey = process.env.GEMINI_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!apiKey) return Response.json({ error: "GEMINI_API_KEY yapılandırılmamış." }, { status: 503 });
    if (!supabaseUrl || !serviceKey) return Response.json({ error: "AI kapak için SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY eklenmeli." }, { status: 503 });
    const sql = await getSql();
    const articles = await sql.query<{ id: number; title: string; summary: string; category: string }>("SELECT id, title, summary, category FROM news_articles WHERE id = $1", [body.articleId]);
    const article = articles[0];
    if (!article) return Response.json({ error: "Haber bulunamadı." }, { status: 404 });
    const prompt = `Create an original editorial news cover image in a realistic photojournalistic style. No logos, no watermarks, no text, no captions, no recognizable public figures. Use a clean 16:9 composition suitable for a Turkish news website. Topic: ${article.title}. Summary: ${article.summary}. Category: ${article.category}.`;
    const model = process.env.GEMINI_IMAGE_MODEL?.trim() || "gemini-3.1-flash-lite-image";
    const gemini = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }, body: JSON.stringify({ model, input: prompt, response_format: { type: "image", aspect_ratio: "16:9", image_size: "1K" } }), signal: AbortSignal.timeout(60_000) });
    if (!gemini.ok) return Response.json({ error: `Gemini kapak oluşturamadı (${gemini.status}).` }, { status: 502 });
    const generated = imageOutput((await gemini.json()) as GeminiImageResponse);
    if (!generated) return Response.json({ error: "Gemini görsel verisi döndürmedi." }, { status: 502 });
    const extension = generated.mimeType.includes("jpeg") ? "jpg" : "png";
    const path = `ai/${article.id}-${Date.now()}.${extension}`;
    const upload = await fetch(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/news-covers/${path}`, { method: "POST", headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey, "Content-Type": generated.mimeType, "x-upsert": "true" }, body: Buffer.from(generated.data, "base64") });
    if (!upload.ok) return Response.json({ error: "Kapak görseli Supabase Storage'a yüklenemedi." }, { status: 502 });
    const coverUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/news-covers/${path}`;
    await sql.query("UPDATE news_articles SET cover_image_mode = 'ai', cover_image_url = $1 WHERE id = $2", [coverUrl, article.id]);
    return Response.json({ ok: true, coverUrl });
  } } },
});
