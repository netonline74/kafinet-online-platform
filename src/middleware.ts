import { NextRequest, NextResponse } from 'next/server';
import { createHmacToken, verifyHmacToken } from '@/lib/session';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // حفاظت از کلیه مسیرهای بخش مدیریت (/admin)
  if (url.pathname.startsWith('/admin')) {
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASSWORD;

    // ۱. منطق Fail-Closed: اگر متغیرهای احراز هویت تنظیم نشده باشند، فوراً دسترسی مسدود می‌شود
    if (!adminUser || !adminPass) {
      return new NextResponse(
        'خطای امنیتی: متغیرهای محیطی دسترسی مدیریت تنظیم نشده‌اند. دسترسی طبق اصل Fail-Closed مسدود شد.',
        {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        }
      );
    }

    // ۲. بررسی توکن سشن رمزنگاری‌شده مبتنی بر HMAC در کوکی (بدون پذیرش هرگونه کوکی ساده یا admin_key)
    const sessionCookie = req.cookies.get('admin_session')?.value;
    if (sessionCookie) {
      const { valid, payload } = await verifyHmacToken(sessionCookie, adminPass);
      if (valid && payload === adminUser) {
        return NextResponse.next();
      }
    }

    // ۳. بررسی احراز هویت استاندارد پایه (HTTP Basic Authentication)
    const basicAuth = req.headers.get('authorization');
    if (basicAuth) {
      try {
        const authValue = basicAuth.split(' ')[1];
        if (authValue) {
          const [user, pwd] = atob(authValue).split(':');

          if (user === adminUser && pwd === adminPass) {
            // تولید توکن نشست امن HMAC با انقضای ۲۴ ساعته
            const sessionToken = await createHmacToken(adminUser, adminPass);
            const res = NextResponse.next();

            // تنظیم کوکی نشست با تمام فلگ‌های حفاظتی اجباری
            res.cookies.set('admin_session', sessionToken, {
              path: '/',
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
              maxAge: 60 * 60 * 24, // ۲۴ ساعت
            });

            return res;
          }
        }
      } catch {
        // نادیده گرفتن فرمت نادرست هدر
      }
    }

    // ۴. در صورت عدم احراز هویت، صدور درخواست لاگین امن HTTP Basic
    return new NextResponse('دسترسی غیرمجاز. لطفاً نام کاربری و رمز عبور مدیریت را وارد کنید.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Panel - Secure Portal"',
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
