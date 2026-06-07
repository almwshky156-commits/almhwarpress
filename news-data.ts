import heroNews from "@/assets/hero-news.jpg";
import newsQuran from "@/assets/news-quran.jpg";
import newsConference from "@/assets/news-conference.jpg";
import newsStudio from "@/assets/news-studio.jpg";
import newsPress from "@/assets/news-press.jpg";
import newsSocial from "@/assets/news-social.jpg";
import newsResistance from "@/assets/news-resistance.jpg";
import newsMultimedia from "@/assets/news-multimedia.jpg";
import newsOpinion from "@/assets/news-opinion.jpg";
import seventySquare from "@/assets/seventy-square-graduation.jpg";

export type CategorySlug =
  | "news"
  | "opinion"
  | "quran"
  | "press"
  | "conferences"
  | "programs"
  | "resistance"
  | "social"
  | "multimedia";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export const categories: Category[] = [
  { slug: "news", name: "الأخبار", description: "آخر الأخبار المحلية والدولية على مدار الساعة" },
  { slug: "opinion", name: "الرأي والمقالات", description: "تحليلات ومقالات رأي من نخبة من الكتّاب" },
  { slug: "quran", name: "الثقافة القرآنية", description: "محتوى يربط الواقع بالقيم القرآنية والنبوية" },
  { slug: "press", name: "الصحافة", description: "متابعات صحفية وتقارير ميدانية" },
  { slug: "conferences", name: "المؤتمرات الدولية", description: "تغطيات حية للمؤتمرات الإقليمية والدولية" },
  { slug: "programs", name: "البرامج الإعلامية", description: "أبرز البرامج الحوارية والوثائقية" },
  { slug: "resistance", name: "المحتوى المقاوم", description: "متابعة قضايا المقاومة والتحرر" },
  { slug: "social", name: "السوشيال ميديا", description: "النشر الرقمي ومتابعة منصات التواصل" },
  { slug: "multimedia", name: "الملتيميديا", description: "فيديوهات وإنفوجرافيك ومحتوى مرئي" },
];

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  category: CategorySlug;
  author: string;
  date: string;
  readingTime: number;
  featured?: boolean;
}

const longBody = (title: string) =>
  `${title}\n\nيتناول هذا التقرير التفاصيل الكاملة وفق ما رصدته شبكة المحور برس من مصادرها الميدانية والدبلوماسية. ` +
  `وقد شملت المتابعات تحليلاً للسياق السياسي والاقتصادي والاجتماعي، مع استعراض ردود الفعل الإقليمية والدولية.\n\n` +
  `ويرى المراقبون أن التطورات الأخيرة تحمل دلالات بالغة الأهمية على صعيد إعادة تشكيل المشهد، ` +
  `في ظل التحولات المتسارعة التي تشهدها المنطقة. كما تشير التقارير إلى أن الأطراف المعنية تعمل على بلورة مواقف جديدة ` +
  `تأخذ بعين الاعتبار التوازنات القائمة والمصالح الاستراتيجية بعيدة المدى.\n\n` +
  `وفي السياق ذاته، تواصل المحور برس متابعة مستجدات هذا الملف وتقديم القراءات المعمّقة لقرّائها الكرام، ` +
  `ضمن سياسة تحريرية تعتمد على الموضوعية والمصداقية والسبق المهني.`;

