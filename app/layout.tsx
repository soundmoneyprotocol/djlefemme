import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tasha Boue - Creative Artist',
  description: 'Explore the work of Tasha Boue through stunning video content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body className='bg-white text-black dark:bg-black dark:text-white transition-colors'>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
