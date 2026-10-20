'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ServiceConfig, ServiceField } from '@/config/services-config';
import IranianPlateInput from './IranianPlateInput';
import { 
  isValidIranianMobile, 
  isValidIranianNationalCode, 
  isValidIranianPostalCode, 
  isValidLegalEntityNationalId 
} from '@/lib/validators';
import { formatToman } from '@/lib/utils';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  UploadCloud, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles, 
  Calculator, 
  Calendar, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Download, 
  Lock, 
  Zap, 
  Building2, 
  BadgePercent, 
  CreditCard,
  Eye,
  Info
} from 'lucide-react';
import { z } from 'zod';

interface DynamicServiceFormProps {
  service: ServiceConfig;
  onFormSubmitted?: (payload: any) => void;
}

export default function DynamicServiceForm({ service, onFormSubmitted }: DynamicServiceFormProps) {
  // State های عمومی فرم
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    service.fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        initial[f.name] = f.defaultValue;
      } else if (f.type === 'switch' || f.type === 'checkbox') {
        initial[f.name] = false;
      } else {
        initial[f.name] = '';
      }
    });
    return initial;
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'otp_required' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [trackingCode, setTrackingCode] = useState<string>('');
  const [submittedPayload, setSubmittedPayload] = useState<any | null>(null);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  // تایمر ماژول‌های OTP (شمارش معکوس ۱۲۰ ثانیه)
  const [otpCountdown, setOtpCountdown] = useState<number>(120);
  const [otpActive, setOtpActive] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpActive && otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpActive, otpCountdown]);

  const restartOtpTimer = () => {
    setOtpCountdown(120);
    setOtpActive(true);
  };

  // --- اختصاصی ماژول سامانه مودیان: ماشین حساب آنلاین تعداد فاکتورها ---
  const [moadianInvoiceCount, setMoadianInvoiceCount] = useState<number>(30);
  const moadianCalculatedCost = useMemo(() => {
    const baseFee = 200000;
    const perInvoice = moadianInvoiceCount <= 50 ? 3000 : moadianInvoiceCount <= 200 ? 2500 : 2000;
    return baseFee + moadianInvoiceCount * perInvoice;
  }, [moadianInvoiceCount]);

  // پیش‌نمایش سطرهای فاکتور اکسل سامانه مودیان
  const [excelUploaded, setExcelUploaded] = useState<boolean>(false);
  const sampleInvoiceRows = useMemo(() => [
    { id: 1, itemCode: '2710000184920', title: 'خدمات مشاوره انفورماتیک', preDiscount: 15000000, vat: 1500000, total: 16500000 },
    { id: 2, itemCode: '2720000293811', title: 'لایسنس نرم‌افزار سازمانی', preDiscount: 28000000, vat: 2800000, total: 30800000 },
    { id: 3, itemCode: '2730000301928', title: 'سخت‌افزار پایانه فروش', preDiscount: 8500000, vat: 850000, total: 9350000 },
  ], []);

  // --- اختصاصی ماژول تبصره ۱۰۰: ماشین حساب هوشمند مالیات ---
  const [taxTurnover, setTaxTurnover] = useState<number>(1200000000); // ۱.۲ میلیارد پیش‌فرض
  const [profitMargin, setProfitMargin] = useState<number>(12); // ۱۲ درصد سود صنف
  const calculatedTaxEstimate = useMemo(() => {
    const grossProfit = (taxTurnover * profitMargin) / 100;
    const basicExemption = 144000000; // معافیت سالانه ۱۴۴ میلیون تومان
    const taxableIncome = Math.max(0, grossProfit - basicExemption);
    
    // پله‌های مالیاتی ماده ۱۳۱ قانون مالیات‌ها
    let tax = 0;
    if (taxableIncome <= 200000000) {
      tax = taxableIncome * 0.15;
    } else if (taxableIncome <= 400000000) {
      tax = 200000000 * 0.15 + (taxableIncome - 200000000) * 0.20;
    } else {
      tax = 200000000 * 0.15 + 200000000 * 0.20 + (taxableIncome - 400000000) * 0.25;
    }

    return {
      grossProfit,
      taxableIncome,
      estimatedTax: Math.round(tax),
      installmentAmount: Math.round(tax / 10), // ۱۰ قسط
    };
  }, [taxTurnover, profitMargin]);

  // --- اختصاصی ماژول درگاه ملی مجوزها: استعلام برخط کد پستی تجاری ---
  const [isVerifyingPostalCode, setIsVerifyingPostalCode] = useState<boolean>(false);
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);

  const handleSimulatePostalInquiry = () => {
    const pc = formData.commercial_postal_code || formData.postal_code;
    if (!pc || !isValidIranianPostalCode(pc)) {
      setFormErrors((prev) => ({ ...prev, commercial_postal_code: 'کد پستی ۱۰ رقمی معتبر وارد کنید.' }));
      return;
    }
    setIsVerifyingPostalCode(true);
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.commercial_postal_code;
      return next;
    });

    setTimeout(() => {
      setIsVerifyingPostalCode(false);
      setVerifiedAddress('استان تهران، شهر تهران، خیابان آزادی، تقاطع شادمان، پلاک ۱۲۴، طبقه ۲ تجاری (تایید شده شرکت ملی پست)');
    }, 1200);
  };

  // --- اختصاصی نوبت‌دهی تعویض پلاک: تقویم جلالی تعاملی ---
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('۱۴۰۴/۰۲/۱۵');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('۰۹:۳۰ الی ۱۰:۱۵');
  const bookingCalendarDays = [
    { date: '۱۴۰۴/۰۲/۱۴', dayName: 'یکشنبه', status: 'full', slots: 0 },
    { date: '۱۴۰۴/۰۲/۱۵', dayName: 'دوشنبه', status: 'available', slots: 8 },
    { date: '۱۴۰۴/۰۲/۱۶', dayName: 'سه‌شنبه', status: 'available', slots: 12 },
    { date: '۱۴۰۴/۰۲/۱۷', dayName: 'چهارشنبه', status: 'full', slots: 0 },
    { date: '۱۴۰۴/۰۲/۱۸', dayName: 'پنجشنبه', status: 'available', slots: 3 },
    { date: '۱۴۰۴/۰۲/۲۰', dayName: 'شنبه', status: 'available', slots: 15 },
  ];

  // --- اختصاصی استعلام جامع خلافی: لیست جرایم کشف‌شده ---
  const [trafficInquired, setTrafficInquired] = useState<boolean>(false);
  const [trafficLoading, setTrafficLoading] = useState<boolean>(false);
  const [trafficFines, setTrafficFines] = useState([
    { id: 101, title: 'تجاوز از سرعت مجاز بیش از ۳۰ کیلومتر (دوربین)', location: 'بزرگراه شهید همت غرب - پل مدرس', date: '۱۴۰۴/۰۲/۰۲ - ساعت ۱۴:۲۲', amount: 350000, selected: true },
    { id: 102, title: 'ورود غیرمجاز به محدوده طرح ترافیک تهران', location: 'خیابان مطهری تقاطع ولیعصر', date: '۱۴۰۴/۰۱/۲۸ - ساعت ۱۰:۴۵', amount: 150000, selected: true },
    { id: 103, title: 'عوارض آزادراه تهران - شمال (قطعه ۱)', location: 'درگاه الکترونیک عوارضی', date: '۱۴۰۴/۰۱/۱۵ - ساعت ۱۸:۳۰', amount: 65000, selected: true },
    { id: 104, title: 'استفاده از تلفن همراه حین رانندگی', location: 'میدان آزادی - ایستگاه پلیس', date: '۱۴۰۳/۱۲/۲۰ - ساعت ۱۱:۱۰', amount: 120000, selected: false },
  ]);

  const trafficSelectedTotal = useMemo(() => {
    return trafficFines.filter((f) => f.selected).reduce((sum, f) => sum + f.amount, 0);
  }, [trafficFines]);

  // --- اختصاصی سامانه املاک و اسکان: اعضای خانوار داینامیک ---
  const [householdMembers, setHouseholdMembers] = useState<Array<{ id: string; name: string; nationalId: string; birthDate: string; relation: string }>>([
    { id: '1', name: 'سارا رضایی', nationalId: '0019283746', birthDate: '1368/05/12', relation: 'همسر' },
  ]);

  const addHouseholdMember = () => {
    setHouseholdMembers((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', nationalId: '', birthDate: '', relation: 'فرزند' },
    ]);
  };

  const removeHouseholdMember = (id: string) => {
    setHouseholdMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // آپدیت مقدار یک فیلد
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (formErrors[fieldName]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // اعتبارسنجی با Zod
  const validateCurrentFields = (fieldsToValidate: ServiceField[]): boolean => {
    const errors: Record<string, string> = {};

    fieldsToValidate.forEach((field) => {
      const val = formData[field.name];

      // الزامی بودن
      if (field.required && (val === undefined || val === null || val === '')) {
        errors[field.name] = `${field.label} الزامی است.`;
        return;
      }

      if (!val) return;

      // قواعد اعتبارسنجی تخصصی ایران
      if (field.validationRule === 'national_code' || field.type === 'national_id') {
        if (!isValidIranianNationalCode(String(val))) {
          errors[field.name] = 'کد ملی ۱۰ رقمی با الگوریتم کنترلی نامعتبر است.';
        }
      } else if (field.validationRule === 'mobile' || field.type === 'mobile') {
        if (!isValidIranianMobile(String(val))) {
          errors[field.name] = 'شماره موبایل نامعتبر است (مثال: 09123456789).';
        }
      } else if (field.validationRule === 'postal_code' || field.type === 'postal_code') {
        if (!isValidIranianPostalCode(String(val))) {
          errors[field.name] = 'کد پستی ۱۰ رقمی نامعتبر است.';
        }
      } else if (field.validationRule === 'company_id' || field.type === 'company_id') {
        const str = String(val).trim();
        if (str.length !== 11 && str.length !== 12) {
          errors[field.name] = 'شناسه ملی شرکت باید ۱۱ یا ۱۲ رقمی باشد.';
        }
      } else if (field.type === 'plate') {
        if (!val || typeof val !== 'string' || !val.includes('-')) {
          errors[field.name] = 'شماره پلاک خودرو را به صورت کامل تکمیل کنید.';
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ناوبری در فرم‌های چندمرحله‌ای (مانند خودنویس)
  const isMultiStep = service.formType === 'multistep-khodnevis' || (service.steps && service.steps.length > 1);
  const currentStepFields = useMemo(() => {
    if (!isMultiStep) return service.fields;
    return service.fields.filter((f) => (f.step || 1) === currentStep);
  }, [isMultiStep, service.fields, currentStep]);

  const handleNextStep = () => {
    if (!validateCurrentFields(currentStepFields)) return;

    if (currentStep === 4 && service.slug === 'khodnevis-rent') {
      // ورود به مرحله OTP
      restartOtpTimer();
    }

    const maxSteps = service.steps?.length || 5;
    if (currentStep < maxSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  // ثبت نهایی فرم
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateCurrentFields(currentStepFields)) {
      return;
    }

    setFormStatus('loading');
    setStatusMessage('در حال اعتبارسنجی نهایی و رمزنگاری اسناد در پایگاه امن...');

    // ساخت Payload استاندارد و غنی‌شده آماده ارسال به سرور
    const generatedTracking = 'CN-' + Math.floor(100000 + Math.random() * 900000);
    const finalPayload = {
      tracking_code: generatedTracking,
      service_slug: service.slug,
      service_title: service.title,
      category: service.category,
      base_price: service.basePrice,
      duration: service.duration,
      submission_timestamp: new Date().toISOString(),
      form_data: {
        ...formData,
        ...(service.slug === 'moadian-system' ? { invoice_tier_count: moadianInvoiceCount, calculated_total: moadianCalculatedCost } : {}),
        ...(service.slug === 'tax-article-100' ? { tax_turnover: taxTurnover, profit_margin: profitMargin, estimated_tax: calculatedTaxEstimate.estimatedTax } : {}),
        ...(service.slug === 'plate-transfer-booking' ? { calendar_date: selectedCalendarDate, time_slot: selectedTimeSlot } : {}),
        ...(service.slug === 'traffic-fines-inquiry' ? { selected_fines: trafficFines.filter((f) => f.selected), total_payable: trafficSelectedTotal } : {}),
        ...(service.slug === 'amlak-maskan-registry' ? { household_members: householdMembers } : {}),
      },
    };

    setTimeout(() => {
      setTrackingCode(generatedTracking);
      setSubmittedPayload(finalPayload);
      setFormStatus('success');
      setStatusMessage('درخواست شما با موفقیت در سامانه ثبت شد و در اولویت بررسی کارشناسان قرار گرفت.');
      if (onFormSubmitted) {
        onFormSubmitted(finalPayload);
      }
    }, 1400);
  };

  const handleCopyPayloadJson = () => {
    if (!submittedPayload) return;
    navigator.clipboard.writeText(JSON.stringify(submittedPayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-100 overflow-hidden font-sans" dir="rtl">
      
      {/* هدر بالایی فرم */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 -translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-2">
              <Zap size={14} className="text-yellow-400" />
              {service.badgeText}
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">{service.title}</h2>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-left bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <p className="text-[11px] text-slate-300 font-medium">تعرفه پایه خدمت</p>
              <p className="text-base sm:text-lg font-black text-emerald-400 font-mono">{service.formattedPrice}</p>
            </div>
          </div>
        </div>
      </div>

      {/* نوار پیشرفت مراحل (در صورت چندمرحله‌ای بودن مثل خودنویس) */}
      {isMultiStep && service.steps && (
        <div className="bg-slate-50 border-b border-slate-100 p-4 sm:p-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (service.steps.length - 1)) * 100}%` }}
              />
            </div>
            
            {service.steps.map((st) => {
              const isActive = currentStep === st.stepNumber;
              const isPassed = currentStep > st.stepNumber;
              return (
                <div key={st.stepNumber} className="relative z-10 flex flex-col items-center">
                  <div className={`size-10 sm:size-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-4 ring-blue-100 scale-105' :
                    isPassed ? 'bg-emerald-500 text-white' :
                    'bg-white text-slate-400 border-2 border-slate-200'
                  }`}>
                    {isPassed ? <Check size={20} strokeWidth={3} /> : st.stepNumber}
                  </div>
                  <span className={`text-[11px] font-bold mt-2 hidden sm:block whitespace-nowrap ${
                    isActive ? 'text-blue-700' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {st.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* محتوای فرم */}
      <div className="p-6 sm:p-10">

        {/* وضعیت موفقیت ثبت فرم */}
        {formStatus === 'success' ? (
          <div className="text-center py-6 animate-in zoom-in-95 duration-500 space-y-6">
            <div className="size-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={44} strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">درخواست شما با موفقیت ثبت گردید</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">{statusMessage}</p>
            </div>

            {/* کارت کد رهگیری رسمی */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 max-w-sm mx-auto space-y-2">
              <span className="text-xs font-bold text-slate-500">کد رهگیری اختصاصی سامانه</span>
              <p className="text-3xl font-black text-blue-600 font-mono tracking-widest">{trackingCode}</p>
              <p className="text-[11px] text-slate-400">این کد برای پیگیری لحظه‌ای و استعلام در بخش پیگیری پرونده معتبر است.</p>
            </div>

            {/* جعبه خروجی Payload آماده سرور / دیتابیس */}
            {submittedPayload && (
              <div className="max-w-xl mx-auto text-right bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5" dir="ltr">
                    <Check size={14} /> Server Payload Ready (JSON)
                  </span>
                  <button
                    onClick={handleCopyPayloadJson}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition-colors"
                  >
                    {copiedPayload ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedPayload ? 'کپی شد!' : 'کپی خروجی JSON'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto max-h-48 text-left p-2 bg-slate-950 rounded-xl" dir="ltr">
                  {JSON.stringify(submittedPayload, null, 2)}
                </pre>
              </div>
            )}

            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => {
                  setFormStatus('idle');
                  setCurrentStep(1);
                  setSubmittedPayload(null);
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                ثبت درخواست جدید
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (isMultiStep) handleNextStep(); else handleFinalSubmit(); }}>
            
            {/* پیام خطای کلی */}
            {statusMessage && formStatus === 'error' && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* ========================================================
                ماژول‌های سفارشی بر اساس نوع خدمت (Custom Modules)
               ======================================================== */}

            {/* ۱. ماژول سفارشی سامانه مودیان B2B */}
            {service.slug === 'moadian-system' && (
              <div className="space-y-6 mb-8 bg-blue-50/50 border border-blue-100 rounded-3xl p-6">
                
                {/* ماشین‌حساب آنلاین تعرفه بر اساس تعداد فاکتور */}
                <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calculator className="size-5 text-blue-600" />
                      <h4 className="font-bold text-slate-800 text-sm">ماشین‌حساب آنلاین هزینه خدمات سامانه مودیان</h4>
                    </div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                      محاسبه هوشمند پلکانی
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-2">
                      <span>تعداد فاکتورهای ارسالی در ماه:</span>
                      <span className="font-mono font-black text-blue-600 text-sm">{moadianInvoiceCount} فاکتور</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={300}
                      step={5}
                      value={moadianInvoiceCount}
                      onChange={(e) => setMoadianInvoiceCount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">مجموع برآورد هزینه ماهانه:</span>
                    <span className="font-mono font-black text-emerald-600 text-base">{formatToman(moadianCalculatedCost)}</span>
                  </div>
                </div>

                {/* پیش‌نمایش جدول سطرهای فاکتور اکسل */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <FileText className="size-4 text-emerald-600" />
                      پیش‌نمایش استخراج اقلام صورتحساب از فایل اکسل
                    </h4>
                    <span className="text-[11px] text-slate-500">۳ سطر نمونه خوانده شده</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="p-2.5">شناسه یکتای کالا (۱۳ رقمی)</th>
                          <th className="p-2.5">شرح قلم کالا / خدمت</th>
                          <th className="p-2.5">مبلغ قبل از تخفیف</th>
                          <th className="p-2.5">مالیات بر ارزش افزوده (۱۰٪)</th>
                          <th className="p-2.5">مبلغ نهایی (تومان)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleInvoiceRows.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/70 font-mono">
                            <td className="p-2.5 text-blue-600 font-bold">{row.itemCode}</td>
                            <td className="p-2.5 font-sans font-medium text-slate-800">{row.title}</td>
                            <td className="p-2.5 text-slate-600">{formatToman(row.preDiscount)}</td>
                            <td className="p-2.5 text-amber-600 font-semibold">{formatToman(row.vat)}</td>
                            <td className="p-2.5 text-emerald-600 font-bold">{formatToman(row.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ۲. ماژول سفارشی اظهارنامه تبصره ۱۰۰ مشاغل */}
            {service.slug === 'tax-article-100' && (
              <div className="space-y-6 mb-8 bg-amber-50/40 border border-amber-200/80 rounded-3xl p-6">
                
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <ShieldCheck className="size-5 text-amber-600" />
                  <span>تضمین عدم جریمه کتمان درآمد و بهره‌مندی از حداکثر معافیت سالانه</span>
                </div>

                {/* ماشین‌حساب تخمین مالیات تبصره ۱۰۰ */}
                <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Calculator className="size-4 text-amber-600" />
                      تخمین هوشمند مالیات مقطوع بر اساس فروش کارتخوان
                    </h4>
                    <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-bold">
                      ماده ۱۳۱ ق.م.م
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        مجموع فروش پوز و درگاه بانکی در سال:
                      </label>
                      <input
                        type="number"
                        value={taxTurnover}
                        onChange={(e) => setTaxTurnover(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-amber-500"
                        step={50000000}
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">{formatToman(taxTurnover)}</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ضریب سود مصوب اینتاکد صنف (%):
                      </label>
                      <input
                        type="number"
                        value={profitMargin}
                        onChange={(e) => setProfitMargin(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-amber-500"
                        min={1}
                        max={50}
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">ضریب میانگین سود اصناف: ۱۰ الی ۱۵ درصد</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[11px] text-slate-500">درآمد مشمول مالیات</p>
                      <p className="text-xs font-bold font-mono text-slate-800 mt-1">{formatToman(calculatedTaxEstimate.taxableIncome)}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[11px] text-slate-500">معافیت پایه کسرشده</p>
                      <p className="text-xs font-bold font-mono text-emerald-600 mt-1">۱۴۴,۰۰۰,۰۰۰ تومان</p>
                    </div>
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200">
                      <p className="text-[11px] text-amber-800 font-bold">مالیات مقطوع تخمینی</p>
                      <p className="text-sm font-black font-mono text-amber-700 mt-1">{formatToman(calculatedTaxEstimate.estimatedTax)}</p>
                    </div>
                    <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200">
                      <p className="text-[11px] text-blue-800 font-bold">مبلغ هر قسط (۱۰ ماه)</p>
                      <p className="text-sm font-black font-mono text-blue-700 mt-1">{formatToman(calculatedTaxEstimate.installmentAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* تایمر معکوس دریافت رمز یکبار مصرف سازمان مالیاتی */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lock className="size-4 text-amber-600" />
                      <span className="text-sm font-bold text-slate-800">رمز یکبار مصرف درگاه خدمات الکترونیک (my.tax.gov.ir)</span>
                    </div>
                    <p className="text-xs text-slate-500">جهت استعلام اطلاعات پرونده مالیاتی و تایید نهایی ارسال تبصره ۱۰۰</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {otpActive ? (
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                        <Clock size={16} className="animate-spin-slow" />
                        <span>{Math.floor(otpCountdown / 60)}:{(otpCountdown % 60).toString().padStart(2, '0')}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={restartOtpTimer}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                      >
                        ارسال کد تایید به شماره مالیاتی
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ۳. ماژول سفارشی درگاه ملی مجوزها (Mojavez.ir) */}
            {service.slug === 'mojavez-national-portal' && (
              <div className="space-y-6 mb-8 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                
                {/* استعلام برخط تطابق کد پستی تجاری با آدرس */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Building2 className="size-4 text-blue-600" />
                      استعلام برخط تطابق کد پستی تجاری با استاندارد مکانی GNAF
                    </h4>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSimulatePostalInquiry}
                      disabled={isVerifyingPostalCode}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {isVerifyingPostalCode ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                      <span>استعلام نشانی رسمی از شرکت ملی پست</span>
                    </button>
                  </div>

                  {verifiedAddress && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 animate-in fade-in duration-300">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-emerald-900 leading-relaxed font-medium">
                        <p className="font-bold">آدرس رسمی تایید شده:</p>
                        <p>{verifiedAddress}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* تایم‌لاین مراحل درخواست پروانه در Mojavez.ir */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm">تایم‌لاین گردش پرونده تا صدور شناسه یکتا</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 font-bold text-blue-800">
                      ۱. ثبت اولیه و احراز هویت
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-600 font-medium">
                      ۲. استعلام سیستمی (پست و ثنا)
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-600 font-medium">
                      ۳. تایید صلاحیت صنف
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-600 font-medium">
                      ۴. صدور شناسه یکتا QR
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ۴. ماژول سفارشی نوبت‌دهی تعویض پلاک */}
            {service.slug === 'plate-transfer-booking' && (
              <div className="space-y-6 mb-8 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                
                {/* تقویم تعاملی روزهای باز و پر شده */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Calendar className="size-4 text-blue-600" />
                      تقویم تعاملی نوبت‌دهی مراکز راهور
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">انتخاب روز مراجعه</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    {bookingCalendarDays.map((item) => {
                      const isSelected = selectedCalendarDate === item.date;
                      const isFull = item.status === 'full';
                      return (
                        <button
                          key={item.date}
                          type="button"
                          disabled={isFull}
                          onClick={() => setSelectedCalendarDate(item.date)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isFull 
                              ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60' 
                              : isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50'
                          }`}
                        >
                          <p className="text-[11px] font-medium">{item.dayName}</p>
                          <p className="text-xs font-bold font-mono mt-0.5">{item.date.split('/')[2]}</p>
                          <span className={`text-[10px] mt-2 block font-semibold ${
                            isFull ? 'text-rose-500' : isSelected ? 'text-blue-100' : 'text-emerald-600'
                          }`}>
                            {isFull ? 'تکمیل ظرفیت' : `${item.slots} نوبت باز`}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* بازه ساعتی */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-600 font-bold ml-2">ساعت مراجعه:</span>
                    {['۰۸:۰۰ الی ۰۸:۴۵', '۰۸:۴۵ الی ۰۹:۳۰', '۰۹:۳۰ الی ۱۰:۱۵', '۱۰:۱۵ الی ۱۱:۰۰'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          selectedTimeSlot === slot 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ۵. ماژول استعلام جامع خلافی و عوارض خودرو */}
            {service.slug === 'traffic-fines-inquiry' && (
              <div className="space-y-6 mb-8 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <Zap className="size-4 text-amber-500" />
                      استعلام برخط صفر تا صد دیون پلاک انتظامی
                    </h4>
                    <p className="text-xs text-slate-500">شامل خلافی دوربین، عوارض آزادراهی و طرح ترافیک با امکان تسویه آنی</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTrafficLoading(true);
                      setTimeout(() => {
                        setTrafficLoading(false);
                        setTrafficInquired(true);
                      }, 1000);
                    }}
                    disabled={trafficLoading}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    {trafficLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    <span>استعلام فوری جریمه‌ها</span>
                  </button>
                </div>

                {/* نتایج دیون کشف‌شده */}
                {trafficInquired && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        ریز تخلفات و عوارض ({trafficFines.length} مورد)
                      </span>
                      <span className="text-xs font-mono font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                        مجموع قابل پرداخت: {formatToman(trafficSelectedTotal)}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {trafficFines.map((fine) => (
                        <div 
                          key={fine.id} 
                          className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                            fine.selected ? 'bg-blue-50/40 border-blue-200' : 'bg-slate-50 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={fine.selected}
                              onChange={(e) => {
                                setTrafficFines(trafficFines.map(f => f.id === fine.id ? { ...f, selected: e.target.checked } : f));
                              }}
                              className="size-4 mt-1 accent-blue-600 rounded cursor-pointer"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900">{fine.title}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{fine.location} • {fine.date}</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-800 shrink-0">
                            {formatToman(fine.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ۶. ماژول سفارشی سامانه ملی املاک و اسکان */}
            {service.slug === 'amlak-maskan-registry' && (
              <div className="space-y-6 mb-8 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                
                {/* لیست اعضای خانوار */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">ثبت مشخصات اعضای خانوار ساکن در اقامتگاه</h4>
                      <p className="text-xs text-slate-500 mt-0.5">همسر و فرزندان تحت تکفل</p>
                    </div>
                    <button
                      type="button"
                      onClick={addHouseholdMember}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Plus size={16} />
                      <span>افزودن عضو خانوار</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {householdMembers.map((member, index) => (
                      <div key={member.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                        <input
                          type="text"
                          placeholder="نام و نام خانوادگی"
                          value={member.name}
                          onChange={(e) => {
                            const updated = [...householdMembers];
                            updated[index].name = e.target.value;
                            setHouseholdMembers(updated);
                          }}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none"
                        />
                        <input
                          type="text"
                          placeholder="کد ملی ۱۰ رقمی"
                          value={member.nationalId}
                          onChange={(e) => {
                            const updated = [...householdMembers];
                            updated[index].nationalId = e.target.value;
                            setHouseholdMembers(updated);
                          }}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono outline-none"
                        />
                        <select
                          value={member.relation}
                          onChange={(e) => {
                            const updated = [...householdMembers];
                            updated[index].relation = e.target.value;
                            setHouseholdMembers(updated);
                          }}
                          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none"
                        >
                          <option value="همسر">همسر</option>
                          <option value="فرزند">فرزند</option>
                          <option value="والدین">پدر / مادر</option>
                        </select>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeHouseholdMember(member.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف عضو"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                رندر داینامیک فیلدهای فرم بر اساس تعریف ServiceField
               ======================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {currentStepFields.map((field) => {
                const errorText = formErrors[field.name];
                const isFullWidth = field.type === 'textarea' || field.type === 'plate' || field.type === 'file' || field.type === 'switch';

                return (
                  <div 
                    key={field.id} 
                    className={`space-y-1.5 ${isFullWidth ? 'sm:col-span-2' : ''}`}
                  >
                    <label className="block text-xs font-bold text-slate-700">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>

                    {/* رندر پلاک خودرو */}
                    {field.type === 'plate' && (
                      <div className="py-2">
                        <IranianPlateInput
                          value={formData[field.name]}
                          onChange={(val) => handleFieldChange(field.name, val)}
                        />
                      </div>
                    )}

                    {/* رندر تکست یا نامبر یا ارز */}
                    {(field.type === 'text' || field.type === 'number' || field.type === 'currency' || field.type === 'national_id' || field.type === 'mobile' || field.type === 'postal_code' || field.type === 'company_id') && (
                      <div className="relative">
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          value={formData[field.name]}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className={`w-full bg-slate-50/70 border rounded-2xl px-4 py-3 text-sm text-slate-900 transition-all outline-none focus:bg-white ${
                            field.type === 'national_id' || field.type === 'mobile' || field.type === 'postal_code' || field.type === 'company_id' || field.type === 'currency'
                              ? 'font-mono text-left'
                              : 'text-right'
                          } ${
                            errorText ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
                          }`}
                        />
                        {field.type === 'currency' && formData[field.name] ? (
                          <span className="text-[11px] text-slate-500 mt-1 block font-mono">
                            {formatToman(Number(String(formData[field.name]).replace(/,/g, '')) || 0)}
                          </span>
                        ) : null}
                      </div>
                    )}

                    {/* رندر تاریخ */}
                    {field.type === 'date' && (
                      <input
                        type="date"
                        value={formData[field.name]}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={`w-full bg-slate-50/70 border rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none font-mono text-left focus:bg-white ${
                          errorText ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                    )}

                    {/* رندر سلکت */}
                    {field.type === 'select' && (
                      <select
                        value={formData[field.name]}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={`w-full bg-slate-50/70 border rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none cursor-pointer focus:bg-white ${
                          errorText ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      >
                        <option value="">انتخاب کنید...</option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label} {opt.hint ? `(${opt.hint})` : ''}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* رندر تکست‌اریا */}
                    {field.type === 'textarea' && (
                      <textarea
                        rows={3}
                        value={formData[field.name]}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full bg-slate-50/70 border rounded-2xl px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white resize-none ${
                          errorText ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                    )}

                    {/* رندر آپلود فایل */}
                    {field.type === 'file' && (
                      <div className="relative">
                        <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all hover:bg-slate-50 ${
                          formData[field.name] ? 'border-emerald-300 bg-emerald-50/30' : errorText ? 'border-rose-300' : 'border-slate-300'
                        }`}>
                          <UploadCloud className={`size-8 mb-2 ${formData[field.name] ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold text-slate-700">
                            {formData[field.name]?.name || 'انتخاب یا رها کردن فایل مدارک (JPG, PNG, PDF)'}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1">حداکثر حجم مجاز: ۵ مگابایت</span>
                          <input
                            type="file"
                            accept={field.accept || '.jpg,.jpeg,.png,.pdf'}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFieldChange(field.name, e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    {/* رندر OTP */}
                    {field.type === 'otp' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            maxLength={6}
                            value={formData[field.name]}
                            onChange={(e) => handleFieldChange(field.name, e.target.value.replace(/[^\d]/g, ''))}
                            placeholder="۱۲۳۴۵"
                            className="w-48 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center text-xl font-mono font-black tracking-widest text-blue-600 outline-none focus:bg-white focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={restartOtpTimer}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            ارسال مجدد کد
                          </button>
                        </div>
                        {otpActive && (
                          <p className="text-[11px] text-slate-400 font-mono">
                            زمان اعتبار کد: {Math.floor(otpCountdown / 60)}:{(otpCountdown % 60).toString().padStart(2, '0')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* رندر سوئیچ */}
                    {field.type === 'switch' && (
                      <label className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(formData[field.name])}
                          onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                          className="size-5 accent-blue-600 rounded cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-800">{field.label}</span>
                      </label>
                    )}

                    {/* نمایش ارور فیلد */}
                    {errorText && (
                      <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle size={12} /> {errorText}
                      </p>
                    )}

                    {field.helperText && !errorText && (
                      <p className="text-[11px] text-slate-400">{field.helperText}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* نوار دکمه‌های ناوبری پایین فرم */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              {isMultiStep && currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight size={18} />
                  <span>مرحله قبل</span>
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                disabled={formStatus === 'loading'}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {formStatus === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>در حال پردازش امن...</span>
                  </>
                ) : isMultiStep && currentStep < (service.steps?.length || 5) ? (
                  <>
                    <span>مرحله بعد</span>
                    <ChevronLeft size={18} />
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>ثبت نهایی و صدور کد رهگیری</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
