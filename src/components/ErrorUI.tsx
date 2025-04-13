"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../i18n';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ErrorUIProps {
  statusCode?: number;
  title?: string;
  message?: string;
  suggestion?: string;
  showHomeLink?: boolean;
  showContinueShoppingLink?: boolean;
  reset?: () => void;
}

const ErrorUI = ({
  statusCode,
  title,
  message,
  suggestion,
  showHomeLink = true,
  showContinueShoppingLink = true,
  reset,
}: ErrorUIProps) => {
  const { t, language, dir } = useTranslation();
  const router = useRouter();

  // Use default error text based on status code or fall back to general error
  const errorType = statusCode === 404 ? '404' : 
                   statusCode === 500 ? '500' : 'general';
  
  const errorTitle = title || t(`error.${errorType}.title`);
  const errorMessage = message || t(`error.${errorType}.message`);
  const errorSuggestion = suggestion || t(`error.${errorType}.suggestion`);
  
  // Display appropriate image based on error type
  const errorImage = statusCode === 404 
    ? '/images/error-404.svg' 
    : '/images/error-general.svg';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-white to-helden-purple-lighter flex flex-col items-center justify-center px-4 py-12" 
      dir={dir}
    >
      <motion.div 
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="p-8 sm:p-12 flex flex-col items-center text-center">
          <motion.div variants={itemVariants} className="mb-8">
            {statusCode && (
              <h1 className="text-7xl font-bold bg-gradient-to-r from-helden-purple to-helden-purple-light bg-clip-text text-transparent">
                {statusCode}
              </h1>
            )}
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-2xl sm:text-3xl font-bold text-helden-purple-dark mb-4"
          >
            {errorTitle}
          </motion.h2>
          
          <motion.div 
            variants={itemVariants}
            className="relative w-60 h-60 sm:w-72 sm:h-72 my-6"
          >
            <Image
              src={errorImage}
              alt={errorTitle}
              fill
              className="object-contain"
              priority
            />
          </motion.div>
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 text-lg mb-3"
          >
            {errorMessage}
          </motion.p>
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-500 mb-8"
          >
            {errorSuggestion}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            {showHomeLink && (
              <Link href="/" className="bg-helden-purple hover:bg-helden-purple-dark text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2">
                {t('common.backToHome')}
              </Link>
            )}
            
            {showContinueShoppingLink && (
              <Link href="/products" className="bg-transparent border-2 border-helden-purple text-helden-purple px-8 py-3 rounded-full font-medium hover:bg-helden-purple hover:text-white transition-colors duration-300 flex items-center justify-center gap-2">
                {t('common.continueShoping')}
              </Link>
            )}
            
            {reset && (
              <button 
                onClick={reset}
                className="bg-white border-2 border-helden-purple-dark text-helden-purple-dark px-8 py-3 rounded-full font-medium hover:bg-helden-purple-dark hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {t('error.tryAgain')}
              </button>
            )}
            
            <button 
              onClick={() => router.back()}
              className="bg-white border-2 border-helden-gold text-helden-purple-dark px-8 py-3 rounded-full font-medium hover:bg-helden-gold hover:text-helden-purple-dark transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {t('common.goBack')}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorUI; 