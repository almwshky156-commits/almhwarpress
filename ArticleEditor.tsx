import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { categories } from "@/lib/news-data";
import {
  type ArticleInput,
  type DbArticle,
  createArticle,
  slugify,
  updateArticle,
  uploadArticleImage,
} from "@/lib/articles-db";

interface Props {
  initial?: DbArticle;
  mode: "create" | "edit";
}

export function ArticleEditor({ initial, mode }: Props) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "هيئة التحرير");
  const [category, setCategory] = useState(
    initial?.category ?? categories[0].slug,
  );
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadArticleImage(file);
      setImageUrl(url);
      toast.success("تم رفع الصورة");
    } catch (err) {
      toast.error((err as Error).message || "فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("العنوان مطلوب");
      return;
    }
    const finalSlug = (slug.trim() || slugify(title)).slice(0, 120);
    if (!finalSlug) {
      toast.error("الرابط (slug) غير صالح");
      return;
    }
    const payload: ArticleInput = {
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author.trim(),
      category,
      image_url: imageUrl || null,
      featured,
      published,
    };
    setSaving(true);
    try {
      if (mode === "create") {
        await createArticle(payload);
        toast.success("تم إنشاء المقال");
      } else if (initial) {
        await updateArticle(initial.id, payload);
        toast.success("تم حفظ التعديلات");
      }
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error((err as Error).message || "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Field label="العنوان">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (mode === "create" && !slug) setSlug(slugify(e.target.value));
            }}
            className="w-full border border-border rounded-md px-3 py-2 bg-background"
            required
          />
        </Field>
        <Field label="الرابط (slug)">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-from-title"
            className="w-full border border-border rounded-md px-3 py-2 bg-background font-mono text-sm"
          />
        </Field>
        <Field label="الملخص">
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full border border-border rounded-md px-3 py-2 bg-background"
          />
        </Field>
        <Field label="نص المقال">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="w-full border border-border rounded-md px-3 py-2 bg-background leading-loose"
          />
          <p className="text-xs text-muted-foreground mt-1">
            افصل بين الفقرات بسطر فارغ.
          </p>
        </Field>
      </div>
      <aside className="space-y-4">
        <Field label="القسم">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 bg-background"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="الكاتب">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 bg-background"
          />
        </Field>
        <Field label="الصورة">
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="w-full aspect-[16/10] object-cover rounded-md border border-border mb-2"
            />
          )}
          <label className="flex items-center justify-center gap-2 border border-dashed border-border rounded-md px-3 py-3 cursor-pointer hover:bg-secondary transition text-sm">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{uploading ? "جاري الرفع..." : "اختر صورة"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="أو ألصق رابط صورة"
            className="mt-2 w-full border border-border rounded-md px-3 py-2 bg-background text-xs"
          />
        </Field>
        <div className="space-y-2 border border-border rounded-md p-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span className="text-sm font-bold">خبر رئيسي (في الواجهة)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span className="text-sm font-bold">منشور</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-primary-foreground rounded-md py-3 font-bold disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "نشر المقال" : "حفظ التعديلات"}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin" })}
          className="w-full border border-border rounded-md py-2 font-bold text-sm hover:bg-secondary"
        >
          إلغاء
        </button>
      </aside>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-bold mb-1">{label}</span>
      {children}
    </label>
  );
}
