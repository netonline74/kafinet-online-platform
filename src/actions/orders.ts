'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { OrderItem, OrderStatus } from '@/types/order';

// ۱. ثبت سفارش جدید در دیتابیس (با الگوریتم تولید کد یکتا)
export async function createOrderAction(data: any) {
  let trackingCode = '';
  let isUnique = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 10;

  // حلقه بررسی یکتا بودن کد رهگیری
  while (!isUnique && attempts < MAX_ATTEMPTS) {
    // تولید کد تصادفی ۶ رقمی
    trackingCode = 'CN-' + Math.floor(100000 + Math.random() * 900000).toString();
    
    // بررسی دیتابیس برای پیدا کردن کد مشابه
    const { data: existingOrder, error: checkError } = await supabase
      .from('orders')
      .select('id')
      .eq('tracking_code', trackingCode)
      .maybeSingle(); // اگر رکوردی نباشد، null برمی‌گرداند

    if (checkError) {
      return { success: false, error: 'خطای سیستمی در بررسی وضعیت یکتا بودن کد رهگیری.' };
    }

    // اگر existingOrder خالی باشد (null)، یعنی کد در دیتابیس نیست و یکتاست
    if (!existingOrder) {
      isUnique = true;
    }
    
    attempts++;
  }

  // اگر بعد از 10 بار تلاش نتوانست کد یکتا بسازد (بسیار نادر)
  if (!isUnique) {
    return { success: false, error: 'ترافیک سیستم بالاست. لطفاً چند لحظه دیگر دوباره تلاش کنید.' };
  }

  // ثبت سفارش با کد رهگیری اختصاصی و یکتا
  const { data: insertedData, error } = await supabase
    .from('orders')
    .insert([{ ...data, tracking_code: trackingCode, status: 'pending' }])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // پاک کردن کش برای آپدیت در لحظه‌ی پنل ادمین
  revalidatePath('/admin');
  return { success: true, trackingCode };
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

  // آپدیت کردن کش پنل مدیریت و صفحه پیگیری تا تغییرات بلافاصله اعمال شوند
  revalidatePath('/admin');
  revalidatePath('/track');
  return { success: true };
}

// ۵. تابع بازگشت به عقب (Rollback) برای پاک کردن فایل‌های یتیم هنگام بروز خطا
export async function rollbackFilesAction(filePaths: string[]) {
  if (!filePaths || filePaths.length === 0) return { success: true };
  
  const { error } = await supabase.storage
    .from('order-files')
    .remove(filePaths);

  if (error) return { success: false, error: error.message };
  return { success: true };
}