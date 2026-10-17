import Link from 'next/link';
import { getActiveAnnouncements } from '@/actions/announcements';
import { Car, Calculator, GraduationCap, Home, HeartHandshake, AlertCircle, Clock, ChevronLeft, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function getDaysRemaining(deadlineDate: string) {
  const diffTime = new Date(deadlineDate).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'پایان یافته';
  if (diffDays === 0) return 'امروز آخرین مهلت';
  if (diffDays === 1) return 'فردا پایان می‌یابد';
  return `تنها ${diffDays} روز مانده`;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'خودرو': return <Car className="size-5" />;
    case 'مالیات': return <Calculator className="size-5" />;
    case 'آموزش': return <GraduationCap className="size-5" />;
    case 'مسکن': return <Home className="size-5" />;
    case 'حمایتی': return <HeartHandshake className="size-5" />;
    default: return <AlertCircle className="size-5" />;
  }
};

export default async function NoticeBoard() {
  const { announcements, success } = await getActiveAnnouncements();

  if (!success || !announcements || announcements.length === 0) {
    return null; 
  }

  return (
    <section className="py-16 bg-slate-50/60 relative overflow-hidden" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* هدر بخش اعلانات با تایپوگرافی بولد و شیک */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100/80 text-rose-700 text-xs font-bold mb-2">
              <Bell className="size-3.5" />
              <span>اطلاعیه‌های فوری و تقویم مهلت‌ها</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              تقویم ثبت‌نام‌های مهم و دارای مهلت
            </h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            آخرین بخشنامه‌ها و فرصت‌های تمدید شده دولتی
          </p>
        </div>

        {/* شبکه کارت‌های اعلانات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((item: any) => {
            const isCritical = item.urgency_level === 'critical';
            const isWarning = item.urgency_level === 'warning';
            
            return (
              <div 
                key={item.id} 
                className={`relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1.5 shadow-xs hover:shadow-xl flex flex-col justify-between
                  ${isCritical ? 'border-rose-200/90 hover:border-rose-300 hover:shadow-rose-500/10' : isWarning ? 'border-amber-200/90 hover:border-amber-300 hover:shadow-amber-500/10' : 'border-slate-200/80 hover:border-slate-300 hover:shadow-slate-300/30'}
                `}
              >
                {/* نشانگر فوریت */}
                {isCritical && (
                  <div className="absolute -top-3 -right-2 bg-rose-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md shadow-rose-600/30 flex items-center gap-1.5">
                    <span className="size-1.5 bg-white rounded-full animate-ping"></span>
                    اقدام فوری
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      item.category === 'خودرو' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                      item.category === 'مالیات' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      item.category === 'آموزش' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      'bg-slate-100 text-slate-700 border border-slate-200/70'
                    }`}>
                      {getCategoryIcon(item.category)}
                    </div>
                    
                    {item.deadline && (
                      <Badge variant="outline" className={`font-mono text-xs font-bold gap-1.5 px-3 py-1 rounded-xl
                        ${isCritical ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-700 border-slate-200'}
                      `}>
                        <Clock className="size-3.5" />
                        <span>{getDaysRemaining(item.deadline)}</span>
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-2.5 leading-snug tracking-tight">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {item.action_link && (
                  <div className="pt-4 border-t border-slate-100">
                    <Link 
                      href={item.action_link}
                      className="inline-flex items-center justify-between w-full text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors group"
                    >
                      <span>شروع ثبت‌نام سریع</span>
                      <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
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