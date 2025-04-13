"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/i18n';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight } from 'react-icons/fi';

export default function NewsletterSignup() {
  const { t, dir } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // بسيطة: صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('newsletter.invalidEmail') || 'الرجاء إدخال بريد إلكتروني صالح');
      return;
    }
    
    // محاكاة إرسال البيانات إلى الخادم
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // بعد 5 ثوان، إعادة تعيين النموذج
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 5000);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-gradient-to-r from-helden-purple to-helden-purple-light rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8 md:p-12 lg:p-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white bg-opacity-20 rounded-full mb-6">
            <FiMail className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t('newsletter.title') || 'اشتركي في النشرة البريدية'}
          </h2>
          <p className="text-white text-opacity-90">
            {t('newsletter.description') || 'اشتركي للحصول على آخر العروض والأخبار وتحديثات المنتجات الجديدة'}
          </p>
        </div>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletter.placeholder') || 'أدخلي بريدك الإلكتروني'}
                className={`w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border-2 border-white border-opacity-20 focus:border-white focus:border-opacity-50 rounded-full py-4 px-5 ${dir === 'rtl' ? 'pr-5 pl-14' : 'pl-5 pr-14'} outline-none transition-colors`}
                dir={dir}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`absolute ${dir === 'rtl' ? 'left-1' : 'right-1'} top-1 h-10 w-12 flex items-center justify-center bg-white text-helden-purple rounded-full transition-all hover:bg-helden-gold disabled:opacity-70`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-helden-purple border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiArrowRight />
                )}
              </button>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white bg-red-500 bg-opacity-20 rounded-lg px-4 py-2 mt-3 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
            <div className="text-white text-opacity-80 text-center text-sm mt-4">
              {t('newsletter.privacy') || 'لن نشارك بريدك الإلكتروني مع أي جهة أخرى'}
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white bg-opacity-20 rounded-xl p-6 max-w-md mx-auto"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white text-helden-purple rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t('newsletter.successTitle') || 'تم الاشتراك بنجاح!'}
            </h3>
            <p className="text-white text-opacity-90">
              {t('newsletter.successMessage') || 'شكراً لاشتراكك في النشرة البريدية. سنبقيك على اطلاع بأحدث العروض والمنتجات.'}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 