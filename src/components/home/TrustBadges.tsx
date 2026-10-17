'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Headphones } from 'lucide-react';

export default function TrustBadges() {
  const items = [
    {
      icon: ShieldCheck,
      title: 'امنیت و محرمانگی مدارک هویتی',
      description: 'ذخیره‌سازی رمزنگاری‌شده اسناد و اطلاعات هویتی؛ دسترسی محدود کارشناس و امحای امن پس از تکمیل فرآیند اداری.',
      badge: 'رمزنگاری کامل',
      color: 'text-blue-600 bg-blue-50/80 border-blue-200/60',
    },
    {
      icon: CheckCircle2,
      title: 'کد پیگیری آنی و مستمر',
      description: 'صدور فوری شناسه یکتای پیگیری بلافاصله پس از ثبت سفارش، همراه با استعلام زنده وضعیت پرونده و اطلاع‌رسانی پیامکی.',
      badge: 'رهگیری ۲۴/۷',
      color: 'text-emerald-600 bg-emerald-50/80 border-emerald-200/60',
    },
    {
      icon: Headphones,
      title: 'پشتیبانی مستقیم کارشناس',
      description: 'بررسی دقیق تک‌تک مدارک توسط کارشناسان باسابقه کافی‌نت و رفع نواقص احتمالی پیش از ارسال نهایی به مراجع رسمی.',
      badge: 'پاسخگویی سریع',
      color: 'text-indigo-600 bg-indigo-50/80 border-indigo-200/60',
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200/70" id="trust-features">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* هدر بخش اعتماد */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block mb-3">
            استانداردهای امنیتی و خدمات سامانه
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            چرا کافی‌نت آنلاین را انتخاب کنید؟
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
            تضمین سرعت، دقت کارشناسی و بالاترین سطح حفظ حریم خصوصی کاربران
          </p>
        </div>

        {/* بخش مینیمال ۳ ستونه با بردر ظریف */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <div 
                key={index}
                className="group relative p-7 sm:p-8 rounded-3xl bg-slate-50/60 hover:bg-white border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* آیکون بولد و بج نشانگر */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform duration-300 group-hover:scale-110 ${item.color}`}>
                      <Icon className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-2xs">
                      {item.badge}
                    </span>
                  </div>

                  {/* عنوان ویژگی */}
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* توضیحات */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>تأییدیه رسمی و استاندارد سامانه</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
