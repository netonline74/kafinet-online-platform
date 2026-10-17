'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Service, ServiceCategory } from '@/types/service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Calculator, 
  GraduationCap, 
  Car, 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Clock,
  ShieldCheck,
  Search,
  X,
  Filter
} from 'lucide-react';

interface Props {
  categories?: ServiceCategory[];
  services?: Service[];
}

const defaultFallbackCategories: ServiceCategory[] = [
  { id: 'cat-housing', title: 'نقل و انتقال مسکن', description: 'امور ملکی، استعلام قرارداد ۵ برگی پردیس و استعلامات ثبتی', icon_name: 'Building', display_order: 1 },
  { id: 'cat-tax', title: 'امور مالیاتی', description: 'اظهارنامه مالیاتی، تبصره ۱۰۰ و سامانه مودیان', icon_name: 'Calculator', display_order: 2 },
  { id: 'cat-univ', title: 'امور دانشگاهی', description: 'ثبت‌نام کنکور، انتخاب رشته و تاییدیه تحصیلی', icon_name: 'GraduationCap', display_order: 3 },
  { id: 'cat-car', title: 'خدمات خودرو', description: 'نوبت‌دهی تعویض پلاک، استعلام خلافی و ثبت‌نام خودرو', icon_name: 'Car', display_order: 4 },
];

const defaultFallbackServices: Service[] = [
  {
    id: 'pardis-housing-transfer',
    category_id: 'cat-housing',
    title: 'استعلام و نقل و انتقال مسکن مهر پردیس',
    description: 'بررسی اصالت قرارداد ۵ برگی، تشکیل پرونده کارگزاری در شرکت عمران پردیس و استعلامات ثبتی و بانکی',
    required_documents: [
      { id: 'doc-id-card', label: 'تصویر کارت ملی و شناسنامه', type: 'file', is_required: true },
      { id: 'doc-contract', label: 'تصویر قرارداد ۵ برگی عمران', type: 'file', is_required: true },
      { id: 'doc-facility-num', label: 'شماره تسهیلات بانک مسکن', type: 'text', is_required: true },
      { id: 'doc-power-attorney', label: 'سلسله وکالت‌نامه‌های قبلی', type: 'file', is_required: false },
    ],
    base_price: 350000,
    display_order: 1,
    is_active: true,
  },
  {
    id: 'tax-affairs',
    category_id: 'cat-tax',
    title: 'امور مالیاتی، اظهارنامه و سامانه مودیان',
    description: 'ارسال اظهارنامه مالیات بر درآمد مشاغل، ثبت فرم تبصره ماده ۱۰۰، ثبت‌نام کد اقتصادی',
    required_documents: [
      { id: 'doc-tax-pass', label: 'کلمه عبور درگاه مالیاتی (my.tax.gov.ir)', type: 'text', is_required: true },
      { id: 'doc-pos-report', label: 'گردش حساب بانکی و ریز تراکنش‌های کارتخوان', type: 'file', is_required: true },
      { id: 'doc-license', label: 'تصویر پروانه کسب یا مجوز فعالیت', type: 'file', is_required: false },
    ],
    base_price: 250000,
    display_order: 1,
    is_active: true,
  },
  {
    id: 'university-registration',
    category_id: 'cat-univ',
    title: 'ثبت‌نام آزمون‌ها و تاییدیه تحصیلی',
    description: 'ثبت نام کنکور سراسری، ارشد، دکتری و دریافت تاییدیه تحصیلی آنلاین',
    required_documents: [
      { id: 'doc-univ-cert', label: 'کد پیگیری دیپلم یا تاییدیه مدرک', type: 'text', is_required: true },
      { id: 'doc-univ-photo', label: 'تصویر پرسنلی ۳×۴', type: 'file', is_required: true },
    ],
    base_price: 120000,
    display_order: 2,
    is_active: true,
  },
  {
    id: 'vehicle-services',
    category_id: 'cat-car',
    title: 'نوبت‌دهی تعویض پلاک و معاینه فنی',
    description: 'دریافت سریع نوبت مراکز تعویض پلاک، پرداخت خلافی و عوارض آزادراهی',
    required_documents: [
      { id: 'doc-car-plate', label: 'شماره پلاک خودرو', type: 'text', is_required: true },
      { id: 'doc-car-card', label: 'تصویر کارت یا برگ سبز خودرو', type: 'file', is_required: false },
    ],
    base_price: 90000,
    display_order: 2,
    is_active: true,
  },
];

const getCategoryIcon = (iconName: string, className = "size-5") => {
  switch (iconName?.toLowerCase()) {
    case 'building':
    case 'home':
      return <Building className={className} />;
    case 'calculator':
    case 'tax':
      return <Calculator className={className} />;
    case 'graduationcap':
    case 'university':
    case 'education':
      return <GraduationCap className={className} />;
    case 'car':
    case 'vehicle':
      return <Car className={className} />;
    default:
      return <FileText className={className} />;
  }
};

