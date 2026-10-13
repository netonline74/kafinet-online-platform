import Link from 'next/link';
import { getLatestArticles } from '@/actions/articles';
import { getCategories, getServices } from '@/actions/services';
import ServicesGrid from '@/components/home/ServicesGrid';
import NoticeBoard from '@/components/home/NoticeBoard';
import { formatPersianDate } from '@/lib/utils';
import { 
  FileText, Search, Headphones,
  ChevronDown, ArrowLeft, Calendar, FileType,
  Building, Calculator, GraduationCap, Car
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
        className="fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/40 hover:bg-blue-700 hover:scale-110 hover:-translate-y-1 transition-all flex items-center justify-center group"
      >
        <Headphones size={28} className="animate-pulse" />
        <span className="absolute left-full ml-4 bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
          تماس با پشتیبانی
        </span>
      </a>

      {/* نوار ناوبری (Navbar) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200">C</div>
              <span className="font-bold text-slate-800 text-lg">کافی‌نت آنلاین</span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/" className="text-blue-600">صفحه اصلی</Link>
              <div className="relative group cursor-pointer py-5">
                <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  خدمات ما <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </span>
                <div className="absolute top-full right-0 w-56 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden z-50">
                  <Link href="/order/new" className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 flex items-center gap-2 text-slate-700"><Building size={16} className="text-emerald-500"/> نقل و انتقال مسکن</Link>
                  <Link href="/order/new" className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 flex items-center gap-2 text-slate-700"><Calculator size={16} className="text-blue-500"/> امور مالیاتی</Link>
                  <Link href="/order/new" className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 flex items-center gap-2 text-slate-700"><GraduationCap size={16} className="text-indigo-500"/> امور دانشگاهی</Link>
                  <Link href="/order/new" className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 flex items-center gap-2 text-slate-700"><Car size={16} className="text-rose-500"/> خدمات خودرو</Link>
                </div>
              </div>
              <Link href="#news" className="hover:text-blue-600 transition-colors">مقالات و اخبار</Link>
              <Link href="#footer" className="hover:text-blue-600 transition-colors">ارتباط با ما</Link>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/track" className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Search size={16} /> پیگیری سفارش
            </Link>
            <Link href="/order/new" className="text-sm font-medium px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all">
              ثبت سفارش
            </Link>
          </div>
        </div>
      </nav>

      {/* بخش قهرمان (Hero Section) */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            سامانه ثبت غیرحضوری سفارشات فعال است
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            انجام امور اینترنتی و اداری شما<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              سریع‌تر و راحت‌تر از همیشه
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-10 leading-relaxed">
            بدون نیاز به مراجعه حضوری و اتلاف وقت، درخواست‌های خود را به صورت آنلاین ثبت کنید. از انجام امور مالیاتی تا خدمات ویژه ملکی و دانشگاهی، همه چیز در چند کلیک انجام می‌شود.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/order/new" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <FileText size={20} />
              <span>شروع ثبت سفارش</span>
            </Link>
          </div>
        </div>
      </section>

      {/* تابلو اعلانات و تقویم ثبت‌نام‌ها */}
      <NoticeBoard />

      {/* بخش خدمات داینامیک */}
      {categories.length > 0 && services.length > 0 && (
        <ServicesGrid categories={categories} services={services} />
      )}

      {/* بخش مقالات داینامیک */}
      <section className="py-20 bg-slate-50 border-t border-slate-100" id="news">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">مقالات و اخبار روز</h2>
              <p className="text-slate-500">آخرین بخشنامه‌ها و راهنمای انجام امور اداری</p>
            </div>
            <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors bg-blue-100/50 px-4 py-2 rounded-lg">
              مشاهده همه <ArrowLeft size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles && articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all group cursor-pointer flex flex-col">
                  <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {article.cover_image ? (
                      <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <FileType size={48} className="text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      <Calendar size={14} /> <span>{article.created_at ? formatPersianDate(article.created_at) : ''}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto flex items-center text-blue-600 text-sm font-medium">
                      مطالعه کامل <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 col-span-3 text-center py-10">هنوز مقاله‌ای منتشر نشده است.</p>
            )}
          </div>
        </div>
      </section>

      {/* فوتر */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-blue-600" id="footer">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500">
          تمامی حقوق برای مجموعه محفوظ است.
        </div>
      </footer>
    </div>
  );
}