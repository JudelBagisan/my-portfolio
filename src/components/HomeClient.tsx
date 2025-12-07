'use client';

import { useState } from 'react';
import Link from 'next/link';
import React from 'react';
import SocialLink from '@/components/SocialLink';
import Image from 'next/image';

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

interface HomeClientProps {
  projects: Project[];
  projectCounts: {
    design: number;
    branding: number;
    shirts: number;
    totalProjects: number;
  };
}

export default function HomeClient({ projects, projectCounts }: HomeClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="bg-gradient-to-l from-customgrey-100 to-customdarkgrey-100 text-offwhite-100 font-sans min-h-screen">
      {/* Header */}
      <header className="w-full px-6 md:px-36 py-6 flex items-center justify-between animate-fadeIn">
        <div className="ml-6">
          <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-customdarkgrey-100 font-semibold hover:scale-110 transition-transform">
            JB
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 md:text-lg text-sm text-muted-100 mr-6">
          <Link href="#services" className="flex items-center gap-2 text-offwhite-100 font-medium hover:scale-105 transition-transform">
            Services
            <span className="w-2 h-2 bg-accent-100 rounded-full inline-block mt-1 ml-1"></span>
          </Link>
          <Link href="/allprojects" className="hover:text-offwhite-100 transition-all hover:scale-105">
            Works
          </Link>
          <Link href="#portfolio" className="hover:text-offwhite-100 transition-all hover:scale-105">
            Portfolio
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden mr-6 p-2 rounded-md bg-customgrey-100/30"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-offwhite-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-customdarkgrey-100 px-6 pb-4 animate-fadeInUp overflow-y-auto max-h-[60vh] smooth-scroll">
          <div className="flex flex-col gap-3 text-offwhite-100">
            <Link href="#services" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent-100 transition-colors">Services</Link>
            <Link href="/allprojects" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent-100 transition-colors">Works</Link>
            <Link href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-accent-100 transition-colors">Portfolio</Link>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <main className="w-full h-auto md:h-[88vh] px-6 md:px-36 flex items-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start md:items-center">
          {/* Left: Name & Social */}
          <div className="col-span-12 md:col-span-5 animate-slideInLeft">
            <div className="text-5xl md:text-8xl font-extrabold leading-tight text-center md:text-left">
              <div>Judel</div>
              <div>Bagisan</div>
            </div>
            <div className="mx-auto md:mx-0 w-20 md:w-12 h-1 bg-accent-100 mt-6 mb-6"></div>
            <div className="flex gap-3 text-muted-100 justify-center md:justify-start items-center">
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

          {/* Middle: Hero Image */}
          <div className="col-span-12 md:col-span-3 flex justify-center relative md:-ml-8 animate-scaleIn animation-delay-200">
            <div className="w-40 sm:w-56 md:w-64 h-80 md:h-[520px] bg-gradient-to-b from-white/5 to-black/50 rounded-[40px] shadow-2xl border-4 border-gray-800 hover:scale-105 transition-transform duration-500"></div>
          </div>

          {/* Right: Intro & CTA */}
          <div className="col-span-12 md:col-span-4 pr-0 md:pr-8 text-center md:text-left animate-slideInRight animation-delay-400">
            <div className="text-sm text-muted-100 uppercase tracking-widest mb-3">— Introduction</div>
            <h2 className="text-xl md:text-3xl font-semibold mb-5 text-offwhite-100 text-justify">
              Graphic Designer & Layout Artist, based in the Philippines.
            </h2>
            <p className="text-sm md:text-base text-muted-100 mb-6 text-justify">
              I specialize in crafting distinct visual identities, from text-based logos to hyper-realistic image manipulations. I blend technical precision with creative flair to transform abstract concepts into compelling digital realities.
            </p>
            <Link
              href="#"
              className="text-accent-100 hover:text-accent-200 md:mb-0 mb-10 inline-flex items-center gap-3 font-medium transition-all hover:translate-x-2"
            >
              My story <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Services Section */}
      <section className="w-full bg-customdarkgrey-100 text-offwhite-100" id='services'>
        <div className="container mx-auto px-6 md:px-36 py-16">
          {/* CTA and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
            <div className="animate-fadeInUp">
              <div className="text-sm text-muted-100 uppercase tracking-widest mb-3">— Services</div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-3">Any Type Of Query & Discussion.</h3>
              <p className="text-muted-100 mb-4">
                Reach out for projects, collaborations, or fresh design ideas.
              </p>
              
            </div>

            <div className="md:text-right animate-fadeInUp animation-delay-200">
              <p className="text-muted-100 mb-4">
                Turning ideas into designs that inspire, engage, and deliver results.
              </p>
              <div className="flex gap-8 justify-start md:justify-end items-center">
                <div className="text-accent-100 text-3xl font-extrabold">4</div>
                <div>
                  <div className="text-muted-100 text-sm">Years of</div>
                  <div className="text-muted-100 text-sm">Experience.</div>
                </div>
                <div className="ml-6 text-accent-100 text-3xl font-extrabold">100+</div>
                <div>
                  <div className="text-muted-100 text-sm">Satisfied</div>
                  <div className="text-muted-100 text-sm">Clients.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch mb-12">
            <ServiceCard
                title="UI/UX & Product Design"
                projects={projectCounts.design}
                icon="☐"
                category="Design"
                featured
            />
            <ServiceCard
                title="Brand Identity & Visual Design"
                projects={projectCounts.branding}
                icon="✦"
                category="Branding"
            />
            <ServiceCard
                title="Layout & Shirts Design"
                projects={projectCounts.shirts}
                icon="▣"
                category="Shirts"
            />
            </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="w-full bg-customdarkgrey-100 text-offwhite-100 py-16" id='portfolio'>
        <div className="container mx-auto px-6 md:px-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Portfolio Intro */}
            <div className="flex flex-col justify-start animate-fadeInUp">
              <div className="text-sm text-muted-100 uppercase tracking-widest mb-4">— Portfolio</div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                All Creative Works,<br />
                Selected projects.
              </h2>
              <p className="text-muted-100 mb-8 max-w-md">
                Showcasing a collection of designs and projects that highlight creativity, craftsmanship, and practical problem-solving across various mediums.
              </p>
              <Link
                href="/allprojects"
                className="text-accent-100 hover:text-accent-200 inline-flex items-center gap-3 font-medium transition-all hover:translate-x-2"
              >
                Explore more <span>→</span>
              </Link>
            </div>

            {/* Right: First Project */}
            {projects.length > 0 && (
              <div 
                onClick={() => setSelectedProject(projects[0])}
                className="bg-customgrey-100 rounded-lg p-6 hover:bg-customgrey-100/80 transition-all group cursor-pointer animate-fadeInUp animation-delay-200 hover:scale-105 transform duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{projects[0].title}</h3>
                  <span className="text-xs text-muted-100 px-3 py-1 bg-customdarkgrey-100 rounded-full">
                    {projects[0].tags.join(', ')}
                  </span>
                </div>
                <div className="rounded-lg h-64 overflow-hidden relative">
                  <Image 
                    src={projects[0].image_url}
                    alt={projects[0].title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: Two Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Second Project */}
            {projects.length > 1 && (
              <div 
                onClick={() => setSelectedProject(projects[1])}
                className="bg-customgrey-100 rounded-lg p-6 hover:bg-customgrey-100/80 transition-all group cursor-pointer animate-fadeInUp animation-delay-400 hover:scale-105 transform duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{projects[1].title}</h3>
                  <span className="text-xs text-muted-100 px-3 py-1 bg-customdarkgrey-100 rounded-full">
                    {projects[1].tags.join(', ')}
                  </span>
                </div>
                <div className="rounded-lg h-64 overflow-hidden relative">
                  <Image 
                    src={projects[1].image_url}
                    alt={projects[1].title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            )}

            {/* Third Project */}
            {projects.length > 2 && (
              <div 
                onClick={() => setSelectedProject(projects[2])}
                className="bg-customgrey-100 rounded-lg p-6 hover:bg-customgrey-100/80 transition-all group cursor-pointer animate-fadeInUp animation-delay-600 hover:scale-105 transform duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{projects[2].title}</h3>
                  <span className="text-xs text-muted-100 px-3 py-1 bg-customdarkgrey-100 rounded-full">
                    {projects[2].tags.join(', ')}
                  </span>
                </div>
                <div className="rounded-lg h-64 overflow-hidden relative">
                  <Image 
                    src={projects[2].image_url}
                    alt={projects[2].title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            )}
          </div>
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
                  {selectedProject.tags.join(', ')}
                </span>
              </div>
              <p className="text-muted-100 text-lg leading-relaxed">
                {selectedProject.description}
              </p>
              
              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-customdarkgrey-100">
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

      {/* Contact Section */}
      <section className="w-full bg-customgrey-100 text-offwhite-100 py-20">
        <div className="container mx-auto px-6 md:px-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Left: Got a project */}
            <div className="animate-fadeInUp">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Got a project?<br />
                Let's talk.
              </h2>
              <p className="text-muted-100 mb-4">
                Feel free to reach out for project inquiries, collaborations, or design discussions. I am open to new opportunities and always ready to connect.
              </p>

              <Link
                href="mailto:judelcabahugbagisan@gmail.com"
                className="text-accent-100 hover:text-accent-200 inline-flex items-center gap-3 font-medium transition-all text-xl group"
              >
                Send an email
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>

            {/* Right: Portfolio Stats & Info */}
            <div className="animate-fadeInUp animation-delay-200">
              <h3 className="text-2xl md:text-3xl font-bold mb-8">
                Why work with me?
              </h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-customgrey-100 p-6 rounded-lg hover:bg-customgrey-100/80 transition-all">
                  <div className="text-accent-100 text-4xl font-extrabold mb-2">4</div>
                  <div className="text-muted-100 text-sm">Years of Experience</div>
                </div>
                <div className="bg-customgrey-100 p-6 rounded-lg hover:bg-customgrey-100/80 transition-all">
                  <div className="text-accent-100 text-4xl font-extrabold mb-2">100+</div>
                  <div className="text-muted-100 text-sm">Satisfied Clients</div>
                </div>
                <div className="bg-customgrey-100 p-6 rounded-lg hover:bg-customgrey-100/80 transition-all">
                  <div className="text-accent-100 text-4xl font-extrabold mb-2">{projectCounts.totalProjects}</div>
                  <div className="text-muted-100 text-sm">Projects Completed</div>
                </div>
                <div className="bg-customgrey-100 p-6 rounded-lg hover:bg-customgrey-100/80 transition-all">
                  <div className="text-accent-100 text-4xl font-extrabold mb-2">98%</div>
                  <div className="text-muted-100 text-sm">Client Satisfaction</div>
                </div>
              </div>

              {/* Services List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-offwhite-100">
                  <div className="w-2 h-2 bg-accent-100 rounded-full"></div>
                  <span>Brand Identity Design</span>
                </div>
                <div className="flex items-center gap-3 text-offwhite-100">
                  <div className="w-2 h-2 bg-accent-100 rounded-full"></div>
                  <span>Logo & Visual Design</span>
                </div>
                <div className="flex items-center gap-3 text-offwhite-100">
                  <div className="w-2 h-2 bg-accent-100 rounded-full"></div>
                  <span>Image Manipulation & Editing</span>
                </div>
                <div className="flex items-center gap-3 text-offwhite-100">
                  <div className="w-2 h-2 bg-accent-100 rounded-full"></div>
                  <span>Layout & Typography</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-customdarkgrey-100 text-offwhite-100 py-12">
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
              <SocialLink href="#" label="Dribbble">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.375 0 0 5.375 0 12c0 6.628 5.375 12 12 12 6.628 0 12-5.372 12-12 0-6.625-5.372-12-12-12zm8.813 12c0 .968-.158 1.898-.447 2.772-1.098-.27-2.363-.447-3.745-.447-1.245 0-2.447.158-3.588.447-.09-.223-.178-.447-.27-.67-.09-.225-.18-.447-.27-.67 2.092-.85 3.833-2.092 5.12-3.632 1.562 1.518 2.558 3.655 2.558 6.043zm-8.813 9.75c-4.462 0-8.218-3-9.405-7.095 1.785.045 3.57.045 5.355-.09.18.358.358.717.537 1.075.09.18.18.358.27.537-1.65.895-2.992 2.27-3.833 3.922-.85-.09-1.695-.135-2.54-.135-.628 0-1.245.045-1.875.09-.895-1.785-1.395-3.81-1.395-5.955 0-7.245 5.895-13.14 13.14-13.14 7.248 0 13.143 5.895 13.143 13.14 0 5.4-3.255 10.035-7.92 12.038-1.29-1.695-2.85-3.075-4.59-4.095z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" label="Instagram">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" label="LinkedIn">
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

interface ServiceCardProps {
  title: string;
  projects: number;
  icon: string;
  category: string;
  featured?: boolean;
}

function ServiceCard({ title, projects, icon, category, featured = false }: ServiceCardProps) {
  return (
    <Link
      href={`/allprojects?category=${encodeURIComponent(category)}`}
      className={`${
        featured
          ? 'bg-accent-100 text-customdarkgrey-100'
          : 'bg-customgrey-100 text-offwhite-100'
      } p-8 rounded-md shadow-lg flex flex-col justify-between transform hover:-translate-y-2 transition-all duration-300 animate-fadeInUp hover:shadow-2xl cursor-pointer`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded ${
            featured ? 'bg-customdarkgrey-100 text-offwhite-100' : 'bg-customdarkgrey-100/60 text-offwhite-100'
          } flex items-center justify-center transition-transform hover:rotate-12`}
        >
          {icon}
        </div>
        <div className="text-lg font-semibold">{title}</div>
      </div>
      <div className={`text-sm mt-6 ${featured ? 'text-customdarkgrey-100' : 'text-muted-100'}`}>
        {projects} Projects
      </div>
    </Link>
  );
}
