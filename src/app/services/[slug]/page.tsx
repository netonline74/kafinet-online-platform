import { notFound } from 'next/navigation';
import Link from 'next/link';
import { servicesData } from '@/config/servicesData';
import FaqAccordion from '@/components/services/FaqAccordion';
import { CheckCircle2, ChevronLeft, Clock, FileText, Check, ShieldCheck, ArrowRight } from 'lucide-react';

// ۱. تولید متادیتای سئو به صورت داینامیک
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = servicesData[params.slug];
  if (!data) return { title: 'خدمت یافت نشد' };

  return {
    title: data.seo.metaTitle,
    description: data.seo.metaDescription,
    keywords: data.seo.keywords,
    openGraph: {
      title: data.seo.metaTitle,
      description: data.seo.metaDescription,
      type: 'website',
      locale: 'fa_IR',
    }
  };
}

export default function ServiceLandingPage({ params }: { params: { slug: string } }) {
  const data = servicesData[params.slug];
  
  if (!data) notFound();

  // ۲. تولید کدهای اسکیما (JSON-LD) برای گوگل
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.title,
    "description": data.shortDescription,
    "provider": { "@type": "Organization", "name": "کافی نت آنلاین" }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* تزریق اسکیما به هد صفحه */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* نوار ناوبری بالای صفحه */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">
            <ArrowRight size={18} /> بازگشت به صفحه اصلی
          </Link>
          <div className="font-bold text-slate-800 text-lg">کافی‌نت آنلاین</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-16 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 text-center lg:text-right">
              {/* استفاده از متغیر جدید badgeText */}
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg mb-6">
                {data.badgeText}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                {data.title}
              </h1>
              {/* استفاده از متغیر جدید shortDescription */}
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                {data.shortDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link 
                  href={data.ctaUrl} 
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <FileText size={20} /> ثبت درخواست آنلاین
                </Link>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <ShieldCheck size={18} className="text-emerald-500" /> تضمین امنیت اطلاعات
                </div>
              </div>
            </div>
            
            {/* باکس ویژگی‌ها */}
            <div className="w-full lg:w-5/12 bg-slate-50 border border-slate-200 rounded-3xl p-8 relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-2xl rotate-12 -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-600 rounded-full opacity-20 -z-10"></div>
              
              <h3 className="font-bold text-slate-800 mb-6 text-center">چرا آنلاین ثبت کنیم؟</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><CheckCircle2 className="text-emerald-500 shrink-0" size={20} /><span className="text-sm text-slate-700">صرفه‌جویی در زمان و هزینه رفت و آمد</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-emerald-500 shrink-0" size={20} /><span className="text-sm text-slate-700">پیگیری لحظه‌ای وضعیت پرونده با کد رهگیری</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-emerald-500 shrink-0" size={20} /><span className="text-sm text-slate-700">حذف خطاهای انسانی در ثبت فرم‌ها</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* بدنه محتوا */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* ستون اصلی (مراحل و سوالات) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* مراحل انجام کار */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-8">مراحل انجام کار</h2>
              <div className="relative border-r-2 border-slate-200 pr-6 space-y-8">
                {data.steps.map((step: any, idx: number) => (
                  <div key={idx} className="relative">
                    <span className="absolute -right-[35px] bg-white border-2 border-blue-600 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* سوالات متداول */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-8">سوالات متداول</h2>
              <FaqAccordion faqs={data.faqs as any} />
            </div>

          </div>

          {/* سایدبار (مدارک و تعرفه) */}
          <div className="space-y-6">
            
            {/* چک لیست مدارک */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                <FileText className="text-blue-600" size={20} /> مدارک مورد نیاز
              </h3>
              <ul className="space-y-4">
                {/* هماهنگ با requiredDocuments */}
                {data.requiredDocuments.map((doc: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className={`shrink-0 mt-0.5 ${doc.required ? 'text-emerald-500' : 'text-slate-300'}`} size={18} />
                    <div>
                      <p className="text-sm text-slate-700 font-bold">{doc.title}</p>
                      {doc.description && <p className="text-xs text-slate-500 mt-1">{doc.description}</p>}
                      <p className="text-[10px] text-slate-400 mt-1.5">{doc.required ? 'الزامی' : 'اختیاری'}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link href={data.ctaUrl} className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                  شروع درخواست <ChevronLeft size={16} />
                </Link>
              </div>
            </div>

            {/* جدول تعرفه و زمان */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Clock className="text-blue-600" size={20} /> زمان‌بندی و تعرفه
              </h3>
              <div className="space-y-3">
                {/* هماهنگ با pricingTable */}
                {data.pricingTable.map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-sm font-bold text-slate-800 mb-2">{item.serviceName}</p>
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                      <span>هزینه: <span className="font-bold text-emerald-600">{item.fee}</span></span>
                      <span>زمان: {item.duration}</span>
                    </div>
                    {item.note && <p className="text-[10px] text-slate-400 border-t border-slate-200 pt-1 mt-1">{item.note}</p>}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}