import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/HomeClient';

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

async function getPublicProjects() {
  const supabase = await createClient();
  
  // Fetch one project from each category: Design, Shirts, Branding
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

  return <HomeClient projects={projects} projectCounts={projectCounts} />;
}