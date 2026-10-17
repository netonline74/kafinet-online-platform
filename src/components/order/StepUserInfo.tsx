'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { OrderFormData } from '@/types/order';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { isValidIranianMobile, isValidIranianNationalCode } from '@/lib/validators';
import { User, CreditCard, Phone, FileText, AlertCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export const userInfoStepSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, 'نام و نام خانوادگی باید حداقل ۳ حرف باشد')
    .max(80, 'نام وارد شده بیش از حد مجاز طولانی است')
    .regex(/^[\u0600-\u06FF\s]+$/, 'نام و نام خانوادگی باید با حروف فارسی وارد شود'),
  national_id: z
    .string()
    .trim()
    .min(10, 'کد ملی باید دقیقاً ۱۰ رقم باشد')
    .max(10, 'کد ملی باید دقیقاً ۱۰ رقم باشد')
    .refine(
      (code) => /^\d{10}$/.test(code) && isValidIranianNationalCode(code),
      'کد ملی وارد شده از نظر ساختار یا رقم کنترل نامعتبر است'
    ),
  phone: z
    .string()
    .trim()
    .refine(isValidIranianMobile, 'شماره همراه نامعتبر است (مثال: 09123456789)'),
  description: z
    .string()
    .max(500, 'توضیحات تکمیلی نباید بیش از ۵۰۰ کاراکتر باشد')
    .optional(),
});

export type UserInfoValidationErrors = Partial<Record<keyof z.infer<typeof userInfoStepSchema>, string>>;

export function validateUserInfoFormData(data: Partial<OrderFormData>): {
  isValid: boolean;
  errors: UserInfoValidationErrors;
} {
  const result = userInfoStepSchema.safeParse({
    full_name: data.full_name || '',
    national_id: data.national_id || '',
    phone: data.phone || '',
    description: data.description || '',
  });

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: UserInfoValidationErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof z.infer<typeof userInfoStepSchema>;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { isValid: false, errors };
}

interface Props {
  formData: OrderFormData;
  updateFields: (fields: Partial<OrderFormData>) => void;
  nextStep?: () => void;
  prevStep?: () => void;
}

