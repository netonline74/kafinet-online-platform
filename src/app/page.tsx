import Link from 'next/link';
import { getLatestArticles } from '@/actions/articles';
import { getCategories, getServices } from '@/actions/services';
import Header from '@/components/layout/Header';
import TrustBadges from '@/components/home/TrustBadges';
import ServicesGrid from '@/components/home/ServicesGrid';
import NoticeBoard from '@/components/home/NoticeBoard';
import { formatPersianDate } from '@/lib/utils';
import { 
  FileText, Search, Headphones,
  ArrowLeft, Calendar, FileType,
  ShieldCheck, CheckCircle2, Zap
} from 'lucide-react';

// جلوگیری از تایم‌اوت بیلد و رندر داینامیک صفحه در زمان درخواست کاربر
export const dynamic = 'force-dynamic';

export default async function Home() {
  // واکشی اطلاعات از دیتابیس به صورت موازی
  const [articlesRes, categoriesRes, servicesRes] = await Promise.all([
    getLatestArticles(3),
    getCategories(),
    getServices()
  ]);

  const articles = articlesRes?.articles || [];
  const categories = categoriesRes?.categories || [];
  const services = servicesRes?.services || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* دکمه شناور پشتیبانی */}
      <a 
        href="tel:09120000000" 
        className="fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/40 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group cursor-pointer"
        aria-label="تماس با پشتیبانی کافی‌نت"
      >
        <Headphones size={26} className="animate-pulse" />
        <span className="absolute left-full ml-4 bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
          تماس با پشتیبانی
        </span>
      </a>

      {/* هدر مدرن شیشه‌ای شناور (Floating Sticky Header) */}
      <Header />

      {/* ۱. بخش قهرمان (Hero Section) با تایپوگرافی بولد، جذاب و چشمگیر */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-blue-50/60 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-extrabold mb-8 shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            سامانه ثبت غیرحضوری و امن سفارشات سراسر کشور
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.2] mb-6">
            انجام کلیه امور اینترنتی و اداری شما<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
              سریع‌تر، دقیق‌تر و آسان‌تر از همیشه
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed font-normal">
            بدون نیاز به مراجعه حضوری و اتلاف وقت در صف‌های طولانی، درخواست‌های خود را به صورت آنلاین ثبت کنید. از امور مالیاتی و خودرو تا خدمات مسکن و دانشگاهی، در کمترین زمان ممکن پردازش می‌شود.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/order/new" 
              className="w-full sm:w-auto h-13 sm:h-14 px-9 bg-blue-600 text-white rounded-2xl font-black text-base shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <FileText size={20} />
              <span>شروع ثبت سفارش آنلاین</span>
            </Link>

            <Link 
              href="/track" 
              className="w-full sm:w-auto h-13 sm:h-14 px-8 bg-white border border-slate-200 text-slate-800 rounded-2xl font-extrabold text-base hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Search size={19} className="text-slate-500" />
              <span>پیگیری وضعیت پرونده</span>
            </Link>
          </div>

          {/* مزایای کلیدی با استایل مینیمال، بولد و خوانا */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto pt-10 border-t border-slate-100 text-right">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">پردازش فوری</p>
                <p className="text-[11px] text-slate-500">کمتر از ۲ ساعت کاری</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">امنیت مدارک</p>
                <p className="text-[11px] text-slate-500">حفظ محرمانگی کامل</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">تاییدیه رسمی</p>
                <p className="text-[11px] text-slate-500">رسید الکترونیک معتبر</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                <Headphones size={20} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-900">پشتیبانی تلفنی</p>
                <p className="text-[11px] text-slate-500">پاسخگویی سریع کارشناسان</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* تابلو اعلانات و تقویم مهلت‌های مهم */}
      <NoticeBoard />

      {/* بخش خدمات داینامیک با کارت‌های لوکس و کامپوننت‌های مدرن */}
      <ServicesGrid />

      {/* بخش مقالات داینامیک با تایپوگرافی بولد و خوانا */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/70" id="news">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 block mb-2">اطلاع‌رسانی و آموزش</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                آخرین اخبار، بخشنامه‌ها و راهنماها
              </h2>
              <p className="text-base text-slate-600 mt-2 font-normal">
                راهنمای گام‌به‌گام قوانین اداری، مهلت‌های مالیاتی و ثبت‌نام‌های کشوری
              </p>
            </div>
            <Link 
              href="/#services" 
              className="h-11 px-5 rounded-xl font-bold text-xs bg-white text-slate-800 border border-slate-200 hover:bg-slate-100/80 shadow-xs inline-flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>مشاهده همه خدمات</span>
              <ArrowLeft size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {articles && articles.length > 0 ? (
              articles.map((article) => (
                <div 
                  key={article.id} 
                  className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                    {article.cover_image ? (
                      <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                        <FileType size={44} className="text-slate-300 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-xs font-bold">راهنمای اداری</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 sm:p-7 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
                      <Calendar size={14} /> <span suppressHydrationWarning>{article.created_at ? formatPersianDate(article.created_at) : 'به‌روزرسانی جدید'}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl mb-2.5 group-hover:text-blue-600 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 line-clamp-2 mb-6 leading-relaxed font-normal">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 text-xs sm:text-sm font-bold">
                      <span>مطالعه دستورالعمل</span>
                      <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 col-span-3 text-center py-10 font-medium">هنوز مقاله‌ای منتشر نشده است.</p>
            )}
          </div>
        </div>
      </section>

      {/* ۴. نوار اعتماد و مزایا (Trust Badges): امنیت، کد پیگیری و پشتیبانی مستقیم */}
      <TrustBadges />

      {/* فوتر مینیمال، شیک و استاندارد */}
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800" id="footer">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg">
                  C
                </div>
                <span className="font-black text-white text-lg">کافی‌نت آنلاین</span>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed font-normal">
                ارائه‌دهنده تخصصی خدمات اینترنتی، اداری، مالیاتی و ملکی. با استفاده از این درگاه می‌توانید در کوتاه‌ترین زمان ممکن و با اطمینان کامل از صحت مدارک، کلیه امور اداری خود را انجام دهید.
              </p>
            </div>

            <div>
              <p className="text-sm font-extrabold text-white mb-4">دسترسی سریع</p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                <li><Link href="/order/new" className="hover:text-white transition-colors">ثبت سفارش جدید</Link></li>
                <li><Link href="/track" className="hover:text-white transition-colors">پیگیری سفارش</Link></li>
                <li><Link href="#services" className="hover:text-white transition-colors">لیست خدمات</Link></li>
                <li><Link href="#news" className="hover:text-white transition-colors">اخبار و بخشنامه‌ها</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-extrabold text-white mb-4">پشتیبانی و ارتباط</p>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                <p>ساعات کاری: همه‌روزه از ۸ صبح تا ۱۰ شب</p>
                <p>تلفن پشتیبانی: ۰۹۱۲۰۰۰۰۰۰۰</p>
                <p className="text-emerald-400 font-bold mt-2">پاسخگویی آنلاین در تمام روزهای کاری</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
            تمامی حقوق مادی و معنوی برای سامانه خدمات الکترونیک کافی‌نت آنلاین محفوظ است.
          </div>
        </div>
      </footer>
    </div>
  );
}