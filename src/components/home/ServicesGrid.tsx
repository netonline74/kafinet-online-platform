'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { servicesConfig, ServiceConfig } from '@/config/services-config';
import { 
  Building2, 
  Calculator, 
  Car, 
  Scale, 
  Briefcase, 
  Coins, 
  GraduationCap, 
  Sparkles, 
  Layers, 
  ArrowLeft, 
  CheckCircle2,
  FileText
} from 'lucide-react';

function toPersianDigits(n: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

function getServiceIcon(iconName: string) {
  switch (iconName) {
    case 'Building2':
    case 'Home':
    case 'Mail':
      return <Building2 className="w-7 h-7 text-emerald-600" />;
    case 'Receipt':
    case 'Calculator':
    case 'Landmark':
      return <Calculator className="w-7 h-7 text-blue-600" />;
    case 'Car':
    case 'CalendarClock':
      return <Car className="w-7 h-7 text-rose-600" />;
    case 'Scale':
    case 'FileLock2':
    case 'HeartHandshake':
    case 'BookUser':
      return <Scale className="w-7 h-7 text-purple-600" />;
    case 'Briefcase':
    case 'ShieldCheck':
    case 'BadgeCheck':
    case 'MapPin':
    case 'FileCheck2':
      return <Briefcase className="w-7 h-7 text-amber-600" />;
    case 'Coins':
    case 'Wallet':
      return <Coins className="w-7 h-7 text-teal-600" />;
    case 'GraduationCap':
      return <GraduationCap className="w-7 h-7 text-indigo-600" />;
    default:
      return <FileText className="w-7 h-7 text-slate-600" />;
  }
}

// لیست استانداردهای دسته‌بندی با شناسه‌های انگلیسی یکتا
export const CATEGORIES = [
  { id: 'all', title: 'همه خدمات' },
  { id: 'real-estate', title: 'املاک و مسکن' },
  { id: 'tax', title: 'مالیات و دارایی' },
  { id: 'business', title: 'کسب‌وکار و شرکت‌ها' },
  { id: 'vehicle', title: 'خودرو و راهور' },
  { id: 'judicial', title: 'قضایی و هویتی' },
  { id: 'banking', title: 'بانکی و حمایتی' },
  { id: 'education', title: 'آموزش و آزمون' },
];

export interface ServicesGridProps {
  categories?: any[];
  services?: ServiceConfig[];
}

export default function ServicesGrid({ services: servicesProp }: ServicesGridProps = {}) {
  // دسترسی به دیتای خدمات (پیش‌فرض تمام ۲۰ خدمت جامع)
  const services = servicesProp && servicesProp.length > 0 ? servicesProp : servicesConfig;

  // استیت تب فعال بر اساس شناسه‌های انگلیسی
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // محاسبه داینامیک تعداد کارت‌های هر دسته‌بندی
  const getCount = (catId: string) => 
    catId === 'all' 
      ? services.length 
      : services.filter(s => s.categoryId === catId).length;

  // فیلتر مستقیم کارت‌ها بر اساس دسته انتخابی
  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.categoryId === selectedCategory);

  const activeCategoryTitle = CATEGORIES.find(c => c.id === selectedCategory)?.title || 'همه خدمات';

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200 relative z-10" id="services" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* هدر بخش خدمات */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="size-3.5 text-blue-600" />
            <span>سامانه رسمی خدمات غیرحضوری کشور</span>
            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              {toPersianDigits(services.length)} خدمت فعال
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            میز خدمات تخصصی کافی‌نت آنلاین
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            برای فیلتر کردن خدمات، روی یکی از دسته‌های زیر کلیک کنید یا مستقیماً برای ثبت سفارش کارت مورد نظر را لمس فرمایید.
          </p>
        </div>

        {/* دکمه‌های تب فیلتر دسته‌بندی با اسکرول افقی روان در موبایل */}
        <div className="flex items-center sm:justify-center gap-2 sm:gap-3 overflow-x-auto whitespace-nowrap pb-3 pt-1 px-2 mb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = getCount(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`pointer-events-auto relative cursor-pointer inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105 ring-2 ring-blue-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.id === 'all' && <Layers className="size-4 shrink-0" />}
                <span>{cat.title}</span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-600 border border-gray-200 shadow-2xs'
                }`}>
                  {toPersianDigits(count)}
                </span>
              </button>
            );
          })}
        </div>

        {/* نوار وضعیت دسته‌بندی فعال */}
        {selectedCategory !== 'all' && (
          <div className="mb-6 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              در حال نمایش خدمات دسته: <strong className="text-blue-700">«{activeCategoryTitle}»</strong> ({toPersianDigits(filteredServices.length)} خدمت)
            </span>
            <button 
              type="button" 
              onClick={() => setSelectedCategory('all')}
              className="text-blue-600 underline cursor-pointer hover:text-blue-800 pointer-events-auto"
            >
              نمایش همه خدمات ({toPersianDigits(services.length)})
            </button>
          </div>
        )}

        {/* شبکه کارت‌های خدمات (Clickable Cards) یا وضعیت خالی */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 my-6">
            <FileText className="size-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700 mb-2">هیچ خدمتی در این دسته‌بندی یافت نشد</p>
            <p className="text-xs text-slate-500 mb-4">می‌توانید برای مشاهده تمام خدمات روی دکمه زیر کلیک کنید.</p>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="px-5 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer pointer-events-auto inline-flex items-center gap-1.5"
            >
              <Layers className="size-3.5" />
              <span>مشاهده همه خدمات ({toPersianDigits(services.length)})</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all cursor-pointer pointer-events-auto relative z-10"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-slate-50 group-hover:bg-blue-50 border border-slate-100 flex items-center justify-center transition-colors">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>

                  {service.badgeText && (
                    <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-700">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{service.badgeText}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                  <div>
                    <span className="text-[11px] text-slate-400 block">تعرفه ثبت خدمت:</span>
                    <span className="text-sm font-black text-slate-900">{service.formattedPrice}</span>
                  </div>

                  <div className="h-9 px-3.5 rounded-xl text-xs font-bold bg-slate-900 text-white group-hover:bg-blue-600 transition-all flex items-center gap-1.5 shadow-xs">
                    <span>ثبت سفارش</span>
                    <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export const ServicesSection = ServicesGrid;