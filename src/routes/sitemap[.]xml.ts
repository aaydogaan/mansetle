import { createFileRoute } from "@tanstack/react-router";
import { listPublishedArticles } from "@/lib/news.server";
import { absoluteUrl } from "@/lib/site";

function xml(value: string) { return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;"); }

export const Route = createFileRoute("/sitemap.xml")({
  server: { handlers: { GET: async () => {
    const staticPaths = ["/", "/kategori/gundem", "/kategori/turkiye", "/kategori/dunya", "/kategori/para", "/kategori/spor", "/kategori/teknoloji", "/kategori/kultur", "/kategori/yasam", "/kategori/eglence"];
    let articles: Awaited<ReturnType<typeof listPublishedArticles>> = [];
    try { articles = await listPublishedArticles(undefined, 500); } catch (error) { console.error("[sitemap] could not load articles", error); }
    const urls = [...staticPaths.map((path) => ({ loc: absoluteUrl(path), lastmod: undefined })), ...articles.map((article) => ({ loc: absoluteUrl(`/haber/${article.slug}`), lastmod: article.publishedAt }))];
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((entry) => `\n  <url><loc>${xml(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${new Date(entry.lastmod).toISOString()}</lastmod>` : ""}</url>`).join("")}\n</urlset>`;
    return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" } });
  } } },
});
