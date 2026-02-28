import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/HomeClient';
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

interface Experience {
  id: string;
  role: string;
  org: string;
  period: string;
  is_current: boolean;
  side: 'left' | 'right';
  sort_order: number;
}

async function getPublicProjects() {
  const supabase = await createClient();

  // First try to fetch featured projects
  const { data: featured } = await supabase
    .from('projects')
    .select('*')
    .eq('is_public', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3);

  if (featured && featured.length > 0) {
    return featured;
  }

  // Fallback: one project per category (original behaviour)
  const categories = ['Design', 'Shirts', 'Branding'];
  const projects: Project[] = [];

  for (const category of categories) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_public', true)
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error(`Error fetching ${category} projects:`, error);
    } else if (data && data.length > 0) {
      projects.push(data[0]);
    }
  }

  return projects;
}

async function getProjectCounts() {
  const supabase = await createClient();
  
  // Get count for Design category
  const { count: designCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('is_public', true)
    .eq('category', 'Design');

  // Get count for Branding category
  const { count: brandingCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('is_public', true)
    .eq('category', 'Branding');

  // Get count for Shirts category
  const { count: shirtsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('is_public', true)
    .eq('category', 'Shirts');

  return {
    design: designCount || 0,
    branding: brandingCount || 0,
    shirts: shirtsCount || 0,
    totalProjects: (designCount || 0) + (brandingCount || 0) + (shirtsCount || 0),
  };
}

export default async function Home() {
  const projects = await getPublicProjects();
  const projectCounts = await getProjectCounts();

  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <Suspense fallback={null}>
      <HomeClient projects={projects} projectCounts={projectCounts} experiences={experiences || []} />
    </Suspense>
  );
}