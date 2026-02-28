import { createClient } from '@/lib/supabase/server';
import AllProjectsClient from '@/components/AllProjectsClient';
import { Suspense } from 'react';

interface Project {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image_url: string;
  description: string;
  year: string;
  role: string;
  is_public: boolean;
}

async function getAllPublicProjects() {
  const supabase = await createClient();
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return projects || [];
}

export default async function AllProjects() {
  const projects = await getAllPublicProjects();

  return (
    <Suspense fallback={null}>
      <AllProjectsClient projects={projects} />
    </Suspense>
  );
}
