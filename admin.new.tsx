import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleEditor } from "@/components/ArticleEditor";

export const Route = createFileRoute("/admin/new")({
  head: () => ({
    meta: [
      { title: "إضافة مقال | المحور برس" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: NewArticlePage,
});

function NewArticlePage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-6">إضافة مقال جديد</h1>
        <ArticleEditor mode="create" />
      </main>
      <SiteFooter />
    </div>
  );
}
