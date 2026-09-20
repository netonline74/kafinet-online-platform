'use client';

import React, { useState } from 'react';
import { OrderFormData } from '@/types/order';
import { formatToman } from '@/lib/utils';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import Link from 'next/link';

interface Props {
  formData: OrderFormData;
  loading: boolean;
  error: string | null;
  trackingCode: string | null;
  submitOrder: () => void;
  prevStep: () => void;
}

export const StepSummary: React.FC<Props> = ({
  formData,
  loading,
  error,
  trackingCode,
  submitOrder,
  prevStep,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (trackingCode) {
      navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (trackingCode) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">سفارش شما با موفقیت ثبت شد</h3>
        <p className="text-sm text-gray-500">کد رهگیری اختصاصی شما:</p>
        
        <div className="flex items-center justify-center gap-2">
          <div className="px-5 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-lg font-mono font-bold text-blue-700 tracking-wider">
            {trackingCode}
          </div>
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
            title="کپی کد رهگیری"
          >
            {copied ? <Check size={20} className="text-emerald-600" /> : <Copy size={20} />}
          </button>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <Link
            href={"/track?code=" + trackingCode}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            مشاهده وضعیت پرونده
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-right">
      <h3 className="text-lg font-bold text-gray-800">پیش‌فاکتور نهایی</h3>

      <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-gray-50/60 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">نوع خدمت:</span>
          <span className="font-semibold text-gray-800">{formData.service_type}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">متقاضی:</span>
          <span className="font-medium text-gray-800">{formData.full_name}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">کد ملی:</span>
          <span className="font-mono text-gray-800">{formData.national_id}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">شماره همراه:</span>
          <span className="font-mono text-gray-800">{formData.phone}</span>
        </div>
        <div className="flex justify-between pt-1 text-base">
          <span className="font-bold text-gray-800">مبلغ قابل پرداخت:</span>
          <span className="font-bold text-blue-600">{formatToman(formData.amount)}</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">{error}</p>}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          ویرایش اطلاعات
        </button>
        <button
          type="button"
          onClick={submitOrder}
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'در حال ثبت در سامانه...' : 'تایید نهایی و ثبت سفارش'}
        </button>
      </div>
    </div>
  );
};