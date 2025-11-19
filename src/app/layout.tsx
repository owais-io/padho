import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTopCategories, getRemainingCategories } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'padho.net - Curated News from The Guardian',
  description: 'Stay informed with AI-powered summaries of the latest news from The Guardian. Discover stories that matter most to you.',
  keywords: 'news, guardian, current events, world news, technology, politics, science',
  authors: [{ name: 'padho.net' }],
  openGraph: {
    title: 'padho.net - Curated News from The Guardian',
    description: 'Stay informed with AI-powered summaries of the latest news from The Guardian.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'padho.net - Curated News from The Guardian',
    description: 'Stay informed with AI-powered summaries of the latest news from The Guardian.',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const topCategories = getTopCategories();
  const remainingCategories = getRemainingCategories();

  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-gray-50 min-h-screen flex flex-col font-sans">
        <Header
          topCategories={topCategories}
          remainingCategories={remainingCategories}
        />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}