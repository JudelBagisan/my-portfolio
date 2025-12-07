'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { createProject, uploadImage } from '../actions';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().min(1, 'At least one tag is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
  role: z.string().min(1, 'Role is required'),
  is_public: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function AddProject() {
  const router = useRouter();
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      role: 'Lead Designer',
      is_public: true,
      year: new Date().getFullYear().toString(),
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    } else {
      toast.error('Please drop an image file');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file: File) => {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    if (!imageFile) {
      toast.error('Please upload an image');
      return;
    }

    try {
      setIsUploading(true);

      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadImage(imageFile);

      if (uploadError || !uploadData) {
        toast.error(uploadError || 'Failed to upload image');
        setIsUploading(false);
        return;
      }

      // Create project with image URL
      const tags = data.tags.split(',').map(tag => tag.trim());
      const result = await createProject({
        ...data,
        tags,
        image_url: uploadData.publicUrl,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Project created successfully!');
        reset();
        setImagePreview(null);
        setImageFile(null);
        router.push('/admin/manage-projects');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-customgrey-100 to-customdarkgrey-100 text-offwhite-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <svg className="w-6 h-6 text-muted-100 hover:text-offwhite-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Add New Project</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload */}
          <div className="bg-customgrey-100 p-6 rounded-lg">
            <label className="block text-sm font-medium text-offwhite-100 mb-3">
              Project Image *
            </label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging 
                  ? 'border-accent-100 bg-accent-100/10' 
                  : 'border-gray-500 hover:border-accent-100'
              }`}
            >
              {imagePreview ? (
                <div className="relative">
                  <div className="relative w-full h-64 mb-4">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="text-sm text-accent-100 hover:text-accent-200"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-muted-100 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-muted-100 mb-2">Drag and drop your image here, or</p>
                  <label className="cursor-pointer text-accent-100 hover:text-accent-200 font-medium">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-muted-100 mt-2">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-customgrey-100 p-6 rounded-lg space-y-6">
            <h3 className="text-xl font-bold mb-4">Basic Information</h3>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-offwhite-100 mb-2">
                Project Title *
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-gray-500 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none"
                placeholder="e.g., Brand Identity Design"
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
            </div>

            {/* Category & Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-offwhite-100 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  id="category"
                  className="w-full px-4 py-3 bg-customdarkgrey-100 border border-gray-500 rounded-lg text-offwhite-100 focus:outline-none"
                >
                  <option value="">Select category</option>
                  <option value="Design">Design</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Branding">Branding</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category.message}</p>}
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-offwhite-100 mb-2">
                  Year *
                </label>
                <input
                  {...register('year')}
                  type="text"
                  id="year"
                  className="w-full px-4 py-3 bg-customdarkgrey-100 border border-gray-500 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none"
                  placeholder="2024"
                />
                {errors.year && <p className="mt-1 text-sm text-red-400">{errors.year.message}</p>}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-offwhite-100 mb-2">
                Tags * <span className="text-muted-100 text-xs">(comma-separated)</span>
              </label>
              <input
                {...register('tags')}
                type="text"
                id="tags"
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-gray-500 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none"
                placeholder="Branding, Logo, Identity"
              />
              {errors.tags && <p className="mt-1 text-sm text-red-400">{errors.tags.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-offwhite-100 mb-2">
                Your Role *
              </label>
              <input
                {...register('role')}
                type="text"
                id="role"
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-gray-500 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none"
                placeholder="Lead Designer"
              />
              {errors.role && <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-offwhite-100 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={6}
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-gray-500 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none resize-none"
                placeholder="Describe your project in detail..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>}
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-3">
              <input
                {...register('is_public')}
                type="checkbox"
                id="is_public"
                className="w-5 h-5 rounded border-gray-500 text-accent-100 focus:outline-none"
              />
              <label htmlFor="is_public" className="text-sm font-medium text-offwhite-100">
                Make this project publicly visible
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 px-6 py-3 bg-accent-100 text-offwhite-100 rounded-lg hover:bg-accent-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Project'
              )}
            </button>
            
            <Link
              href="/admin"
              className="px-6 py-3 bg-customgrey-100 text-offwhite-100 rounded-lg hover:bg-customdarkgrey-100 transition-all font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
