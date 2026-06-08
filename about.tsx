import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | المحور برس" },
      {
        name: "description",
        content: "تعرّف على شبكة المحور برس الإخبارية ورؤيتها ورسالتها.",
      },
      { property: "og:title", content: "من نحن | المحور برس" },
      {
        property: "og:description",
        content: "شبكة إخبارية عربية تنقل الحدث من مصادره.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-black mb-6 text-gradient-primary">
          من نحن
        </h1>
        <div className="space-y-4 text-base sm:text-lg leading-loose text-foreground">
          <p>
            <strong>موقع المحور برس</strong> منصة إعلامية رقمية تحليلية إخبارية
            فكرية، تهدف إلى نقل الحقيقة بوعي، وقراءة الأحداث بعمق، وكشف ما وراء
            الخبر، وصناعة رأي عام مقاوم واعٍ، من خلال محتوى مهني موثوق يجمع بين
            الخبر والتحليل والفكر القرآني والرؤية الحضارية.
          </p>
          <p>
            يستند الموقع إلى شبكة واسعة من الكتّاب والناشطين والمحللين
            والسياسيين والمثقفين من مختلف دول محور المقاومة، ويعمل على تقديم
            مواد يومية متجددة، وتحقيقات معمقة، ومقالات رأي رصينة، إلى جانب محتوى
            قرآني وفكري يربط الواقع بالمنهج القرآني، ويؤسس لخطاب إعلامي رسالي
            جامع.
          </p>
          <div>
            <p className="mb-2">يلتزم موقع المحور برس بقيم:</p>
            <ul className="list-disc pr-6 space-y-1">
              <li>المصداقية والسبق</li>
              <li>التحليل لا التلقين</li>
              <li>الوعي لا التضليل</li>
              <li>الانتماء لقضايا الأمة والإنسان</li>
            </ul>
          </div>
          <p>ليكون منصة رقمية رائدة في معركة الوعي والتحرر الإعلامي.</p>

          <div className="mt-10 pt-6 border-t border-border">
            <h2 className="text-2xl font-black mb-4 text-gradient-primary">
              الإدارة التحريرية
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  رئيس تحرير الموقع
                </div>
                <div className="font-bold">محمد زيد علي الموشكي</div>
              </li>
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  نائب رئيس تحرير الموقع
                </div>
                <div className="font-bold">يونس السالمي</div>
              </li>
            </ul>

            <h2 className="text-2xl font-black mt-10 mb-4 text-gradient-primary">
              محررو الأقسام
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  قسم الرأي والمقالات
                </div>
                <div className="font-bold">هشام عبدالقادر علي صالح عنتر</div>
              </li>
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  القسم الثقافي القرآني
                </div>
                <div className="font-bold">أمة الخالق الحوثي</div>
              </li>
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  قسم الصحافة
                </div>
                <div className="font-bold">عبير عبدالحكيم الجنيد</div>
              </li>
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  قسم المؤتمرات الدولية
                </div>
                <div className="font-bold">حنان ملاطف عوضه</div>
              </li>
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  قسم البرامج الإعلامية
                </div>
                <div className="font-bold">أمل حسين فايع</div>
              </li>
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  قسم المحتوى المقاوم
                </div>
                <div className="font-bold">بلال عبد اللطيف سريع</div>
              </li>
              <li className="rounded-lg border border-border bg-card p-4 sm:col-span-2">
                <div className="text-xs text-muted-foreground mb-1">
                  قسم السوشيال ميديا والنشر الرقمي
                </div>
                <div className="font-bold">عفاف فيصل صالح</div>
              </li>
            </ul>

            <h2 className="text-2xl font-black mt-10 mb-4 text-gradient-primary">
              العلاقات العامة
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  مسؤول العلاقات العامة
                </div>
                <div className="font-bold">عبدالرحمن حسن فايع</div>
              </li>
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  علاقات دولية
                </div>
                <div className="font-bold">حميد عبدالقادر عنتر</div>
              </li>
            </ul>

            <h2 className="text-2xl font-black mt-10 mb-4 text-gradient-primary">
              المراسلون الميدانيون
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  مراسل الموقع في محافظة الحديدة
                </div>
                <div className="font-bold">قادري عبدالله صروان</div>
              </li>
              <li className="rounded-lg border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  مراسل الموقع في محافظة المحويت
                </div>
                <div className="font-bold">عبدالله هاشم الذارحي</div>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
