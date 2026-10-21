'use server';

import crypto from 'crypto';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { OrderItem, OrderStatus } from '@/types/order';
import { orderWizardSchema } from '@/types/orderSchema';
import { verifyAdminSession } from '@/lib/auth';
import { servicesConfig } from '@/config/services-config';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';

/**
 * تولید کد رهگیری رمزنگاری‌شده و غیرقابل حدس با استفاده از CSPRNG بومی Node.js
 * جلوگیری از پیش‌بینی‌پذیری الگوریتم Math.random و حملات حدس متوالی
 */
function generateCryptographicallySecureTrackingCode(): string {
  // استفاده از randomInt بدون modulo bias بین ۱۰۰,۰۰۰ تا ۹۹۹,۹۹۹
  const secureRandom = crypto.randomInt(100000, 1000000);
  return `CN-${secureRandom}`;
}

// ۱. ثبت سفارش جدید در دیتابیس (با استخراج قیمت در سمت سرور، آنتروپی بالای کد رهگیری و اعتبارسنجی Zod)
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

  // ب) استخراج قطعی و امن قیمت در سمت سرور (بی‌اثر کردن مبلغ ارسالی کلاینت)
  let calculatedPrice = 0;
  let serviceTitle = inputObj.service_type || 'خدمات اینترنتی';

  // ۱. بررسی در کانفیگ جامع خدمات (servicesConfig)
  const foundConfig = servicesConfig.find(
    (s) => s.slug === validData.serviceId || s.title === validData.serviceId
  );

  if (foundConfig) {
    calculatedPrice = foundConfig.basePrice || 0;
    serviceTitle = foundConfig.title;
  } else {
    // ۲. بررسی در جدول خدمات دیتابیس (services) در صورت عدم وجود در فایل کانفیگ
    try {
      const { data: dbService } = await supabase
        .from('services')
        .select('base_price, title')
        .eq('id', validData.serviceId)
        .maybeSingle();

      if (dbService) {
        calculatedPrice = Number(dbService.base_price) || 0;
        serviceTitle = dbService.title || serviceTitle;
      }
    } catch (dbErr) {
      console.warn('[Order Price Lookup] خطا در واکشی قیمت از دیتابیس:', dbErr);
    }
  }

  // ج) الگوریتم تولید کد رهگیری یکتا با آنتروپی رمزنگاری‌شده (CSPRNG)
  let trackingCode = '';
  let isUnique = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 10;

  while (!isUnique && attempts < MAX_ATTEMPTS) {
    trackingCode = generateCryptographicallySecureTrackingCode();

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

  // د) ذخیره داده‌های اعتبارسنجی‌شده در جدول orders (با مبلغ سرور و فیلتر ورودی)
  const { data: insertedData, error } = await supabase
    .from('orders')
    .insert([
      {
        service_id: validData.serviceId,
        service_type: serviceTitle,
        full_name: validData.fullName,
        national_id: validData.nationalCode,
        national_code: validData.nationalCode,
        phone: validData.phoneNumber,
        phone_number: validData.phoneNumber,
        description: validData.description || null,
        amount: calculatedPrice, // منحصراً مبلغ محاسبه‌شده در سمت سرور
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

  // هـ) به‌روزرسانی کش پنل ادمین
  revalidatePath('/admin');
  return { success: true, trackingCode, order: insertedData as OrderItem };
}

// ۲. دریافت اطلاعات سفارش برای صفحه پیگیری مشتری (محدود به Rate Limiting و بدون نشت داده‌های هویتی)
export async function getOrderByTrackingCode(trackingCode: string) {
  if (!trackingCode || typeof trackingCode !== 'string') {
    return { success: false, error: 'کد رهگیری نامعتبر است.' };
  }

  // الف) محدودسازی نرخ استعلام بر مبنای IP جهت جلوگیری از حملات Brute-Force و حدس کدهای پیگیری
  const headerStore = await headers();
  const clientIp = extractClientIp(headerStore);
  const rateLimit = checkRateLimit(`track:${clientIp}`, 20, 60 * 1000); // حداکثر ۲۰ استعلام در دقیقه

  if (!rateLimit.success) {
    return {
      success: false,
      error: `تعداد درخواست‌های استعلام شما بیش از حد مجاز است. لطفاً پس از ${rateLimit.resetInSeconds} ثانیه مجدداً تلاش نمایید.`,
    };
  }

  const cleanCode = trackingCode.trim().toUpperCase();

  // ب) واکشی فقط ستون‌های غیرحساس و موردنیاز عمومی (جلوگیری از نشت کدملی، شماره تلفن و اسناد آپلودشده)
  const { data, error } = await supabase
    .from('orders')
    .select('id, tracking_code, service_id, service_type, full_name, amount, status, description, created_at')
    .eq('tracking_code', cleanCode)
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: 'سفارشی با این کد رهگیری یافت نشد.' };
  }

  // ج) پروجکشن خروجی جهت تضمین عدم حضور کدملی، تلفن و مسیر فایل‌ها در پاسخ به کلاینت
  const sanitizedOrder: Partial<OrderItem> = {
    id: data.id,
    tracking_code: data.tracking_code,
    service_id: data.service_id,
    service_type: data.service_type,
    full_name: data.full_name,
    amount: data.amount,
    status: data.status,
    description: data.description,
    created_at: data.created_at,
  };

  return { success: true, order: sanitizedOrder as OrderItem };
}

// ۳. دریافت لیست کل سفارشات برای پنل مدیریت (منوط به احراز هویت ادمین)
export async function getAllOrders() {
  const isAuthorized = await verifyAdminSession();
  if (!isAuthorized) {
    return {
      success: false,
      error: 'دسترسی غیرمجاز: برای مشاهده لیست سفارشات، نشست مدیریت الزامی است.',
    };
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, orders: data as OrderItem[] };
}

// ۴. تغییر وضعیت سفارش توسط ادمین (منوط به احراز هویت ادمین)
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const isAuthorized = await verifyAdminSession();
  if (!isAuthorized) {
    return {
      success: false,
      error: 'دسترسی غیرمجاز: تغییر وضعیت سفارش نیازمند دسترسی مدیریت است.',
    };
  }

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
    .from('documents')
    .remove(filePaths);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ۶. تولید لینک موقت امضاشده (Signed URL) ۱۰ دقیقه‌ای برای مدارک (منوط به احراز هویت معتبر ادمین)
export async function getOrderDocumentSignedUrlAction(filePath: string, expiresIn: number = 600) {
  try {
    // محدودسازی قطعی به نشست ادمین در سمت سرور
    const isAuthorized = await verifyAdminSession();
    if (!isAuthorized) {
      return {
        success: false,
        error: 'دسترسی غیرمجاز: صدور لینک امضاشده اسناد منوط به احراز هویت معتبر مدیریت است.',
      };
    }

    if (!filePath) {
      return { success: false, error: 'مسیر فایل مشخص نشده است.' };
    }

    // نرمال‌سازی مسیر فایل در صورتی که URL کامل، باکت یا پیشوندهای مختلف ارسال شده باشد
    let cleanPath = filePath;
    if (cleanPath.includes('documents/')) {
      cleanPath = cleanPath.split('documents/')[1];
    } else if (cleanPath.includes('order-documents/')) {
      cleanPath = cleanPath.split('order-documents/')[1];
    } else if (cleanPath.includes('/uploads/')) {
      cleanPath = 'uploads/' + cleanPath.split('/uploads/')[1];
    }
    cleanPath = cleanPath.replace(/^\/+/, '').split('?')[0];

    // تولید لینک موقت امضاشده در باکت documents با انقضای ۱۰ دقیقه (۶۰۰ ثانیه)
    const { data, error } = await supabase.storage
      .from('documents')
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