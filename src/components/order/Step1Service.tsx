'use client';

import { useEffect, useState } from 'react';
import { getCategories, getServices } from '@/actions/services';
import { ServiceCategory, Service } from '@/types/service';
import { OrderFormData } from '@/types/order';
import { Loader2, LayoutGrid, CheckCircle2 } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
        <Loader2 className="animate-spin" size={32} />
        <p className="text-sm">در حال دریافت لیست خدمات...</p>
      </div>
    );
  }

  // فیلتر کردن خدمات بر اساس دسته‌بندی انتخاب شده
  const filteredServices = services.filter(s => s.category_id === formData.category_id);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // با تغییر دسته‌بندی، خدمت قبلی باید پاک شود
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
    
    // ذخیره همزمان آیدی، نام، قیمت و اطلاعات کامل خدمت (برای نمایش مدارک در مرحله ۳)
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* انتخاب دسته‌بندی */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
          <LayoutGrid size={18} className="text-blue-500" />
          ۱. انتخاب دسته‌بندی
        </label>
        <select
          value={formData.category_id}
          onChange={handleCategoryChange}
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow appearance-none"
        >
          <option value="" disabled>-- لطفاً یک دسته‌بندی را انتخاب کنید --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.title}</option>
          ))}
        </select>
      </div>

      {/* انتخاب خدمت (فقط زمانی نمایش داده می‌شود که دسته‌بندی انتخاب شده باشد) */}
      {formData.category_id && (
        <div className="animate-in fade-in duration-300">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            ۲. انتخاب نوع خدمت
          </label>
          <select
            value={formData.service_id}
            onChange={handleServiceChange}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow appearance-none"
          >
            <option value="" disabled>-- خدمت مورد نظر را انتخاب کنید --</option>
            {filteredServices.map(srv => (
              <option key={srv.id} value={srv.id}>
                {srv.title} {srv.base_price > 0 ? `(${srv.base_price.toLocaleString()} تومان)` : ''}
              </option>
            ))}
          </select>
          {filteredServices.length === 0 && (
            <p className="text-xs text-rose-500 mt-2">خدمتی در این دسته‌بندی یافت نشد.</p>
          )}
        </div>
      )}

      {/* نمایش خلاصه خدمت انتخاب شده */}
      {formData.selected_service_details && (
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mt-6">
          <p className="text-sm text-blue-800 leading-relaxed mb-2">
            {formData.selected_service_details.description || 'با انتخاب این خدمت، درخواست شما در سریع‌ترین زمان ممکن توسط کارشناسان ما پردازش خواهد شد.'}
          </p>
          {formData.amount > 0 && (
            <p className="text-sm font-bold text-slate-800">
              هزینه پایه: <span className="text-blue-600">{formData.amount.toLocaleString()} تومان</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}