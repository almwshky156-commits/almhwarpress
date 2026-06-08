import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/ArticleCard";
import {
  articles as staticArticles,
  formatDate,
  getArticle,
  getCategory,
} from "@/lib/news-data";
import { fetchArticleBySlug, fetchPublishedArticles } from "@/lib/articles-db";
import { Clock, Loader2, User } from "lucide-react";

export const Route = createFileRoute("/article/$slug")({
  head: ({ params }) => {
    const a = getArticle(params.slug);
    if (!a) return { meta: [{ title: "المحور برس" }] };
    return {
      meta: [
        { title: `${a.title} | المحور برس` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:image", content: a.image },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: a.image },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black mb-2">المقال غير موجود</h1>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded font-bold mt-4"
        >
          الرئيسية
        </Link>
      </main>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: dbArticle, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticleBySlug(slug),
  });
  const { data: dbAll } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: fetchPublishedArticles,
  });
  const article = dbArticle ?? getArticle(slug);

  if (isLoading && !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-black mb-2">المقال غير موجود</h1>
          <Link
            to="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded font-bold mt-4"
          >
            الرئيسية
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const cat = getCategory(article.category);
  const source = dbAll && dbAll.length > 0 ? dbAll : staticArticles;
  const related = source
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 max-w-3xl">
          {cat && (
            <Link
              to="/category/$slug"
              params={{ slug: cat.slug }}
              className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded mb-4"
            >
              {cat.name}
            </Link>
          )}
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {article.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-y border-border py-3 mb-6">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" /> {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {formatDate(article.date)}
            </span>
            <span>قراءة: {article.readingTime} د</span>
          </div>
          <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-elevated mb-8">
            <img
              src={article.image}
              alt={article.title}
              width={1200}
              height={675}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="prose prose-lg max-w-none text-foreground leading-loose space-y-4">
            {article.body.split("\n\n").map((p, i) => (
              <p key={i} className="text-base sm:text-lg leading-loose">
                {p}
              </p>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section className="container mx-auto px-4 py-10 border-t border-border mt-10">
            <h2 className="text-2xl font-black border-r-4 border-primary pr-3 mb-6">
              مقالات ذات صلة
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
