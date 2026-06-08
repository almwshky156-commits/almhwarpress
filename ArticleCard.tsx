import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { type Article, formatDate, getCategory } from "@/lib/news-data";

export function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
}) {
  const cat = getCategory(article.category);

  if (variant === "horizontal") {
    return (
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="group flex gap-4 rounded-lg overflow-hidden bg-card shadow-card hover:shadow-elevated transition"
      >
        <div className="relative w-32 h-28 sm:w-40 sm:h-32 shrink-0 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
        <div className="flex flex-col justify-between py-3 pl-3 flex-1 min-w-0">
          <div>
            <span className="text-xs font-bold text-primary">{cat?.name}</span>
            <h3 className="mt-1 font-bold text-sm sm:text-base leading-snug line-clamp-3 group-hover:text-primary transition">
              {article.title}
            </h3>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Clock className="h-3 w-3" />
            {formatDate(article.date)}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        to="/article/$slug"
        params={{ slug: article.slug }}
        className="group block"
      >
        <h3 className="text-sm font-bold leading-snug group-hover:text-primary transition line-clamp-2">
          {article.title}
        </h3>
        <div className="mt-1 text-xs text-muted-foreground">
          {formatDate(article.date)}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      className="group flex flex-col rounded-lg overflow-hidden bg-card shadow-card hover:shadow-elevated transition"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
        />
        <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
          {cat?.name}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-base sm:text-lg leading-snug group-hover:text-primary transition line-clamp-3">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(article.date)}
          </span>
        </div>
      </div>
    </Link>
  );
}
