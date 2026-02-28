import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ManageExperiencesClient from '@/components/admin/ManageExperiencesClient';

export const dynamic = 'force-dynamic';

export default async function ManageExperiencesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <ManageExperiencesClient
      experiences={experiences || []}
      userEmail={user.email || ''}
    />
  );
}
