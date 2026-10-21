'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { servicesConfig } from '@/config/services-config';
import { 
  ChevronDown, 
  Building2, 
  Calculator, 
  Car, 
  Scale, 
  Briefcase, 
  Coins, 
  GraduationCap, 
  Sparkles,
  Menu,
  X,
  FileText,
  ArrowLeft
} from 'lucide-react';

function getIcon(name: string) {
  switch (name) {
    case 'Building2':
    case 'Home':
    case 'Mail':
      return <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />;
    case 'Receipt':
    case 'Calculator':
    case 'Landmark':
      return <Calculator className="w-4 h-4 text-blue-600 shrink-0" />;
    case 'Car':
    case 'CalendarClock':
      return <Car className="w-4 h-4 text-rose-600 shrink-0" />;
    case 'Scale':
    case 'FileLock2':
    case 'HeartHandshake':
    case 'BookUser':
      return <Scale className="w-4 h-4 text-purple-600 shrink-0" />;
    case 'Briefcase':
    case 'ShieldCheck':
    case 'BadgeCheck':
    case 'MapPin':
    case 'FileCheck2':
      return <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />;
    case 'Coins':
    case 'Wallet':
      return <Coins className="w-4 h-4 text-teal-600 shrink-0" />;
    case 'GraduationCap':
      return <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />;
    default:
      return <FileText className="w-4 h-4 text-slate-600 shrink-0" />;
  }
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // بستن منو در صورت کلیک در بیرون کادر
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* لوگو و نام سامانه */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer pointer-events-auto"
            aria-label="منوی موبایل"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/" className="flex items-center gap-3 group pointer-events-auto">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <span className="font-black text-slate-900 text-lg sm:text-xl tracking-tight block">
                کافی‌نت آنلاین
              </span>
              <span className="text-[11px] font-semibold text-slate-400 block -mt-0.5">
                سامانه هوشمند خدمات الکترونیک اداری و مالیاتی
              </span>
            </div>
          </Link>
        </div>

        {/* ناوبری وسط + منوی خدمات ما */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-700">
          <Link 
            href="/" 
            className="px-3.5 py-2 rounded-xl hover:text-blue-600 hover:bg-slate-50 transition-colors pointer-events-auto cursor-pointer"
          >
            صفحه اصلی
          </Link>

          {/* کانتینر دراپ‌داون خدمات */}
          <div 
            className="relative" 
            ref={menuRef}
            onMouseLeave={() => setIsOpen(false)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((prev) => !prev);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer pointer-events-auto font-bold text-sm ${
                isOpen 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'bg-slate-100 text-slate-800 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span>خدمات ما</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                isOpen ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'
              }`}>
                {servicesConfig.length}
              </span>
              <ChevronDown size={15} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* لیست بازشونده */}
            {isOpen && (
              <div 
                className="z-[9999] absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 shadow-2xl rounded-2xl p-3 max-h-[75vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span className="flex items-center gap-1.5 text-slate-800 font-extrabold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    تمام {servicesConfig.length} خدمت فعال سامانه
                  </span>
                  <Link 
                    href="/#services" 
                    onClick={() => setIsOpen(false)}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    میز خدمت
                  </Link>
                </div>

                <div className="space-y-1">
                  {servicesConfig.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/80 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100">
                          {getIcon(service.iconName)}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-black text-slate-800 group-hover:text-blue-600 truncate">
                            {service.title}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {service.category}
                          </span>
                        </div>
                      </div>
                      <ArrowLeft className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all shrink-0 mr-1" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/#news" 
            className="px-3.5 py-2 rounded-xl hover:text-blue-600 hover:bg-slate-50 transition-colors pointer-events-auto cursor-pointer"
          >
            اخبار و بخشنامه‌ها
          </Link>
          <Link 
            href="/#tracking" 
            className="px-3.5 py-2 rounded-xl hover:text-blue-600 hover:bg-slate-50 transition-colors pointer-events-auto cursor-pointer"
          >
            پیگیری پرونده
          </Link>
        </nav>

        {/* دکمه‌های اکشن چپ هدر */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/#tracking"
            className="hidden sm:inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 transition-all pointer-events-auto cursor-pointer"
          >
            پیگیری سفارش
          </Link>
          
          <Link
            href="/services/khodnevis-rent"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all pointer-events-auto cursor-pointer"
          >
            ثبت سفارش آنلاین
          </Link>
        </div>

      </div>

      {/* منوی ریسپانسیو موبایل */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3 shadow-lg">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50"
          >
            صفحه اصلی
          </Link>
          <Link 
            href="/#services" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-blue-600 bg-blue-50"
          >
            لیست تمام {servicesConfig.length} خدمت
          </Link>
          <Link 
            href="/#news" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50"
          >
            اخبار و بخشنامه‌ها
          </Link>
          <Link 
            href="/#tracking" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-blue-50"
          >
            پیگیری سفارش
          </Link>
        </div>
      )}
    </header>
  );
}