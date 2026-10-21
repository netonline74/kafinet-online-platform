import { cookies, headers } from 'next/headers';
import { verifyHmacToken } from '@/lib/session';

/**
 * بررسی احراز هویت نشست مدیریت در لایه سرور (Server-side Admin Session Verification)
 * این تابع به صورت مستقل و امن در سمت سرور با الگوریتم HMAC SHA-256 و اصل Fail-Closed عمل می‌کند.
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASSWORD;

    // ۱. اصل Fail-Closed: اگر متغیرهای ادمین در محیط تعریف نشده باشند، فوراً رد می‌شود
    if (!adminUser || !adminPass) {
      console.warn('[Security Warning] متغیرهای دسترسی مدیریت در سرور تنظیم نشده‌اند. دسترسی مسدود شد (Fail-Closed).');
      return false;
    }

    // ۲. بررسی کوکی نشست رمزنگاری‌شده مبتنی بر HMAC (admin_session)
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (sessionToken) {
      const { valid, payload } = await verifyHmacToken(sessionToken, adminPass);
      if (valid && payload === adminUser) {
        return true;
      }
    }

    // ۳. بررسی هدر احراز هویت پایه (Basic Authorization) برای درخواست‌های مستقیم
    const headerStore = await headers();
    const authHeader = headerStore.get('authorization');

    if (authHeader) {
      try {
        const authValue = authHeader.split(' ')[1];
        if (authValue) {
          const [user, pwd] = atob(authValue).split(':');
          if (user === adminUser && pwd === adminPass) {
            return true;
          }
        }
      } catch {
        // نادیده گرفتن فرمت نامعتبر
      }
    }

    return false;
  } catch (error) {
    console.error('[Auth Error] خطا در بررسی نشست مدیریت:', error);
    return false;
  }
}

/**
 * الزام احراز هویت ادمین برای عملیات‌های بحرانی
 * در صورت عدم احراز هویت، استثنا (Exception) پرتاب می‌کند.
 */
export async function requireAdminSession(): Promise<void> {
  const isAuthorized = await verifyAdminSession();
  if (!isAuthorized) {
    throw new Error('دسترسی غیرمجاز: برای انجام این عملیات احراز هویت مدیریت الزامی است.');
  }
}
