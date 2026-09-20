import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';

const vazir = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazir',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'سامانه خدمات الکترونیک کافی‌نت',
  description: 'ثبت و پیگیری آنلاین سفارش‌های اینترنتی و اداری',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
