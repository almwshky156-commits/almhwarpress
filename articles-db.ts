import { supabase } from "@/integrations/supabase/client";
import type { Article, CategorySlug } from "@/lib/news-data";
import heroFallback from "@/assets/hero-news.jpg";

export interface DbArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export function dbToArticle(row: DbArticle): Article {
  const dateOnly = (row.published_at || row.created_at).slice(0, 10);
  const wordCount = (row.content || "").split(/\s+/).filter(Boolean).length;
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.content,
    image: row.image_url || heroFallback,
    category: row.category as CategorySlug,
    author: row.author || "هيئة التحرير",
    date: dateOnly,
    readingTime: Math.max(1, Math.round(wordCount / 200)),
    featured: row.featured,
  };
}

export async function fetchPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data as DbArticle[]).map(dbToArticle);
}

export async function fetchAllArticlesAdmin(): Promise<DbArticle[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbArticle[];
}

export async function fetchArticleBySlug(
  slug: string,
): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? dbToArticle(data as DbArticle) : null;
}

export async function fetchArticleById(id: string): Promise<DbArticle | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as DbArticle) ?? null;
}

export interface ArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image_url: string | null;
  featured: boolean;
  published: boolean;
}

export async function createArticle(input: ArticleInput) {
  const { data: userRes } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("articles")
    .insert({ ...input, created_by: userRes.user?.id ?? null })
    .select()
    .single();
  if (error) throw error;
  return data as DbArticle;
}

export async function updateArticle(id: string, input: Partial<ArticleInput>) {
  const { data, error } = await supabase
    .from("articles")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as DbArticle;
}

export async function deleteArticle(id: string) {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadArticleImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("article-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("article-images").getPublicUrl(path);
  return data.publicUrl;
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s\u00A0]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
