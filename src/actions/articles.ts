'use server';

import { supabase } from '@/lib/supabase';
import { Article } from '@/types/article';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/auth';
import { articleInputSchema } from '@/types/contentSchemas';

/**
 * پاکسازی ورودی‌های متنی (Sanitization)
 */
function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

// ۱. دریافت مقالات برای صفحه اصلی (عمومی)
export async function getLatestArticles(limit = 3) {
  const safeLimit = Math.min(Math.max(1, limit), 20);
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, cover_image, is_published, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(safeLimit);

  if (error) return { success: false, error: error.message };
  return { success: true, articles: data as Article[] };
}

// ۲. دریافت کل مقالات برای پنل ادمین (منحصراً ادمین)
export async function getAllArticles() {
  const isAuthorized = await verifyAdminSession();
  if (!isAuthorized) {
    return { success: false, error: 'دسترسی غیرمجاز: نیازمند نشست معتبر مدیریت است.' };
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, articles: data as Article[] };
}

// ۳. ثبت مقاله جدید (منحصراً ادمین با اعتبارسنجی Zod و مقابله با Mass Assignment)
export async function createArticleAction(rawInput: unknown) {
  const isAuthorized = await verifyAdminSession();
  if (!isAuthorized) {
    return { success: false, error: 'دسترسی غیرمجاز: نیازمند نشست معتبر مدیریت است.' };
  }

  // اعتبارسنجی ورودی با Zod
  const validation = articleInputSchema.safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'اطلاعات مقاله نامعتبر است.',
    };
  }

  const valid = validation.data;

  // استخراج فیلدهای مجاز به صورت Whitelist صریح (جلوگیری از Mass Assignment)
  const safePayload = {
    title: sanitizeText(valid.title),
    slug: valid.slug.toLowerCase().trim(),
    excerpt: sanitizeText(valid.excerpt),
    content: sanitizeText(valid.content || ''),
    cover_image: valid.cover_image || '',
    is_published: valid.is_published,
  };

  const { error } = await supabase
    .from('articles')
    .insert([safePayload]);

  if (error) return { success: false, error: error.message };

  // پاک کردن کش برای نمایش فوری مقاله در صفحه اصلی و ادمین
  revalidatePath('/');
  revalidatePath('/admin');

  return { success: true };
}