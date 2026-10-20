import React from 'react';
import { FaqItem } from '@/types/landing';

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-4 my-4" dir="rtl">
      {faqs.map((faq, index) => (
        <details 
          key={index} 
          className="group bg-white border border-gray-200 rounded-2xl p-4 transition-all duration-200 open:border-blue-500 open:shadow-md cursor-pointer"
        >
          <summary className="flex items-center justify-between font-semibold text-gray-800 list-none select-none">
            <span>{faq.question}</span>
            <span className="transition-transform duration-300 group-open:rotate-180 text-blue-600 text-xl font-bold">
              ↓
            </span>
          </summary>
          <div className="mt-3 pt-3 border-t border-gray-100 text-gray-600 leading-relaxed text-sm">
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  );
}