import { notFound } from 'next/navigation';
import Link from 'next/link';
import { servicesConfig, getServiceBySlug, ServiceConfig } from '@/config/services-config';
import { servicesData } from '@/config/servicesData';
import DynamicServiceForm from '@/components/services/DynamicServiceForm';
import { 
  CheckCircle2, 
  ChevronLeft, 
  Clock, 
  FileText, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Headphones, 
  Lock, 
  Zap, 
  Award, 
  HelpCircle,
  FolderCheck,
  ChevronRight
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// تولید متادیتای سئو به صورت داینامیک و استاندارد برای موتورهای جستجو
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  // ۱. بررسی در کانفیگ جامع جدید (۲۰ خدمت)
  const service = getServiceBySlug(slug);
  if (service) {
    return {
      title: `${service.title} | ثبت آنلاین با کد رهگیری رسمی`,
      description: service.seo.metaDescription || service.shortDescription,
      keywords: service.seo.keywords,
      openGraph: {
        title: service.seo.metaTitle,
        description: service.seo.metaDescription,
        type: 'website',
        locale: 'fa_IR',
        siteName: 'سامانه خدمات الکترونیک کافینت آنلاین',
      },
      twitter: {
        card: 'summary_large_image',
        title: service.seo.metaTitle,
        description: service.seo.metaDescription,
      },
    };
  }

  // ۲. بررسی در کانفیگ قدیمی جهت حفظ سازگاری
  const legacyData = servicesData[slug];
  if (legacyData) {
    return {
      title: legacyData.seo.metaTitle,
      description: legacyData.seo.metaDescription,
      keywords: legacyData.seo.keywords,
      openGraph: {
        title: legacyData.seo.metaTitle,
        description: legacyData.seo.metaDescription,
        type: 'website',
        locale: 'fa_IR',
      },
    };
  }

  return { 
    title: 'خدمت الکترونیک یافت نشد | سامانه آنلاین',
    description: 'صفحه خدمت مورد نظر در سامانه یافت نشد.',
  };
}

// ساخت صفحات استاتیک برای سرعت لود بالا
export async function generateStaticParams() {
  const newSlugs = servicesConfig.map((s) => ({ slug: s.slug }));
  const legacySlugs = Object.keys(servicesData).map((slug) => ({ slug }));
  return [...newSlugs, ...legacySlugs];
}

