'use server';

import { supabase } from '@/lib/supabase';
import { Article } from '@/types/article';
import { revalidatePath } from 'next/cache';

// دریافت مقالات برای صفحه اصلی
export async function getLatestArticles(limit = 3) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return { success: false, error: error.message };
  return { success: true, articles: data as Article[] };
}

// دریافت کل مقالات برای پنل ادمین
export async function getAllArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, articles: data as Article[] };
}

// ثبت مقاله جدید
export async function createArticleAction(formData: {
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
}) {
  const { error } = await supabase
    .from('articles')
    .insert([formData]);

  if (error) return { success: false, error: error.message };
  
  // پاک کردن کش برای نمایش فوری مقاله در صفحه اصلی و ادمین
  revalidatePath('/');
  revalidatePath('/admin');
  
  return { success: true };
}