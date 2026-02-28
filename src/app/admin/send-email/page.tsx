'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { sendEmail } from '../email-actions';

const emailSchema = z.object({
  recipient: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function SendEmail() {
  const [isUploading, setIsUploading] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      recipient: '',
      subject: '',
      message: '',
    },
  });

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setAttachment(file);
    }
  };

  const onSubmit = async (data: EmailFormValues) => {
    try {
      setIsUploading(true);

      const result = await sendEmail({
        recipient: data.recipient,
        subject: data.subject,
        message: data.message,
        attachment: attachment || undefined,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Email sent successfully!');
        reset();
        setAttachment(null);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-customdarkgrey-100 text-offwhite-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6 border-b border-customgrey-100">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <svg className="w-6 h-6 text-muted-100 hover:text-offwhite-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Send Email</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-6 md:px-12 py-8">
        <div className="bg-customgrey-100 p-8 rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Recipient */}
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-offwhite-100 mb-2">
                Recipient Email *
              </label>
              <input
                {...register('recipient')}
                type="email"
                id="recipient"
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none focus:ring-2 focus:ring-accent-100"
                placeholder="client@example.com"
              />
              {errors.recipient && <p className="mt-1 text-sm text-red-400">{errors.recipient.message}</p>}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-offwhite-100 mb-2">
                Subject *
              </label>
              <input
                {...register('subject')}
                type="text"
                id="subject"
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none focus:ring-2 focus:ring-accent-100"
                placeholder="Regarding your project..."
              />
              {errors.subject && <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-offwhite-100 mb-2">
                Message *
              </label>
              <textarea
                {...register('message')}
                id="message"
                rows={12}
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none focus:ring-2 focus:ring-accent-100 resize-none"
                placeholder="Write your message here..."
              />
              {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-sm font-medium text-offwhite-100 mb-2">
                Attachment (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex-1 px-4 py-3 bg-customdarkgrey-100 border border-customgrey-100 rounded-lg text-center text-muted-100 hover:bg-customdarkgrey-100/80 transition-colors">
                  {attachment ? (
                    <span className="text-offwhite-100">
                      {attachment.name} ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  ) : (
                    'Choose File'
                  )}
                  <input
                    type="file"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
                {attachment && (
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="px-4 py-3 bg-red-400/20 text-red-400 rounded-lg hover:bg-red-400/30 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-100 mt-2">Maximum file size: 10MB</p>
            </div>

            {/* Info Box */}
            <div className="bg-accent-100/10 border border-accent-100/20 rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-accent-100 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-offwhite-100">
                  <p className="font-medium mb-1">Email Service Notice</p>
                  <p className="text-muted-100">
                    To enable email functionality, you need to configure an email service (Resend or SendGrid) in your Supabase Edge Functions or environment variables.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
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
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Email
                  </span>
                )}
              </button>
              
              <Link
                href="/admin"
                className="px-6 py-3 bg-customdarkgrey-100 text-offwhite-100 rounded-lg hover:bg-customdarkgrey-100/80 transition-all font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
