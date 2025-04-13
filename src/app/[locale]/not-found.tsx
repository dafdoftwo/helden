"use client";

import React from 'react';
import { useTranslation } from '@/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome, FiShoppingBag, FiArrowLeft, FiSearch } from 'react-icons/fi';

export default function NotFoundPage() {
  const { t, dir } = useTranslation();

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

  // Featured products to suggest
  const suggestedCategories = [
    {
      image: "/images/Abayas/Saudi_Abayas_1.jpg",
      title: t('categories.abayas') || "عبايات",
      link: "/products/category/abayas",
    },
    {
      image: "/images/Abayas/Saudi_Abayas_2.jpg",
      title: t('categories.casual') || "ملابس كاجوال",
      link: "/products/category/casual",
    },
    {
      image: "/images/Abayas/Saudi_Abayas_3.jpg",
      title: t('categories.formal') || "ملابس رسمية",
      link: "/products/category/formal",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-helden-purple-lighter" dir={dir}>
      {/* Hero Section with 404 message */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <Image
            src="/images/Abayas/Saudi_Abayas_5.jpg"
            alt="404 Background"
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
              <h1 className="text-8xl font-bold bg-gradient-to-r from-helden-purple to-helden-purple-light bg-clip-text text-transparent">
                404
              </h1>
            </motion.div>
            
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-helden-purple-dark mb-6"
            >
              {t('error.404.title') || 'Page Not Found'}
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
                src="/images/error-404.svg"
                alt="404 Error"
                fill
                className="object-contain"
                priority
              />
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 6, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0"
              >
                <Image
                  src="/images/error-elements.svg"
                  alt="Floating Elements"
                  fill
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
            
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-700 mb-4"
            >
              {t('error.404.message') || 'The page you\'re looking for doesn\'t exist or has been moved.'}
            </motion.p>
            
            <motion.p
              variants={itemVariants}
              className="text-gray-600 mb-8 max-w-xl mx-auto"
            >
              {t('error.404.suggestion') || 'You might have mistyped the address or the page may have been moved.'}
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
              
              <Link 
                href="/products" 
                className="bg-transparent border-2 border-helden-purple text-helden-purple px-8 py-3 rounded-full font-medium hover:bg-helden-purple hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FiShoppingBag className="w-5 h-5" />
                {t('common.continueShoping') || 'Continue Shopping'}
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className="bg-white border-2 border-helden-gold text-helden-purple-dark px-8 py-3 rounded-full font-medium hover:bg-helden-gold hover:text-helden-purple-dark transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FiArrowLeft className="w-5 h-5" />
                {t('common.goBack') || 'Go Back'}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h3 className="text-2xl font-bold text-helden-purple-dark mb-4">
              {t('error.lookingFor') || 'Looking for something specific?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('error.trySearch') || 'Try searching for what you need or explore our popular categories.'}
            </p>
            
            <div className="relative max-w-lg mx-auto mb-10">
              <form action="/search" method="get" className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder={t('common.searchPlaceholder') || "Search for products..."}
                  className="w-full px-5 py-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-helden-purple focus:border-transparent shadow-sm"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-helden-purple hover:text-helden-purple-dark"
                >
                  <FiSearch className="text-xl" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Suggested Categories */}
      <section className="py-16 bg-gradient-to-r from-helden-purple-lighter to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-2xl font-bold text-helden-purple-dark mb-2">
              {t('error.exploreCategories') || 'Explore Our Popular Categories'}
            </h3>
            <div className="h-1 w-24 bg-helden-gold mx-auto mb-6"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {suggestedCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={category.link} className="block">
                  <div className="relative rounded-xl overflow-hidden shadow-lg h-64 mb-3 group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-helden-purple-dark/70 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <h4 className="text-xl font-semibold mb-1">{category.title}</h4>
                        <p className="text-white/80 text-sm">
                          {t('common.shopNow') || 'Shop Now'} →
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-helden-purple text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">
              {t('error.emailSignup.title') || 'Stay Updated with Our Collection'}
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {t('error.emailSignup.text') || 'Subscribe to our newsletter and be the first to know about new arrivals and exclusive offers.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder={t('common.emailAddress') || "Your email address"}
                className="bg-white/10 text-white placeholder:text-white/60 border border-white/30 px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white flex-grow"
              />
              <button 
                type="button" 
                className="bg-helden-gold hover:bg-helden-gold-dark text-helden-purple-dark px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex-shrink-0"
              >
                {t('common.subscribe') || 'Subscribe'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 