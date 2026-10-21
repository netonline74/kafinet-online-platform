/**
 * src/lib/rateLimit.ts
 * ماژول پیشرفته محدودسازی نرخ درخواست (Rate Limiting) بر پایه IP
 * دفاع در برابر حملات Brute-Force، اسکن شناسه و DoS
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// حافظه موقت نگهداری نرخ درخواست‌ها (In-Memory Sliding Window Store)
const rateLimitStore = new Map<string, RateLimitRecord>();

// پاکسازی دوره‌ای رکوردهای منقضی‌شده جهت جلوگیری از نشت حافظه (هر ۶۰ ثانیه)
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000);

  // جلوگیری از معلق ماندن پروسس در محیط‌های تست یا بیلد
  if (timer.unref) {
    timer.unref();
  }
}

/**
 * بررسی سهمیه درخواست برای یک کلید مشخص (مانند ip:action)
 * @param key شناسه یکتا (ترکیب IP و نام اکشن)
 * @param maxRequests حداکثر تعداد درخواست مجاز در بازه زمانی
 * @param windowMs طول بازه زمانی به میلی‌ثانیه
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; limit: number; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * استخراج امن آدرس IP کلاینت از هدرهای استاندارد شبکه و پروکسی
 */
export function extractClientIp(headerGetter: { get(name: string): string | null }): string {
  const forwardedFor = headerGetter.get('x-forwarded-for');
  if (forwardedFor) {
    // در صورت وجود زنجیره پروکسی، اولین IP مربوط به کلاینت اصلی است
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = headerGetter.get('x-real-ip');
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  const cfConnectingIp = headerGetter.get('cf-connecting-ip');
  if (cfConnectingIp && cfConnectingIp.trim()) {
    return cfConnectingIp.trim();
  }

  return '127.0.0.1';
}
