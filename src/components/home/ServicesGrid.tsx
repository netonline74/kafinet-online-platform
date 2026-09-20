'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Service, ServiceCategory } from '@/types/service';
import * as Icons from 'lucide-react';

interface Props {
  categories: ServiceCategory[];
  services: Service[];
}

export default function ServicesGrid({ categories, services }: Props) {
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || '');
  const filteredServices = services.filter(s => s.category_id === activeTab);

  return (
    <section className="py-20 bg-slate-50" id="services">
      <div className="max-w-6xl mx-auto px-4" dir="rtl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">خدمات پرکاربرد ما</h2>
          <p className="text-slate-500">مجموعه‌ای کامل از خدمات الکترونیک متناسب با نیازهای شما</p>
        </div>
        
        {/* نوار تب‌بندی دسته‌بندی‌ها */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide snap-x">
          {categories.map((cat) => {
            const IconComponent = (Icons as any)[cat.icon_name] || Icons.FileText;
            const isActive = activeTab === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`snap-start shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 border outline-none ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <IconComponent size={18} />
                <span className="text-sm whitespace-nowrap">{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* شبکه کارت‌های خدمات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex flex-col h-full group"
            >
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              
              {/* پیش‌نمایش لیست مدارک */}
              {service.required_documents && service.required_documents.length > 0 && (
                <div className="mt-4 mb-6">
                  <p className="text-xs text-slate-400 mb-2 font-medium">مدارک مورد نیاز:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.required_documents.slice(0, 3).map((doc: any, idx: number) => (
                      <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md">
                        {typeof doc === 'string' ? doc : doc.label}
                      </span>
                    ))}
                    {service.required_documents.length > 3 && (
                      <span className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md">
                        +{service.required_documents.length - 3} مورد دیگر
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* بخش پایینی کارت و لینک هدایت به لندینگ */}
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {service.base_price > 0 ? `شروع از ${service.base_price.toLocaleString()} تومان` : 'استعلام هزینه'}
                </span>
                <Link 
                  href={`/services/${service.id}`}
                  className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-1"
                >
                  اطلاعات بیشتر و ثبت
                  <Icons.ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
          
          {filteredServices.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              خدمتی در این دسته‌بندی یافت نشد.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}