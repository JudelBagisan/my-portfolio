'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { updateProject, uploadImage } from '@/app/admin/actions';

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

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProjectModal({ project, onClose, onSuccess }: EditProjectModalProps) {
  const [imagePreview, setImagePreview] = useState<string>(project.image_url);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      category: project.category,
      tags: project.tags.join(', '),
      description: project.description,
      year: project.year,
      role: project.role,
      is_public: project.is_public,
    },
  });

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsUploading(true);

      let imageUrl = project.image_url;

      // Upload new image if selected
      if (imageFile) {
        const { data: uploadData, error: uploadError } = await uploadImage(imageFile);

        if (uploadError || !uploadData) {
          toast.error(uploadError || 'Failed to upload image');
          setIsUploading(false);
          return;
        }

        imageUrl = uploadData.publicUrl;
      }

      // Update project
      const tags = data.tags.split(',').map(tag => tag.trim());
      const result = await updateProject(project.id, {
        ...data,
        tags,
        image_url: imageUrl,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Project updated successfully!');
        onSuccess();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-customgrey-100 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-customgrey-100 border-b border-customdarkgrey-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-offwhite-100">Edit Project</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-customdarkgrey-100 rounded-full flex items-center justify-center text-offwhite-100 hover:bg-accent-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-offwhite-100 mb-3">
              Project Image
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-1/2 h-48 rounded-lg overflow-hidden bg-customdarkgrey-100">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-block w-full px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-center text-accent-100 hover:bg-customdarkgrey-100/80 transition-colors">
                  Choose New Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-muted-100 mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-offwhite-100 mb-2">
              Title *
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="w-full px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none focus:ring-2 focus:ring-accent-100"
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
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 focus:outline-none focus:ring-2 focus:ring-accent-100"
              >
                <option value="Design">Design</option>
                <option value="Shirts">Shirts</option>
                <option value="Publications">Publications</option>
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
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none focus:ring-2 focus:ring-accent-100"
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
              className="w-full px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none focus:ring-2 focus:ring-accent-100"
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
              className="w-full px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none focus:ring-2 focus:ring-accent-100"
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
              className="w-full px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none focus:ring-2 focus:ring-accent-100 resize-none"
            />
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>}
          </div>

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <input
              {...register('is_public')}
              type="checkbox"
              id="is_public"
              className="w-5 h-5 rounded border-customgrey-100 text-accent-100 focus:ring-2 focus:ring-accent-100"
            />
            <label htmlFor="is_public" className="text-sm font-medium text-offwhite-100">
              Make this project publicly visible
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
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
                  Updating...
                </span>
              ) : (
                'Update Project'
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-customdarkgrey-100 text-offwhite-100 rounded-lg hover:bg-customdarkgrey-100/80 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