const getServiceIcon = (serviceId: string) => {
  if (serviceId.includes('housing') || serviceId.includes('pardis')) {
    return <Building className="w-7 h-7 stroke-[2.2]" />;
  }
  if (serviceId.includes('tax')) {
    return <Calculator className="w-7 h-7 stroke-[2.2]" />;
  }
  if (serviceId.includes('univ') || serviceId.includes('education')) {
    return <GraduationCap className="w-7 h-7 stroke-[2.2]" />;
  }
  if (serviceId.includes('car') || serviceId.includes('vehicle')) {
    return <Car className="w-7 h-7 stroke-[2.2]" />;
  }
  return <FileText className="w-7 h-7 stroke-[2.2]" />;
};

export default function ServicesGrid({ categories, services }: Props) {
  const safeCategories = categories && categories.length > 0 ? categories : defaultFallbackCategories;
  const safeServices = services && services.length > 0 ? services : defaultFallbackServices;

  // وضعیت تب فعال دسته‌بندی و عبارت جستجوی لحظه‌ای
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // نقشه شناسه‌های دسته به نام دسته جهت جستجوی سریع
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    safeCategories.forEach((cat) => map.set(cat.id, cat.title));
    return map;
  }, [safeCategories]);

  // فیلتر و جستجوی لحظه‌ای خدمات بر اساس نام خدمت، توضیحات یا دسته‌بندی
  const filteredServices = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();

    return safeServices.filter((service) => {
      // بررسی دسته‌بندی انتخاب شده
      const matchesCategory = activeTab === 'all' || service.category_id === activeTab;

      if (!trimmed) {
        return matchesCategory;
      }

      // جستجو در نام خدمت، توضیحات و عنوان دسته
      const categoryTitle = categoryMap.get(service.category_id)?.toLowerCase() || '';
      const titleMatch = service.title.toLowerCase().includes(trimmed);
      const descMatch = (service.description || '').toLowerCase().includes(trimmed);
      const catMatch = categoryTitle.includes(trimmed);
      
      // جستجو در عناوین مدارک الزامی
      const docMatch = service.required_documents?.some((doc: any) => {
        const label = typeof doc === 'string' ? doc : doc.label;
        return label?.toLowerCase().includes(trimmed);
      });

      const matchesSearch = titleMatch || descMatch || catMatch || docMatch;

      // اگر کاربر در حال جستجو است و دسته‌ای انتخاب کرده، هر دو را در نظر می‌گیریم
      return matchesCategory && matchesSearch;
    });
  }, [safeServices, activeTab, searchQuery, categoryMap]);

  const activeCategory = activeTab === 'all' 
    ? null 
    : safeCategories.find((c) => c.id === activeTab);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50/80 via-slate-50 to-white border-t border-slate-200/60" id="services" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* ۱. عنوان اصلی و زیرعنوان با تایپوگرافی بولد، جذاب، خوانا و شیک */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-slate-700 text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="size-3.5 text-blue-600" />
            <span>میز خدمات تخصصی و غیرحضوری</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.25] mb-4">
            خدمات پرکاربرد و دارای اولویت
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            دسته‌بندی جامع خدمات الکترونیک؛ با ارسال سریع مدارک، پیگیری آنلاین و استعلام مستقیم از سامانه‌های رسمی
          </p>
        </div>

        {/* ۳. اینپوت جستجوی تمیز و مدرن با آیکون Search برای فیلتر لحظه‌ای */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative group">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Search className="w-5 h-5 stroke-[2.2]" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی سریع خدمات و دسته‌بندی‌ها (مانند: مسکن مهر، مالیات، خودرو، دیپلم...)..."
              className="w-full h-14 pr-12 pl-12 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium shadow-sm transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="پاک کردن جستجو"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <X className="w-3.5 h-3.5" />
                </div>
              </button>
            )}
          </div>

          {/* نوار وضعیت جستجو در صورت وجود متن */}
          {searchQuery.trim() && (
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-500 px-2">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Filter className="w-3.5 h-3.5" />
                <span>نتایج جستجو برای «{searchQuery}»:</span>
                <span className="bg-blue-100/80 text-blue-800 px-2 py-0.5 rounded-md font-black">{filteredServices.length} خدمت</span>
              </span>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-500 hover:text-rose-600 transition-colors underline cursor-pointer"
              >
                نمایش همه
              </button>
            </div>
          )}
        </div>

        {/* نوار انتخاب دسته‌بندی با استایل مدرن و دکمه‌های h-12 با پدینگ دست‌ودلباز */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2.5 scrollbar-hide snap-x justify-start md:justify-center">
          {/* گزینه همه خدمات */}
          <button
            onClick={() => setActiveTab('all')}
            className={`snap-start shrink-0 flex items-center gap-2 h-12 px-5 rounded-2xl font-bold text-sm transition-all duration-300 outline-none cursor-pointer active:scale-95 ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15 scale-[1.02] ring-2 ring-slate-900/10'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100/70 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
            }`}
          >
            <Layers className="size-4" />
            <span className="whitespace-nowrap">همه خدمات ({safeServices.length})</span>
          </button>

          {safeCategories.map((cat) => {
            const isActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`snap-start shrink-0 flex items-center gap-2.5 h-12 px-5 rounded-2xl font-bold text-sm transition-all duration-300 outline-none cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15 scale-[1.02] ring-2 ring-slate-900/10'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100/70 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {getCategoryIcon(cat.icon_name, "size-4.5")}
                <span className="whitespace-nowrap">{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* نوار معرفی دسته فعال با استایل شیشه‌ای و خوانا */}
        {activeCategory?.description && (
          <div className="mb-10 p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/70 text-slate-700 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 border border-slate-200/60 shadow-inner shrink-0">
                {getCategoryIcon(activeCategory.icon_name, "size-5")}
              </span>
              <span className="font-semibold text-slate-800">{activeCategory.description}</span>
            </div>
            <Badge variant="secondary" className="text-xs font-bold py-1 px-3 self-start sm:self-auto">
              {filteredServices.length} خدمت در این دسته‌بندی
            </Badge>
          </div>
        )}

        {/* ۲. شبکه کارت‌های خدمات لوکس و مدرن */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredServices.map((service) => {
            const docCount = service.required_documents?.length || 0;
            const categoryName = categoryMap.get(service.category_id);

            return (
              <Card
                key={service.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-white/95 backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-slate-300/30 hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* هدر کارت: آیکون مربعی w-14 h-14 با گوشه‌های نرم rounded-xl/2xl و آیکون بولد w-7 h-7 */}
                <CardHeader className="p-7 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {/* باکس مربعی آیکون خدمت */}
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200/80 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:scale-105 shadow-inner shrink-0">
                      {getServiceIcon(service.id)}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold gap-1.5 px-3 py-1.5 rounded-xl">
                        <Clock className="size-3.5 text-slate-500" />
                        <span>پردازش آنلاین</span>
                      </Badge>
                      {activeTab === 'all' && categoryName && (
                        <span className="text-[11px] font-bold text-slate-400">
                          {categoryName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* عنوان کارت با سایز بزرگتر، بولد و چشمگیر */}
                  <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                    {service.title}
                  </CardTitle>

                  {/* متن توضیحی کارت با کنتراست عالی و اندازه خوانا */}
                  {service.description && (
                    <CardDescription className="text-sm sm:text-base text-slate-600 line-clamp-2 mt-2.5 leading-relaxed font-normal">
                      {service.description}
                    </CardDescription>
                  )}
                </CardHeader>

                {/* محتوای کارت (پیش‌نمایش مدارک الزامی) */}
                <CardContent className="p-7 pt-0 flex-1">
                  {docCount > 0 && (
                    <div className="mt-3 pt-4 border-t border-slate-100 space-y-2.5">
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        مدارک و اطلاعات مورد نیاز:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {service.required_documents.slice(0, 3).map((doc: any, idx: number) => (
                          <span
                            key={idx}
                            className="bg-slate-50/90 border border-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-xl"
                          >
                            {typeof doc === 'string' ? doc : doc.label}
                          </span>
                        ))}
                        {docCount > 3 && (
                          <span className="bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium px-2 py-1 rounded-xl">
                            +{docCount - 3} مورد دیگر
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* فوتر کارت: تعرفه و دکمه اکشن بولد با ارتفاع h-11 و انیمیشن کلیک نرم */}
                <CardFooter className="p-7 pt-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">تعرفه خدمت</span>
                    <span className="text-base font-black text-slate-900">
                      {service.base_price > 0 ? (
                        <>
                          {service.base_price.toLocaleString()} <span className="text-xs font-normal text-slate-500">تومان</span>
                        </>
                      ) : (
                        'استعلام هزینه'
                      )}
                    </span>
                  </div>

                  <Link
                    href={`/services/${service.id}`}
                    className="h-11 px-5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all inline-flex items-center gap-2 group/btn"
                  >
                    <span>مشاهده و ثبت</span>
                    <ArrowLeft className="size-4 transition-transform group-hover/btn:-translate-x-1" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}

          {filteredServices.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 shadow-xs space-y-3 px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Search className="size-8 stroke-[1.8]" />
              </div>
              <p className="text-lg font-black text-slate-800">خدمتی مطابق جستجوی شما یافت نشد.</p>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                می‌توانید املای واژه را بررسی کنید یا با کلیک روی دکمه زیر، تمام خدمات سامانه را مرور فرمایید.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('all');
                  }}
                  className="h-11 px-6 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>پاک کردن فیلتر و مشاهده همه خدمات</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* بنر اطمینان و گارانتی انجام کار */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-7" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-base sm:text-lg">تضمین امنیت اسناد، محرمانگی و پیگیری مستقیم</p>
              <p className="text-sm text-slate-500 mt-1">کلیه مراحل انجام کار با کد پیگیری یکتا در سامانه قابل رصد لحظه‌ای است.</p>
            </div>
          </div>
          <Link
            href="/track"
            className="h-12 px-6 rounded-2xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all inline-flex items-center justify-center whitespace-nowrap active:scale-95"
          >
            پیگیری سفارش‌های پیشین
          </Link>
        </div>

      </div>
    </section>
  );
}