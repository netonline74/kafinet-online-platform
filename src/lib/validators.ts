// src/lib/validators.ts

/**
 * اعتبارسنجی شماره موبایل ایران
 * فرمت‌های معتبر: 09121234567 یا +989121234567 یا 989121234567
 */
export function isValidIranianMobile(phone: string): boolean {
  const pattern = /^(\+98|0)?9\d{9}$/;
  return pattern.test(phone.trim());
}

/**
 * اعتبارسنجی ریاضی کد ملی ایران بر اساس الگوریتم رقم کنترل (Check Digit)
 */
export function isValidIranianNationalCode(code: string): boolean {
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
