'use client';

import { useContext } from 'react';
import { Language, translations } from './index';
import { useTranslation as useProviderTranslation } from '@/components/I18nProvider';

export const useTranslation = (forcedLocale?: Language) => {
  if (forcedLocale) {
    const baseContext = useProviderTranslation();
    
    // Create a custom t function that uses the forced locale
    const t = (key: string): string => {
      const keys = key.split('.');
      let value = translations[forcedLocale];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Return the key if translation is missing
        }
      }

      return typeof value === 'string' ? value : key;
    };
    
    return {
      ...baseContext,
      language: forcedLocale,
      t,
      dir: forcedLocale === 'ar' ? 'rtl' : 'ltr'
    };
  }
  
  return useProviderTranslation();
};