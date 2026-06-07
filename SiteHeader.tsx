import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categories, breakingNews as fallbackBreakingNews } from "@/lib/news-data";
import { fetchActiveBreakingNews } from "@/lib/breaking-news-db";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: dbBreaking } = useQuery({
    queryKey: ["breaking", "active"],
    queryFn: fetchActiveBreakingNews,
  });
  const breakingNews =
    dbBreaking && dbBreaking.length > 0
      ? dbBreaking.map((b) => b.text)
      : fallbackBreakingNews;
  const today = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur shadow-card">
      {/* Top utility bar */}
      <div className="bg-foreground text-background text-xs">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <span className="opacity-80">{today}</span>
          <span className="opacity-80 hidden sm:inline">شبكة المحور برس الإخبارية</span>
        </div>
      </div>

      {/* Brand row */}
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-hero text-primary-foreground font-black text-xl shadow-elevated">
            م
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gradient-primary leading-none">
              المحور برس
            </h1>
            <p className="text-xs text-muted-foreground mt-1">صوتك في قلب الحدث</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <button
            aria-label="بحث"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border hover:bg-secondary transition"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <button
          aria-label="القائمة"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-md border border-border"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="hidden md:block bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap items-center gap-1">
            <li>
              <Link
                to="/"
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-primary-foreground/15" }}
                className="block px-4 py-3 text-sm font-bold hover:bg-primary-foreground/15 transition"
              >
                الرئيسية
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  activeProps={{ className: "bg-primary-foreground/15" }}
                  className="block px-4 py-3 text-sm font-bold hover:bg-primary-foreground/15 transition"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-primary text-primary-foreground">
          <ul className="container mx-auto flex flex-col px-4 py-2">
            <li>
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-bold border-b border-primary-foreground/10"
              >
                الرئيسية
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-bold border-b border-primary-foreground/10"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Breaking ticker */}
      <div className="bg-[var(--breaking)] text-[var(--breaking-foreground)]">
        <div className="container mx-auto flex items-stretch overflow-hidden">
          <span className="shrink-0 px-4 py-2 text-xs font-black bg-foreground text-background flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--breaking)] animate-pulse" />
            عاجل
          </span>
          <div className="relative flex-1 overflow-hidden py-2">
            <div className="ticker text-sm font-semibold">
              {breakingNews.map((b, i) => (
                <span key={i} className="mx-8">
                  • {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}