"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { auth } from '@/lib/supabase';

export default function LoginPage() {
  const { t, language, dir } = useTranslation();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t('auth.errorFields'));
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await auth.signInWithEmail(email, password);
      
      // تحويل المستخدم إلى الصفحة الرئيسية بعد تسجيل الدخول
      router.push(language === 'en' ? '/' : '/ar');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(t('auth.errorLogin'));
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
            {t('auth.welcomeBack')}
          </h1>
          <p className="mt-2 text-gray-600">
            {t('auth.loginSubtitle')}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
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
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <Link 
                href={`${language === 'en' ? '' : '/ar'}/auth/forgot-password`}
                className="text-sm text-helden-purple hover:text-helden-purple-dark"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-helden-purple focus:border-transparent transition-colors"
              placeholder={t('auth.passwordPlaceholder')}
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-helden-purple text-white py-3 px-4 rounded-lg font-medium hover:bg-helden-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              ) : (
                t('auth.login')
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {t('auth.noAccount')}{' '}
            <Link 
              href={`${language === 'en' ? '' : '/ar'}/auth/register`}
              className="font-medium text-helden-purple hover:text-helden-purple-dark"
            >
              {t('auth.createAccount')}
            </Link>
          </p>
        </div>
        
        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              {t('auth.orContinueWith')}
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple-light"
          >
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-helden-purple-light"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1">
              <title>Google-color</title>
              <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Color-" transform="translate(-401.000000, -860.000000)">
                  <g id="Google" transform="translate(401.000000, 860.000000)">
                    <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2668 2.62025,34.3970667 L10.5247955,28.3368 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05" />
                    <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335" />
                    <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853" />
                    <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4" />
                  </g>
                </g>
              </g>
            </svg>
            Google
          </button>
        </div>
      </div>
    </div>
  );
} 