import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';
import I18nProvider from '@/components/I18nProvider';
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import '@/lib/supabase';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HELDEN - Online Store for Women\'s Clothing',
  description: 'Shop the latest trends in women\'s clothing at HELDEN. Discover our collection of dresses, tops, bottoms, and accessories with worldwide shipping.',
  keywords: 'women\'s clothing, fashion, online store, dresses, tops, bottoms, accessories',
  authors: [{ name: 'HELDEN Store', url: 'https://helden-store.com' }],
  creator: 'HELDEN Store',
  publisher: 'HELDEN Store',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'HELDEN - Online Store for Women\'s Clothing',
    description: 'Shop the latest trends in women\'s clothing at HELDEN.',
    url: 'https://helden-store.com',
    siteName: 'HELDEN Store',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HELDEN - Online Store for Women\'s Clothing',
    description: 'Shop the latest trends in women\'s clothing at HELDEN.',
    creator: '@heldenstore',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: 'https://helden-store.com',
    languages: {
      'en': 'https://helden-store.com/en',
      'ar': 'https://helden-store.com/ar',
    },
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className={inter.className}>
        <I18nProvider>
          <Providers>
            <Header />
            <CartSidebar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
} 