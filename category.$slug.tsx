import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/ArticleCard";
import {
  type CategorySlug,
  articles as staticArticles,
  getCategory,
} from "@/lib/news-data";
import { fetchPublishedArticles } from "@/lib/articles-db";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.cat.name ?? "قسم"} | المحور برس` },
      { name: "description", content: loaderData?.cat.description ?? "" },
      {
        property: "og:title",
        content: `${loaderData?.cat.name ?? ""} | المحور برس`,
      },
      {
        property: "og:description",
        content: loaderData?.cat.description ?? "",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black mb-2">القسم غير موجود</h1>
        <p className="text-muted-foreground mb-6">
          تأكد من الرابط أو عد إلى الصفحة الرئيسية.
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded font-bold"
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
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = getCategory(slug)!;
  const { data: dbArticles } = useQuery({
    queryKey: ["articles", "published"],
    queryFn: fetchPublishedArticles,
  });
  const source =
    dbArticles && dbArticles.length > 0 ? dbArticles : staticArticles;
  const items = source.filter((a) => a.category === (slug as CategorySlug));

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-hero text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl font-black mb-2">{cat.name}</h1>
            <p className="opacity-90 max-w-2xl">{cat.description}</p>
          </div>
        </section>
        <section className="container mx-auto px-4 py-10">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">
              لا توجد مقالات حالياً في هذا القسم.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
