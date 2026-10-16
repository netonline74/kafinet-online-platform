import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ۱. فعال‌سازی خروجی استندالون برای اجرای سبک و سریع با PM2/Node روی VPS
  output: "standalone",

  // ۲. خاموش کردن هدر x-powered-by به دلایل امنیتی
  poweredByHeader: false,

  // ۳. فشرده‌سازی خودکار کدهای ارسالی به مرورگر
  compress: true,

  // ۴. بهینه‌سازی تصاویر (تنظیم دامنه‌ها و فرمت‌های مدرن)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
