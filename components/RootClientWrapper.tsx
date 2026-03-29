'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

export function RootClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeToggle />
      {children}
    </ThemeProvider>
  );
}
