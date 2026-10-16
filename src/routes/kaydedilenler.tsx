import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { ArticleList, PageIntro } from "@/components/news/ArticleList";
import { getArticle } from "@/data/content";
import { useSaved } from "@/store/saved";

export const Route = createFileRoute("/kaydedilenler")({ component: SavedPage });

function SavedPage() {
  const { ids } = useSaved();
  const list = ids.map((id) => getArticle(id)).filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <SiteShell>
      <div className="container-buletin py-10 md:py-14">
        <PageIntro
          kicker="Kaydedilenler"
          title="Okuma Listeniz"
          body="Daha sonra okumak üzere kaydettiğiniz haber ve analizler burada listelenir."
        />
        <ArticleList articles={list} empty="Henüz kaydedilmiş bir haberiniz yok. Bir haberi kaydetmek için yer imi simgesine tıklayın." />
      </div>
    </SiteShell>
  );
}
