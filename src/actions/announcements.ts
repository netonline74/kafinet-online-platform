'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/auth';
import { announcementInputSchema, announcementIdSchema } from '@/types/contentSchemas';

/**
 * پاکسازی ورودی‌های متنی (Sanitization)
 * حذف تگ‌های خطرناک HTML/Script و کاراکترهای مخرب احتمالی
 */
function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

// ۱. دریافت اطلاعیه‌های فعال (عمومی برای صفحه اصلی)
export async function getActiveAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('id, title, description, category, urgency_level, deadline, action_link, is_active, created_at')
    .eq('is_active', true)
    .or(`deadline.is.null,deadline.gte.${new Date().toISOString()}`)
    .order('created_at', { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, announcements: data || [] };
}

// ۲. ثبت اطلاعیه جدید (منحصراً ادمین با اعتبارسنجی Zod و مقابله با Mass Assignment)
export async function createAnnouncementAction(rawInput: unknown) {
  const isAuthorized = await verifyAdminSession();
  if (!isAuthorized) {
    return { success: false, error: 'دسترسی غیرمجاز: نیازمند نشست معتبر مدیریت است.' };
  }

  // اعتبارسنجی با Zod
  const validation = announcementInputSchema.safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'اطلاعات اطلاعیه نامعتبر است.',
    };
  }

  const valid = validation.data;

  // پاکسازی متون و ساخت شیء امن جهت درج مستقیم در دیتابیس (Whitelist دقیق فیلدها)
  const safePayload = {
    title: sanitizeText(valid.title),
    description: sanitizeText(valid.description || ''),
    category: sanitizeText(valid.category),
    urgency_level: valid.urgency_level,
    deadline: valid.deadline ? new Date(valid.deadline).toISOString() : null,
    action_link: sanitizeText(valid.action_link || ''),
    is_active: true,
  };

  const { error } = await supabase.from('announcements').insert([safePayload]);
  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// ۳. ویرایش اطلاعیه (منحصراً ادمین با اعتبارسنجی Zod و فیلتر فیلدها)
export async function updateAnnouncementAction(rawId: string, rawInput: unknown) {
  const isAuthorized = await verifyAdminSession();
  if (!isAuthorized) {
    return { success: false, error: 'دسترسی غیرمجاز: نیازمند نشست معتبر مدیریت است.' };
  }

  const idValidation = announcementIdSchema.safeParse(rawId);
  if (!idValidation.success) {
    return { success: false, error: 'شناسه اطلاعیه نامعتبر است.' };
  }

  const validation = announcementInputSchema.partial().safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'اطلاعات ارسالی نامعتبر است.',
    };
  }

  const valid = validation.data;
  const updatePayload: Record<string, any> = {};

  if (valid.title !== undefined) updatePayload.title = sanitizeText(valid.title);
  if (valid.description !== undefined) updatePayload.description = sanitizeText(valid.description);
  if (valid.category !== undefined) updatePayload.category = sanitizeText(valid.category);
  if (valid.urgency_level !== undefined) updatePayload.urgency_level = valid.urgency_level;
  if (valid.deadline !== undefined) {
    updatePayload.deadline = valid.deadline ? new Date(valid.deadline).toISOString() : null;
  }
  if (valid.action_link !== undefined) updatePayload.action_link = sanitizeText(valid.action_link);

  const { error } = await supabase
    .from('announcements')
    .update(updatePayload)
    .eq('id', idValidation.data);

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// ۴. حذف اطلاعیه (منحصراً ادمین با اعتبارسنجی شناسه)
export async function deleteAnnouncementAction(rawId: string) {
  const isAuthorized = await verifyAdminSession();
  if (!isAuthorized) {
    return { success: false, error: 'دسترسی غیرمجاز: نیازمند نشست معتبر مدیریت است.' };
  }

  const idValidation = announcementIdSchema.safeParse(rawId);
  if (!idValidation.success) {
    return { success: false, error: 'شناسه اطلاعیه نامعتبر است.' };
  }

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', idValidation.data);

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}