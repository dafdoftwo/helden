"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/i18n';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { language } = useTranslation();
  
  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      // Get the auth code from the URL
      const hash = window.location.hash;
      const query = new URLSearchParams(window.location.search);
      
      try {
        if (hash || query.get('code')) {
          // Process the OAuth callback
          const { error } = await supabase.auth.exchangeCodeForSession(
            query.get('code') || hash.substring(1)
          );
          
          if (error) {
            console.error('Error exchanging code for session:', error);
            throw error;
          }
        }
        
        // Redirect to dashboard or profile page
        router.push(`/${language === 'en' ? '' : language}/profile`);
      } catch (error) {
        console.error('Error in auth callback:', error);
        // Redirect to login page on error
        router.push(`/${language === 'en' ? '' : language}/auth/login`);
      }
    };
    
    handleAuthCallback();
  }, [router, language]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-helden-gradient">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-helden-purple border-t-transparent mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {language === 'en' ? 'Processing your login...' : 'جاري معالجة تسجيل الدخول...'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' ? 'Please wait while we verify your credentials.' : 'يرجى الانتظار بينما نتحقق من بيانات اعتماد حسابك.'}
        </p>
      </div>
    </div>
  );
} 