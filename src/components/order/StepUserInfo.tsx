'use client';

import React, { useState } from 'react';
import { OrderFormData } from '@/types/order';

interface Props {
  formData: OrderFormData;
  updateFields: (fields: Partial<OrderFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const StepUserInfo: React.FC<Props> = ({ formData, updateFields, nextStep, prevStep }) => {
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.full_name.trim()) errs.full_name = 'نام و نام خانوادگی الزامی است';
    if (!/^\d{10}$/.test(formData.national_id)) errs.national_id = 'کد ملی باید ۱۰ رقم باشد';
    if (!/^09\d{9}$/.test(formData.phone)) errs.phone = 'شماره موبایل نامعتبر است (مثال: 09123456789)';

    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) nextStep();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-4 text-right">
      <h3 className="text-lg font-bold text-gray-800">مشخصات متقاضی</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">نام و نام خانوادگی</label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => updateFields({ full_name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {localErrors.full_name && <p className="text-xs text-red-500 mt-1">{localErrors.full_name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">کد ملی (۱۰ رقم)</label>
          <input
            type="text"
            maxLength={10}
            value={formData.national_id}
            onChange={(e) => updateFields({ national_id: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {localErrors.national_id && <p className="text-xs text-red-500 mt-1">{localErrors.national_id}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شماره همراه</label>
          <input
            type="tel"
            maxLength={11}
            value={formData.phone}
            onChange={(e) => updateFields({ phone: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {localErrors.phone && <p className="text-xs text-red-500 mt-1">{localErrors.phone}</p>}
        </div>
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
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          ادامه
        </button>
      </div>
    </form>
  );
};