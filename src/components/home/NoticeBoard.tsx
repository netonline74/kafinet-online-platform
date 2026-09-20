import Link from 'next/link';
import { getActiveAnnouncements } from '@/actions/announcements';
import { Car, Calculator, GraduationCap, Home, HeartHandshake, AlertCircle, Clock, ChevronLeft } from 'lucide-react';

// تابع محاسبه زمان باقی‌مانده
function getDaysRemaining(deadlineDate: string) {
  const diffTime = new Date(deadlineDate).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'پایان یافته';
  if (diffDays === 0) return 'امروز آخرین مهلت';
  if (diffDays === 1) return 'فردا پایان می‌یابد';
  return `تنها ${diffDays} روز مانده`;
}

// انتخاب آیکون بر اساس دسته‌بندی
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'خودرو': return <Car size={20} />;
    case 'مالیات': return <Calculator size={20} />;
    case 'آموزش': return <GraduationCap size={20} />;
    case 'مسکن': return <Home size={20} />;
    case 'حمایتی': return <HeartHandshake size={20} />;
    default: return <AlertCircle size={20} />;
  }
};

export default async function NoticeBoard() {
  const { announcements, success } = await getActiveAnnouncements();

  if (!success || !announcements || announcements.length === 0) {
    return null; 
  }

  return (
    <section className="py-12 bg-slate-50 relative overflow-hidden" dir="rtl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex items-center gap-3 mb-8 border-r-4 border-rose-500 pr-4">
          <h2 className="text-2xl font-bold text-slate-800">تقویم ثبت‌نام‌های مهم</h2>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {announcements.map((item: any) => {
            const isCritical = item.urgency_level === 'critical';
            const isWarning = item.urgency_level === 'warning';
            
            return (
              <div 
                key={item.id} 
                className={`relative bg-white/70 backdrop-blur-md rounded-2xl p-5 border transition-all hover:-translate-y-1 shadow-sm hover:shadow-md flex flex-col h-full
                  ${isCritical ? 'border-rose-200 shadow-rose-100/50' : isWarning ? 'border-amber-200' : 'border-slate-200'}
                `}
              >
                {/* نشانگر فوریت قرمز چشمک‌زن */}
                {isCritical && (
                  <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-rose-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    اقدام فوری
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${
                    item.category === 'خودرو' ? 'bg-indigo-100 text-indigo-600' :
                    item.category === 'مالیات' ? 'bg-blue-100 text-blue-600' :
                    item.category === 'آموزش' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {getCategoryIcon(item.category)}
                  </div>
                  
                  {/* تایمر (فقط اگر تاریخ وارد شده باشد نمایش داده می‌شود) */}
                  {item.deadline && (
                    <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg
                      ${isCritical ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}
                    `}>
                      <Clock size={14} />
                      {getDaysRemaining(item.deadline)}
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-base mb-2 leading-relaxed">
                  {item.title}
                </h3>

                {/* توضیحات یک خطی */}
                {item.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* دکمه لینک اقدام */}
                {item.action_link && (
                  <div className="mt-auto pt-4 border-t border-slate-100/50">
                    <Link 
                      href={item.action_link}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group"
                    >
                      ثبت درخواست
                      <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}