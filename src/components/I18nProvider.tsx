"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import enTranslations from '@/i18n/translations/en.json';
import arTranslations from '@/i18n/translations/ar.json';

// Define translations object type
type TranslationObject = {
  [key: string]: string | TranslationObject;
};

// Define translations object
const translations: {
  en: TranslationObject;
  ar: TranslationObject;
} = {
  en: enTranslations as TranslationObject,
  ar: arTranslations as TranslationObject
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

  // Improved translation function
  const t = (key: string, replacements?: Record<string, string>): string => {
    // --- DEBUG LOG START ---
    console.log(`[i18n] Attempting to translate key: "${key}" for language: "${language}"`);
    // --- DEBUG LOG END ---

    if (!key || typeof key !== 'string') {
      // --- DEBUG LOG START ---
      console.warn(`[i18n] Invalid key received:`, key);
      // --- DEBUG LOG END ---
      return key || '';
    }
    
    try {
      const keys = key.split('.');
      let current: any = translations[language];
      
      // Navigate through nested objects
      for (const k of keys) {
        if (current === undefined || current === null || typeof current !== 'object') { // Added type check
          // --- DEBUG LOG START ---
          console.warn(`[i18n] Key part "${k}" not found or invalid structure in "${key}" for language "${language}". Current structure:`, current);
          // --- DEBUG LOG END ---
          return key; // Return the original key as fallback
        }
        
        current = current[k];
      }
      
      // Check if we got a valid string
      if (typeof current === 'string') {
        let result = current;
        // Apply replacements
        if (replacements) {
          for (const [replaceKey, replaceValue] of Object.entries(replacements)) {
            result = result.replace(new RegExp(`{{${replaceKey}}}`, 'g'), replaceValue);
          }
        }
        // --- DEBUG LOG START ---
        // console.log(`[i18n] Successfully translated "${key}" to: "${result}"`); // Uncomment for successful logs
        // --- DEBUG LOG END ---
        return result;
      }
      
      // --- DEBUG LOG START ---
      console.warn(`[i18n] Translation key "${key}" resolved, but is not a string for language "${language}". Value:`, current);
       // --- DEBUG LOG END ---
      return key; // Return the original key as fallback
    } catch (error) {
      // --- DEBUG LOG START ---
      console.error(`[i18n] Error translating key "${key}":`, error);
      // --- DEBUG LOG END ---
      return key; // Return the original key as fallback in case of any error
    }
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nProvider; 