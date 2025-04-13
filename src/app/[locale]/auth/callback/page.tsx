"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/components/I18nProvider';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (session) {
          // Refresh the user context
          await refreshUser();
          
          // Redirect to account page
          router.push(`/${language}/account`);
        } else {
          // If no session, redirect to login
          setError(t('auth.authError'));
          setTimeout(() => {
            router.push(`/${language}/auth/login`);
          }, 3000);
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || t('auth.authError'));
        
        // Redirect to login on error
        setTimeout(() => {
          router.push(`/${language}/auth/login`);
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router, language, refreshUser, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {error ? (
          <div>
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{t('auth.redirectingToLogin')}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              {t('auth.authenticating')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('auth.pleaseWait')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 