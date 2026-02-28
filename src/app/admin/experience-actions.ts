'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ExperienceFormData {
  role: string;
  org: string;
  period: string;
  is_current: boolean;
  side: 'left' | 'right';
  sort_order: number;
}

export async function createExperience(formData: ExperienceFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data, error } = await supabase
    .from('experiences')
    .insert([formData])
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/manage-experiences');
  return { data };
}

export async function updateExperience(id: string, formData: Partial<ExperienceFormData>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data, error } = await supabase
    .from('experiences')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/manage-experiences');
  return { data };
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/admin/manage-experiences');
  return { success: true };
}
