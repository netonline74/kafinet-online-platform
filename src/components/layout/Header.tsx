'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  Building, 
  Calculator, 
  GraduationCap, 
  Car,
  PlusCircle,
  Clock
} from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/50 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* راست: لوگو، نام سامانه و برچسب وضعیت زنده */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/25 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              C
            </div>
            <div>
              <span className="font-black text-slate-900 text-lg sm:text-xl tracking-tight block group-hover:text-blue-600 transition-colors">
                کافی‌نت آنلاین
              </span>
              <span className="text-[11px] font-semibold text-slate-400 block -mt-0.5">
                سامانه هوشمند خدمات الکترونیک
              </span>
            </div>
          </Link>

          {/* برچسب وضعیت زنده با پالس سبز رنگ */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>پشتیبانی آنلاین کافی‌نت</span>
          </div>
        </div>

        {/* وسط: منوی ناوبری سریع در دسکتاپ */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
          <Link href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
            صفحه اصلی
          </Link>
          
          <div className="relative group cursor-pointer py-6">
            <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              خدمات ما 
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </span>
            <div className="absolute top-full right-0 w-64 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden z-50 p-2">
              <Link href="/order/new" className="px-4 py-3 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-bold text-xs transition-colors">
                <Building size={16} className="text-emerald-500"/> نقل و انتقال مسکن پردیس
              </Link>
              <Link href="/order/new" className="px-4 py-3 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-bold text-xs transition-colors">
                <Calculator size={16} className="text-blue-500"/> اظهارنامه و امور مالیاتی
              </Link>
              <Link href="/order/new" className="px-4 py-3 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-bold text-xs transition-colors">
                <GraduationCap size={16} className="text-indigo-500"/> ثبت‌نام‌های دانشگاهی
              </Link>
              <Link href="/order/new" className="px-4 py-3 rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 font-bold text-xs transition-colors">
                <Car size={16} className="text-rose-500"/> خدمات خودرو و تعویض پلاک
              </Link>
            </div>
          </div>

          <Link href="#services" className="hover:text-blue-600 transition-colors">
            میز خدمات
          </Link>
          <Link href="#news" className="hover:text-blue-600 transition-colors">
            اخبار و مقالات
          </Link>
        </nav>

        {/* چپ: دکمه پیگیری سفارش + برچسب وضعیت در موبایل + دکمه ثبت سفارش */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* برچسب وضعیت زنده برای تبلت و موبایل */}
          <div className="flex lg:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/70 text-emerald-700 text-[11px] font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">پشتیبانی آنلاین</span>
          </div>

          {/* دکمه پیگیری سفارش */}
          <Link 
            href="/track" 
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-3.5 sm:px-4 h-11 text-slate-700 hover:text-blue-600 bg-slate-100/70 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all active:scale-95 shadow-2xs"
          >
            <Clock size={16} className="text-slate-500" />
            <span>پیگیری سفارش</span>
          </Link>

          {/* دکمه ثبت سفارش */}
          <Link 
            href="/order/new" 
            className="h-11 px-4 sm:px-5 bg-blue-600 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all inline-flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} />
            <span className="hidden xs:inline">ثبت سفارش</span>
            <span className="xs:hidden">سفارش</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
