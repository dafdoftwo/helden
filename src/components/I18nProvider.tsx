"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import enTranslations from '@/i18n/locales/en.json';
import arTranslations from '@/i18n/locales/ar.json';

// Define translations object
const translations = {
  en: enTranslations,
  ar: arTranslations
};

// Define the shape of our context
interface I18nContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string, replacements?: Record<string, string>) => string;
  dir: 'ltr' | 'rtl';
}

// Create the context with default values
const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, replacements?: Record<string, string>) => key,
  dir: 'ltr',
});

// Custom hook to use the context
export const useTranslation = () => useContext(I18nContext);

const I18nProvider: React.FC<{
  children: React.ReactNode;
  defaultLanguage?: 'en' | 'ar';
}> = ({ children, defaultLanguage = 'en' }) => {
  const [language, setLanguageState] = useState<'en' | 'ar'>(defaultLanguage);
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    // Detect language from URL
    const path = window.location.pathname;
    
    // Check if URL has a language prefix
    let detectedLanguage: 'en' | 'ar' = defaultLanguage;
    
    if (path.startsWith('/en')) {
      detectedLanguage = 'en';
    } else if (path.startsWith('/ar')) {
      detectedLanguage = 'ar';
    } else {
      // No language prefix - assume English (main domain)
      detectedLanguage = 'en';
    }
    
    // If user has a saved preference, use that instead
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null;
    
    // Use detected language or saved preference
    const initialLanguage = savedLanguage || detectedLanguage;
    
    if (initialLanguage !== language) {
      setLanguageState(initialLanguage);
    }
    
    // Update document attributes
    document.documentElement.dir = initialLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = initialLanguage;
    
    // For RTL support with CSS
    if (initialLanguage === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [defaultLanguage, language]);

  const setLanguage = (lang: 'en' | 'ar') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update document attributes
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // For RTL support with CSS
    if (lang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  // Enhanced translation function
  const t = (key: string, replacements?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    // Navigate through the translation object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation is missing
      }
    }

    // If we have a string value, process any replacements
    if (typeof value === 'string') {
      if (replacements) {
        // Replace any {{variable}} in the string with its value
        let result = value;
        
        for (const [varKey, varValue] of Object.entries(replacements)) {
          const pattern = new RegExp(`{{${varKey}}}`, 'g');
          result = result.replace(pattern, varValue);
        }
        
        return result;
      }
      return value;
    }

    return key; // Return the key if translation is not a string
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nProvider; 