"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/i18n';
import Image from 'next/image';

export default function Error({ 
  error,
  reset,
}: { 
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, language } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="relative w-64 h-64">
            <Image
              src="/images/error.svg"
              alt="Error illustration"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-4">
          {t('errorPages.serverError.title')}
        </h1>
        
        <p className="text-gray-600 mb-2">
          {t('errorPages.serverError.message')}
        </p>
        
        <p className="text-gray-600 mb-8">
          {t('errorPages.serverError.suggestion')}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-helden-purple text-white font-medium rounded-md shadow-md hover:bg-helden-purple-dark transition-colors"
          >
            {t('common.continue')}
          </button>
          
          <Link 
            href={`/${language}`} 
            className="px-6 py-3 bg-white text-helden-purple border border-helden-purple font-medium rounded-md shadow-md hover:bg-gray-50 transition-colors"
          >
            {t('common.home')}
          </Link>
        </div>
      </div>
    </div>
  );
} 