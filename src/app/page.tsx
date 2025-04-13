"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CategoryCard from '../components/CategoryCard';
import FeaturedProducts from '../components/FeaturedProducts';
import TestimonialSlider from '@/components/TestimonialSlider';
import Contact from '@/components/Contact';
import Newsletter from '@/components/Newsletter';
import { useTranslation } from '../i18n';
import { motion } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa';

export default function HomePage() {
  const { t, language } = useTranslation();

  // Function to get path with locale
  const getLocalizedHref = (path: string): string => {
    return language === 'en' ? `/${path}` : `/${language}/${path}`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/Abayas/SaudiAbayas.jpg" 
            alt="HELDEN Fashion"
            fill
            priority
            className="object-cover brightness-75"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <motion.div 
            className="max-w-xl bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="inline-block bg-helden-gold text-helden-purple-dark px-4 py-1 rounded-full text-sm font-bold mb-4 animate-pulse"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {t('home.hero.exclusive')}
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-helden-purple-dark leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={getLocalizedHref('products')} className="bg-helden-purple hover:bg-helden-purple-dark text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2">
                {t('common.shopNow')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href={getLocalizedHref('categories')} className="bg-transparent border-2 border-helden-purple text-helden-purple px-8 py-3 rounded-full font-medium hover:bg-helden-purple hover:text-white transition-colors duration-300">
                {t('common.exploreCategories')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Promotion Banner */}
      <section className="bg-helden-gold-light py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-center">
            <div className="mr-3 text-helden-purple-dark">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-helden-purple-dark font-medium">
              <span className="font-bold">{t('promotions.limitedOffer')}</span> — {t('promotions.discount')} <span className="font-bold underline">HELDEN15</span>
            </p>
          </div>
        </div>
      </section>
      
      {/* Welcome Message */}
      <section className="py-16 bg-gradient-to-r from-helden-purple-lighter to-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-helden-purple-dark">{t('home.welcome.title', { brandName: t('common.brandName') })}</h2>
            <div className="w-24 h-1 bg-helden-gold mx-auto mb-8"></div>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-700">
              {t('home.welcome.text', { brandName: t('common.brandName') })}
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-helden-purple-dark">{t('home.collections')}</h2>
            <div className="w-24 h-1 bg-helden-gold mx-auto mb-4"></div>
            <p className="max-w-2xl mx-auto text-gray-600">{t('home.collectionsSubtitle')}</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <CategoryCard 
                title={t('categories.abayas')}
                image="/images/Abayas/Saudi_Abayas_3.jpg" 
                href={getLocalizedHref('products/category/abayas')}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <CategoryCard 
                title={t('categories.casual')}
                image="/images/casual_clothes/Saudi_casual_clothes_1.jpg" 
                href={getLocalizedHref('products/category/casual')}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <CategoryCard 
                title={t('categories.formal')}
                image="/images/formal_wear/formal_wear_1.jpg" 
                href={getLocalizedHref('products/category/formal')}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <CategoryCard 
                title={t('categories.sports')}
                image="/images/Saudi-women-sportswear/Saudi_women_sportswear.jpg" 
                href={getLocalizedHref('products/category/sports')}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <CategoryCard 
                title={t('categories.bodyShaper')}
                image="/images/women_body_shapers/women_body_shapers.jpg" 
                href={getLocalizedHref('products/category/body-shapers')}
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-helden-purple-dark">
              {t('home.featuredProducts.title')}
            </h2>
            <Link 
              href={getLocalizedHref('/products')}
              className="mt-4 md:mt-0 text-helden-purple hover:text-helden-purple-dark transition-colors inline-flex items-center group"
            >
              {t('home.featuredProducts.viewAll')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSlider />

      {/* New Arrivals Banner */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/formal_wear/formal_wear_1.jpg" 
            alt="New Arrivals"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-helden-purple/90 to-helden-purple-light/90 z-10"></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">{t('home.newArrivals.title')}</h2>
                <p className="text-xl text-white/80 mb-8">{t('home.newArrivals.subtitle')}</p>
                <Link href={getLocalizedHref('products/new-arrivals')} className="inline-flex items-center gap-2 bg-helden-gold hover:bg-helden-gold-dark text-helden-purple-dark px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:translate-x-2">
                  {t('home.newArrivals.cta')}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </motion.div>
            </div>
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative h-80 w-80 rounded-full overflow-hidden border-8 border-white/20"
              >
                <Image 
                  src="/images/Abayas/Saudi_Abayas_2.jpg" 
                  alt="New Collection"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Instagram Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-helden-purple-dark mb-4">Follow Us on Instagram</h2>
            <div className="w-24 h-1 bg-helden-gold mx-auto mb-4"></div>
            <p className="max-w-2xl mx-auto text-gray-600">Join our community and stay updated with the latest trends and collections</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative group overflow-hidden rounded-lg aspect-square"
              >
                <Image
                  src={`/images/instagram-${item}.jpg`}
                  alt={`Instagram post ${item}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-helden-purple/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white font-medium">View Post</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-10 text-center">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-helden-purple hover:text-helden-purple-dark transition-colors font-medium"
            >
              @heldenstore
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <Newsletter />

      {/* Contact Section */}
      <Contact />
    </>
  );
} 