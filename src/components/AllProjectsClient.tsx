'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import SocialLink from '@/components/SocialLink';

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
    <div className="bg-gradient-to-l from-customgrey-100 to-customdarkgrey-100 text-offwhite-100 font-sans min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 md:px-20 lg:px-36 py-4 md:py-6 flex items-center justify-between">
        <Link href="/" className="ml-2 sm:ml-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent-100 flex items-center justify-center text-customdarkgrey-100 font-semibold hover:scale-110 transition-transform text-sm md:text-base">
            JB
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-lg text-muted-100 mr-2 sm:mr-6">
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
      <section className="w-full px-4 sm:px-6 md:px-20 lg:px-36 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 md:mb-4">All Projects</h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-100 max-w-2xl mx-auto px-4">
              Explore my complete portfolio of creative works across various categories.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all text-sm md:text-base ${
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
            <div className="space-y-12 md:space-y-16">
              {Object.entries(projectsByCategory).map(([category, categoryProjects]) => (
                categoryProjects.length > 0 && (
                  <div key={category}>
                    {/* Category Header with Divider */}
                    <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                      <h2 className="text-2xl sm:text-3xl font-bold text-offwhite-100">{category}</h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-accent-100 to-transparent"></div>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                      {categoryProjects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => setSelectedProject(project)}
                          className="bg-customgrey-100 rounded-lg p-4 md:p-6 hover:bg-customgrey-100/80 transition-all group cursor-pointer hover:scale-105 transform duration-300"
                        >
                          <div className="flex justify-between items-start mb-3 md:mb-4 gap-2">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold">{project.title}</h3>
                            <span className="text-xs text-muted-100 px-2 md:px-3 py-1 bg-customdarkgrey-100 rounded-full whitespace-nowrap">
                              {project.year}
                            </span>
                          </div>
                          <div className="rounded-lg h-40 sm:h-48 overflow-hidden relative mb-3 md:mb-4">
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
                          <p className="text-xs md:text-sm text-muted-100 line-clamp-2">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="bg-customgrey-100 rounded-lg p-4 md:p-6 hover:bg-customgrey-100/80 transition-all group cursor-pointer hover:scale-105 transform duration-300"
                >
                  <div className="flex justify-between items-start mb-3 md:mb-4 gap-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">{project.title}</h3>
                    <span className="text-xs text-muted-100 px-2 md:px-3 py-1 bg-customdarkgrey-100 rounded-full whitespace-nowrap">
                      {project.year}
                    </span>
                  </div>
                  <div className="rounded-lg h-40 sm:h-48 overflow-hidden relative mb-3 md:mb-4">
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
                  <p className="text-xs md:text-sm text-muted-100 line-clamp-2">
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
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-customgrey-100 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scaleIn my-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-customdarkgrey-100 rounded-full flex items-center justify-center text-offwhite-100 hover:bg-accent-100 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Large Image */}
            <div className="relative w-full bg-customdarkgrey-100 flex items-center justify-center">
              <Image
                src={selectedProject.image_url}
                alt={selectedProject.title}
                width={1200}
                height={800}
                className="object-contain w-full h-auto"
                style={{ maxHeight: '60vh', width: 'auto', height: 'auto' }}
              />
            </div>

            {/* Project Details */}
            <div className="p-4 md:p-8 overflow-y-auto flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-offwhite-100">{selectedProject.title}</h2>
                <span className="text-xs sm:text-sm text-muted-100 px-3 sm:px-4 py-1 sm:py-2 bg-customdarkgrey-100 rounded-full whitespace-nowrap self-start">
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

              <p className="text-muted-100 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
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

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="px-4 sm:px-6 py-2 sm:py-3 bg-accent-100 text-offwhite-100 rounded-lg hover:bg-accent-200 transition-colors font-medium text-sm sm:text-base">
                  View Live Project
                </button>
                <button className="px-4 sm:px-6 py-2 sm:py-3 bg-customdarkgrey-100 text-offwhite-100 rounded-lg hover:bg-customdarkgrey-100/80 transition-colors font-medium text-sm sm:text-base">
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
            {/* Logo/Icon */}
            <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center text-customdarkgrey-100 font-bold text-2xl mb-6 animate-scaleIn">
              JB
            </div>
            
            {/* Thank you message */}
            <p className="text-muted-100 mb-6">
              <span className="font-semibold text-offwhite-100">Thanks for scrolling,</span> that's all folks.
            </p>

            {/* Social Links */}
            <div className="flex gap-6 text-muted-100">
              <SocialLink href="https://www.facebook.com/judelcabahug.bagisan" label="Facebook">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12.072C22 6.507 17.523 2 12 2S2 6.507 2 12.072c0 5.025 3.657 9.188 8.438 9.93v-7.03H7.898v-2.9h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.9h-2.33v7.03C18.343 21.26 22 17.096 22 12.072z"/>
                </svg>
              </SocialLink>
              <SocialLink href="https://github.com/JudelBagisan" label="GitHub">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297a12 12 0 00-3.794 23.4c.6.111.82-.261.82-.58 0-.289-.01-1.047-.016-2.054-3.338.724-4.042-1.583-4.042-1.583-.546-1.389-1.333-1.761-1.333-1.761-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.237 1.84 1.237 1.07 1.832 2.809 1.303 3.492.997.108-.776.418-1.303.76-1.603-2.665-.304-5.466-1.334-5.466-5.932 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 016.003 0c2.292-1.552 3.298-1.23 3.298-1.23.654 1.653.242 2.874.118 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.804 5.625-5.476 5.921.43.371.813 1.102.813 2.222 0 1.604-.015 2.898-.015 3.293 0 .322.216.695.825.577A12.006 12.006 0 0012 .297"/>
                </svg>
              </SocialLink>
              <SocialLink href="https://www.linkedin.com/in/judel-bagisan-88279334b/" label="LinkedIn">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.451 20.451h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.852 0-2.135 1.446-2.135 2.941v5.665H9.357V9.5h3.413v1.503h.049c.476-.9 1.637-1.852 3.372-1.852 3.604 0 4.27 2.372 4.27 5.456v6.294zM5.337 8.001a2.062 2.062 0 11.001-4.124 2.062 2.062 0 01-.001 4.124zM7.112 20.451H3.56V9.5h3.552v10.951zM22.225 0H1.771C.792 0 0 .774 0 1.73v20.54C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.27V1.73C24 .774 23.2 0 22.225 0z"/>
                </svg>
              </SocialLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
