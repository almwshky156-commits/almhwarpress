import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import { logAnalyticsEvent } from "@/integrations/firebase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "المحور برس | شبكة إخبارية عربية" },
      { name: "description", content: "المحور برس - موقع المحور برس منصة إعلامية رقمية تحليلية إخبارية فكرية، تهدف إلى نقل الحقيقة بوعي، وقراءة الأحداث بعمق، وكشف ما وراء الخبر، وصناعة رأي عام مقاوم" },
      { name: "author", content: "المحور برس" },
      { property: "og:title", content: "المحور برس | شبكة إخبارية عربية" },
      { property: "og:description", content: "المحور برس - موقع المحور برس منصة إعلامية رقمية تحليلية إخبارية فكرية، تهدف إلى نقل الحقيقة بوعي، وقراءة الأحداث بعمق، وكشف ما وراء الخبر، وصناعة رأي عام مقاوم" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@AlMhwarPress" },
      { name: "twitter:title", content: "المحور برس | شبكة إخبارية عربية" },
      { name: "twitter:description", content: "المحور برس - موقع المحور برس منصة إعلامية رقمية تحليلية إخبارية فكرية، تهدف إلى نقل الحقيقة بوعي، وقراءة الأحداث بعمق، وكشف ما وراء الخبر، وصناعة رأي عام مقاوم" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/9RJolSXAuzPulXX6ASDEmuDbN4z2/social-images/social-1778366264388-Clipped_image_20260209_220422.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/9RJolSXAuzPulXX6ASDEmuDbN4z2/social-images/social-1778366264388-Clipped_image_20260209_220422.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();

  useEffect(() => {
    void logAnalyticsEvent("page_view", {
      page_path: location.pathname,
      page_location: typeof window !== "undefined" ? window.location.href : undefined,
    });
  }, [location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
