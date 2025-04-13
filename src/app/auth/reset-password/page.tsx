"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n';
import { auth } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const { t, language, dir } = useTranslation();
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من إدخال جميع البيانات
    if (!password || !confirmPassword) {
      setError(t('auth.errorFields'));
      return;
    }
    
    // التحقق من تطابق كلمات المرور
    if (password !== confirmPassword) {
      setError(t('auth.errorPasswordMatch'));
      return;
    }
    
    // التحقق من طول كلمة المرور
    if (password.length < 8) {
      setError(t('auth.errorPasswordLength'));
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await auth.updatePassword(password);
      
      // إظهار رسالة النجاح
      setSuccess(true);
      
      // مسح البيانات بعد التحديث الناجح
      setPassword('');
      setConfirmPassword('');
      
      // تحويل المستخدم بعد 3 ثوان
      setTimeout(() => {
        router.push(`${language === 'en' ? '' : '/ar'}/auth/login`);
      }, 3000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(t('auth.errorUpdatePassword'));
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
            {t('auth.resetYourPassword')}
          </h1>
          <p className="mt-2 text-gray-600">
            {t('auth.resetPasswordSubtitle')}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <p>{t('auth.successPasswordReset')}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.newPassword')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-helden-purple focus:border-transparent transition-colors"
              placeholder={t('auth.newPasswordPlaceholder')}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {t('auth.passwordRequirements')}
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.confirmNewPassword')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-helden-purple focus:border-transparent transition-colors"
              placeholder={t('auth.confirmNewPasswordPlaceholder')}
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
                t('auth.resetPassword')
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {t('auth.backToLoginPrompt')}{' '}
            <Link 
              href={`${language === 'en' ? '' : '/ar'}/auth/login`}
              className="font-medium text-helden-purple hover:text-helden-purple-dark"
            >
              {t('auth.backToLogin')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 