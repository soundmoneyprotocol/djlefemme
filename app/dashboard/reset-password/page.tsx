'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { getSession } from '../../../lib/supabase';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

function ResetPasswordContent() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data } = await getSession();
        if (data?.session) {
          // Redirect to dashboard if already logged in
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };

    checkSession();

    // Check if we have a reset token in URL
    const token = searchParams.get('token');
    if (token) {
      setStep('reset');
    }
  }, [router, searchParams]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send reset email');
        return;
      }

      setMessage('Password reset email sent! Check your inbox for instructions.');
      setEmail('');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Reset request error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const token = searchParams.get('token');
      const response = await fetch('/api/auth/reset-password-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password');
        return;
      }

      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/dashboard/login'), 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center px-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-md'
      >
        <div className='bg-black/50 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm'>
          {/* Header */}
          <div className='flex items-center justify-center mb-8'>
            <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
              <Lock className='text-white' size={24} />
            </div>
          </div>

          <h1 className='text-3xl font-bold text-white text-center mb-2'>Reset Password</h1>
          <p className='text-gray-400 text-center mb-8'>
            {step === 'email'
              ? 'Enter your email to receive a reset link'
              : 'Create a new password'}
          </p>

          {/* Messages */}
          {error && (
            <div className='mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg'>
              <p className='text-red-400 text-sm'>{error}</p>
            </div>
          )}

          {message && (
            <div className='mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg'>
              <p className='text-green-400 text-sm'>{message}</p>
            </div>
          )}

          {/* Request Reset Form */}
          {step === 'email' && (
            <form onSubmit={handleRequestReset} className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-300 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='your@email.com'
                  required
                  className='w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition'
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition mt-6'
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </form>
          )}

          {/* Reset Password Form */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-300 mb-2'>
                  New Password
                </label>
                <input
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Enter new password'
                  required
                  className='w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-300 mb-2'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm new password'
                  required
                  className='w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition'
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition mt-6'
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className='mt-8 text-center'>
            <p className='text-gray-400 text-sm'>
              Remember your password?{' '}
              <a href='/dashboard/login' className='text-purple-400 hover:text-purple-300'>
                Back to login
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center'><p className='text-white'>Loading...</p></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
