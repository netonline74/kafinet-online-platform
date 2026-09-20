'use client';

import React from 'react';
import Link from 'next/link';
import { useOrderWizard } from '@/hooks/useOrderWizard';
import Step1Service from '@/components/order/Step1Service';
import { Check, ChevronLeft, ChevronRight, Loader2, UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 1, title: 'انتخاب خدمت' },
  { id: 2, title: 'اطلاعات فردی' },
  { id: 3, title: 'آپلود مدارک' },
  { id: 4, title: 'تایید نهایی' },
];

export default function OrderWizardPage() {
  const {
    step, formData, loading, error, trackingCode,
    updateFields, nextStep, prevStep, submitOrder
  } = useOrderWizard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-12 px-4 font-sans text-right" dir="rtl">
      <div className="max-w-3xl mx-auto">
        
        {/* لینک بازگشت به خانه */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
          <ChevronRight size={16} /> بازگشت به صفحه اصلی
        </Link>

        {/* کارت اصلی فرم */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* هدر و نوار پیشرفت (Stepper) */}
          <div className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center justify-between relative max-w-lg mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-200 -translate-y-1/2 z-0 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
                  style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
              
              {steps.map((s) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                return (
                  <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110 shadow-lg' :
                      isCompleted ? 'bg-emerald-500 text-white' :
                      'bg-white text-slate-400 border-2 border-slate-200'
                    }`}>
                      {isCompleted ? <Check size={24} /> : s.id}
                    </div>
                    <span className={`absolute -bottom-7 text-[11px] font-bold whitespace-nowrap hidden sm:block ${
                      isActive ? 'text-blue-700' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* بدنه فرم */}
          <div className="p-8 sm:p-10">
            {/* نمایش ارورهای فرم */}
            {error && (
              <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-start gap-2 animate-in fade-in zoom-in duration-300">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {/* مرحله ۱: انتخاب دسته‌بندی و خدمت */}
            {step === 1 && (
              <Step1Service formData={formData} updateFields={updateFields} />
            )}

            {/* مرحله ۲: اطلاعات فردی */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6">
                  <p className="text-sm text-slate-600">
                    درخواست شما برای <span className="font-bold text-blue-600">{formData.service_type}</span> ثبت می‌شود. لطفاً اطلاعات فردی متقاضی را وارد کنید.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">نام و نام خانوادگی</label>
                  <input 
                    type="text" 
                    value={formData.full_name} 
                    onChange={(e) => updateFields({ full_name: e.target.value })} 
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="مثال: علی محمدی" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">کد ملی</label>
                    <input 
                      type="text" 
                      value={formData.national_id} 
                      onChange={(e) => updateFields({ national_id: e.target.value.replace(/\D/g, '') })} 
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-left font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="0123456789" 
                      maxLength={10} 
                      dir="ltr" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">شماره موبایل</label>
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={(e) => updateFields({ phone: e.target.value.replace(/\D/g, '') })} 
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-left font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="09120000000" 
                      maxLength={11} 
                      dir="ltr" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">توضیحات تکمیلی (اختیاری)</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => updateFields({ description: e.target.value })} 
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                    rows={3} 
                    placeholder="اگر توضیح خاصی برای کارشناس دارید اینجا بنویسید..." 
                  />
                </div>
              </div>
            )}

            {/* مرحله ۳: مدارک و اطلاعات تکمیلی داینامیک */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800 font-medium">لطفاً اطلاعات و مدارک اختصاصی فرم <span className="font-bold">{formData.service_type}</span> را با دقت تکمیل کنید.</p>
                </div>

                {formData.selected_service_details?.required_documents && formData.selected_service_details.required_documents.length > 0 ? (
                  formData.selected_service_details.required_documents.map((doc: any) => {
                    
                    // رندر فیلد متنی داینامیک
                    if (doc.type === 'text') {
                      return (
                        <div key={doc.id} className="mb-5">
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            {doc.label} {doc.is_required && <span className="text-rose-500">*</span>}
                          </label>
                          <input 
                            type="text" 
                            value={formData.dynamic_texts?.[doc.id] || ''}
                            onChange={(e) => updateFields({ dynamic_texts: { ...formData.dynamic_texts, [doc.id]: e.target.value } })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            placeholder={`وارد کردن ${doc.label}...`}
                          />
                        </div>
                      );
                    }

                    // رندر دراپ‌زون فایل داینامیک
                    if (doc.type === 'file') {
                      const uploadedFile = formData.dynamic_files?.[doc.id];
                      return (
                        <div key={doc.id} className="mb-5">
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            {doc.label} {doc.is_required && <span className="text-rose-500">*</span>}
                          </label>
                          
                          {!uploadedFile ? (
                            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors relative group cursor-pointer">
                              <UploadCloud className="mx-auto text-slate-400 mb-3 group-hover:text-blue-500 transition-colors" size={32} />
                              <p className="text-sm font-medium text-slate-600 mb-1">انتخاب فایل برای {doc.label}</p>
                              <p className="text-xs text-slate-400">JPG, PNG, PDF</p>
                              <input 
                                type="file" 
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => {
                                  if(e.target.files && e.target.files[0]) {
                                    updateFields({ dynamic_files: { ...formData.dynamic_files, [doc.id]: e.target.files[0] } });
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                                <span className="text-sm text-emerald-800 truncate max-w-[200px]" dir="ltr">{uploadedFile.name}</span>
                              </div>
                              <button 
                                onClick={() => {
                                  const newFiles = { ...formData.dynamic_files };
                                  delete newFiles[doc.id];
                                  updateFields({ dynamic_files: newFiles });
                                }}
                                className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                حذف / تغییر
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return null;
                  })
                ) : (
                  <div className="text-center text-slate-500 py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    این خدمت نیاز به آپلود مدرک خاصی ندارد. می‌توانید به مرحله بعد بروید.
                  </div>
                )}
              </div>
            )}

            {/* مرحله ۴: تایید و دریافت کد رهگیری */}
            {step === 4 && (
              <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Check size={48} strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-3">سفارش شما با موفقیت ثبت شد!</h2>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto leading-relaxed">
                  پرونده شما ایجاد شد. کارشناسان ما به زودی بررسی و انجام کار را آغاز خواهند کرد.
                </p>
                
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 max-w-sm mx-auto mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 blur-xl"></div>
                  <p className="text-sm font-bold text-slate-500 mb-3">کد رهگیری اختصاصی شما</p>
                  <p className="text-4xl font-mono font-black text-blue-600 tracking-widest">{trackingCode}</p>
                </div>
                
                <Link href="/" className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5">
                  بازگشت به صفحه اصلی
                </Link>
              </div>
            )}

            {/* دکمه‌های ناوبری پایین فرم */}
            {step < 4 && (
              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={prevStep}
                  disabled={step === 1 || loading}
                  className={`flex items-center gap-1 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  <ChevronRight size={18} /> بازگشت
                </button>
                
                {step < 3 ? (
                  <button 
                    onClick={nextStep}
                    className="flex items-center gap-1 px-8 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                  >
                    مرحله بعد <ChevronLeft size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={submitOrder}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                    {loading ? 'در حال آپلود و ثبت...' : 'تایید نهایی و ارسال'}
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}