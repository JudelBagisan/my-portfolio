'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import toast, { Toaster } from 'react-hot-toast';
import { deleteProject, toggleProjectVisibility } from '../actions';
import EditProjectModal from '@/components/admin/EditProjectModal';

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
  created_at: string;
}

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const itemsPerPage = 10;
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, filterCategory]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'All') {
      filtered = filtered.filter(project => project.category === filterCategory);
    }

    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await deleteProject(project.id, project.image_url);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Project deleted successfully');
        fetchProjects();
      }
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  const handleToggleVisibility = async (project: Project) => {
    try {
      const result = await toggleProjectVisibility(project.id, !project.is_public);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Project ${!project.is_public ? 'published' : 'hidden'} successfully`);
        fetchProjects();
      }
    } catch (error) {
      toast.error('Failed to update visibility');
      console.error(error);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-l from-customgrey-100 to-customdarkgrey-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-accent-100 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-offwhite-100">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-l from-customgrey-100 to-customdarkgrey-100 text-offwhite-100">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <svg className="w-6 h-6 text-muted-100 hover:text-offwhite-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Manage Projects</h1>
              <p className="text-sm text-muted-100">{filteredProjects.length} project(s)</p>
            </div>
          </div>

          <Link
            href="/admin/add-project"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-offwhite-100 rounded-lg hover:bg-accent-200 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Project
          </Link>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <div className="bg-customgrey-100 p-4 rounded-lg flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="w-full px-4 py-2 bg-customdarkgrey-100 border border-gray-500 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-customdarkgrey-100 border border-gray-500 rounded-lg text-offwhite-100 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Design">Design</option>
            <option value="Shirts">Shirts</option>
            <option value="Branding">Branding</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pb-12">
        {filteredProjects.length === 0 ? (
          <div className="bg-customgrey-100 rounded-lg p-12 text-center">
            <p className="text-muted-100 text-lg">No projects found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-customgrey-100 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-customdarkgrey-100">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-100">Image</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-100">Title</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-100">Category</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-100">Year</th>
                      <th className="text-left px-6 py-3 text-sm font-medium text-muted-100">Status</th>
                      <th className="text-right px-6 py-3 text-sm font-medium text-muted-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-customdarkgrey-100">
                    {paginatedProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-customdarkgrey-100/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="relative w-16 h-16 rounded overflow-hidden">
                            <Image
                              src={project.image_url}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-offwhite-100">{project.title}</div>
                          <div className="text-sm text-muted-100 line-clamp-1">{project.description}</div>
                        </td>
                        <td className="px-6 py-4 text-muted-100">{project.category}</td>
                        <td className="px-6 py-4 text-muted-100">{project.year}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleVisibility(project)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              project.is_public 
                                ? 'bg-accent-100/20 text-accent-100 hover:bg-accent-100/30' 
                                : 'bg-muted-100/20 text-muted-100 hover:bg-muted-100/30'
                            }`}
                          >
                            {project.is_public ? 'Public' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingProject(project)}
                              className="p-2 text-accent-100 hover:bg-accent-100/20 rounded transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(project)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {paginatedProjects.map((project) => (
                <div key={project.id} className="bg-customgrey-100 rounded-lg p-4">
                  <div className="flex gap-4 mb-4">
                    <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-offwhite-100 mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-100 mb-2">{project.category} • {project.year}</p>
                      <button
                        onClick={() => handleToggleVisibility(project)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.is_public 
                            ? 'bg-accent-100/20 text-accent-100' 
                            : 'bg-muted-100/20 text-muted-100'
                        }`}
                      >
                        {project.is_public ? 'Public' : 'Hidden'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="flex-1 px-4 py-2 bg-accent-100 text-offwhite-100 rounded-lg hover:bg-accent-200 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
                      className="flex-1 px-4 py-2 bg-red-400/20 text-red-400 rounded-lg hover:bg-red-400/30 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-customgrey-100 text-offwhite-100 rounded-lg hover:bg-customdarkgrey-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-muted-100">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-customgrey-100 text-offwhite-100 rounded-lg hover:bg-customdarkgrey-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={() => {
            fetchProjects();
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}
