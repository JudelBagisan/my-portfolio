'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

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

interface AllProjectsClientProps {
  projects: Project[];
}

export default function AllProjectsClient({ projects }: AllProjectsClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Set initial filter from URL parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedFilter(categoryParam);
    }
  }, [categoryParam]);

  // Get unique categories from projects
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = selectedFilter === 'All'
    ? projects
    : projects.filter(project => project.category === selectedFilter);

  // Group projects by category for display
  const projectsByCategory = categories.slice(1).reduce((acc, category) => {
    acc[category] = projects.filter(p => p.category === category);
    return acc;
  }, {} as Record<string, Project[]>);

  return (
    <div className="bg-linear-to-l from-customgrey-100 to-customdarkgrey-100 text-offwhite-100 font-sans min-h-screen">
      {/* Header */}
      <header className="w-full px-6 md:px-36 py-6 flex items-center justify-between">
        <Link href="/" className="ml-6">
          <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-customdarkgrey-100 font-semibold hover:scale-110 transition-transform">
            JB
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 md:text-lg text-sm text-muted-100 mr-6">
          <Link href="/" className="hover:text-offwhite-100 transition-all hover:scale-105">
            Home
          </Link>
          <Link href="/allprojects" className="flex items-center gap-2 text-offwhite-100 font-medium hover:scale-105 transition-transform">
            All Projects
            <span className="w-2 h-2 bg-accent-100 rounded-full inline-block mt-1 ml-1"></span>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full px-6 md:px-36 py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">All Projects</h1>
            <p className="text-muted-100 text-lg max-w-2xl mx-auto">
              Explore my complete portfolio of creative works across various categories.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedFilter === category
                    ? 'bg-accent-100 text-offwhite-100'
                    : 'bg-customgrey-100 text-muted-100 hover:bg-customgrey-100/80 hover:text-offwhite-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Display */}
          {selectedFilter === 'All' ? (
            // Show projects grouped by category
            <div className="space-y-16">
              {Object.entries(projectsByCategory).map(([category, categoryProjects]) => (
                categoryProjects.length > 0 && (
                  <div key={category}>
                    {/* Category Header with Divider */}
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-3xl font-bold text-offwhite-100">{category}</h2>
                      <div className="flex-1 h-px bg-linear-to-r from-accent-100 to-transparent"></div>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryProjects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => setSelectedProject(project)}
                          className="bg-customgrey-100 rounded-lg p-6 hover:bg-customgrey-100/80 transition-all group cursor-pointer hover:scale-105 transform duration-300"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">{project.title}</h3>
                            <span className="text-xs text-muted-100 px-3 py-1 bg-customdarkgrey-100 rounded-full">
                              {project.year}
                            </span>
                          </div>
                          <div className="rounded-lg h-48 overflow-hidden relative mb-4">
                            <Image
                              src={project.image_url}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs text-accent-100 bg-accent-100/10 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-muted-100 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            // Show filtered projects
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="bg-customgrey-100 rounded-lg p-6 hover:bg-customgrey-100/80 transition-all group cursor-pointer hover:scale-105 transform duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <span className="text-xs text-muted-100 px-3 py-1 bg-customdarkgrey-100 rounded-full">
                      {project.year}
                    </span>
                  </div>
                  <div className="rounded-lg h-48 overflow-hidden relative mb-4">
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs text-accent-100 bg-accent-100/10 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-100 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-customgrey-100 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-customdarkgrey-100 rounded-full flex items-center justify-center text-offwhite-100 hover:bg-accent-100 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Large Image */}
            <div className="relative w-full h-96 md:h-[500px]">
              <Image
                src={selectedProject.image_url}
                alt={selectedProject.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>

            {/* Project Details */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-offwhite-100">{selectedProject.title}</h2>
                <span className="text-sm text-muted-100 px-4 py-2 bg-customdarkgrey-100 rounded-full">
                  {selectedProject.category}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm text-accent-100 bg-accent-100/10 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-muted-100 text-lg leading-relaxed mb-8">
                {selectedProject.description}
              </p>

              {/* Additional Info */}
              <div className="pt-6 border-t border-customdarkgrey-100">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-100 mb-1">Category</div>
                    <div className="text-offwhite-100 font-medium">{selectedProject.category}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-100 mb-1">Year</div>
                    <div className="text-offwhite-100 font-medium">{selectedProject.year}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-100 mb-1">Role</div>
                    <div className="text-offwhite-100 font-medium">{selectedProject.role}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="px-6 py-3 bg-accent-100 text-offwhite-100 rounded-lg hover:bg-accent-200 transition-colors font-medium">
                  View Live Project
                </button>
                <button className="px-6 py-3 bg-customdarkgrey-100 text-offwhite-100 rounded-lg hover:bg-customdarkgrey-100/80 transition-colors font-medium">
                  View Case Study
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-customdarkgrey-100 text-offwhite-100 py-12 mt-16">
        <div className="container mx-auto px-6 md:px-36">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center text-customdarkgrey-100 font-bold text-2xl mb-6">
              JB
            </div>
            <p className="text-muted-100 mb-6">
              <span className="font-semibold text-offwhite-100">Thanks for viewing,</span> let's create something amazing together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
