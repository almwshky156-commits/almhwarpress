import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  type DbBreakingNews,
  createBreakingNews,
  deleteBreakingNews,
  fetchAllBreakingNews,
  updateBreakingNews,
} from "@/lib/breaking-news-db";

export const Route = createFileRoute("/admin/breaking")({
  head: () => ({
    meta: [
      { title: "إدارة شريط الأخبار العاجلة | المحور برس" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: BreakingNewsAdmin,
});

function BreakingNewsAdmin() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["breaking", "admin"],
    queryFn: fetchAllBreakingNews,
    enabled: !!isAdmin,
  });

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const refresh = () => qc.invalidateQueries({ queryKey: ["breaking"] });

  const handleAdd = async () => {
    const text = newText.trim();
    if (!text) return;
    setAdding(true);
    try {
      const maxOrder = items.reduce((m, i) => Math.max(m, i.sort_order), 0);
      await createBreakingNews(text, maxOrder + 1);
      setNewText("");
      toast.success("تمت الإضافة");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "فشل الحفظ");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (item: DbBreakingNews) => {
    try {
      await updateBreakingNews(item.id, { active: !item.active });
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "فشل التحديث");
    }
  };

  const handleDelete = async (item: DbBreakingNews) => {
    if (!confirm("حذف هذا الخبر العاجل؟")) return;
    try {
      await deleteBreakingNews(item.id);
      toast.success("تم الحذف");
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "فشل الحذف");
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    try {
      await Promise.all([
        updateBreakingNews(a.id, { sort_order: b.sort_order }),
        updateBreakingNews(b.id, { sort_order: a.sort_order }),
      ]);
      refresh();
    } catch (err) {
      toast.error((err as Error).message || "فشل الترتيب");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black">إدارة شريط الأخبار العاجلة</h1>
          <Link
            to="/admin"
            className="text-sm font-bold text-primary hover:text-primary-glow flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> عودة للوحة التحكم
          </Link>
        </div>

        {/* Add form */}
        <section className="bg-card border border-border rounded-xl shadow-card p-5 mb-6">
          <h2 className="font-black mb-3">إضافة خبر عاجل</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleAdd();
              }}
              placeholder="اكتب نص الخبر العاجل..."
              className="flex-1 border border-border rounded-md px-3 py-2 bg-background"
            />
            <button
              onClick={handleAdd}
              disabled={adding || !newText.trim()}
              className="bg-primary text-primary-foreground rounded-md px-5 py-2 font-bold disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              إضافة
            </button>
          </div>
        </section>

        {/* List */}
        <section className="bg-card border border-border rounded-xl shadow-card p-5">
          <h2 className="font-black mb-4">الأخبار العاجلة الحالية</h2>
          {isLoading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              لا توجد أخبار عاجلة بعد. أضف أول خبر من الأعلى.
            </p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <BreakingRow
                  key={item.id}
                  item={item}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                  onMoveUp={() => handleMove(index, -1)}
                  onMoveDown={() => handleMove(index, 1)}
                  onToggle={() => handleToggle(item)}
                  onDelete={() => handleDelete(item)}
                  onSaveText={async (text) => {
                    try {
                      await updateBreakingNews(item.id, { text });
                      toast.success("تم الحفظ");
                      refresh();
                    } catch (err) {
                      toast.error((err as Error).message || "فشل الحفظ");
                    }
                  }}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function BreakingRow({
  item,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onToggle,
  onDelete,
  onSaveText,
}: {
  item: DbBreakingNews;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onSaveText: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState(item.text);
  const dirty = text.trim() !== item.text && text.trim().length > 0;

  return (
    <li
      className={`border border-border rounded-md p-3 flex flex-wrap items-center gap-2 ${
        item.active ? "bg-background" : "bg-muted/40 opacity-75"
      }`}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 min-w-[200px] bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1 text-sm"
      />
      <div className="flex items-center gap-1">
        {dirty && (
          <button
            onClick={() => onSaveText(text.trim())}
            title="حفظ النص"
            className="p-2 rounded hover:bg-primary/10 text-primary"
          >
            <Save className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          title="نقل للأعلى"
          className="p-2 rounded hover:bg-secondary disabled:opacity-30"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          title="نقل للأسفل"
          className="p-2 rounded hover:bg-secondary disabled:opacity-30"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
        <button
          onClick={onToggle}
          title={item.active ? "إيقاف" : "تفعيل"}
          className="p-2 rounded hover:bg-secondary"
        >
          {item.active ? (
            <Eye className="h-4 w-4 text-green-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <button
          onClick={onDelete}
          title="حذف"
          className="p-2 rounded hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}