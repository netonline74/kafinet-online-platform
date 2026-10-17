'use client';

import { useEffect, useState } from 'react';
import { getCategories, getServices } from '@/actions/services';
import { ServiceCategory, Service } from '@/types/service';
import { OrderFormData } from '@/types/order';
import { Label } from '@/components/ui/label';
import { Loader2, LayoutGrid, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';

interface Props {
  formData: OrderFormData;
  updateFields: (fields: Partial<OrderFormData>) => void;
}

export default function Step1Service({ formData, updateFields }: Props) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [catRes, serRes] = await Promise.all([getCategories(), getServices()]);
      if (catRes.success) setCategories(catRes.categories || []);
      if (serRes.success) setServices(serRes.services || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
        <Loader2 className="animate-spin text-blue-600" size={36} />
        <p className="text-sm font-bold text-slate-600">در حال دریافت و آماده‌سازی فهرست خدمات...</p>
      </div>
    );
  }

  // فیلتر کردن خدمات بر اساس دسته‌بندی انتخاب شده
  const filteredServices = services.filter(s => s.category_id === formData.category_id);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFields({ 
      category_id: e.target.value, 
      service_id: '', 
      service_type: '',
      amount: 0,
      selected_service_details: null
    });
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedService = services.find(s => s.id === selectedId);
    
    if (selectedService) {
      updateFields({ 
        service_id: selectedId,
        service_type: selectedService.title,
        amount: selectedService.base_price,
        selected_service_details: selectedService
      });
    }
  };

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500 text-right" dir="rtl">
      
      {/* هدر بولد مرحله اول */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-sm p-6 sm:p-7 shadow-xs flex items-center gap-4">
        <div className="w-13 h-13 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
          <Sparkles className="size-6 text-blue-600" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-0.5">مرحله اول ثبت سفارش</span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            انتخاب دسته‌بندی و نوع خدمت الکترونیک
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ابتدا حوزه موضوعی پرونده و سپس خدمت مورد نظرتان را انتخاب کنید.
          </p>
        </div>
      </div>

      {/* ۱. انتخاب دسته‌بندی */}
      <div className="space-y-2.5">
        <Label htmlFor="category-select" className="text-sm sm:text-base font-extrabold text-slate-900">
          <LayoutGrid className="size-4.5 text-blue-600" />
          <span>۱. حوزه و دسته‌بندی خدمات</span>
          <span className="text-rose-500">*</span>
        </Label>
        
        <div className="relative">
          <select
            id="category-select"
            value={formData.category_id}
            onChange={handleCategoryChange}
            className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-800 shadow-xs transition-all outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 appearance-none cursor-pointer pr-4 pl-10"
          >
            <option value="" disabled>-- لطفاً یک دسته‌بندی را انتخاب کنید --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id} className="py-2 text-slate-800 font-medium">
                {cat.title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ۲. انتخاب خدمت (فقط زمانی نمایش داده می‌شود که دسته‌بندی انتخاب شده باشد) */}
      {formData.category_id && (
        <div className="space-y-2.5 animate-in fade-in duration-300">
          <Label htmlFor="service-select" className="text-sm sm:text-base font-extrabold text-slate-900">
            <CheckCircle2 className="size-4.5 text-emerald-500" />
            <span>۲. عنوان خدمت اختصاصی</span>
            <span className="text-rose-500">*</span>
          </Label>

          <div className="relative">
            <select
              id="service-select"
              value={formData.service_id}
              onChange={handleServiceChange}
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-800 shadow-xs transition-all outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 appearance-none cursor-pointer pr-4 pl-10"
            >
              <option value="" disabled>-- خدمت مورد نظر را انتخاب کنید --</option>
              {filteredServices.map(srv => (
                <option key={srv.id} value={srv.id} className="py-2 text-slate-800 font-medium">
                  {srv.title} {srv.base_price > 0 ? `(${srv.base_price.toLocaleString()} تومان)` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>

          {filteredServices.length === 0 && (
            <p className="text-xs font-bold text-rose-500 mt-2">خدمتی در این دسته‌بندی یافت نشد.</p>
          )}
        </div>
      )}

      {/* نمایش خلاصه خدمت انتخاب شده */}
      {formData.selected_service_details && (
        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-5 mt-6 shadow-xs">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-3 font-normal">
            {formData.selected_service_details.description || 'با انتخاب این خدمت، درخواست شما در سریع‌ترین زمان ممکن توسط کارشناسان ما پردازش خواهد شد.'}
          </p>
          {formData.amount > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-blue-100/80">
              <span className="text-xs font-bold text-slate-500">تعرفه پایه این خدمت:</span>
              <span className="text-base font-black text-slate-900">
                {formData.amount.toLocaleString()} <span className="text-xs font-normal text-slate-500">تومان</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}