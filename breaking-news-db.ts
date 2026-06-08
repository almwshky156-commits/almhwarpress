import { supabase } from "@/integrations/supabase/client";

export interface DbBreakingNews {
  id: string;
  text: string;
  active: boolean;
  sort_order: number;
  created_at: string;
}

export async function fetchActiveBreakingNews(): Promise<DbBreakingNews[]> {
  const { data, error } = await supabase
    .from("breaking_news")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbBreakingNews[];
}

export async function fetchAllBreakingNews(): Promise<DbBreakingNews[]> {
  const { data, error } = await supabase
    .from("breaking_news")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbBreakingNews[];
}

export async function createBreakingNews(text: string, sort_order = 0) {
  const { data, error } = await supabase
    .from("breaking_news")
    .insert({ text, sort_order, active: true })
    .select()
    .single();
  if (error) throw error;
  return data as DbBreakingNews;
}

export async function updateBreakingNews(
  id: string,
  patch: Partial<Pick<DbBreakingNews, "text" | "active" | "sort_order">>,
) {
  const { data, error } = await supabase
    .from("breaking_news")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as DbBreakingNews;
}

export async function deleteBreakingNews(id: string) {
  const { error } = await supabase.from("breaking_news").delete().eq("id", id);
  if (error) throw error;
}
