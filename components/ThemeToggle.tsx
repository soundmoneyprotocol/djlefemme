'use client';

import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className='fixed top-6 right-6 z-50 p-3 rounded-full bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors'
      aria-label='Toggle theme'
    >
      {theme === 'dark' ? (
        <Sun size={20} className='text-yellow-500' />
      ) : (
        <Moon size={20} className='text-blue-600' />
      )}
    </motion.button>
  );
}
