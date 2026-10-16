import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');

    // خواندن از متغیرهای محیطی سرور (.env)
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD;

    if (basicAuth && adminPass) {
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

    return new NextResponse('دسترسی غیرمجاز. لطفا نام کاربری و رمز عبور را وارد کنید.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Panel"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
