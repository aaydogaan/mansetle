export const site = {
  name: "Mansetle",
  url: "https://mansetle.vercel.app",
  slogan: "Bugünden ne varsa, Mansetle'de.",
  description: "Günün önemli gelişmelerini özgün, sade ve hızlı bir akışta takip edin.",
  image: "/og.jpg",
} as const;

export const categoryNames: Record<string, string> = {
  gundem: "Gündem", turkiye: "Türkiye", dunya: "Dünya", para: "Para", spor: "Spor", teknoloji: "Teknoloji", kultur: "Kültür", yasam: "Yaşam", eglence: "Eğlence",
};

export function absoluteUrl(path = "/") { return new URL(path, site.url).toString(); }
export function pageTitle(value?: string) { return value ? `${site.name} - ${value}` : `${site.name} - ${site.slogan}`; }
export function trimDescription(value: string, limit = 160) { const text = value.replace(/\s+/g, " ").trim(); return text.length <= limit ? text : `${text.slice(0, limit - 1).trimEnd()}…`; }

export function seoHead({ title, description, path, type = "website" }: { title: string; description: string; path: string; type?: "website" | "article" }) {
  const canonical = absoluteUrl(path); const image = absoluteUrl(site.image);
  return { meta: [{ title }, { name: "description", content: description }, { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }, { property: "og:type", content: type }, { property: "og:locale", content: "tr_TR" }, { property: "og:site_name", content: site.name }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: canonical }, { property: "og:image", content: image }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: image }], links: [{ rel: "canonical", href: canonical }] };
}