export default async function ServiceLandingPage({ params }: PageProps) {
  const { slug } = await params;

  // واکشی خدمت از کانفیگ جامع جدید
  let currentService = getServiceBySlug(slug);

  // در صورتی که اسلاگ در کانفیگ قدیمی باشد، آن را تبدیل به ساختار ServiceConfig می‌کنیم
  if (!currentService && servicesData[slug]) {
    const legacy = servicesData[slug];
    currentService = {
      slug: legacy.slug,
      title: legacy.title,
      categoryId: 'real-estate',
      category: 'املاک و مسکن',
      iconName: 'Building2',
      badgeText: legacy.badgeText,
      shortDescription: legacy.shortDescription,
      fullDescription: legacy.shortDescription,
      basePrice: 250000,
      formattedPrice: '۲۵۰,۰۰۰ تومان',
      duration: 'کمتر از ۲ ساعت کاری',
      guaranteeText: 'تضمین اصالت استعلام و مدارک',
      formType: 'standard',
      steps: legacy.steps,
      pricingTable: legacy.pricingTable,
      fields: [
        { id: 'full_name', name: 'full_name', label: 'نام و نام خانوادگی', type: 'text', required: true },
        { id: 'national_id', name: 'national_id', label: 'کد ملی', type: 'national_id', required: true, validationRule: 'national_code' },
        { id: 'phone', name: 'phone', label: 'شماره همراه', type: 'mobile', required: true, validationRule: 'mobile' },
        { id: 'notes', name: 'notes', label: 'توضیحات تکمیلی پرونده', type: 'textarea', required: false },
        { id: 'docs_file', name: 'docs_file', label: 'بارگذاری مدارک هویتی یا قراردادی', type: 'file', required: false },
      ],
      faqs: legacy.faqs,
      seo: legacy.seo,
    };
  }

  if (!currentService) {
    notFound();
  }

  // داده‌های ساختاریافته Schema.org جهت سئوی قوی در گوگل
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": currentService.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": currentService.title,
    "description": currentService.shortDescription,
    "provider": { 
      "@type": "Organization", 
      "name": "سامانه خدمات الکترونیک کافینت آنلاین",
      "url": "https://kafinet.ir"
    },
    "offers": {
      "@type": "Offer",
      "price": currentService.basePrice,
      "priceCurrency": "IRR",
      "availability": "https://schema.org/InStock",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "صفحه اصلی", "item": "/" },
      { "@type": "ListItem", "position": 2, "name": "خدمات آنلاین", "item": "/#services" },
      { "@type": "ListItem", "position": 3, "name": currentService.title, "item": `/services/${currentService.slug}` },
    ],
  };

  const serviceSteps = (currentService.steps && currentService.steps.length > 0)
    ? currentService.steps
    : [
        { stepNumber: 1, title: 'ثبت اطلاعات و فرم آنلاین', description: 'تکمیل فرم الکترونیک و بارگذاری مدارک پرونده در بستر امن سامانه.' },
        { stepNumber: 2, title: 'استعلام سیستمی و تطبیق مدارک', description: 'بررسی صحت اطلاعات هویتی و اصالت اسناد با درگاه‌های رسمی.' },
        { stepNumber: 3, title: 'پردازش تخصصی توسط کارشناس', description: 'پیگیری پرونده در مراجع قانونی و اداری تا حصول تاییدیه نهایی.' },
        { stepNumber: 4, title: 'صدور تاییدیه و تحویل رسید رسمی', description: 'صدور فایل نهایی با شناسه پیگیری، مهر دیجیتال و ارسال پیامک.' },
      ];

  const requiredDocumentsList = currentService.fields.filter((f) => f.type === 'file' || f.required);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900" dir="rtl">
      
      {/* تزریق اسکیما به هدر صفحه */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* نوار ناوبری بالای صفحه با بردکرامب */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              صفحه اصلی
            </Link>
            <ChevronLeft size={14} className="text-slate-300" />
            <Link href="/#services" className="hover:text-blue-600 transition-colors hidden sm:inline">
              خدمات الکترونیک
            </Link>
            <ChevronLeft size={14} className="text-slate-300 hidden sm:inline" />
            <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-xs">
              {currentService.title}
            </span>
          </div>

          <a 
            href="#order-form" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            تکمیل و ثبت آنلاین فرم
          </a>
        </div>
      </nav>

      {/* بخش Hero لندینگ پیج با اطلاعات خدمت */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-50/70 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-50/60 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
            
            {/* متن عنوان و توضیحات */}
            <div className="flex-1 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-extrabold rounded-xl border border-blue-100 shadow-2xs">
                <Sparkles size={14} className="text-blue-600" />
                {currentService.badgeText}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.25] tracking-tight">
                {currentService.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl">
                {currentService.shortDescription}
              </p>

              {/* نشان‌های تضمین و زمانبندی */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <Clock size={16} className="text-blue-600" />
                  <span>زمان پردازش: <strong className="text-slate-900">{currentService.duration}</strong></span>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>{currentService.guaranteeText}</span>
                </div>
              </div>
            </div>

            {/* کارت خلاصه تعرفه و پشتیبانی */}
            <div className="w-full lg:w-80 bg-slate-50 border border-slate-200/90 rounded-3xl p-6 space-y-5 shrink-0 shadow-xs">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs text-slate-500 font-medium block">هزینه پایه ثبت درخواست:</span>
                <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                  {currentService.formattedPrice}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  ✓ بدون هزینه پنهان با فاکتور رسمی
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>صدور آنی کد رهگیری پرونده</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>حفظ ۱۰۰٪ محرمانگی و امنیت اسناد</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>پشتیبانی تلفنی و آنلاین تا تحویل نهایی</span>
                </div>
              </div>

              <a
                href="#order-form"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <FileText size={18} />
                <span>شروع ثبت آنلاین سفارش</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* بخش بدنه محتوا: فرم تعاملی هوشمند + مراحل انجام کار + سوالات متداول */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ستون اصلی (فرم ساز داینامیک + سوالات) - ۸ ستون */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* ۱. کامپوننت فرم‌ساز داینامیک هوشمند اختصاصی این خدمت */}
            <div id="order-form" className="scroll-mt-24">
              <DynamicServiceForm service={currentService} />
            </div>

            {/* ۲. مراحل انجام کار گام‌به‌گام */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FolderCheck size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">مراحل انجام و گردش پرونده شما</h3>
                  <p className="text-xs text-slate-500 mt-0.5">از زمان ثبت تا تحویل رسید و تاییدیه نهایی</p>
                </div>
              </div>

              <div className="relative border-r-2 border-slate-200 pr-6 space-y-8 mt-6">
                {serviceSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -right-[35px] bg-white border-2 border-blue-600 text-blue-600 size-8 rounded-full flex items-center justify-center text-sm font-bold shadow-xs">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mb-1">{step.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ۳. سوالات متداول (FAQ با تگ بومی details و summary) */}
            {currentService.faqs && currentService.faqs.length > 0 && (
              <div className="space-y-4 my-8" dir="rtl">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="size-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">سوالات متداول</h3>
                    <p className="text-xs text-slate-500 mt-0.5">پاسخ رسمی به پرسش‌های پرتکرار این خدمت</p>
                  </div>
                </div>

                {currentService.faqs.map((faq, index) => (
                  <details 
                    key={index} 
                    className="group bg-white border border-gray-200 rounded-2xl p-4 transition-all duration-200 open:border-blue-500 open:shadow-md cursor-pointer"
                  >
                    <summary className="flex items-center justify-between font-semibold text-gray-800 list-none select-none">
                      <span>{faq.question}</span>
                      <span className="transition-transform duration-300 group-open:rotate-180 text-blue-600 text-xl font-bold">
                        ↓
                      </span>
                    </summary>
                    <div className="mt-3 pt-3 border-t border-gray-100 text-gray-600 leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            )}

          </div>

          {/* سایدبار اطلاعات و تعرفه‌ها - ۴ ستون */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* مدارک و نیازمندی‌های این خدمت */}
            {requiredDocumentsList.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileText className="text-blue-600 size-5" />
                  <span>مدارک و اطلاعات مورد نیاز</span>
                </div>
                <div className="space-y-2.5">
                  {requiredDocumentsList.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{doc.label}</p>
                        {doc.required && (
                          <span className="text-[10px] text-rose-500 font-semibold block mt-0.5">الزامی</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* جدول زمانبندی و تعرفه رسمی */}
            {currentService.pricingTable && currentService.pricingTable.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Clock className="text-blue-600 size-5" />
                  <span>جدول زمانبندی و تعرفه خدمات</span>
                </div>

                <div className="space-y-3">
                  {currentService.pricingTable.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                      <p className="text-xs font-bold text-slate-900 leading-tight">{item.serviceName}</p>
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                        <span>هزینه: <strong className="text-emerald-700 font-mono font-black">{item.fee}</strong></span>
                        <span className="text-[11px] text-slate-500">زمان: {item.duration}</span>
                      </div>
                      {item.note && (
                        <p className="text-[10px] text-slate-400 leading-normal">{item.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* کارت پشتیبانی تلفنی مستقیم */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md shadow-blue-500/20 space-y-4">
              <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Headphones size={24} />
              </div>
              <h4 className="text-lg font-black">نیاز به راهنمایی تلفنی دارید؟</h4>
              <p className="text-xs text-blue-100 leading-relaxed font-normal">
                کارشناسان بخش امور اداری و مالیاتی آماده پاسخگویی به ابهامات پرونده شما هستند.
              </p>
              <div className="pt-2">
                <a
                  href="tel:09120000000"
                  className="w-full py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Headphones size={16} />
                  <span>تماس با کارشناس بخش</span>
                </a>
              </div>
            </div>

            {/* کارت پیگیری سفارش‌های قبلی */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">پیگیری سفارش ثبت‌شده</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                اگر قبلاً در این سامانه سفارشی ثبت کرده‌اید، با وارد کردن کد رهگیری وضعیت پرونده را استعلام کنید.
              </p>
              <Link
                href="/track"
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>ورود به سامانه رهگیری</span>
                <ChevronLeft size={16} />
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}