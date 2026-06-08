import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { adminExists, bootstrapAdmin } from "@/lib/admin-bootstrap.functions";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | المحور برس" },
      {
        name: "description",
        content: "تسجيل دخول مدراء وكتّاب موقع المحور برس.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "بريد إلكتروني غير صالح" })
    .max(255),
  password: z
    .string()
    .min(8, { message: "كلمة المرور يجب ألا تقل عن 8 أحرف" })
    .max(128),
});

function LoginPage() {
  const { user, loading, isAdmin, signIn } = useAuth();
  const navigate = useNavigate();
  const checkAdminExists = useServerFn(adminExists);
  const runBootstrap = useServerFn(bootstrapAdmin);

  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    checkAdminExists({}).then((r) => setHasAdmin(r.exists));
  }, [checkAdminExists]);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [loading, user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "بيانات غير صالحة");
      return;
    }
    setBusy(true);
    try {
      if (hasAdmin === false) {
        const res = await runBootstrap({ data: parsed.data });
        if (!res.ok) {
          toast.error(res.error);
          return;
        }
        toast.success("تم إنشاء حساب المدير. جارٍ تسجيل الدخول...");
        const { error } = await signIn(parsed.data.email, parsed.data.password);
        if (error) {
          toast.error(error);
          return;
        }
        navigate({ to: "/admin" });
      } else {
        const { error } = await signIn(parsed.data.email, parsed.data.password);
        if (error) {
          toast.error("بيانات الدخول غير صحيحة");
          return;
        }
        toast.success("تم تسجيل الدخول");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setBusy(false);
    }
  };

  const setupMode = hasAdmin === false;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card rounded-xl shadow-elevated p-6 sm:p-8 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-hero text-primary-foreground shadow-card">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black">
                {setupMode ? "إنشاء حساب المدير" : "تسجيل دخول لوحة التحكم"}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {setupMode
                  ? "أنشئ أول حساب إداري للموقع"
                  : "وصول محدود لمدراء وكتّاب الموقع"}
              </p>
            </div>
          </div>

          {hasAdmin === null ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> البريد الإلكتروني
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="admin@almhwarpress.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> كلمة المرور
                </label>
                <input
                  type="password"
                  autoComplete={setupMode ? "new-password" : "current-password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="٨ أحرف على الأقل"
                />
                {setupMode && (
                  <p className="text-xs text-muted-foreground">
                    اختر كلمة مرور قوية. تُشفّر كلمات المرور بالكامل ولا يمكن
                    استرجاعها.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2.5 text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition flex items-center justify-center gap-2"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {setupMode ? "إنشاء الحساب وتسجيل الدخول" : "تسجيل الدخول"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              العودة إلى الموقع
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
