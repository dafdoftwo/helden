'use client';

import { useContext } from 'react';
import { Language, translations } from './index';
import { useTranslation as useProviderTranslation } from '@/components/I18nProvider';

export const useTranslation = (forcedLocale?: Language) => {
  if (forcedLocale) {
    const baseContext = useProviderTranslation();
    
    // Create a custom t function that uses the forced locale
    const t = (key: string, replacements?: Record<string, string>): string => {
      const keys = key.split('.');
      let value: any = translations[forcedLocale];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Return the key if translation is missing
        }
      }

      if (typeof value === 'string' && replacements) {
        let result = value;
        for (const [replaceKey, replaceValue] of Object.entries(replacements)) {
          result = result.replace(new RegExp(`{{${replaceKey}}}`, 'g'), replaceValue);
        }
        return result;
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