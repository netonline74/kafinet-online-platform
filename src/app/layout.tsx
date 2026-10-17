import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazir',
  weight: ['400', '500', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'سامانه خدمات الکترونیک کافی‌نت | ثبت و پیگیری آنلاین',
  description: 'سامانه جامع ثبت و پیگیری آنلاین سفارش‌های اینترنتی، امور مالیاتی، ملکی و اداری با پاسخگویی لحظه‌ای',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={cn(vazirmatn.variable, vazirmatn.className)}>
      <body className={cn(vazirmatn.className, "font-sans antialiased bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900")}>
        {children}
      </body>
    </html>
  );
}