export const articles: Article[] = [
  {
    slug: "seventy-square-summer-centers-closing",
    title: "هنا صنعاء… ميدان السبعين يحتضن الحفل الختامي للمراكز الصيفية",
    excerpt:
      "آلاف الطلاب يملؤون ميدان السبعين في الحفل الختامي للمراكز الصيفية… مشهدٌ يختصر سنوات من الثبات ويعلن أن جيل القرآن حاضر.",
    body:
      "هنا صنعاء…\n\n" +
      "وهنا ميدان السبعين الذي امتلأ اليوم بآلاف الطلاب في الحفل الختامي للمراكز الصيفية…\n\n" +
      "مشهدٌ لم يكن عابرًا… بل رسالةٌ كبيرة تختصر سنواتٍ من الثبات والصمود.\n\n" +
      "هؤلاء الأبناء الذين نشاهدهم اليوم في الساحات… كان يمكن أن تسرقهم الشوارع… أو تبتلع أوقاتهم الهواتف والألعاب والفراغ.\n\n" +
      "لكنهم اختاروا طريق القرآن… وطريق العلم… وطريق الوعي.\n\n" +
      "على مدى أسابيع، تلقّى هؤلاء الطلاب العلوم النافعة، والثقافة القرآنية، والتربية الأخلاقية، والأنشطة الكشفية والرياضية… ليصلوا اليوم إلى هذا المشهد المهيب في الحفل الختامي للمراكز الصيفية.\n\n" +
      "عشرة أعوام من الحرب والحصار لم تستطع إيقاف هذا المشروع التربوي العظيم…\n\n" +
      "فبعد أن استهدف العدوان في عام 2018 حافلة طلاب المراكز الصيفية في ضحيان بهدف إخافة أولياء الأمور ومنعهم من إرسال أبنائهم…\n\n" +
      "ها هي الساحات اليوم تمتلئ بعشرات الآلاف من الطلاب في صنعاء وكل المحافظات.\n\n" +
      "لأن الشعوب التي تربّي أبناءها على القرآن… تصنع مستقبلها بنفسها.\n\n" +
      "وهذا الحضور الكبير اليوم… ليس مجرد حفل اختتامي… بل إعلانٌ بأن جيل القرآن حاضر… وأن الوعي ما زال حيًا في هذه الأمة.\n\n" +
      "#علم_وجهاد  #جيل_القرآن  #محمد_الموشكي",
    image: seventySquare,
    category: "news",
    author: "محمد الموشكي",
    date: "2026-05-14",
    readingTime: 4,
    featured: true,
  },
  {
    slug: "regional-summit-opens",
    title: "افتتاح القمة الإقليمية بمشاركة واسعة وسط ترقب لقرارات حاسمة",
    excerpt:
      "انطلقت اليوم أعمال القمة الإقليمية بمشاركة عدد من قادة الدول وممثلي المنظمات الدولية، وسط ترقب لقرارات قد تعيد رسم المشهد.",
    body: longBody("افتتاح القمة الإقليمية"),
    image: heroNews,
    category: "news",
    author: "هيئة التحرير",
    date: "2026-05-09",
    readingTime: 4,
  },
  {
    slug: "international-conference",
    title: "مؤتمر دولي يناقش مستقبل الأمن الإقليمي والتعاون متعدد الأطراف",
    excerpt: "ينعقد المؤتمر الدولي بمشاركة عشرات الدول لبحث ملفات الأمن والتنمية والشراكات الاستراتيجية.",
    body: longBody("مؤتمر دولي"),
    image: newsConference,
    category: "conferences",
    author: "وكالات",
    date: "2026-05-08",
    readingTime: 5,
  },
  {
    slug: "opinion-media-future",
    title: "مقال رأي: الإعلام الرقمي ومستقبل صناعة الخبر في المنطقة",
    excerpt: "قراءة في التحولات التي يفرضها الإعلام الرقمي على المؤسسات التقليدية وأدوات صناعة الخبر.",
    body: longBody("الإعلام الرقمي"),
    image: newsOpinion,
    category: "opinion",
    author: "د. أحمد المنصور",
    date: "2026-05-07",
    readingTime: 7,
  },
  {
    slug: "quran-contemporary-readings",
    title: "قراءات معاصرة في الهدي القرآني وأثرها في بناء الوعي",
    excerpt: "ندوة فكرية تناقش حضور القيم القرآنية في معالجة قضايا العصر وبناء الوعي الجمعي.",
    body: longBody("قراءات معاصرة"),
    image: newsQuran,
    category: "quran",
    author: "الشيخ محمد الحسني",
    date: "2026-05-06",
    readingTime: 6,
  },
  {
    slug: "press-field-report",
    title: "تقرير صحفي ميداني: شهادات حية من قلب الحدث",
    excerpt: "مراسلو المحور برس ينقلون شهادات حية ومشاهدات ميدانية من مواقع الأحداث.",
    body: longBody("تقرير ميداني"),
    image: newsPress,
    category: "press",
    author: "فريق المراسلين",
    date: "2026-05-06",
    readingTime: 5,
  },
  {
    slug: "tv-program-launch",
    title: "إطلاق برنامج حواري جديد يناقش القضايا الكبرى للأمة",
    excerpt: "البرنامج الحواري الجديد يستضيف نخبة من المفكرين والسياسيين لمناقشة القضايا الراهنة.",
    body: longBody("برنامج حواري"),
    image: newsStudio,
    category: "programs",
    author: "قسم البرامج",
    date: "2026-05-05",
    readingTime: 3,
  },
  {
    slug: "resistance-update",
    title: "آخر تطورات المشهد المقاوم في المنطقة وتداعياته",
    excerpt: "متابعة شاملة لآخر التطورات الميدانية والسياسية على صعيد ملفات المقاومة في المنطقة.",
    body: longBody("التطورات المقاومة"),
    image: newsResistance,
    category: "resistance",
    author: "هيئة التحرير",
    date: "2026-05-04",
    readingTime: 6,
  },
  {
    slug: "social-media-trends",
    title: "اتجاهات السوشيال ميديا: كيف تُصاغ الرواية في الفضاء الرقمي؟",
    excerpt: "قراءة في أبرز الاتجاهات الرقمية وتأثيرها على تشكيل الرأي العام في المنطقة.",
    body: longBody("اتجاهات رقمية"),
    image: newsSocial,
    category: "social",
    author: "وحدة النشر الرقمي",
    date: "2026-05-03",
    readingTime: 4,
  },
  {
    slug: "infographic-yearly-stats",
    title: "إنفوجرافيك: حصاد العام في أرقام ومؤشرات",
    excerpt: "ملخص بصري شامل لأبرز الأحداث والمؤشرات خلال العام المنصرم في مادة إنفوجرافيك متكاملة.",
    body: longBody("إنفوجرافيك"),
    image: newsMultimedia,
    category: "multimedia",
    author: "وحدة الملتيميديا",
    date: "2026-05-02",
    readingTime: 2,
  },
  {
    slug: "economic-outlook",
    title: "خبراء: مؤشرات اقتصادية إيجابية رغم التحديات الإقليمية",
    excerpt: "تقرير اقتصادي يرصد المؤشرات الإيجابية في الأسواق الإقليمية ويستشرف الفترة المقبلة.",
    body: longBody("الاقتصاد"),
    image: newsPress,
    category: "news",
    author: "محرر الاقتصاد",
    date: "2026-05-01",
    readingTime: 5,
  },
  {
    slug: "diplomatic-meeting",
    title: "لقاءات دبلوماسية مكثفة على هامش الاجتماعات الدولية",
    excerpt: "كواليس الاجتماعات الدبلوماسية وما تكشفه من توجهات للمرحلة المقبلة.",
    body: longBody("الدبلوماسية"),
    image: newsConference,
    category: "news",
    author: "وكالات",
    date: "2026-04-30",
    readingTime: 4,
  },
  {
    slug: "documentary-launch",
    title: "فيلم وثائقي جديد يوثّق محطات بارزة من تاريخ المنطقة",
    excerpt: "إنتاج وثائقي ضخم يستعرض المحطات الفارقة في تاريخ المنطقة عبر شهادات نادرة.",
    body: longBody("وثائقي"),
    image: newsMultimedia,
    category: "multimedia",
    author: "وحدة الإنتاج",
    date: "2026-04-29",
    readingTime: 3,
  },
];

export const breakingNews: string[] = [
  "انتظروا انطلاق موقع المحور برس الإخباري قريبًا… صوت الحقيقة والتحليل الواعي",
  "عاجل: انطلاق أعمال القمة الإقليمية بمشاركة واسعة من قادة الدول",
  "المحور برس تنفرد بنقل تفاصيل الاجتماعات الدبلوماسية المغلقة",
  "تقرير ميداني حصري من قلب الحدث خلال الساعات القادمة",
  "بث مباشر لأبرز فعاليات المؤتمر الدولي على منصاتنا الرقمية",
  "إطلاق البرنامج الحواري الجديد مساء اليوم على شاشة المحور",
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const getArticlesByCategory = (slug: CategorySlug) =>
  articles.filter((a) => a.category === slug);
export const getFeatured = () => articles.find((a) => a.featured) ?? articles[0];
export const getLatest = (limit = 6) =>
  [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);

export const formatDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};