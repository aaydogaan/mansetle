import { Link } from "@tanstack/react-router";
import type { LiveArticle } from "@/lib/news";
import { categoryNames } from "@/lib/site";

function ArticleImage({ article, className }: { article: LiveArticle; className: string }) {
  if (!article.imageUrl) return <div className={`${className} grid place-items-center bg-gradient-to-br from-buletin/90 via-buletin to-ink p-6 text-center font-serif text-2xl font-bold text-white`}><span>{categoryNames[article.category] ?? "Mansetle"}</span></div>;
  return <img src={article.imageUrl} alt="" className={className} loading="eager" referrerPolicy="no-referrer" />;
}

function NewsCard({ article }: { article: LiveArticle }) {
  return <Link to="/haber/$slug" params={{ slug: article.slug }} className="group block"><ArticleImage article={article} className="aspect-[4/3] w-full rounded-xl object-cover" /><p className="mt-3 text-[11px] font-semibold text-muted">{article.sourceName} <span className="mx-1">•</span> {categoryNames[article.category] ?? article.category}</p><h3 className="mt-2 font-serif text-[20px] leading-tight font-bold text-ink group-hover:text-buletin">{article.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{article.summary}</p></Link>;
}

export function HomePage({ articles }: { articles: LiveArticle[] }) {
  const [hero, ...latest] = articles;
  return <div>
    <section className="container-buletin pt-7 md:pt-10"><div className="rounded-2xl bg-paper px-6 py-8 text-center md:px-12 md:py-10"><p className="text-[10px] font-bold tracking-[0.28em] text-subtle uppercase">Mansetle</p><h1 className="mx-auto mt-3 max-w-[700px] font-serif text-[29px] leading-snug font-bold text-ink md:text-[40px]">Günün önemli gelişmeleri, <span className="text-buletin">Mansetle'de.</span></h1></div></section>
    {!hero ? <section className="container-buletin py-20 text-center"><h2 className="font-serif text-3xl font-bold">Haberler hazırlanıyor</h2><p className="mt-3 text-muted">Yayınlanan haberler burada anında görünecek.</p></section> : <><section className="container-buletin mt-10 md:mt-14"><Link to="/haber/$slug" params={{ slug: hero.slug }} className="grid items-center gap-7 md:grid-cols-2 md:gap-10"><ArticleImage article={hero} className="aspect-[4/3] w-full rounded-2xl object-cover" /><div><p className="text-xs font-semibold text-buletin">{hero.sourceName} <span className="mx-1">•</span> {categoryNames[hero.category] ?? hero.category}</p><h2 className="mt-4 font-serif text-[34px] leading-[1.1] font-bold text-ink md:text-[46px]">{hero.title}</h2><p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">{hero.summary}</p><p className="mt-5 text-sm font-semibold text-buletin">Haberi oku →</p></div></Link></section>
    <section className="container-buletin mt-14 pb-8 md:mt-20"><div className="mb-7 flex items-center justify-between"><h2 className="font-serif text-[30px] font-bold text-ink">Son Haberler</h2><Link to="/kategori/$slug" params={{ slug: "gundem" }} className="text-sm font-semibold text-buletin">Tümünü gör →</Link></div>{latest.length ? <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{latest.slice(0, 8).map((article) => <NewsCard key={article.slug} article={article} />)}</div> : <p className="py-6 text-muted">Yeni yayınlanan haberler burada sıralanacak.</p>}</section></>}</div>;
}
