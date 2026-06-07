import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleEditor } from "@/components/ArticleEditor";
import { fetchArticleById } from "@/lib/articles-db";

export const Route = createFileRoute("/admin/edit/$id")({
  head: () => ({
    meta: [
      { title: "تعديل مقال | المحور برس" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: EditArticlePage,
});

function EditArticlePage() {
  const { id } = Route.useParams();
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", "id", id],
    queryFn: () => fetchArticleById(id),
    enabled: !!isAdmin,
  });

  if (loading || !user || !isAdmin || isLoading) {
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
          <h1 className="text-2xl font-black mb-2">المقال غير موجود</h1>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-6">تعديل المقال</h1>
        <ArticleEditor mode="edit" initial={article} />
      </main>
      <SiteFooter />
    </div>
  );
}