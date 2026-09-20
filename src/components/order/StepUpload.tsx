'use client';

import React from 'react';
import { OrderFormData } from '@/types/order';

interface Props {
  formData: OrderFormData;
  updateFields: (fields: Partial<OrderFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const StepUpload: React.FC<Props> = ({ formData, updateFields, nextStep, prevStep }) => {
  return (
    <div className="space-y-4 text-right">
      <h3 className="text-lg font-bold text-gray-800">توضیحات و مدارک</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات تکمیلی یا رمزها</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => updateFields({ description: e.target.value })}
          placeholder="اگر نکته‌ای یا کد رهگیری خاصی نیاز است وارد کنید..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
        <p className="text-sm font-medium text-gray-700">بارگذاری مدارک (اختیاری)</p>
        <p className="text-xs text-gray-400 mt-1">تصویر کارت ملی، شناسنامه یا فیش مربوطه</p>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              updateFields({ files: Array.from(e.target.files) });
            }
          }}
          className="mt-3 block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
        >
          مرحله قبل
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          مشاهده پیش‌فاکتور
        </button>
      </div>
    </div>
  );
};