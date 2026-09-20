'use client';

import React from 'react';
import { OrderFormData } from '@/types/order';
import { formatToman } from '@/lib/utils';
import { FileText, Car, GraduationCap, Briefcase } from 'lucide-react';

interface Props {
  formData: OrderFormData;
  updateFields: (fields: Partial<OrderFormData>) => void;
  nextStep: () => void;
}

const services = [
  { id: 'tax', name: 'اظهارنامه و امور مالیاتی', price: 150000, icon: FileText },
  { id: 'traffic', name: 'خدمات خودرو و خلافی', price: 50000, icon: Car },
  { id: 'university', name: 'ثبت‌نام دانشگاه و کنکور', price: 120000, icon: GraduationCap },
  { id: 'insurance', name: 'امور بیمه و تامین اجتماعی', price: 80000, icon: Briefcase },
];

export const StepServiceSelect: React.FC<Props> = ({ formData, updateFields, nextStep }) => {
  const handleSelect = (service: typeof services[0]) => {
    updateFields({ service_type: service.name, amount: service.price });
    nextStep();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 text-right">انتخاب نوع خدمت</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((item) => {
          const Icon = item.icon;
          const isSelected = formData.service_type === item.name;
          const borderClass = isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300';
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={"p-4 rounded-xl border text-right transition flex items-start space-x-3 space-x-reverse " + borderClass}
            >
              <div className="p-2.5 rounded-lg bg-white border border-gray-100 text-blue-600">
                <Icon size={22} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatToman(item.price)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};