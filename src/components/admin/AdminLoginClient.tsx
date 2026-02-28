'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success('Login successful!');
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-customdarkgrey-100 flex items-center justify-center px-4 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#313546',
            color: '#FAFAF9',
            border: '1px solid #44405B',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#906bff', secondary: '#232633' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#232633' },
          },
        }}
      />
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center text-offwhite-100 font-bold text-2xl mx-auto mb-4">
            JB
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-offwhite-100 mb-2">Admin Portal</h1>
          <p className="text-muted-100">Sign in to manage your portfolio</p>
        </div>

        {/* Login Form */}
        <div className="bg-customgrey-100 rounded-lg p-8 shadow-2xl animate-fadeInUp animation-delay-200">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-offwhite-100 mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-accent-100/30 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none transition-all"
                placeholder="admin@example.com"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-offwhite-100 mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-customdarkgrey-100 border border-accent-100/30 rounded-lg text-offwhite-100 placeholder-muted-100 focus:outline-none transition-all"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-accent-100 text-offwhite-100 rounded-lg hover:bg-accent-200 transition-all font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-accent-100/30">
            <p className="text-center text-sm text-muted-100">Secure admin access only</p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-accent-100 hover:text-accent-200 transition-colors inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
