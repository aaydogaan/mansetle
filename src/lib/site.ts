export const site = {
  name: "Mansetle",
  url: "https://mansetle.vercel.app",
  slogan: "Bugünden ne varsa, Mansetle'de.",
  description: "Günün önemli gelişmelerini özgün, sade ve hızlı bir akışta takip edin.",
  image: "/og.jpg",
} as const;

export const categoryNames: Record<string, string> = {
  gundem: "Gündem", turkiye: "Türkiye", dunya: "Dünya", para: "Para", spor: "Spor", teknoloji: "Teknoloji", kultur: "Kültür", yasam: "Yaşam", eglence: "Eğlence", "son-haberler": "Son Haberler",
};

export const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  gundem: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop",
  turkiye: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
  dunya: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  para: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
  spor: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop",
  teknoloji: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  kultur: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop",
  yasam: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
  eglence: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
  "son-haberler": "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200&auto=format&fit=crop",
};

export function getArticleImageUrl(article: { imageUrl?: string | null; category: string }): string {
  if (article.imageUrl && article.imageUrl.trim().length > 0) {
    return article.imageUrl;
  }
  return DEFAULT_CATEGORY_IMAGES[article.category] ?? DEFAULT_CATEGORY_IMAGES.gundem;
}

export function absoluteUrl(path = "/") { return new URL(path, site.url).toString(); }
export function pageTitle(value?: string) { return value ? `${site.name} - ${value}` : `${site.name} - ${site.slogan}`; }
export function trimDescription(value: string, limit = 160) { const text = value.replace(/\s+/g, " ").trim(); return text.length <= limit ? text : `${text.slice(0, limit - 1).trimEnd()}…`; }

export function seoHead({ title, description, path, type = "website", image: customImage }: { title: string; description: string; path: string; type?: "website" | "article"; image?: string }) {
  const canonical = absoluteUrl(path); const image = customImage || absoluteUrl(site.image);
  return { meta: [{ title }, { name: "description", content: description }, { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }, { property: "og:type", content: type }, { property: "og:locale", content: "tr_TR" }, { property: "og:site_name", content: site.name }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: canonical }, { property: "og:image", content: image }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: image }], links: [{ rel: "canonical", href: canonical }] };
}
