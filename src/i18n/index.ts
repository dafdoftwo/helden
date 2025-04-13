import { useContext } from 'react';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

export type Language = 'en' | 'ar';

export interface TranslationKey {
  [key: string]: string | TranslationKey;
}

export type Translations = {
  [key in Language]: any;
};

export const translations: Translations = {
  en: enTranslations,
  ar: arTranslations,
};

// Re-export the useTranslation hook from our I18nProvider
export { useTranslation } from '@/components/I18nProvider';

// Enhanced translation function with replacement support
export const translate = (language: Language, key: string, replacements?: Record<string, any>): string => {
  const keys = key.split('.');
  let current: any = translations[language];

  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      console.warn(`Translation key not found: ${key} for language: ${language}`);
      return key; // Return the key as fallback
    }
  }

  if (typeof current === 'string') {
    // Handle replacements if provided
    if (replacements) {
      return Object.entries(replacements).reduce((str, [key, value]) => {
        return str.replace(new RegExp(`{${key}}`, 'g'), String(value));
      }, current);
    }
    return current;
  }

  console.warn(`Invalid translation key: ${key} for language: ${language}`);
  return key; // Return the key as fallback
}; 