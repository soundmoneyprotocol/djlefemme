'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn, getSession } from '../../../lib/supabase';
import { isAdminUser } from '../../../lib/adminConfig';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const notAdminError = searchParams.get('error') === 'not_admin';

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await getSession();
        if (data?.session) {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const { data, error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message || 'Login failed. Please check your credentials.');
        return;
      }

      if (data?.session) {
        // Check if user is admin
        const userEmail = data.session.user?.email;
        if (!isAdminUser(userEmail)) {
          setError('Admin access required. Your email is not authorized to access this dashboard.');
          return;
        }
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className='w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full'
        />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-black dark:via-purple-900 dark:to-black flex items-center justify-center px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-md'
      >
        <div className='bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm space-y-6'>
          {/* Header */}
          <div className='text-center space-y-2'>
            <h1 className='text-3xl md:text-4xl font-bold text-white'>Dashboard</h1>
            <p className='text-gray-700 dark:text-gray-300'>Tasha Boué Admin Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-300 mb-2'>
                Email
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='your@email.com'
                className='w-full bg-neutral-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-300 mb-2'>
                Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                className='w-full bg-neutral-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition'
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm'
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type='submit'
              disabled={isLoggingIn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50'
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          {/* Footer */}
          <div className='text-center text-xs text-gray-400 space-y-2'>
            <p>Supabase Authentication</p>
            <p>SoundMoney Unified Auth</p>
            <p>© 2024 Tasha Boué • SoundMoneyOS</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
