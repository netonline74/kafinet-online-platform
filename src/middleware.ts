import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  // فقط آدرس‌های پنل ادمین را قفل می‌کنیم
  if (url.pathname.startsWith('/admin')) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // نام کاربری و رمز عبور پنل کافی‌نت
      if (user === 'admin' && pwd === '123456') {
        return NextResponse.next();
      }
    }
    
    // نمایش پاپ‌آپ پیش‌فرض مرورگر برای دریافت رمز
    return new NextResponse('دسترسی غیرمجاز. لطفا نام کاربری و رمز عبور را وارد کنید.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Panel"',
      },
    });
  }

  return NextResponse.next();
}

// تعیین مسیرهایی که این فایل باید روی آن‌ها اعمال شود
export const config = {
  matcher: ['/admin/:path*'],
};