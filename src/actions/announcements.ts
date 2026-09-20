'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// دریافت اطلاعیه‌ها (با پشتیبانی از تاریخ‌های خالی)
export async function getActiveAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    // نمایش مواردی که تاریخ ندارند یا تاریخشان هنوز نگذشته است
    .or(`deadline.is.null,deadline.gte.${new Date().toISOString()}`) 
    .order('created_at', { ascending: false }); 

  if (error) return { success: false, error: error.message };
  return { success: true, announcements: data || [] };
}

export async function createAnnouncementAction(formData: any) {
  const { error } = await supabase.from('announcements').insert([{ ...formData, is_active: true }]);
  if (error) return { success: false, error: error.message };
  revalidatePath('/'); revalidatePath('/admin');
  return { success: true };
}

export async function updateAnnouncementAction(id: string, formData: any) {
  const { error } = await supabase.from('announcements').update(formData).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/'); revalidatePath('/admin');
  return { success: true };
}

export async function deleteAnnouncementAction(id: string) {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/'); revalidatePath('/admin');
  return { success: true };
}