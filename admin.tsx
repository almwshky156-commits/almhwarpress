import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { categories } from "@/lib/news-data";
import {
  fetchAllArticlesAdmin,
  deleteArticle,
  type DbArticle,
} from "@/lib/articles-db";
import {
  LogOut,
  Newspaper,
  FolderTree,
  Plus,
  Loader2,
  ShieldCheck,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم | المحور برس" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles", "admin"],
    queryFn: fetchAllArticlesAdmin,
    enabled: !!isAdmin,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h1 className="text-2xl font-black mb-2">لا تملك صلاحية الوصول</h1>
          <p className="text-muted-foreground mb-6">هذه الصفحة مخصصة للمدراء فقط.</p>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/login" });
            }}
            className="bg-primary text-primary-foreground px-6 py-2 rounded font-bold"
          >
            تسجيل الخروج
          </button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const handleDelete = async (a: DbArticle) => {
    if (!confirm(`حذف المقال "${a.title}"؟ لا يمكن التراجع.`)) return;
    setDeleting(a.id);
    try {
      await deleteArticle(a.id);
      toast.success("تم الحذف");
      await queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (err) {
      toast.error((err as Error).message || "فشل الحذف");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
              لوحة التحكم
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              مرحباً، <span className="font-bold text-foreground">{user.email}</span>
            </p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              toast.success("تم تسجيل الخروج");
              navigate({ to: "/" });
            }}
            className="flex items-center gap-2 border border-border rounded-md px-4 py-2 text-sm font-bold hover:bg-secondary transition"
          >
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCard icon={Newspaper} label="المقالات" value={articles.length} />
          <StatCard icon={FolderTree} label="الأقسام" value={categories.length} />
          <StatCard icon={ShieldCheck} label="المدراء" value={1} />
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            to="/admin/breaking"
            className="flex items-center gap-2 bg-card border border-border rounded-md px-4 py-3 font-bold text-sm hover:bg-secondary transition"
          >
            <Megaphone className="h-4 w-4 text-primary" /> إدارة شريط الأخبار العاجلة
          </Link>
        </div>

        <section className="bg-card border border-border rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">إدارة المقالات</h2>
            <Link
              to="/admin/new"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-bold hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> إضافة مقال
            </Link>
          </div>
          {isLoading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : articles.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground text-sm">
              لا توجد مقالات بعد. اضغط "إضافة مقال" لبدء النشر.
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-right text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2 px-2 font-bold">العنوان</th>
                  <th className="py-2 px-2 font-bold">القسم</th>
                  <th className="py-2 px-2 font-bold">الحالة</th>
                  <th className="py-2 px-2 font-bold">التاريخ</th>
                  <th className="py-2 px-2 font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="border-b border-border/50">
                    <td className="py-2 px-2">
                      <Link to="/article/$slug" params={{ slug: a.slug }} className="hover:text-primary font-semibold">
                        {a.title}
                      </Link>
                    </td>
                    <td className="py-2 px-2 text-muted-foreground">
                      {categories.find((c) => c.slug === a.category)?.name}
                    </td>
                    <td className="py-2 px-2">
                      {a.published ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                          <Eye className="h-3 w-3" /> منشور
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <EyeOff className="h-3 w-3" /> مسودة
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-muted-foreground text-xs">
                      {new Date(a.published_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1">
                        <Link
                          to="/admin/edit/$id"
                          params={{ id: a.id }}
                          className="p-2 hover:bg-secondary rounded"
                          title="تعديل"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(a)}
                          disabled={deleting === a.id}
                          className="p-2 hover:bg-destructive/10 hover:text-destructive rounded disabled:opacity-50"
                          title="حذف"
                        >
                          {deleting === a.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-hero text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}