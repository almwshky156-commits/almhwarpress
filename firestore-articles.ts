import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  type Timestamp,
} from "firebase/firestore";
import { getDb } from "@/integrations/firebase/client";

export interface FirestoreArticle {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  published: boolean;
}

function toDateString(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const ts = value as Timestamp;
  if (ts && typeof ts.toDate === "function") {
    return ts.toDate().toISOString().slice(0, 10);
  }
  return "";
}

export async function fetchFirestoreArticles(): Promise<FirestoreArticle[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const q = query(
      collection(db, "articles"),
      where("published", "==", true),
      orderBy("date", "desc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        title: String(data.title ?? ""),
        content: String(data.content ?? ""),
        image: String(data.image ?? ""),
        date: toDateString(data.date),
        published: Boolean(data.published),
      };
    });
  } catch (err) {
    // Fallback without composite-index requirements
    console.warn(
      "Firestore articles query failed, retrying without filters",
      err,
    );
    try {
      const snap = await getDocs(collection(db, "articles"));
      return snap.docs
        .map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            title: String(data.title ?? ""),
            content: String(data.content ?? ""),
            image: String(data.image ?? ""),
            date: toDateString(data.date),
            published: Boolean(data.published),
          };
        })
        .filter((a) => a.published);
    } catch (err2) {
      console.warn("Firestore fallback fetch failed", err2);
      return [];
    }
  }
}
