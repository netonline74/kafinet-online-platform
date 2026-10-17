'use client';

import React, { useState } from 'react';
import { getOrderByTrackingCode } from '@/actions/orders';
import { OrderItem } from '@/types/order';
import { formatPersianDate, formatToman } from '@/lib/utils';
import { 
  Search, 
  Loader2, 
  ClipboardPaste, 
  Check, 
  Clock, 
  Settings, 
  CheckCircle2, 
  XCircle,
  User,
  Wallet,
  Calendar,
  FileText,
  AlignRight
} from 'lucide-react';

export default function TrackPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    const res = await getOrderByTrackingCode(code.trim());
    if (res.success && res.order) {
      setOrder(res.order);
    } else {
      setError(res.error || 'سفارشی پیدا نشد');
    }
    setLoading(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setCode(text);
    } catch (err) {
      console.error('دسترسی به کلیپ‌بورد داده نشده است', err);
    }
  };

  // Timeline configuration
  const steps = [
    { id: 'pending', label: 'در انتظار بررسی', icon: Clock },
    { id: 'in_progress', label: 'در حال انجام', icon: Settings },
    { id: 'completed', label: 'تکمیل شده', icon: CheckCircle2 },
  ];

  const getStepStatus = (stepId: string, currentStatus: string) => {
    if (currentStatus === 'completed') return stepId === 'completed' ? 'active' : 'passed';
    if (currentStatus === 'in_progress') return stepId === 'pending' ? 'passed' : (stepId === 'in_progress' ? 'active' : 'upcoming');
    if (currentStatus === 'pending') return stepId === 'pending' ? 'active' : 'upcoming';
    return 'upcoming';
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 py-12 px-4 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Search Box */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-500"></div>
          
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Search size={32} strokeWidth={2.5} />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
            پیگیری وضعیت سفارش
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed font-normal">
            برای استعلام و مشاهده آخرین وضعیت پرونده خود، کد رهگیری ۶ رقمی صادر شده در هنگام ثبت سفارش را در کادر زیر وارد کنید.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto relative z-10">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="مثال: CN-123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-13 rounded-2xl border-2 border-slate-200 bg-slate-50/50 pr-5 pl-14 py-3 text-left font-mono text-lg uppercase tracking-wider focus:outline-none focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all shadow-xs placeholder:text-slate-400 placeholder:text-right placeholder:tracking-normal placeholder:font-sans placeholder:text-sm font-semibold"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                title="جای‌گذاری کد رهگیری"
              >
                <ClipboardPaste size={20} />
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="h-13 px-8 bg-blue-600 text-white rounded-2xl text-base font-extrabold hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              <span>استعلام وضعیت</span>
            </button>
          </form>

          {error && (
            <div className="max-w-xl mx-auto mt-5 animate-in fade-in slide-in-from-top-2">
              <p className="text-sm font-medium text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Results Card */}
        {order && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
            
            {/* Header Area */}
            <div className="bg-slate-50/80 px-6 sm:px-10 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600 border border-slate-200">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">کد رهگیری پرونده</p>
                  <p className="text-lg font-extrabold font-mono text-slate-800 tracking-wider">
                    {order.tracking_code}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Area */}
            <div className="px-6 sm:px-10 py-10">
              {order.status === 'cancelled' ? (
                <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shadow-inner">
                    <XCircle size={40} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-extrabold text-rose-700">این سفارش لغو شده است</h3>
                  <p className="text-rose-600/80 text-sm max-w-sm leading-relaxed font-medium">
                    متأسفانه پردازش این پرونده متوقف شده است. در صورت نیاز به اطلاعات بیشتر یا استرداد وجه، با پشتیبانی تماس بگیرید.
                  </p>
                </div>
              ) : (
                <div className="relative flex flex-col sm:flex-row justify-between gap-10 sm:gap-0 mt-4 sm:mt-0">
                  {/* Connecting Lines */}
                  {/* Desktop */}
                  <div className="hidden sm:block absolute top-6 right-[15%] left-[15%] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000 ease-out rounded-full"
                      style={{ 
                        width: order.status === 'completed' ? '100%' : order.status === 'in_progress' ? '50%' : '0%' 
                      }}
                    />
                  </div>
                  {/* Mobile */}
                  <div className="sm:hidden absolute top-6 bottom-6 right-[22px] w-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="w-full bg-emerald-500 transition-all duration-1000 ease-out rounded-full"
                      style={{ 
                        height: order.status === 'completed' ? '100%' : order.status === 'in_progress' ? '50%' : '0%' 
                      }}
                    />
                  </div>

                  {steps.map((step) => {
                    const status = getStepStatus(step.id, order.status);
                    
                    return (
                      <div key={step.id} className="relative z-10 flex sm:flex-col items-center gap-5 sm:gap-4 w-full sm:w-1/3 text-right sm:text-center group">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                          status === 'passed' 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-50 scale-110 sm:scale-100' 
                          : status === 'active' 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40 ring-4 ring-blue-50 scale-110 sm:scale-110' 
                          : 'bg-white text-slate-300 border-2 border-slate-200'
                        }`}>
                          {status === 'passed' ? <Check size={24} strokeWidth={3} /> : <step.icon size={24} strokeWidth={status === 'active' ? 2.5 : 2} className={status === 'active' && step.id === 'in_progress' ? 'animate-spin-slow' : ''} />}
                        </div>
                        <div>
                          <p className={`font-bold text-sm sm:text-base transition-colors ${
                            status === 'active' ? 'text-blue-700' : 
                            status === 'passed' ? 'text-slate-800' : 'text-slate-400'
                          }`}>
                            {step.label}
                          </p>
                          <p className={`text-xs mt-1 transition-colors ${
                            status === 'active' ? 'text-blue-500 font-medium' : 'text-transparent'
                          }`}>
                            وضعیت فعلی
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Details Grid Area */}
            <div className="px-6 sm:px-10 pb-10 pt-4">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlignRight size={18} className="text-blue-600" />
                جزئیات پرونده
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex items-center gap-4 bg-slate-50 hover:bg-slate-50/70 transition-colors p-4 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 shrink-0">
                    <FileText size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs text-slate-500 block mb-1 font-medium">نوع خدمت</span>
                    <span className="font-bold text-slate-800 truncate block">{order.service_type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 hover:bg-slate-50/70 transition-colors p-4 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-sky-500 shrink-0">
                    <User size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs text-slate-500 block mb-1 font-medium">نام متقاضی</span>
                    <span className="font-bold text-slate-800 truncate block">{order.full_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 hover:bg-slate-50/70 transition-colors p-4 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500 shrink-0">
                    <Wallet size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs text-slate-500 block mb-1 font-medium">هزینه خدمت</span>
                    <span className="font-bold text-slate-800 truncate block">{formatToman(order.amount)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 hover:bg-slate-50/70 transition-colors p-4 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-amber-500 shrink-0">
                    <Calendar size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs text-slate-500 block mb-1 font-medium">تاریخ ثبت</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {order.created_at ? formatPersianDate(order.created_at) : '-'}
                    </span>
                  </div>
                </div>

              </div>

              {order.description && (
                <div className="mt-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-500 block mb-2 font-medium flex items-center gap-1.5">
                    توضیحات سفارش:
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {order.description}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}