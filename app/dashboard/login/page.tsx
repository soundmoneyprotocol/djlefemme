'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Store auth token in localStorage
        const data = await response.json();
        localStorage.setItem('dashboardAuth', data.token);
        router.push('/dashboard');
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-md'
      >
        <div className='bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm space-y-6'>
          {/* Header */}
          <div className='text-center space-y-2'>
            <h1 className='text-3xl md:text-4xl font-bold text-white'>Dashboard</h1>
            <p className='text-gray-300'>Tasha Boué Admin Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-300 mb-2'>
                Admin Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter dashboard password'
                className='w-full bg-neutral-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 transition'
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
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50'
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          {/* Footer */}
          <div className='text-center text-xs text-gray-400'>
            <p>Secure admin dashboard</p>
            <p>For Tasha Boué only</p>
          </div>
        </div>

        {/* Background decoration */}
        <div className='mt-8 text-center'>
          <p className='text-gray-500 text-sm'>
            © 2024 Tasha Boué • SoundMoneyOS
          </p>
        </div>
      </motion.div>
    </div>
  );
}
