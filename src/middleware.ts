import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');

    // خواندن از متغیرهای محیطی سرور (.env)
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASSWORD;

    // اگر متغیرهای ادمین مشخص شده باشند، احراز هویت را بررسی کن
    if (adminUser && adminPass) {
      if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        try {
          const [user, pwd] = atob(authValue).split(':');

          if (user === adminUser && pwd === adminPass) {
            return NextResponse.next();
          }
        } catch {
          // در صورت ارسال هدر نامعتبر
        }
      }

      // بررسی کوکی یا پارامتر امن جهت جلوگیری از بلاک شدن پرامپت در آی‌فریم
      const authCookie = req.cookies.get('admin_auth')?.value;
      if (authCookie === 'true' || url.searchParams.get('admin_key') === adminPass) {
        const res = NextResponse.next();
        res.cookies.set('admin_auth', 'true', { path: '/', httpOnly: true, sameSite: 'lax' });
        return res;
      }

      return new NextResponse('دسترسی غیرمجاز. لطفا نام کاربری و رمز عبور را وارد کنید.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Panel"',
        },
      });
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
