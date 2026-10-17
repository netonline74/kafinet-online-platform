'use client';

import { useState } from 'react';
import { OrderFormData } from '@/types/order';
import { createOrderAction, rollbackFilesAction } from '@/actions/orders';

// مقادیر اولیه شامل فیلدهای داینامیک متنی و فایلی
const initialData: OrderFormData = {
  category_id: '',
  service_id: '',
  service_type: '', 
  full_name: '',
  national_id: '',
  phone: '',
  description: '',
  amount: 0,
  files: [], // برای حفظ سازگاری با نسخه‌های قبل
  dynamic_texts: {}, // نگهداری مقادیر فیلدهای متنی داینامیک
  dynamic_files: {}, // نگهداری فایل‌های آپلودی داینامیک
};

export function useOrderWizard() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<OrderFormData>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const updateFields = (fields: Partial<OrderFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    if (error) setError(null);
  };

  const nextStep = () => {
    // اعتبارسنجی مرحله ۱: انتخاب خدمت
    if (step === 1) {
      if (!formData.category_id || !formData.service_id) {
        setError('لطفاً دسته‌بندی و نوع خدمت مورد نظر خود را انتخاب کنید.');
        return;
      }
      setError(null);
    }

    // اعتبارسنجی مرحله ۲: اطلاعات فردی
    if (step === 2) {
      if (formData.full_name.trim().length < 3) {
        setError('لطفاً نام و نام خانوادگی خود را کامل وارد کنید.');
        return;
      }
      if (!/^[0-9]{10}$/.test(formData.national_id)) {
        setError('کد ملی باید دقیقاً ۱۰ رقم باشد.');
        return;
      }
      if (!/^09[0-9]{9}$/.test(formData.phone)) {
        setError('شماره موبایل نامعتبر است (مثال: 09123456789).');
        return;
      }
      setError(null);
    }
    
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const submitOrder = async () => {
    // --- اعتبارسنجی فیلدهای داینامیک مرحله ۳ قبل از آپلود ---
    const requiredDocs = formData.selected_service_details?.required_documents || [];
    for (const doc of requiredDocs) {
      if (doc.is_required) {
        if (doc.type === 'text' && !formData.dynamic_texts[doc.id]) {
          setError(`لطفاً فیلد "${doc.label}" را پر کنید.`);
          return; // متوقف کردن ارسال تا پر شدن فیلد اجباری
        }
        if (doc.type === 'file' && !formData.dynamic_files[doc.id]) {
          setError(`لطفاً فایل "${doc.label}" را آپلود کنید.`);
          return; // متوقف کردن ارسال تا آپلود فایل اجباری
        }
      }
    }
    
    setLoading(true);
    setError(null);
    const successfullyUploadedPaths: string[] = [];

    try {
      const fileUrls: string[] = [];
      
      // ۱. آپلود فایل‌های داینامیک از طریق روت امن /api/upload
      const dynamicFileEntries = Object.values(formData.dynamic_files);
      for (const file of dynamicFileEntries) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || 'خطا در بارگذاری مدارک.');
        }

        fileUrls.push(uploadData.filePath);
        successfullyUploadedPaths.push(uploadData.filePath);
      }

      // ۲. چسباندن فیلدهای متنی داینامیک به فیلد توضیحات برای نمایش به ادمین
      let finalDescription = formData.description;
      if (Object.keys(formData.dynamic_texts).length > 0) {
        const extraData = Object.entries(formData.dynamic_texts)
          .map(([key, val]) => {
            const label = requiredDocs.find(d => d.id === key)?.label || key;
            return `${label}: ${val}`;
          }).join('\n');
        
        // ترکیب توضیحات کاربر با دیتای داینامیک
        finalDescription = finalDescription 
          ? `${finalDescription}\n\n--- اطلاعات تکمیلی ---\n${extraData}` 
          : `--- اطلاعات تکمیلی ---\n${extraData}`;
      }

      // ۳. ثبت اطلاعات نهایی در دیتابیس
      const res = await createOrderAction({
        category_id: formData.category_id,
        service_id: formData.service_id,
        service_type: formData.service_type,
        full_name: formData.full_name,
        national_id: formData.national_id,
        phone: formData.phone,
        description: finalDescription, // ارسال توضیحات غنی‌شده
        amount: formData.amount,
        file_urls: fileUrls,
      });

      // ۴. بررسی نتیجه دیتابیس و اجرای Rollback در صورت خطا
      if (!res.success) {
        if (successfullyUploadedPaths.length > 0) {
          await rollbackFilesAction(successfullyUploadedPaths);
        }
        setError(res.error || 'خطایی در سرور دیتابیس رخ داد.');
      } else if (res.trackingCode) {
        setTrackingCode(res.trackingCode);
        setStep(4); // نمایش کد رهگیری
      }

    } catch (err: any) {
      // ۵. اجرای مکانیزم ایمنی (Rollback) در صورت قطعی اینترنت
      if (successfullyUploadedPaths.length > 0) {
        await rollbackFilesAction(successfullyUploadedPaths);
      }
      setError(err.message || 'خطای سیستمی در پردازش اطلاعات.');
    } finally {
      setLoading(false);
    }
  };

  return {
    step, formData, loading, error, trackingCode,
    updateFields, nextStep, prevStep, submitOrder,
  };
}