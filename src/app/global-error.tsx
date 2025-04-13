"use client";

import React from 'react';
import { Inter } from 'next/font/google';
import { translate } from '@/i18n';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({ 
  error,
  reset,
}: { 
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // We can't use the I18nProvider here as this is outside of it
  // Use a simple direct translation with English fallback
  const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir}>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
          <div className="text-center max-w-md">
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-4">
              {translate(lang, 'errorPages.generic.title')}
            </h1>
            
            <p className="text-gray-600 mb-2">
              {translate(lang, 'errorPages.generic.message')}
            </p>
            
            <p className="text-gray-600 mb-8">
              {translate(lang, 'errorPages.generic.suggestion')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => reset()}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-md shadow-md hover:bg-purple-700 transition-colors"
              >
                {translate(lang, 'common.continue')}
              </button>
              
              <a 
                href={`/${lang}`} 
                className="px-6 py-3 bg-white text-purple-600 border border-purple-600 font-medium rounded-md shadow-md hover:bg-gray-50 transition-colors"
              >
                {translate(lang, 'common.home')}
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 