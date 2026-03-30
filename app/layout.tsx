import type { Metadata } from 'next';
import { RootClientWrapper } from '../components/RootClientWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'Creative Director - Tasha Boue',
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
        <RootClientWrapper>{children}</RootClientWrapper>
      </body>
    </html>
  );
}
