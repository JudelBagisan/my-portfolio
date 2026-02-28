'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SocialLink from '@/components/SocialLink';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';

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

interface HomeClientProps {
  projects: Project[];
  projectCounts: {
    design: number;
    branding: number;
    shirts: number;
    totalProjects: number;
  };
  experiences: Experience[];
}

export default function HomeClient({ projects, projectCounts, experiences }: HomeClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.id === projectId);
      if (project) setSelectedProject(project);
    }
  }, [searchParams, projects]);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    const params = new URLSearchParams(window.location.search);
    params.set('project', project.id);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const closeProject = () => {
    setSelectedProject(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('project');
    const newSearch = params.toString();
    router.replace(newSearch ? `?${newSearch}` : window.location.pathname, { scroll: false });
  };

  const handleCopyLink = () => {
    if (!selectedProject) return;
    const url = `${window.location.origin}${window.location.pathname}?project=${selectedProject.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFullscreen = () => {
    const el = imageContainerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('judelcabahugbagisan@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-customdarkgrey-100 text-offwhite-100 font-sans min-h-screen relative overflow-x-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full px-4 sm:px-6 md:px-20 lg:px-36 py-4 md:py-6 flex items-center justify-between"
      >
        <motion.div 
          className="ml-2 sm:ml-6"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent-100 flex items-center justify-center text-customdarkgrey-100 font-semibold text-sm md:text-base cursor-pointer">
            JB
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-lg text-muted-100 mr-2 sm:mr-6">
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
          <Link href="#experience" className="hover:text-offwhite-100 transition-all hover:scale-105">
            Experience
          </Link>
          <Link href="#contact" className="hover:text-offwhite-100 transition-all hover:scale-105">
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden mr-2 sm:mr-6 p-2 rounded-md bg-customgrey-100/30 hover:bg-customgrey-100/50 transition-colors"
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
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </motion.button>
      </motion.header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.nav 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-customdarkgrey-100 px-4 sm:px-6 pb-4 overflow-hidden"
        >
          <div className="flex flex-col gap-3 text-offwhite-100">
            <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="#services" onClick={() => setMobileMenuOpen(false)} className="py-2 block hover:text-accent-100 transition-colors">
                Services
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="/allprojects" onClick={() => setMobileMenuOpen(false)} className="py-2 block hover:text-accent-100 transition-colors">
                Works
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="py-2 block hover:text-accent-100 transition-colors">
                Portfolio
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="#experience" onClick={() => setMobileMenuOpen(false)} className="py-2 block hover:text-accent-100 transition-colors">
                Experience
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 block hover:text-accent-100 transition-colors">
                Contact
              </Link>
            </motion.div>
          </div>
        </motion.nav>
      )}

      {/* Hero Section */}
      <main className="w-full min-h-[60vh] md:h-[88vh] px-4 sm:px-6 md:px-20 lg:px-36 py-8 md:py-0 flex items-center relative overflow-hidden">
        {/* Background Hero Image */}
        <div className="absolute inset-0 flex justify-center items-end pointer-events-none">
          <div className="relative h-full w-[85%] sm:w-[65%] md:w-[500px] md:max-w-[55%] md:-translate-x-20">
            <Image
              src="/images/hero-img-50.png"
              alt="Judel Bagisan"
              fill
              className="object-contain object-bottom"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#232633] via-transparent to-[#232633]" />
            <div className="absolute inset-0 bg-linear-to-t from-[#232633] via-[#232633]/20 to-transparent" />
          </div>
        </div>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start md:items-center relative z-10">
          {/* Left: Name & Social */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 md:col-span-6"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-tight text-center md:text-left">
              <AnimatedText text="Judel" delay={0.5} />
              <AnimatedText text="Bagisan" delay={0.8} />
            </div>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="mx-auto md:mx-0 w-16 sm:w-20 md:w-12 h-1 bg-accent-100 mt-4 md:mt-6 mb-4 md:mb-6 origin-left"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="flex gap-3 text-muted-100 justify-center md:justify-start items-center"
            >
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
            </motion.div>
          </motion.div>



          {/* Right: Intro & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="col-span-12 md:col-span-6 pr-0 md:pr-8 text-center md:text-left"
          >
            <div className="text-xs sm:text-sm text-muted-100 uppercase tracking-widest mb-3">— Introduction</div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-5 text-offwhite-100 text-justify">
              Designer with a developer’s mindset.
            </h2>
            <p className="text-sm md:text-base text-muted-100 mb-6 text-justify">
              Graphic Designer with Web Development Experience — building visuals that don’t just look good, but function with purpose.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-100 hover:bg-accent-200 text-offwhite-100 font-semibold rounded-lg transition-all text-sm md:text-base"
              >
                Get in touch <span>→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Services Section */}
      <section className="w-full bg-customdarkgrey-100 text-offwhite-100" id='services'>
        <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-36 py-12 md:py-16">
          {/* CTA and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center mb-8 md:mb-12">
            <ScrollReveal>
              <div className="text-xs sm:text-sm text-muted-100 uppercase tracking-widest mb-3">— Services</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3">Any Type Of Query & Discussion.</h3>
              <p className="text-sm md:text-base text-muted-100 mb-4">
                Reach out for projects, collaborations, or fresh design ideas.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-sm md:text-base text-muted-100 mb-4 md:text-right">
                Turning ideas into designs that inspire, engage, and deliver results.
              </p>
              <div className="flex flex-wrap gap-4 md:gap-8 justify-start md:justify-end items-center">
                <div className="text-accent-100 text-2xl md:text-3xl font-extrabold">4</div>
                <div>
                  <div className="text-muted-100 text-xs md:text-sm">Years of</div>
                  <div className="text-muted-100 text-xs md:text-sm">Experience.</div>
                </div>
                <div className="ml-2 md:ml-6 text-accent-100 text-2xl md:text-3xl font-extrabold">100+</div>
                <div>
                  <div className="text-muted-100 text-xs md:text-sm">Satisfied</div>
                  <div className="text-muted-100 text-xs md:text-sm">Clients.</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch mb-8 md:mb-12">
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
      <section className="w-full bg-customdarkgrey-100 text-offwhite-100 py-12 md:py-16" id='portfolio'>
        <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left: Portfolio Intro */}
            <ScrollReveal>
              <div className="flex flex-col justify-start">
                <div className="text-xs sm:text-sm text-muted-100 uppercase tracking-widest mb-4">— Portfolio</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                  All Creative Works,<br />
                  Selected projects.
                </h2>
                <p className="text-sm md:text-base text-muted-100 mb-6 md:mb-8 max-w-md">
                  Showcasing a collection of designs and projects that highlight creativity, craftsmanship, and practical problem-solving across various mediums.
                </p>
                <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link
                    href="/allprojects"
                    className="text-accent-100 hover:text-accent-200 inline-flex items-center gap-3 font-medium transition-all text-sm md:text-base"
                  >
                    Explore more <span>→</span>
                  </Link>
                </motion.div>
              </div>
            </ScrollReveal>

            {/* Right: First Project */}
            {projects.length > 0 && (
              <ProjectCard project={projects[0]} onClick={() => openProject(projects[0])} delay={0.2} />
            )}
          </div>

          {/* Bottom Row: Two Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">
            {/* Second Project */}
            {projects.length > 1 && (
              <ProjectCard project={projects[1]} onClick={() => openProject(projects[1])} delay={0.3} />
            )}

            {/* Third Project */}
            {projects.length > 2 && (
              <ProjectCard project={projects[2]} onClick={() => openProject(projects[2])} delay={0.4} />
            )}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto"
          onClick={closeProject}
        >
          <div 
            className="relative bg-customgrey-100 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleIn my-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeProject}
              className="absolute top-4 right-4 w-10 h-10 bg-customdarkgrey-100 rounded-full flex items-center justify-center text-offwhite-100 hover:bg-accent-100 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Large Image */}
            <div ref={imageContainerRef} className="relative w-full bg-customdarkgrey-100 flex items-center justify-center group">
              <Image 
                src={selectedProject.image_url}
                alt={selectedProject.title}
                width={1200}
                height={800}
                className="object-contain w-full h-auto"
                style={{ maxHeight: '70vh', width: 'auto', height: 'auto' }}
              />
              <button
                onClick={handleFullscreen}
                title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
                className="absolute bottom-3 right-3 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-lg flex items-center justify-center text-offwhite-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                {isFullscreen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                )}
              </button>
            </div>

            {/* Project Details */}
            <div className="p-4 md:p-8 overflow-y-auto flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-offwhite-100">{selectedProject.title}</h2>
                <span className="text-xs sm:text-sm text-muted-100 px-3 sm:px-4 py-1 sm:py-2 bg-customdarkgrey-100 rounded-full whitespace-nowrap self-start">
                  {selectedProject.tags.join(', ')}
                </span>
              </div>
              <p className="text-muted-100 text-base md:text-lg leading-relaxed">
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

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="px-4 sm:px-6 py-2 sm:py-3 bg-accent-100 text-offwhite-100 rounded-lg hover:bg-accent-200 transition-colors font-medium text-sm sm:text-base">
                  View Live Project
                </button>
                <button className="px-4 sm:px-6 py-2 sm:py-3 bg-customdarkgrey-100 text-offwhite-100 rounded-lg hover:bg-customdarkgrey-100/80 transition-colors font-medium text-sm sm:text-base">
                  View Case Study
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-customdarkgrey-100 text-offwhite-100 rounded-lg hover:bg-customdarkgrey-100/80 transition-colors font-medium text-sm sm:text-base inline-flex items-center gap-2"
                >
                  {copiedLink ? (
                    <>
                      <svg className="w-4 h-4 text-accent-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section className="w-full bg-customgrey-100 text-offwhite-100 py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Left: Got a project */}
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
                Got a project?<br />
                Let's talk.
              </h2>
              <p className="text-sm md:text-base text-muted-100 mb-4 md:mb-6">
                Feel free to reach out for project inquiries, collaborations, or design discussions. I am open to new opportunities and always ready to connect.
              </p>

              <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                  href="mailto:judelcabahugbagisan@gmail.com"
                  className="text-accent-100 hover:text-accent-200 inline-flex items-center gap-3 font-medium transition-all text-lg md:text-xl group"
                >
                  Send an email
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </motion.div>
            </ScrollReveal>

            {/* Right: Portfolio Stats & Info */}
            <ScrollReveal delay={0.2}>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8">
                Why work with me?
              </h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-customdarkgrey-100/50 p-4 md:p-6 rounded-lg hover:bg-customdarkgrey-100/70 transition-all"
                >
                  <div className="text-accent-100 text-3xl md:text-4xl font-extrabold mb-2">4</div>
                  <div className="text-muted-100 text-xs md:text-sm">Years of Experience</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-customdarkgrey-100/50 p-4 md:p-6 rounded-lg hover:bg-customdarkgrey-100/70 transition-all"
                >
                  <div className="text-accent-100 text-3xl md:text-4xl font-extrabold mb-2">100+</div>
                  <div className="text-muted-100 text-xs md:text-sm">Satisfied Clients</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-customdarkgrey-100/50 p-4 md:p-6 rounded-lg hover:bg-customdarkgrey-100/70 transition-all"
                >
                  <div className="text-accent-100 text-3xl md:text-4xl font-extrabold mb-2">{projectCounts.totalProjects}</div>
                  <div className="text-muted-100 text-xs md:text-sm">Projects Completed</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-customdarkgrey-100/50 p-4 md:p-6 rounded-lg hover:bg-customdarkgrey-100/70 transition-all"
                >
                  <div className="text-accent-100 text-3xl md:text-4xl font-extrabold mb-2">98%</div>
                  <div className="text-muted-100 text-xs md:text-sm">Client Satisfaction</div>
                </motion.div>
              </div>

              {/* Services List */}
              <div className="space-y-2 md:space-y-3">
                {['Brand Identity Design', 'Logo & Visual Design', 'Image Manipulation & Editing', 'Layout & Typography'].map((service, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-offwhite-100 text-sm md:text-base"
                  >
                    <div className="w-2 h-2 bg-accent-100 rounded-full"></div>
                    <span>{service}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="w-full bg-customgrey-100 text-offwhite-100 py-16 md:py-24" id="experience">
        <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-36">
          {/* Heading */}
          <ScrollReveal>
            <div className="text-center mb-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
                Experience <span className="text-accent-200">Summary</span>
              </h2>
              <div className="mx-auto mt-4 mb-16 w-20 h-1 bg-accent-100 rounded-full" />
            </div>
          </ScrollReveal>

          {/* Timeline */}
          <div className="relative">
            {/* Center line — desktop */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-accent-100" />
            {/* Left rail line — mobile */}
            <div className="block md:hidden absolute left-3 top-0 bottom-0 w-0.5 bg-accent-100" />

            <div className="flex flex-col gap-12">
              {experiences.length === 0 ? (
                <p className="text-center text-muted-100">No experience entries yet. Add some from the admin panel.</p>
              ) : experiences.map((item, i) => (
                <div key={i} className="relative flex items-start md:items-center">
                  {/* Timeline dot — desktop */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent-100 z-10" />
                  {/* Timeline dot — mobile */}
                  <div className="block md:hidden absolute left-3 -translate-x-1/2 top-6 w-3 h-3 rounded-full bg-accent-100 z-10" />

                  {/* Card layout */}
                  <div className={`w-full pl-8 md:pl-0 md:w-[calc(50%-2rem)] ${item.side === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}>
                    <ScrollReveal delay={i * 0.1}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="bg-customdarkgrey-100 rounded-2xl p-6 transition-colors"
                      >
                        {item.is_current && (
                          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-customgrey-100 text-accent-200 mb-3">
                            Current
                          </span>
                        )}
                        <h3 className="text-lg sm:text-xl font-bold text-offwhite-100 mb-1">{item.role}</h3>
                        <p className="text-accent-200 font-medium text-sm mb-1">{item.org}</p>
                        <p className="text-muted-100 text-xs">{item.period}</p>
                      </motion.div>
                    </ScrollReveal>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Let's Connect Section */}
      <section className="w-full bg-customdarkgrey-100 text-offwhite-100 py-16 md:py-24" id="contact">
        <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-36">
          <ScrollReveal>
            {/* Heading */}
            <div className="text-center mb-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
                Let&apos;s <span className="text-accent-200">Connect</span>
              </h2>
              <div className="mx-auto mt-4 mb-10 w-20 h-1 bg-accent-100 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-center text-muted-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              Open to design, layout, and web collaboration opportunities.
            </p>

            {/* Cards */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-2xl mx-auto">
              {/* Email Card */}
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex-1 bg-customgrey-100 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-accent-100/60 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-100/20 flex items-center justify-center group-hover:bg-accent-100/40 transition-colors">
                  <svg className="w-6 h-6 text-accent-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-muted-100 text-sm uppercase tracking-widest">Email</span>
                <span className="text-offwhite-100 font-bold text-sm sm:text-base flex items-center gap-2">
                  judelcabahugbagisan@gmail.com
                  <button
                    onClick={handleCopyEmail}
                    title={copied ? 'Copied!' : 'Copy email'}
                    className="ml-1 p-1 rounded hover:bg-accent-100/20 transition-colors"
                  >
                    {copied ? (
                      <svg className="w-4 h-4 text-accent-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-muted-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </span>
              </motion.div>

              {/* Location Card */}
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex-1 bg-customgrey-100 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-accent-100/60 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-100/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-muted-100 text-sm uppercase tracking-widest">Location</span>
                <span className="text-offwhite-100 font-bold text-sm sm:text-base">Davao City, Philippines</span>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-customdarkgrey-100 text-offwhite-100 py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-36">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            {/* Logo/Icon */}
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent-100 flex items-center justify-center text-customdarkgrey-100 font-bold text-xl md:text-2xl mb-4 md:mb-6 cursor-pointer"
            >
              JB
            </motion.div>
            
            {/* Thank you message */}
            <p className="text-sm md:text-base text-muted-100 mb-4 md:mb-6">
              <span className="font-semibold text-offwhite-100">Thanks for scrolling,</span> that's all folks.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 md:gap-6 text-muted-100">
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
          </motion.div>
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        href={`/allprojects?category=${encodeURIComponent(category)}`}
        className={`${
          featured
            ? 'bg-accent-100 text-customdarkgrey-100'
            : 'bg-customgrey-100 text-offwhite-100'
        } p-6 md:p-8 rounded-md shadow-lg flex flex-col justify-between transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl cursor-pointer block h-full`}
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-8 h-8 rounded ${
              featured ? 'bg-customdarkgrey-100 text-offwhite-100' : 'bg-customdarkgrey-100/60 text-offwhite-100'
            } flex items-center justify-center`}
          >
            {icon}
          </motion.div>
          <div className="text-base md:text-lg font-semibold">{title}</div>
        </div>
        <div className={`text-xs md:text-sm mt-6 ${featured ? 'text-customdarkgrey-100' : 'text-muted-100'}`}>
          {projects} Projects
        </div>
      </Link>
    </motion.div>
  );
}

// Animated Text Component
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.05,
            ease: [0.6, 0.01, 0.05, 0.95]
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Scroll Reveal Component
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}

// Project Card Component
function ProjectCard({ project, onClick, delay = 0 }: { project: Project; onClick: () => void; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      onClick={onClick}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="bg-customgrey-100 rounded-lg p-4 md:p-6 hover:bg-customgrey-100/80 transition-all group cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{project.title}</h3>
        <span className="text-xs text-muted-100 px-3 py-1 bg-customdarkgrey-100 rounded-full whitespace-nowrap">
          {project.tags.join(', ')}
        </span>
      </div>
      <div className="rounded-lg h-48 sm:h-56 md:h-64 overflow-hidden relative">
        <Image 
          src={project.image_url}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
    </motion.div>
  );
}
