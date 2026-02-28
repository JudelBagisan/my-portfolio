'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ProjectFormData {
  title: string;
  category: string;
  tags: string[];
  image_url: string;
  description: string;
  year: string;
  role: string;
  is_public: boolean;
}

export async function createProject(formData: ProjectFormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([formData])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return { error: error.message };
  }

  // Revalidate pages to show new project
  revalidatePath('/');
  revalidatePath('/allprojects');
  revalidatePath('/admin');
  revalidatePath('/admin/manage-projects');

  return { data };
}

export async function updateProject(id: string, formData: Partial<ProjectFormData>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data, error } = await supabase
    .from('projects')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return { error: error.message };
  }

  // Revalidate pages
  revalidatePath('/');
  revalidatePath('/allprojects');
  revalidatePath('/admin');
  revalidatePath('/admin/manage-projects');

  return { data };
}

export async function deleteProject(id: string, imageUrl?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Delete image from storage if it exists
  if (imageUrl && imageUrl.includes('supabase')) {
    const path = imageUrl.split('/').pop();
    if (path) {
      await supabase.storage.from('project-images').remove([path]);
    }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    return { error: error.message };
  }

  // Revalidate pages
  revalidatePath('/');
  revalidatePath('/allprojects');
  revalidatePath('/admin');
  revalidatePath('/admin/manage-projects');

  return { success: true };
}

export async function toggleProjectVisibility(id: string, isPublic: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { error } = await supabase
    .from('projects')
    .update({ is_public: isPublic })
    .eq('id', id);

  if (error) {
    console.error('Error toggling visibility:', error);
    return { error: error.message };
  }

  // Revalidate pages
  revalidatePath('/');
  revalidatePath('/allprojects');
  revalidatePath('/admin/manage-projects');

  return { success: true };
}

export async function toggleProjectFeatured(id: string, isFeatured: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Enforce max 3 featured projects
  if (isFeatured) {
    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true);

    if ((count ?? 0) >= 3) {
      return { error: 'You can only feature up to 3 projects on the homepage. Please unfeature one first.' };
    }
  }

  const { error } = await supabase
    .from('projects')
    .update({ is_featured: isFeatured })
    .eq('id', id);

  if (error) {
    console.error('Error toggling featured:', error);
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/manage-projects');

  return { success: true };
}

export async function uploadImage(file: File) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('project-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    return { error: error.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('project-images')
    .getPublicUrl(fileName);

  return { data: { path: data.path, publicUrl } };
}
