import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/admin/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch statistics
  const { count: totalProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  const { count: publicProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('is_public', true);

  const { data: recentProjects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-customdarkgrey-100 text-offwhite-100">
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-customdarkgrey-100 font-semibold hover:scale-110 transition-transform">
                JB
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-100">{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-muted-100">Here's what's happening with your portfolio today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-customgrey-100 p-6 rounded-lg hover:bg-customgrey-100/80 transition-all animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent-100/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-offwhite-100 mb-1">{totalProjects || 0}</h3>
            <p className="text-muted-100 text-sm">Total Projects</p>
          </div>

          <div className="bg-customgrey-100 p-6 rounded-lg hover:bg-customgrey-100/80 transition-all animate-fadeInUp animation-delay-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent-100/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-offwhite-100 mb-1">{publicProjects || 0}</h3>
            <p className="text-muted-100 text-sm">Public Projects</p>
          </div>

          <div className="bg-customgrey-100 p-6 rounded-lg hover:bg-customgrey-100/80 transition-all animate-fadeInUp animation-delay-400">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent-100/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-4xl font-extrabold text-offwhite-100 mb-1">{((publicProjects || 0) / (totalProjects || 1) * 100).toFixed(0)}%</h3>
            <p className="text-muted-100 text-sm">Visibility Rate</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/add-project" className="bg-customgrey-100 p-6 rounded-lg hover:bg-accent-100 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-100 group-hover:bg-customdarkgrey-100 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-offwhite-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-offwhite-100">Add Project</h4>
                  <p className="text-sm text-muted-100 group-hover:text-offwhite-100">Create new project</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/manage-projects" className="bg-customgrey-100 p-6 rounded-lg hover:bg-accent-100 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-100 group-hover:bg-customdarkgrey-100 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-offwhite-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-offwhite-100">Manage Projects</h4>
                  <p className="text-sm text-muted-100 group-hover:text-offwhite-100">Edit or delete</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/send-email" className="bg-customgrey-100 p-6 rounded-lg hover:bg-accent-100 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-100 group-hover:bg-customdarkgrey-100 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-offwhite-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-offwhite-100">Send Email</h4>
                  <p className="text-sm text-muted-100 group-hover:text-offwhite-100">Contact clients</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/manage-experiences" className="bg-customgrey-100 p-6 rounded-lg hover:bg-accent-100 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-100 group-hover:bg-customdarkgrey-100 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-offwhite-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-offwhite-100">Manage Experiences</h4>
                  <p className="text-sm text-muted-100 group-hover:text-offwhite-100">Add or remove entries</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Recent Projects</h3>
            <Link href="/admin/manage-projects" className="text-accent-100 hover:text-accent-200 text-sm">
              View all →
            </Link>
          </div>
          
          {recentProjects && recentProjects.length > 0 ? (
            <div className="bg-customgrey-100 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-customdarkgrey-100">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-100">Title</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-100">Category</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-100">Year</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-100">Status</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {recentProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-customdarkgrey-100/50 transition-colors">
                        <td className="px-6 py-4 text-offwhite-100 font-medium">{project.title}</td>
                        <td className="px-6 py-4 text-muted-100">{project.category}</td>
                        <td className="px-6 py-4 text-muted-100">{project.year}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.is_public 
                              ? 'bg-accent-100/20 text-accent-100' 
                              : 'bg-muted-100/20 text-muted-100'
                          }`}>
                            {project.is_public ? 'Public' : 'Hidden'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-customgrey-100 rounded-lg p-12 text-center">
              <p className="text-muted-100">No projects yet. Create your first project!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
