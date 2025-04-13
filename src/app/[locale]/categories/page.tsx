"use client";

import React from 'react';
import { useTranslation } from '@/i18n/client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NewsletterSignup from '@/components/NewsletterSignup';

// Categories data
const categories = [
  {
    id: 'abayas',
    name: 'عبايات',
    name_en: 'Abayas',
    description: 'مجموعة متنوعة من العبايات العصرية والأنيقة للمرأة السعودية',
    description_en: 'A diverse collection of modern and elegant abayas for Saudi women',
    image: '/images/categories/abayas-banner.jpg',
    color: 'from-purple-900 to-purple-800',
    count: 120
  },
  {
    id: 'casual',
    name: 'ملابس كاجوال',
    name_en: 'Casual Wear',
    description: 'ملابس يومية مريحة وعصرية تناسب مختلف الأذواق',
    description_en: 'Comfortable and trendy everyday clothing for various tastes',
    image: '/images/categories/casual-banner.jpg',
    color: 'from-teal-800 to-teal-700',
    count: 85
  },
  {
    id: 'formal',
    name: 'ملابس رسمية',
    name_en: 'Formal Wear',
    description: 'أناقة وفخامة مع تشكيلة متنوعة من الملابس الرسمية',
    description_en: 'Elegance and luxury with a varied collection of formal attire',
    image: '/images/categories/formal-banner.jpg',
    color: 'from-indigo-900 to-indigo-800',
    count: 64
  },
  {
    id: 'sportswear',
    name: 'ملابس رياضية',
    name_en: 'Sportswear',
    description: 'ملابس رياضية عصرية لممارسة الرياضة بأناقة وراحة',
    description_en: 'Modern sportswear for exercising with elegance and comfort',
    image: '/images/categories/sportswear-banner.jpg',
    color: 'from-blue-800 to-blue-700',
    count: 48
  },
  {
    id: 'shapewear',
    name: 'مشدات الجسم',
    name_en: 'Shapewear',
    description: 'مشدات حديثة لإبراز جمال قوامك بشكل مثالي',
    description_en: 'Modern shapewear to highlight your figure perfectly',
    image: '/images/categories/shapewear-banner.jpg',
    color: 'from-pink-900 to-pink-800',
    count: 32
  }
];

export default function CategoriesPage({ params }: { params: { locale: string } }) {
  const { t } = useTranslation();
  const locale = params.locale;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-helden-purple-lighter">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-helden-purple to-helden-purple-dark py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <Image
            src="/images/categories/categories-hero.jpg"
            alt="Categories background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t('categories.title') || 'Browse Our Collections'}
            </h1>
            <p className="text-white text-opacity-90 text-lg md:text-xl max-w-3xl mx-auto">
              {t('categories.subtitle') || 'Discover the perfect style that matches your taste and personality.'}
            </p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10"
            >
              <Link
                href="#categories"
                className="inline-block bg-white text-helden-purple font-medium px-8 py-3 rounded-full hover:bg-helden-gold hover:text-white transition-colors duration-300 shadow-lg"
              >
                {t('categories.exploreNow') || 'Explore Now'}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Categories Section */}
      <div id="categories" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('categories.categories') || 'Our Categories'}
          </h2>
          <div className="h-1 w-20 bg-helden-gold mx-auto"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            {t('categories.categoriesSubtitle') || 'Browse through our exclusive collections designed to suit every style and occasion.'}
          </p>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12 md:space-y-20"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} rounded-3xl overflow-hidden shadow-xl bg-white`}
            >
              <div className="md:w-1/2 relative min-h-[300px] md:min-h-[400px]">
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-90 mix-blend-multiply`}></div>
                <Image
                  src={category.image}
                  alt={locale === 'ar' ? category.name : category.name_en}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <span className="text-sm text-helden-purple font-medium mb-2">
                  {category.count}+ {t('categories.products') || 'products'}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {locale === 'ar' ? category.name : category.name_en}
                </h3>
                <p className="text-gray-600 mb-8 md:pr-8">
                  {locale === 'ar' ? category.description : category.description_en}
                </p>
                <Link
                  href={`/${locale}/categories/${category.id}`}
                  className="inline-flex items-center justify-center bg-helden-purple hover:bg-helden-purple-dark text-white font-medium px-6 py-3 rounded-full transition-colors w-full md:w-auto md:self-start"
                >
                  {t('categories.exploreCategory') || 'Explore Category'}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Benefits Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('categories.whyShopWithUs') || 'Why Shop With Us'}
            </h2>
            <div className="h-1 w-20 bg-helden-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-helden-purple-lighter rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-helden-purple text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('categories.benefits.quality') || 'Premium Quality'}
              </h3>
              <p className="text-gray-600">
                {t('categories.benefits.qualityDesc') || 'We source only the finest materials for all our products.'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-helden-purple-lighter rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-helden-purple text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('categories.benefits.fastDelivery') || 'Fast Delivery'}
              </h3>
              <p className="text-gray-600">
                {t('categories.benefits.fastDeliveryDesc') || 'Quick delivery across Saudi Arabia within 1-3 business days.'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-helden-purple-lighter rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-helden-purple text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('categories.benefits.securePayment') || 'Secure Payment'}
              </h3>
              <p className="text-gray-600">
                {t('categories.benefits.securePaymentDesc') || 'Multiple secure payment options including Mada, credit cards, and cash on delivery.'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-helden-purple-lighter rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-helden-purple text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('categories.benefits.easyReturns') || 'Easy Returns'}
              </h3>
              <p className="text-gray-600">
                {t('categories.benefits.easyReturnsDesc') || 'Hassle-free returns within 14 days of purchase.'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="py-16 md:py-24 px-4">
        <NewsletterSignup />
      </div>
    </main>
  );
} 