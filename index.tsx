import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/ArticleCard";
import {
  articles as staticArticles,
  categories,
  formatDate,
  getCategory,
} from "@/lib/news-data";
import { fetchPublishedArticles } from "@/lib/articles-db";
import { fetchFirestoreArticles } from "@/lib/firestore-articles";
import { ArrowLeft, Clock } from "lucide-react";
import almhwarHero from "@/assets/almhwar-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "المحور برس | الرئيسية" },
      {
        name: "description",
        content:
          "الصفحة الرئيسية لشبكة المحور برس - أحدث الأخبار، المقالات، والتحليلات.",
      },
      { property: "og:title", content: "المحور برس | الرئيسية" },
      {
        property: "og:description",
        content: "أحدث الأخبار والتحليلات من شبكة المحور برس.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: dbArticles } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: fetchPublishedArticles,
  });
  const { data: firestoreArticles } = useQuery({
    queryKey: ["firestore", "articles"],
    queryFn: fetchFirestoreArticles,
  });
  const articles =
    dbArticles && dbArticles.length > 0 ? dbArticles : staticArticles;
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const latest = [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((a) => a.slug !== featured.slug)
    .slice(0, 5);
  const featuredCat = getCategory(featured.category);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Brand hero banner */}
        <section className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-6 flex justify-center">
            <img
              src={almhwarHero}
              alt="موقع المحور برس"
              className="w-full max-w-3xl h-auto object-contain"
              loading="eager"
            />
          </div>
        </section>

        {/* Hero featured */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <Link
              to="/article/$slug"
              params={{ slug: featured.slug }}
              className="lg:col-span-2 group relative overflow-hidden rounded-xl shadow-elevated"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  width={1600}
                  height={900}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-overlay" />
              <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-8 text-background">
                <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded mb-3">
                  {featuredCat?.name}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black leading-tight mb-2 group-hover:text-accent transition">
                  {featured.title}
                </h2>
                <p className="text-sm sm:text-base opacity-90 line-clamp-2 max-w-2xl">
                  {featured.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs opacity-80">
                  <span>{featured.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatDate(featured.date)}
                  </span>
                </div>
              </div>
            </Link>

            <aside className="flex flex-col gap-3">
              <h3 className="text-lg font-black border-r-4 border-primary pr-3">
                آخر الأخبار
              </h3>
              <div className="flex flex-col gap-3">
                {latest.map((a) => (
                  <ArticleCard key={a.slug} article={a} variant="horizontal" />
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* Category sections */}
        {categories.map((cat) => {
          const items = articles.filter((a) => a.category === cat.slug);
          if (items.length === 0) return null;
          const [first, ...rest] = items;
          return (
            <section
              key={cat.slug}
              className="container mx-auto px-4 py-8 border-t border-border"
            >
              <div className="flex items-end justify-between mb-6">
                <h2 className="text-2xl font-black border-r-4 border-primary pr-3">
                  {cat.name}
                </h2>
                <Link
                  to="/category/$slug"
                  params={{ slug: cat.slug }}
                  className="text-sm font-bold text-primary hover:text-primary-glow flex items-center gap-1"
                >
                  المزيد <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <ArticleCard article={first} />
                {rest.length > 0 ? (
                  <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
                    {rest.slice(0, 2).map((a) => (
                      <ArticleCard key={a.slug} article={a} />
                    ))}
                  </div>
                ) : (
                  <div className="md:col-span-2 text-sm text-muted-foreground">
                    {cat.description}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* All articles strip */}
        <section className="container mx-auto px-4 py-10 border-t border-border">
          <h2 className="text-2xl font-black border-r-4 border-primary pr-3 mb-6">
            تصفح كل المقالات
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>

        {/* Firestore articles */}
        {firestoreArticles && firestoreArticles.length > 0 && (
          <section className="container mx-auto px-4 py-10 border-t border-border">
            <h2 className="text-2xl font-black border-r-4 border-primary pr-3 mb-6">
              من Firestore
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {firestoreArticles.map((a) => (
                <article
                  key={a.id}
                  className="rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-elevated transition"
                >
                  {a.image && (
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={a.image}
                        alt={a.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-base line-clamp-2 mb-2">
                      {a.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {a.content}
                    </p>
                    {a.date && (
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" /> {formatDate(a.date)}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
