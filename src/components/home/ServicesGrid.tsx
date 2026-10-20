'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { servicesConfig } from '@/config/services-config';
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

// دسته‌بندی‌ها با شناسه استاندارد انگلیسی طبق خواسته کاربر
export const serviceCategories = [
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
  services?: any[];
}

export default function ServicesGrid() {
  // ۱. استیت فیلتر تب انتخاب‌شده با شناسه انگلیسی
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // ۲. فیلتر صریح و مستقیم خدمات بر اساس categoryId
  const displayedServices = selectedCategoryId === 'all'
    ? servicesConfig
    : servicesConfig.filter(s => s.categoryId === selectedCategoryId);

  const activeCategoryTitle = serviceCategories.find(c => c.id === selectedCategoryId)?.title || 'همه خدمات';

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200 relative z-10" id="services" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* هدر بخش خدمات */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="size-3.5 text-blue-600" />
            <span>سامانه رسمی خدمات غیرحضوری کشور</span>
            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              {servicesConfig.length} خدمت فعال
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            میز خدمات تخصصی کافی‌نت آنلاین
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            برای فیلتر کردن خدمات، روی یکی از دسته‌های زیر کلیک کنید یا مستقیماً برای ثبت سفارش کارت مورد نظر را لمس فرمایید.
          </p>
        </div>

        {/* دکمه‌های تب فیلتر دسته‌بندی با کلیک تعاملی تضمینی */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {serviceCategories.map((cat) => {
            const isActive = selectedCategoryId === cat.id;
            const count = cat.id === 'all' 
              ? servicesConfig.length 
              : servicesConfig.filter(s => s.categoryId === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`pointer-events-auto relative cursor-pointer flex items-center gap-2 h-11 px-4 sm:px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105 ring-2 ring-blue-500'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-blue-600'
                }`}
              >
                {cat.id === 'all' && <Layers className="size-4" />}
                <span>{cat.title}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* نوار وضعیت دسته‌بندی فعال */}
        {selectedCategoryId !== 'all' && (
          <div className="mb-6 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              در حال نمایش خدمات دسته: <strong className="text-blue-700">«{activeCategoryTitle}»</strong> ({displayedServices.length} خدمت)
            </span>
            <button 
              type="button" 
              onClick={() => setSelectedCategoryId('all')}
              className="text-blue-600 underline cursor-pointer hover:text-blue-800 pointer-events-auto"
            >
              نمایش همه خدمات ({servicesConfig.length})
            </button>
          </div>
        )}

        {/* شبکه کارت‌های خدمات (Clickable Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((service) => (
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

      </div>
    </section>
  );
}

export const ServicesSection = ServicesGrid;