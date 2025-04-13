"use client";

import React from 'react';
import { useTranslation } from '@/i18n';
import { usePathname, useRouter } from 'next/navigation';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    
    // Get the path without locale prefix
    let pathWithoutLocale = pathname;
    
    // Handle English and Arabic paths
    if (pathname.startsWith('/en/')) {
      // Remove /en/ prefix
      pathWithoutLocale = pathname.substring(3);
    } else if (pathname === '/en') {
      pathWithoutLocale = '/';
    } else if (pathname.startsWith('/ar/')) {
      // Remove /ar/ prefix
      pathWithoutLocale = pathname.substring(3);
    } else if (pathname === '/ar') {
      pathWithoutLocale = '/';
    }
    
    // Navigate to the same route but with the new locale
    if (newLanguage === 'en') {
      // For English, use /en prefix
      router.push(pathWithoutLocale === '/' ? '/en' : `/en${pathWithoutLocale}`);
    } else {
      // For Arabic, use /ar prefix
      router.push(pathWithoutLocale === '/' ? '/ar' : `/ar${pathWithoutLocale}`);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 text-gray-600 hover:text-helden-purple-dark transition-colors"
      aria-label="Toggle Language"
    >
      <div className="flex items-center">
        <span className="text-sm font-medium">{language === 'en' ? 'AR' : 'EN'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      </div>
    </button>
  );
};

export default LanguageSwitcher; 