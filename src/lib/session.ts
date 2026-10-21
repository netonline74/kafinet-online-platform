/**
 * session.ts
 * مدیریت توکن‌های نشست امن مبتنی بر HMAC SHA-256 با وب کریپتو API بومی
 * سازگار با Edge Middleware و Server Actions در Next.js
 */

const SESSION_EXPIRATION_MS = 24 * 60 * 60 * 1000; // ۲۴ ساعت اعتبار

/**
 * ایجاد توکن نشست امضاشده با HMAC SHA-256
 * ساختار توکن: base64(payload).timestamp.signatureHex
 */
export async function createHmacToken(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const timestamp = Date.now().toString();
  const dataToSign = `${payload}:${timestamp}`;
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToSign));

  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const encodedPayload = Buffer.from(payload, 'utf-8').toString('base64url');
  return `${encodedPayload}.${timestamp}.${signatureHex}`;
}

/**
 * اعتبارسنجی توکن نشست HMAC و بررسی انقضا
 */
export async function verifyHmacToken(
  token: string,
  secret: string
): Promise<{ valid: boolean; payload?: string }> {
  try {
    if (!token || !secret) return { valid: false };

    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };

    const [encodedPayload, timestampStr, signatureHex] = parts;
    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) return { valid: false };

    // بررسی زمان انقضا و جلوگیری از توکن‌های زمان آینده
    const now = Date.now();
    if (now - timestamp > SESSION_EXPIRATION_MS || timestamp > now + 60000) {
      return { valid: false };
    }

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const dataToVerify = `${payload}:${timestampStr}`;
    const signatureBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encoder.encode(dataToVerify)
    );

    return { valid: isValid, payload: isValid ? payload : undefined };
  } catch {
    return { valid: false };
  }
}