export function StepUserInfo({ formData, updateFields, nextStep, prevStep }: Props) {
  const [localErrors, setLocalErrors] = useState<UserInfoValidationErrors>({});

  const validate = () => {
    const { isValid, errors } = validateUserInfoFormData(formData);
    setLocalErrors(errors);
    return isValid;
  };

  const handleBlur = (field: keyof z.infer<typeof userInfoStepSchema>) => {
    const { errors } = validateUserInfoFormData(formData);
    setLocalErrors((prev) => ({
      ...prev,
      [field]: errors[field],
    }));
  };

  const handleFieldChange = (field: keyof OrderFormData, value: string) => {
    updateFields({ [field]: value });
    if (localErrors[field as keyof z.infer<typeof userInfoStepSchema>]) {
      setLocalErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && nextStep) {
      nextStep();
    }
  };

  return (
    <div className="space-y-7 text-right animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
      
      {/* هدر بولد و مدرن مرحله مشخصات */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-sm p-6 sm:p-7 shadow-xs flex items-center gap-4">
        <div className="w-13 h-13 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
          <Sparkles className="size-6 text-blue-600" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-0.5">مرحله دوم ثبت سفارش</span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            مشخصات فردی متقاضی برای{' '}
            <span className="text-blue-600 font-extrabold">{formData.service_type || 'خدمت انتخابی'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            اطلاعات وارد شده جهت تشکیل پرونده الکترونیکی و استعلامات مستقیم استفاده می‌شود.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* فیلد نام و نام خانوادگی با Label بولد و اینپوت دست‌ودلباز h-12 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="full_name" className="text-sm sm:text-base font-extrabold text-slate-900">
              <User className="size-4.5 text-slate-400" />
              <span>نام و نام خانوادگی کامل</span>
              <span className="text-rose-500">*</span>
            </Label>
            <span className="text-xs font-medium text-slate-400">فقط حروف فارسی</span>
          </div>

          <Input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => handleFieldChange('full_name', e.target.value)}
            onBlur={() => handleBlur('full_name')}
            placeholder="مثال: محمد امینی"
            aria-invalid={Boolean(localErrors.full_name)}
            className={`h-12 rounded-2xl text-base font-medium transition-all ${
              localErrors.full_name ? 'border-rose-300 ring-4 ring-rose-100' : ''
            }`}
          />

          {localErrors.full_name && (
            <p className="flex items-center gap-1.5 pt-1 text-xs font-bold text-rose-500 animate-in fade-in duration-200">
              <AlertCircle size={14} className="shrink-0" />
              <span>{localErrors.full_name}</span>
            </p>
          )}
        </div>

        {/* فیلدهای کد ملی و شماره موبایل در شبکه دو ستونه با اینپوت‌های h-12 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          
          {/* کد ملی ۱۰ رقمی */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="national_id" className="text-sm sm:text-base font-extrabold text-slate-900">
                <CreditCard className="size-4.5 text-slate-400" />
                <span>کد ملی متقاضی</span>
                <span className="text-rose-500">*</span>
              </Label>
              <span className="text-xs font-mono text-slate-400">۱۰ رقم عددی</span>
            </div>

            <Input
              id="national_id"
              type="text"
              inputMode="numeric"
              maxLength={10}
              dir="ltr"
              value={formData.national_id}
              onChange={(e) => handleFieldChange('national_id', e.target.value.replace(/\D/g, ''))}
              onBlur={() => handleBlur('national_id')}
              placeholder="0123456789"
              aria-invalid={Boolean(localErrors.national_id)}
              className={`h-12 rounded-2xl text-left font-mono text-base tracking-widest font-semibold transition-all ${
                localErrors.national_id ? 'border-rose-300 ring-4 ring-rose-100' : ''
              }`}
            />

            {localErrors.national_id && (
              <p className="flex items-center gap-1.5 pt-1 text-xs font-bold text-rose-500 animate-in fade-in duration-200">
                <AlertCircle size={14} className="shrink-0" />
                <span>{localErrors.national_id}</span>
              </p>
            )}
          </div>

          {/* شماره تلفن همراه */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="phone" className="text-sm sm:text-base font-extrabold text-slate-900">
                <Phone className="size-4.5 text-slate-400" />
                <span>شماره تلفن همراه</span>
                <span className="text-rose-500">*</span>
              </Label>
              <span className="text-xs font-mono text-slate-400">09xxxxxxxxx</span>
            </div>

            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              maxLength={11}
              dir="ltr"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value.replace(/\D/g, ''))}
              onBlur={() => handleBlur('phone')}
              placeholder="09120000000"
              aria-invalid={Boolean(localErrors.phone)}
              className={`h-12 rounded-2xl text-left font-mono text-base tracking-widest font-semibold transition-all ${
                localErrors.phone ? 'border-rose-300 ring-4 ring-rose-100' : ''
              }`}
            />

            {localErrors.phone && (
              <p className="flex items-center gap-1.5 pt-1 text-xs font-bold text-rose-500 animate-in fade-in duration-200">
                <AlertCircle size={14} className="shrink-0" />
                <span>{localErrors.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* فیلد توضیحات تکمیلی با شمارنده کاراکتر و تکست‌آریای شیک */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description" className="text-sm sm:text-base font-extrabold text-slate-900">
              <FileText className="size-4.5 text-slate-400" />
              <span>توضیحات تکمیلی متقاضی</span>
              <span className="text-xs font-normal text-slate-400">(اختیاری)</span>
            </Label>
            <span className="text-xs font-mono text-slate-400">
              {formData.description ? formData.description.length : 0} / ۵۰۰
            </span>
          </div>

          <textarea
            id="description"
            rows={4}
            maxLength={500}
            value={formData.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="در صورت داشتن هرگونه نکته، شماره پرونده یا درخواست خاص برای کارشناس، در این قسمت بنویسید..."
            aria-invalid={Boolean(localErrors.description)}
            className={`w-full resize-none rounded-2xl border bg-white p-4 text-base text-slate-800 transition-all placeholder:text-slate-400 focus:outline-none focus-visible:ring-4 ${
              localErrors.description
                ? 'border-rose-300 ring-rose-200/60 focus-visible:border-rose-500'
                : 'border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100'
            }`}
          />

          {localErrors.description && (
            <p className="flex items-center gap-1.5 pt-1 text-xs font-bold text-rose-500 animate-in fade-in duration-200">
              <AlertCircle size={14} className="shrink-0" />
              <span>{localErrors.description}</span>
            </p>
          )}
        </div>

        {/* دکمه‌های ناوبری بولد با ارتفاع h-12 و انیمیشن کلیک نرم */}
        {nextStep && prevStep && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={prevStep}
              className="gap-2"
            >
              <ChevronRight className="size-4" />
              <span>مرحله قبل</span>
            </Button>
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="gap-2"
            >
              <span>ادامه به مرحله بعد</span>
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default StepUserInfo;