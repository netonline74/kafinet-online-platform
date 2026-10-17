import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// حداکثر حجم مجاز: ۵ مگابایت (۵ * ۱۰۲۴ * ۱۰۲۴ بایت)
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// لیست MIME-Type های مجاز اعلامی و واقعی (فقط JPG, PNG, PDF)
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'application/pdf',
  'application/x-pdf',
]);

/**
 * تشخیص MIME-Type واقعی بر اساس Magic Numbers / بایت‌های باینری ابتدای فایل
 * جهت جلوگیری از فیک کردن پسوند (File Extension Spoofing) و حملات امنیتی Polyglot
 */
function detectRealMimeType(buffer: Buffer): { mimeType: string; extension: string } | null {
  if (buffer.length < 4) {
    return null;
  }

  // ۱. بررسی فرمت JPEG/JPG: سه بایت اول برابر 0xFF 0xD8 0xFF
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { mimeType: 'image/jpeg', extension: 'jpg' };
  }

  // ۲. بررسی فرمت PNG: هشت بایت اول برابر 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mimeType: 'image/png', extension: 'png' };
  }

  // ۳. بررسی فرمت PDF: چهار بایت اول با 0x25 0x50 0x44 0x46 (%PDF) شروع می‌شود
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x25 && // %
    buffer[1] === 0x50 && // P
    buffer[2] === 0x44 && // D
    buffer[3] === 0x46    // F
  ) {
    return { mimeType: 'application/pdf', extension: 'pdf' };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    // ۱. بررسی وجود فایل
    if (!file) {
      return NextResponse.json(
        { error: 'فایلی جهت بارگذاری ارسال نشده است.' },
        { status: 400 }
      );
    }

    // ۲. کنترل فایل خالی
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'فایل ارسالی خالی است.' },
        { status: 400 }
      );
    }

    // ۳. کنترل حجم فایل در سرور (حداکثر ۵ مگابایت)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { 
          error: `حجم فایل (${fileSizeMB} مگابایت) بیش از حد مجاز است. حداکثر حجم فایل ۵ مگابایت می‌باشد.` 
        },
        { status: 400 }
      );
    }

    // ۴. تبدیل محتوای فایل به Buffer برای بازرسی امنیتی عمیق بایت‌ها
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ۵. اعتبارسنجی نوع فایل بر اساس MIME-Type واقعی (Magic Bytes)
    const detected = detectRealMimeType(buffer);
    if (!detected) {
      return NextResponse.json(
        { 
          error: 'فرمت فایل مجاز نیست. فقط فایل‌های JPG، PNG و PDF مورد پذیرش هستند.' 
        },
        { status: 400 }
      );
    }

    // ۶. تطبیق نوع گزارش‌شده مرورگر با لیست سفید
    if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json(
        { 
          error: 'نوع رسانه ارسالی با فرمت مجاز همخوانی ندارد. فقط تصاویر JPG/PNG و فایل‌های PDF مجاز هستند.' 
        },
        { status: 400 }
      );
    }

    // ۷. ساخت نام امن و ذخیره در باکت امن order-documents سوپابیس
    const safeRandom = Math.random().toString(36).substring(2, 10);
    const timestamp = Date.now();
    const sanitizedOriginalName = file.name
      ? file.name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 50)
      : 'document';
    
    const fileName = `${timestamp}-${safeRandom}-${sanitizedOriginalName}.${detected.extension}`;
    const filePath = `uploads/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('order-documents')
      .upload(filePath, buffer, {
        contentType: detected.mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error('[Upload Error]', uploadError);
      return NextResponse.json(
        { error: `خطا در ذخیره‌سازی فایل در مخزن امن: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // پاسخ امن موفقیت‌آمیز شامل مسیر فایل در باکت order-documents
    return NextResponse.json({
      success: true,
      filePath: uploadData?.path || filePath,
      fileName,
      mimeType: detected.mimeType,
      size: file.size,
      bucket: 'order-documents',
    });

  } catch (error: any) {
    console.error('[Upload API Exception]', error);
    return NextResponse.json(
      { error: error.message || 'خطای غیرمنتظره در سرور آپلود فایل رخ داد.' },
      { status: 500 }
    );
  }
}

// متد GET برای تولید لینک امضاشده موقت (Signed URL) از طریق API در صورت نیاز کلاینت یا پنل
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get('path');
    const expiresInParam = searchParams.get('expiresIn');
    // پیش‌فرض ۱۵ دقیقه = ۹۰۰ ثانیه
    const expiresIn = expiresInParam ? parseInt(expiresInParam, 10) : 900;

    if (!filePath) {
      return NextResponse.json(
        { error: 'پارامتر path الزامی است.' },
        { status: 400 }
      );
    }

    // پاکسازی مسیر
    let cleanPath = filePath;
    if (cleanPath.includes('order-documents/')) {
      cleanPath = cleanPath.split('order-documents/')[1];
    } else if (cleanPath.includes('/uploads/')) {
      cleanPath = 'uploads/' + cleanPath.split('/uploads/')[1];
    }
    cleanPath = cleanPath.replace(/^\/+/, '').split('?')[0];

    const { data, error } = await supabase.storage
      .from('order-documents')
      .createSignedUrl(cleanPath, expiresIn);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: error?.message || 'خطا در تولید لینک امضاشده.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'خطای سیستمی' },
      { status: 500 }
    );
  }
}
