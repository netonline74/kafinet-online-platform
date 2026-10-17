'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { OrderItem, OrderStatus } from '@/types/order';
import { orderWizardSchema } from '@/types/orderSchema';

// ۱. ثبت سفارش جدید در دیتابیس (با اعتبارسنجی Zod و تولید کد رهگیری یکتا)
export async function createOrderAction(rawInput: unknown) {
  const inputObj = (rawInput as any) || {};
  const normalizedInput = {
    serviceId: inputObj.serviceId || inputObj.service_id || '',
    fullName: inputObj.fullName || inputObj.full_name || '',
    nationalCode: inputObj.nationalCode || inputObj.national_id || '',
    phoneNumber: inputObj.phoneNumber || inputObj.phone || '',
    description: inputObj.description || '',
  };

  // الف) اعتبارسنجی داده‌های ورودی با Zod
  const validationResult = orderWizardSchema.safeParse(normalizedInput);
  if (!validationResult.success) {
    const issue = validationResult.error.issues[0];
    return {
      success: false,
      error: issue ? issue.message : 'اطلاعات وارد شده نامعتبر است.',
    };
  }

  const validData = validationResult.data;

  // ب) الگوریتم تولید کد رهگیری یکتا
  let trackingCode = '';
  let isUnique = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 10;

  while (!isUnique && attempts < MAX_ATTEMPTS) {
    trackingCode = 'CN-' + Math.floor(100000 + Math.random() * 900000).toString();

    const { data: existingOrder, error: checkError } = await supabase
      .from('orders')
      .select('id')
      .eq('tracking_code', trackingCode)
      .maybeSingle();

    if (checkError) {
      return { success: false, error: 'خطای سیستمی در بررسی وضعیت یکتا بودن کد رهگیری.' };
    }

    if (!existingOrder) {
      isUnique = true;
    }

    attempts++;
  }

  if (!isUnique) {
    return { success: false, error: 'ترافیک سیستم بالاست. لطفاً چند لحظه دیگر دوباره تلاش کنید.' };
  }

  // ج) ذخیره داده‌های اعتبارسنجی‌شده در جدول orders
  const { data: insertedData, error } = await supabase
    .from('orders')
    .insert([
      {
        service_id: validData.serviceId,
        service_type: inputObj.service_type || 'خدمات اینترنتی',
        full_name: validData.fullName,
        national_id: validData.nationalCode,
        national_code: validData.nationalCode,
        phone: validData.phoneNumber,
        phone_number: validData.phoneNumber,
        description: validData.description || null,
        amount: inputObj.amount || 0,
        file_urls: inputObj.file_urls || [],
        tracking_code: trackingCode,
        status: 'pending' as OrderStatus,
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // د) به‌روزرسانی کش پنل ادمین
  revalidatePath('/admin');
  return { success: true, trackingCode, order: insertedData as OrderItem };
}

// ۲. دریافت اطلاعات سفارش برای صفحه پیگیری مشتری
export async function getOrderByTrackingCode(trackingCode: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('tracking_code', trackingCode)
    .single();

  if (error) {
    return { success: false, error: 'سفارشی با این کد رهگیری یافت نشد.' };
  }

  return { success: true, order: data as OrderItem };
}

// ۳. دریافت لیست کل سفارشات برای پنل مدیریت
export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, orders: data as OrderItem[] };
}

// ۴. تغییر وضعیت سفارش توسط ادمین
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  // آپدیت کردن کش پنل مدیریت و صفحه پیگیری
  revalidatePath('/admin');
  revalidatePath('/track');
  return { success: true };
}

// ۵. تابع بازگشت به عقب (Rollback) برای پاک کردن فایل‌های یتیم هنگام بروز خطا
export async function rollbackFilesAction(filePaths: string[]) {
  if (!filePaths || filePaths.length === 0) return { success: true };

  const { error } = await supabase.storage
    .from('order-documents')
    .remove(filePaths);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ۶. تولید لینک موقت امضاشده (Signed URL) برای فایل‌های باکت order-documents
// دسترسی موقت ۱۵ دقیقه‌ای (۹۰۰ ثانیه) بدون ایجاد لینک عمومی مستقیم
export async function getOrderDocumentSignedUrlAction(filePath: string, expiresIn: number = 900) {
  try {
    if (!filePath) {
      return { success: false, error: 'مسیر فایل مشخص نشده است.' };
    }

    // نرمال‌سازی مسیر فایل در صورتی که URL یا پیشوند فرستاده شده باشد
    let cleanPath = filePath;
    if (cleanPath.includes('order-documents/')) {
      cleanPath = cleanPath.split('order-documents/')[1];
    } else if (cleanPath.includes('/uploads/')) {
      cleanPath = 'uploads/' + cleanPath.split('/uploads/')[1];
    }
    // حذف اسلش ابتدا یا پارامترهای کوئری احتمالی
    cleanPath = cleanPath.replace(/^\/+/, '').split('?')[0];

    // فراخوانی متد استاندارد createSignedUrl سوپابیس با زمان انقضا (پیش‌فرض ۱۵ دقیقه = ۹۰۰ ثانیه)
    const { data, error } = await supabase.storage
      .from('order-documents')
      .createSignedUrl(cleanPath, expiresIn);

    if (error || !data?.signedUrl) {
      return { 
        success: false, 
        error: error?.message || 'خطا در صدور لینک امضاشده از مخزن اسناد.' 
      };
    }

    return { 
      success: true, 
      signedUrl: data.signedUrl,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
    };
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'خطای غیرمنتظره در تولید لینک امن موقت.' 
    };
  }
}
