"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { auth } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const { t, language, dir } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError(t('auth.errorEmailRequired'));
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await auth.resetPassword(email);
      
      // إظهار رسالة النجاح
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(t('auth.errorResetPassword'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-helden-gradient py-12 flex items-center justify-center" dir={dir}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 hover:shadow-helden-purple/20">
        <div className="text-center mb-8">
          <Link href={language === 'en' ? '/' : '/ar'} className="inline-block">
            <Image 
              src="/images/logo/helden-logo.png" 
              alt="HELDEN" 
              width={120} 
              height={60}
              className="mx-auto"
            />
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-helden-purple-dark">
            {t('auth.forgotPassword')}
          </h1>
          <p className="mt-2 text-gray-600">
            {t('auth.forgotPasswordSubtitle')}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <p>{t('auth.resetPasswordEmailSent')}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-helden-purple focus:border-transparent transition-colors"
              placeholder={t('auth.emailPlaceholder')}
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-helden-purple text-white py-3 px-4 rounded-lg font-medium hover:bg-helden-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              ) : (
                t('auth.sendResetLink')
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {t('auth.rememberPassword')}{' '}
            <Link 
              href={`${language === 'en' ? '' : '/ar'}/auth/login`}
              className="font-medium text-helden-purple hover:text-helden-purple-dark"
            >
              {t('auth.backToLogin')}
            </Link>
          </p>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex justify-center space-x-6 rtl:space-x-reverse">
            <Link 
              href={`${language === 'en' ? '' : '/ar'}/help`}
              className="text-sm text-gray-500 hover:text-helden-purple transition-colors"
            >
              {t('auth.needHelp')}
            </Link>
            <Link 
              href={`${language === 'en' ? '' : '/ar'}/contact`}
              className="text-sm text-gray-500 hover:text-helden-purple transition-colors"
            >
              {t('auth.contactSupport')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 