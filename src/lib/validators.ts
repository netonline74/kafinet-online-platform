// src/lib/validators.ts
import { z } from 'zod';

/**
 * اعتبارسنجی شماره موبایل ایران
 * فرمت‌های معتبر: 09121234567 یا +989121234567 یا 989121234567
 */
export function isValidIranianMobile(phone: string): boolean {
  if (!phone) return false;
  const pattern = /^(\+98|0)?9\d{9}$/;
  return pattern.test(phone.trim());
}

/**
 * اعتبارسنجی ریاضی کد ملی ۱۰ رقمی ایران بر اساس الگوریتم رقم کنترل (Check Digit)
 */
export function isValidIranianNationalCode(code: string): boolean {
  if (!code) return false;
  const trimmed = code.trim();

  // بررسی طول ۱۰ رقم و عددی بودن
  if (!/^\d{10}$/.test(trimmed)) return false;

  // کدهای نامعتبر تکراری (مثل 0000000000، 1111111111 و ...)
  const repeatedPatterns = Array.from({ length: 10 }, (_, i) => `${i}`.repeat(10));
  if (repeatedPatterns.includes(trimmed)) return false;

  const checkDigit = parseInt(trimmed[9], 10);
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(trimmed[i], 10) * (10 - i);
  }

  const remainder = sum % 11;

  if (remainder < 2) {
    return checkDigit === remainder;
  }
  return checkDigit === 11 - remainder;
}

/**
 * اعتبارسنجی کد پستی ۱۰ رقمی ایران
 * بدون رقم 0 و 2 در ۵ رقم اول بر اساس استاندارد شرکت ملی پست
 */
export function isValidIranianPostalCode(postalCode: string): boolean {
  if (!postalCode) return false;
  const trimmed = postalCode.trim();
  if (!/^\d{10}$/.test(trimmed)) return false;
  // بررسی عدم شروع با صفر یا دو بر اساس ساختار کد پستی ایران
  if (/^[02]/.test(trimmed)) return false;
  // عدم تکرار یکسان ۱۰ رقم
  if (/^(\d)\1{9}$/.test(trimmed)) return false;
  return true;
}

/**
 * اعتبارسنجی شناسه ملی اشخاص حقوقی / شرکت‌ها (۱۱ رقمی)
 */
export function isValidLegalEntityNationalId(id: string): boolean {
  if (!id) return false;
  const trimmed = id.trim();
  if (!/^\d{11}$/.test(trimmed)) return false;
  return true;
}

/**
 * Zod Schemas قابل استفاده در تمام فرم‌ها
 */
export const iranianNationalCodeSchema = z
  .string()
  .min(1, 'کد ملی را وارد کنید.')
  .refine(isValidIranianNationalCode, {
    message: 'کد ملی ۱۰ رقمی نامعتبر است (کنترل رقم اختصاصی).',
  });

export const iranianMobileSchema = z
  .string()
  .min(1, 'شماره موبایل را وارد کنید.')
  .refine(isValidIranianMobile, {
    message: 'شماره موبایل نامعتبر است (مثال: 09123456789).',
  });

export const iranianPostalCodeSchema = z
  .string()
  .min(1, 'کد پستی ۱۰ رقمی را وارد کنید.')
  .refine(isValidIranianPostalCode, {
    message: 'کد پستی ۱۰ رقمی نامعتبر است.',
  });

export const currencySchema = z
  .union([z.number(), z.string()])
  .transform((val) => {
    if (typeof val === 'number') return val;
    const clean = val.replace(/,/g, '').replace(/[^\d]/g, '');
    return parseInt(clean, 10) || 0;
  })
  .refine((num) => num >= 0, {
    message: 'مبلغ باید مقداری معتبر و مثبت باشد.',
  });

export const fileSchema = z
  .custom<File | null>((val) => val === null || val instanceof File, {
    message: 'فایل انتخابی نامعتبر است.',
  })
  .refine(
    (file) => {
      if (!file) return true;
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      return file.size <= MAX_SIZE;
    },
    { message: 'حجم فایل نباید بیشتر از ۵ مگابایت باشد.' }
  )
  .refine(
    (file) => {
      if (!file) return true;
      const allowed = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];
      return allowed.includes(file.type);
    },
    { message: 'فرمت فایل مجاز نیست (فقط JPG، PNG، PDF یا اکسل).' }
  );
