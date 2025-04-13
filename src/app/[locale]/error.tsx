"use client";

import React, { useEffect } from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome, FiShoppingBag, FiRefreshCw, FiHelpCircle } from 'react-icons/fi';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const { t, dir } = useTranslation();
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
  };

  // Quick links for troubleshooting
  const helpfulLinks = [
    {
      icon: <FiHome className="w-5 h-5" />,
      title: t('error.links.home') || "Return to Homepage",
      description: t('error.links.homeDesc') || "Go back to our main page to start fresh",
      link: "/",
      color: "bg-gradient-to-br from-helden-purple-lighter to-white",
    },
    {
      icon: <FiShoppingBag className="w-5 h-5" />,
      title: t('error.links.products') || "Browse Products",
      description: t('error.links.productsDesc') || "Continue shopping our collection",
      link: "/products",
      color: "bg-gradient-to-br from-helden-purple-lighter to-white",
    },
    {
      icon: <FiHelpCircle className="w-5 h-5" />,
      title: t('error.links.help') || "Get Help",
      description: t('error.links.helpDesc') || "Contact our customer support team",
      link: "/contact",
      color: "bg-gradient-to-br from-helden-purple-lighter to-white",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-helden-purple-lighter" dir={dir}>
      {/* Hero Section with 500 message */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <Image
            src="/images/Abayas/Saudi_Abayas_8.jpg"
            alt="500 Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <h1 className="text-8xl font-bold bg-gradient-to-r from-helden-gold to-helden-purple-light bg-clip-text text-transparent">
                500
              </h1>
            </motion.div>
            
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-helden-purple-dark mb-6"
            >
              {t('error.500.title') || 'Server Error'}
            </motion.h2>
            
            <motion.div
              variants={itemVariants}
              className="h-1 w-24 bg-helden-gold mx-auto mb-8"
            ></motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto my-8"
            >
              <Image
                src="/images/error-general.svg"
                alt="500 Error"
                fill
                className="object-contain"
                priority
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1], 
                  opacity: [1, 0.8, 1] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0"
              >
                <Image
                  src="/images/error-glow.svg"
                  alt="Error Glow"
                  fill
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
            
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-700 mb-4"
            >
              {t('error.500.message') || 'Something went wrong on our servers.'}
            </motion.p>
            
            <motion.p
              variants={itemVariants}
              className="text-gray-600 mb-8 max-w-xl mx-auto"
            >
              {t('error.500.suggestion') || "We're working to fix the issue. Please try again later."}
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/" 
                className="bg-helden-purple hover:bg-helden-purple-dark text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                {t('common.backToHome') || 'Back to Home'}
              </Link>
              
              <button 
                onClick={reset}
                className="bg-helden-gold hover:bg-helden-gold-dark text-helden-purple-dark px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FiRefreshCw className="w-5 h-5" />
                {t('error.tryAgain') || 'Try Again'}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Helpful Links Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl font-bold text-helden-purple-dark mb-2">
              {t('error.helpful') || 'Helpful Resources'}
            </h3>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('error.helpfulDesc') || "While we're fixing the issue, here are some helpful links to continue your shopping experience."}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {helpfulLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${link.color} p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-helden-purple text-white rounded-full mb-4">
                    {link.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-helden-purple-dark mb-2">{link.title}</h4>
                  <p className="text-gray-600 mb-4">{link.description}</p>
                  <Link 
                    href={link.link}
                    className="text-helden-purple hover:text-helden-purple-dark font-medium transition-colors flex items-center gap-1"
                  >
                    {t('common.goToLink') || 'Visit'} →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Support Section */}
      <section className="py-16 bg-gradient-to-r from-helden-purple to-helden-purple-dark text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">
              {t('error.support.title') || 'Need Additional Help?'}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {t('error.support.text') || 'If the problem persists, our customer service team is ready to assist you.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-helden-gold hover:bg-helden-gold-dark text-helden-purple-dark px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                {t('error.support.contactBtn') || 'Contact Support'}
              </Link>
              <Link 
                href="/faq" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-helden-purple transition-colors duration-300 flex items-center justify-center gap-2"
              >
                {t('error.support.faqBtn') || 'Visit FAQ'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 