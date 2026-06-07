import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/news-data";
import { Facebook, Twitter, Youtube, Send } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-black mb-3">المحور برس</h3>
          <p className="text-sm opacity-80 leading-relaxed max-w-md">
            شبكة إخبارية عربية تنقل الحدث من مصادره، وتقدّم تحليلات معمّقة وتغطيات حية على مدار الساعة،
            بمصداقية ومهنية عالية.
          </p>
          <div className="mt-4 flex gap-2">
            {[Facebook, Twitter, Youtube, Send].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="تواصل اجتماعي"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-background/10 hover:bg-primary transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-3">الأقسام</h4>
          <ul className="space-y-2 text-sm opacity-80">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="hover:text-primary-foreground hover:opacity-100">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">روابط</h4>
          <ul className="space-y-2 text-sm opacity-80">
            {categories.slice(5).map((c) => (
              <li key={c.slug}>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="hover:text-primary-foreground hover:opacity-100">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/about" className="hover:text-primary-foreground hover:opacity-100">من نحن</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary-foreground hover:opacity-100">دخول الإدارة</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4 text-xs opacity-70 text-center">
          © {new Date().getFullYear()} المحور برس. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}