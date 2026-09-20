'use server';

import { supabase } from '@/lib/supabase';
import { ServiceCategory, Service } from '@/types/service';
import { revalidatePath } from 'next/cache';

// دریافت تمام دسته‌بندی‌ها
export async function getCategories() {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, categories: data as ServiceCategory[] };
}

// دریافت فقط خدمات فعال (برای سایت)
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category_id', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, services: data as Service[] };
}

// دریافت کل خدمات (برای پنل ادمین)
export async function getAllServicesAdmin() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('category_id', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, services: data as Service[] };
}

// ثبت دسته‌بندی جدید
export async function createCategoryAction(data: { id: string; title: string; description: string; icon_name: string; display_order: number }) {
  const { error } = await supabase.from('service_categories').insert([data]);
  if (error) return { success: false, error: error.message };
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// ثبت خدمت جدید
export async function createServiceAction(data: { id: string; category_id: string; title: string; description: string; required_documents: string[]; base_price: number; display_order: number; is_active: boolean }) {
  const { error } = await supabase.from('services').insert([data]);
  if (error) return { success: false, error: error.message };
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}