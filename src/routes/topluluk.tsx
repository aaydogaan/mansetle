import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageIntro } from "@/components/news/ArticleList";
import { communityPosts } from "@/data/content";

export const Route = createFileRoute("/topluluk")({ component: CommunityPage });

function CommunityPage() {
  const [posts, setPosts] = useState(communityPosts);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setPosts((prev) => [
      {
        id: `local-${Date.now()}`,
        author: "Siz",
        avatar: "/avatars/user.jpg",
        handle: "siz",
        time: "Az önce",
        title: title.trim(),
        body: body.trim(),
        replies: 0,
        likes: 0,
      },
      ...prev,
    ]);
    setTitle("");
    setBody("");
  };

  return (
    <SiteShell>
      <div className="container-buletin py-10 md:py-14">
        <PageIntro
          kicker="Topluluk"
          title="Yazı İşleri & Tartışma"
          body="Gündemi değerlendirin, görüşlerinizi paylaşın ve haberlerin perde arkasını tartışın."
        />

        <form onSubmit={onSubmit} className="mb-10 rounded-2xl border border-line bg-paper p-5 md:p-6">
          <label className="text-[13px] font-medium" htmlFor="c-title">
            Yeni Bir Konu Başlat
          </label>
          <input
            id="c-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Konu başlığı nedir?"
            className="mt-2 h-11 w-full rounded-lg border border-line bg-surface px-3 text-[14px] outline-none"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Düşüncelerinizi ve analizlerinizi buraya yazın..."
            rows={4}
            className="mt-3 w-full rounded-lg border border-line bg-surface px-3 py-2 text-[14px] outline-none"
          />
          <button type="submit" className="mt-3 h-11 rounded-lg bg-buletin px-5 text-[14px] font-semibold text-white hover:bg-buletin-dark">
            Paylaş
          </button>
        </form>

        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-line p-5">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt="" className="size-10 rounded-full object-cover" />
                <div>
                  <p className="text-[14px] font-semibold">{post.author}</p>
                  <p className="text-[12px] text-muted">
                    @{post.handle} · {post.time}
                  </p>
                </div>
              </div>
              <h2 className="mt-4 font-serif font-bold text-[22px] leading-snug">{post.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{post.body}</p>
              <div className="mt-4 flex items-center gap-5 text-[13px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="size-4" /> {post.replies}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="size-4" /> {post.likes}
                </span>
                <Link to="/hikayeler" className="ml-auto text-buletin">
                  İlgili haberler
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
