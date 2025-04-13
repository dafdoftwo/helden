import React from 'react';
import './globals.css';
import I18nProvider from '@/components/I18nProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import { Inter } from 'next/font/google';
import { OrganizationStructuredData } from '@/components/StructuredData';
import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import CartProvider from '../context/CartContext';

const inter = Inter({ subsets: ['latin'] });

// Metadata for SEO
export const metadata: Metadata = {
  title: {
    default: 'HELDEN Store | Premium Products for Modern Life',
    template: '%s | HELDEN Store'
  },
  description: 'Discover premium products at HELDEN Store. Shop the latest trends in fashion, accessories, and home decor with worldwide shipping.',
  keywords: ['helden', 'online store', 'ecommerce', 'fashion', 'accessories', 'premium products'],
  openGraph: {
    title: 'HELDEN Store | Premium Products for Modern Life',
    description: 'Discover premium products at HELDEN Store. Shop the latest trends in fashion, accessories, and home decor with worldwide shipping.',
    url: 'https://helden-store.com',
    siteName: 'HELDEN Store',
    locale: 'en',
    type: 'website',
    images: [
      {
        url: 'https://helden-store.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HELDEN Store',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HELDEN Store | Premium Products for Modern Life',
    description: 'Discover premium products at HELDEN Store. Shop the latest trends in fashion, accessories, and home decor with worldwide shipping.',
    images: ['https://helden-store.com/images/twitter-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale || 'en';
  
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <OrganizationStructuredData 
          name="HELDEN Store"
          url="https://helden-store.com"
          logo="https://helden-store.com/logo.png"
          sameAs={[
            "https://facebook.com/heldenstore",
            "https://instagram.com/heldenstore",
            "https://twitter.com/heldenstore"
          ]}
        />
      </head>
      <body className={inter.className}>
        <I18nProvider defaultLanguage={locale as 'en' | 'ar'}>
          <CartProvider>
            <Providers>
              <Header />
              <CartSidebar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </Providers>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
} 